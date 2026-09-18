/**
 * Counts what the Firestore client actually receives from the server, without
 * instrumenting production code. The benchmark replaces `firebase/firestore`
 * with `createMeteredFirestore(actual)`, so every service call made through the
 * real SDK is observed:
 *
 *   - onSnapshot  → documents of the first *server* snapshot of each distinct
 *                   query target (identical queries share one target in the
 *                   SDK, so they are billed once and counted once);
 *   - getDocs     → documents returned;
 *   - getDoc      → one document;
 *   - getCountFromServer → one aggregation; billed as ceil(n / 1000), min 1.
 *
 * "Estimated billed reads" follows Firestore's published rules (a query that
 * returns nothing still costs one read). It is an estimate for comparison, not
 * an invoice.
 */
import type * as FirestoreModule from "firebase/firestore";

type Firestore = typeof FirestoreModule;
type Target = FirestoreModule.Query | FirestoreModule.DocumentReference;

export interface IndexField {
  fieldPath: string;
  order: "ASCENDING" | "DESCENDING";
}

/** Composite index a query needs in production (the emulator does not check). */
export interface RequiredIndex {
  collectionGroup: string;
  /** Equality fields first (any order is valid), then the range/order field. */
  equality: string[];
  ordered: IndexField[];
}

export interface ReadRecord {
  kind: "listen" | "getDocs" | "getDoc" | "count";
  path: string;
  requiredIndex?: RequiredIndex;
  docs: number;
  bytes: number;
  aggregateCount?: number;
  billed: number;
}

export interface ScreenMeasurement {
  listeners: number;
  distinctTargets: number;
  docsRead: number;
  aggregations: number;
  payloadBytes: number;
  estimatedBilledReads: number;
  records: ReadRecord[];
  errors: string[];
}

interface MeterState {
  listeners: number;
  targets: Target[];
  records: ReadRecord[];
  errors: string[];
  pending: Promise<void>[];
}

const fresh = (): MeterState => ({
  listeners: 0,
  targets: [],
  records: [],
  errors: [],
  pending: [],
});

let state: MeterState = fresh();

const describeTarget = (target: Target): string => {
  if ("path" in target && typeof target.path === "string") return target.path;
  // Query internals are private; the collection path is enough for reports.
  const internal = (target as unknown as { _query?: { path?: unknown } })._query
    ?.path;
  return internal ? String(internal) : "query";
};

interface CoreQueryShape {
  path?: { lastSegment?(): string; toString(): string };
  collectionGroup?: string | null;
  filters?: Array<{
    field?: { canonicalString(): string };
    op?: string;
  }>;
  explicitOrderBy?: Array<{
    field: { canonicalString(): string };
    dir: "asc" | "desc";
  }>;
}

/**
 * Derives the composite index Firestore requires for a query, following the
 * documented rules: equality-only queries and single-field range/order queries
 * use automatic single-field indexes; mixing equality on some fields with a
 * range or order on another field needs a composite index.
 * Reads SDK internals (`_query`), acceptable in a test-only helper.
 */
export const requiredCompositeIndex = (
  target: Target,
): RequiredIndex | undefined => {
  if (target.type === "document") return undefined;
  const core = (target as unknown as { _query?: CoreQueryShape })._query;
  if (!core) return undefined;
  const collectionGroup =
    core.collectionGroup ?? core.path?.lastSegment?.() ?? "unknown";
  const filters = core.filters ?? [];
  const equality = [
    ...new Set(
      filters
        .filter(
          (f) => f.op === "==" || f.op === "in" || f.op === "array-contains",
        )
        .map((f) => f.field!.canonicalString()),
    ),
  ];
  const ordered: IndexField[] = [];
  const pushOrdered = (fieldPath: string, order: IndexField["order"]) => {
    if (!ordered.some((o) => o.fieldPath === fieldPath))
      ordered.push({ fieldPath, order });
  };
  for (const o of core.explicitOrderBy ?? []) {
    pushOrdered(
      o.field.canonicalString(),
      o.dir === "desc" ? "DESCENDING" : "ASCENDING",
    );
  }
  for (const f of filters) {
    if (["<", "<=", ">", ">=", "!=", "not-in"].includes(f.op ?? "")) {
      pushOrdered(f.field!.canonicalString(), "ASCENDING");
    }
  }
  const distinct = new Set([...equality, ...ordered.map((o) => o.fieldPath)]);
  if (ordered.length === 0 || distinct.size < 2) return undefined;
  return { collectionGroup, equality, ordered };
};

/** True when `declared` (firestore.indexes.json) contains an index serving `required`. */
export const isIndexDeclared = (
  required: RequiredIndex,
  declared: Array<{ collectionGroup: string; fields: IndexField[] }>,
) =>
  declared.some((idx) => {
    if (idx.collectionGroup !== required.collectionGroup) return false;
    const eqCount = required.equality.length;
    if (idx.fields.length !== eqCount + required.ordered.length) return false;
    const prefix = idx.fields.slice(0, eqCount).map((f) => f.fieldPath);
    const rest = idx.fields.slice(eqCount);
    return (
      prefix.every((f) => required.equality.includes(f)) &&
      rest.every(
        (f, i) =>
          f.fieldPath === required.ordered[i].fieldPath &&
          f.order === required.ordered[i].order,
      )
    );
  });

