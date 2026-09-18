import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Patient } from "../../types";

const auth = vi.hoisted(() => ({ user: { uid: "u1" } as { uid: string } }));
vi.mock("../AuthContext", () => ({
  useAuth: () => ({ currentUser: auth.user }),
}));

type Listener = {
  uid: string;
  emit: (patients: Patient[]) => void;
  fail: (error: { code: string }) => void;
  unsubscribe: ReturnType<typeof vi.fn>;
};
const listeners = vi.hoisted(() => [] as Listener[]);
vi.mock("../../services/firebaseService", () => ({
  getPatients: vi.fn(
    (
      uid: string,
      cb: (p: Patient[]) => void,
      onError: (e: { code: string }) => void,
    ) => {
      const unsubscribe = vi.fn();
      listeners.push({ uid, emit: cb, fail: onError, unsubscribe });
      return unsubscribe;
    },
  ),
}));

import { PatientDirectoryProvider } from "../PatientDirectoryContext";
import { usePatientDirectory } from "../../hooks/usePatientDirectory";
import { getPatients } from "../../services/firebaseService";

const Consumer: React.FC<{ name: string; enabled?: boolean }> = ({
  name,
  enabled = true,
}) => {
  const { patients, loading, error } = usePatientDirectory(enabled);
  return (
    <p data-testid={name}>
      {loading
        ? "loading"
        : error
          ? `error:${error.code}`
          : patients.map((p) => p.firstName).join(",") || "empty"}
    </p>
  );
};

const patient = (firstName: string) => ({ firstName }) as Patient;

describe("PatientDirectoryProvider", () => {
  beforeEach(() => {
    listeners.length = 0;
    vi.mocked(getPatients).mockClear();
    auth.user = { uid: "u1" };
  });

  it("shares ONE roster subscription between all consumers", () => {
    render(
      <PatientDirectoryProvider>
        <Consumer name="search" />
        <Consumer name="page" />
      </PatientDirectoryProvider>,
    );
    expect(getPatients).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("page").textContent).toBe("loading");

    act(() => listeners[0].emit([patient("Ana"), patient("Bruno")]));
    expect(screen.getByTestId("search").textContent).toBe("Ana,Bruno");
    expect(screen.getByTestId("page").textContent).toBe("Ana,Bruno");
  });

  it("does not read the roster until a consumer asks for it", () => {
    const { rerender } = render(
      <PatientDirectoryProvider>
        <Consumer name="bell" enabled={false} />
      </PatientDirectoryProvider>,
    );
    expect(getPatients).not.toHaveBeenCalled();
    expect(screen.getByTestId("bell").textContent).toBe("empty");

    rerender(
      <PatientDirectoryProvider>
        <Consumer name="bell" enabled />
      </PatientDirectoryProvider>,
    );
    expect(getPatients).toHaveBeenCalledTimes(1);
  });

  it("keeps the subscription alive when the requesting screen unmounts", () => {
    const { rerender } = render(
      <PatientDirectoryProvider>
        <Consumer name="page" />
      </PatientDirectoryProvider>,
    );
    act(() => listeners[0].emit([patient("Ana")]));
    rerender(
      <PatientDirectoryProvider>
        <Consumer name="other" enabled={false} />
      </PatientDirectoryProvider>,
    );
    expect(listeners[0].unsubscribe).not.toHaveBeenCalled();
    expect(screen.getByTestId("other").textContent).toBe("Ana");
    expect(getPatients).toHaveBeenCalledTimes(1);
  });

  it("never exposes the previous account's roster after an account switch", () => {
    const { rerender } = render(
      <PatientDirectoryProvider>
        <Consumer name="page" />
      </PatientDirectoryProvider>,
    );
    act(() => listeners[0].emit([patient("Ana")]));

    auth.user = { uid: "u2" };
    rerender(
      <PatientDirectoryProvider>
        <Consumer name="page" />
      </PatientDirectoryProvider>,
    );
    expect(listeners[0].unsubscribe).toHaveBeenCalledTimes(1);
    expect(listeners[1].uid).toBe("u2");
    expect(screen.getByTestId("page").textContent).toBe("loading");

    act(() => listeners[1].emit([patient("Carla")]));
    expect(screen.getByTestId("page").textContent).toBe("Carla");
  });

  it("surfaces subscription errors instead of an empty list", () => {
    render(
      <PatientDirectoryProvider>
        <Consumer name="page" />
      </PatientDirectoryProvider>,
    );
    act(() => listeners[0].fail({ code: "permission-denied" }));
    expect(screen.getByTestId("page").textContent).toBe(
      "error:permission-denied",
    );
  });

  it("unsubscribes on unmount (logout)", () => {
    const { unmount } = render(
      <PatientDirectoryProvider>
        <Consumer name="page" />
      </PatientDirectoryProvider>,
    );
    unmount();
    expect(listeners[0].unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("returns an idle, empty directory when no provider is mounted", () => {
    render(<Consumer name="isolated" />);
    expect(screen.getByTestId("isolated").textContent).toBe("empty");
  });
});