const payloadSize = (
  docs: Array<{ data: () => FirestoreModule.DocumentData | undefined }>,
) => docs.reduce((acc, d) => acc + JSON.stringify(d.data() ?? {}).length, 0);

export const createMeteredFirestore = (actual: Firestore): Firestore => {
  const isSameTarget = (a: Target, b: Target) => {
    const aIsDoc = a.type === "document";
    const bIsDoc = b.type === "document";
    if (aIsDoc !== bIsDoc) return false;
    return aIsDoc
      ? actual.refEqual(
          a as FirestoreModule.DocumentReference,
          b as FirestoreModule.DocumentReference,
        )
      : actual.queryEqual(
          a as FirestoreModule.Query,
          b as FirestoreModule.Query,
        );
  };

  const onSnapshot = ((target: Target, ...args: unknown[]) => {
    const unsubscribe = (actual.onSnapshot as (...a: unknown[]) => () => void)(
      target,
      ...args,
    );
    state.listeners += 1;
    if (state.targets.some((t) => isSameTarget(t, target))) return unsubscribe;
    state.targets.push(target);

    // A parallel metadata listener on the same target (no extra reads: the SDK
    // shares the target) tells us when the server result has arrived.
    const current = state;
    current.pending.push(
      new Promise<void>((resolve) => {
        const stop = (actual.onSnapshot as (...a: unknown[]) => () => void)(
          target,
          { includeMetadataChanges: true },
          (
            snap:
              | FirestoreModule.QuerySnapshot
              | FirestoreModule.DocumentSnapshot,
          ) => {
            if (snap.metadata.fromCache) return;
            const docs =
              "docs" in snap
                ? snap.docs
                : snap.exists()
                  ? [snap as FirestoreModule.DocumentSnapshot]
                  : [];
            current.records.push({
              kind: "listen",
              path: describeTarget(target),
              requiredIndex: requiredCompositeIndex(target),
              docs: docs.length,
              bytes: payloadSize(docs),
              billed: Math.max(1, docs.length),
            });
            setTimeout(stop, 0);
            resolve();
          },
          (error: Error) => {
            current.errors.push(`${describeTarget(target)}: ${error.message}`);
            resolve();
          },
        );
      }),
    );
    return unsubscribe;
  }) as Firestore["onSnapshot"];

  const getDocs = (async (query: FirestoreModule.Query) => {
    const snap = await actual.getDocs(query);
    state.records.push({
      kind: "getDocs",
      path: describeTarget(query),
      requiredIndex: requiredCompositeIndex(query),
      docs: snap.size,
      bytes: payloadSize(snap.docs),
      billed: Math.max(1, snap.size),
    });
    return snap;
  }) as Firestore["getDocs"];

  const getDoc = (async (ref: FirestoreModule.DocumentReference) => {
    const snap = await actual.getDoc(ref);
    state.records.push({
      kind: "getDoc",
      path: ref.path,
      docs: snap.exists() ? 1 : 0,
      bytes: snap.exists() ? payloadSize([snap]) : 0,
      billed: 1,
    });
    return snap;
  }) as Firestore["getDoc"];

  const getCountFromServer = (async (query: FirestoreModule.Query) => {
    const result = await actual.getCountFromServer(query);
    const count = result.data().count;
    state.records.push({
      kind: "count",
      path: describeTarget(query),
      requiredIndex: requiredCompositeIndex(query),
      docs: 0,
      bytes: 0,
      aggregateCount: count,
      billed: Math.max(1, Math.ceil(count / 1000)),
    });
    return result;
  }) as Firestore["getCountFromServer"];

  return { ...actual, onSnapshot, getDocs, getDoc, getCountFromServer };
};

/**
 * Runs `load` (which starts listeners and/or awaits one-shot reads), waits for
 * every distinct listener to receive its first server snapshot, stops the
 * listeners and returns what was read.
 */
export const measure = async (
  load: () => Promise<Array<() => void>> | Array<() => void>,
): Promise<ScreenMeasurement> => {
  state = fresh();
  const unsubscribers = await load();
  // New listeners can be opened by callbacks (e.g. latest diet per visible
  // patient), so drain until no new pending promise appears.
  let seen = 0;
  while (seen < state.pending.length) {
    const batch = state.pending.slice(seen);
    seen = state.pending.length;
    await Promise.all(batch);
  }
  unsubscribers.forEach((u) => u());
  const records = state.records;
  return {
    listeners: state.listeners,
    distinctTargets: state.targets.length,
    docsRead: records.reduce((acc, r) => acc + r.docs, 0),
    aggregations: records.filter((r) => r.kind === "count").length,
    payloadBytes: records.reduce((acc, r) => acc + r.bytes, 0),
    estimatedBilledReads: records.reduce((acc, r) => acc + r.billed, 0),
    records,
    errors: state.errors,
  };
};
