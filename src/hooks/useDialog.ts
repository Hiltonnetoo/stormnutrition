import { useEffect, useRef, type RefObject } from "react";

/**
 * Modal dialog behaviour shared by every dialog in the app (WAI-ARIA APG
 * "Dialog (Modal)" pattern):
 *
 * - initial focus inside the dialog, and focus returned to the element that
 *   opened it when it closes;
 * - Tab / Shift+Tab contained in the dialog;
 * - Escape closes only the top-most dialog;
 * - everything outside the top-most dialog is `inert` (not focusable, hidden
 *   from assistive technology);
 * - page scroll locked while at least one dialog is open, restored when the
 *   last one closes (nested dialogs no longer unlock it early).
 *
 * The dialog must be rendered in a portal attached to <body> (see `Dialog`)
 * for the background to be made inert.
 */

interface OpenDialog {
  panel: RefObject<HTMLElement | null>;
  onClose: RefObject<() => void>;
}

const stack: OpenDialog[] = [];
/** Background elements this module made inert (never touches others). */
const managedInert = new Set<Element>();
let savedBodyOverflow: string | null = null;

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(",");

const isVisible = (el: HTMLElement) => {
  if (el.closest("[hidden],[inert]")) return false;
  const style = window.getComputedStyle(el);
  return style.display !== "none" && style.visibility !== "hidden";
};

export const getFocusable = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible);

const topDialog = () => stack[stack.length - 1];

const syncBackground = () => {
  const top = topDialog()?.panel.current ?? null;
  for (const el of Array.from(managedInert)) {
    if (!el.isConnected) managedInert.delete(el);
  }
  for (const child of Array.from(document.body.children)) {
    const shouldBeInert = top !== null && !child.contains(top);
    if (shouldBeInert && !child.hasAttribute("inert")) {
      child.setAttribute("inert", "");
      managedInert.add(child);
    } else if (!shouldBeInert && managedInert.has(child)) {
      child.removeAttribute("inert");
      managedInert.delete(child);
    }
  }
};

const lockScroll = () => {
  if (stack.length === 1) {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};

const unlockScroll = () => {
  if (stack.length === 0 && savedBodyOverflow !== null) {
    document.body.style.overflow = savedBodyOverflow;
    savedBodyOverflow = null;
  }
};

const focusInitial = (
  panel: HTMLElement,
  initialFocus?: RefObject<HTMLElement | null>,
) => {
  const target =
    initialFocus?.current ??
    panel.querySelector<HTMLElement>("[data-autofocus]") ??
    getFocusable(panel).find((el) =>
      ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName),
    ) ??
    panel;
  target.focus({ preventScroll: true });
};

export interface UseDialogOptions {
  onClose: () => void;
  /** Element to focus when the dialog opens (defaults: [data-autofocus],
   *  first form field, then the dialog itself so its name is announced). */
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Activates the modal behaviour while the calling component is mounted.
 * Returns the ref to attach to the element with role="dialog".
 */
export function useDialog<T extends HTMLElement = HTMLDivElement>({
  onClose,
  initialFocus,
}: UseDialogOptions) {
  const panel = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const initialFocusRef = useRef(initialFocus);
  initialFocusRef.current = initialFocus;

  useEffect(() => {
    const entry: OpenDialog = { panel, onClose: onCloseRef };
    const returnTo =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    stack.push(entry);
    lockScroll();
    syncBackground();
    if (panel.current) focusInitial(panel.current, initialFocusRef.current);

    const onKeyDown = (e: KeyboardEvent) => {
      if (topDialog() !== entry) return;
      const root = panel.current;
      if (!root) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable(root);
      const active = document.activeElement;
      if (focusable.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const outside = !root.contains(active);
      if (e.shiftKey && (active === first || active === root || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const wasTop = topDialog() === entry;
      const index = stack.indexOf(entry);
      if (index > -1) stack.splice(index, 1);
      syncBackground();
      unlockScroll();
      if (wasTop && returnTo?.isConnected) {
        returnTo.focus({ preventScroll: true });
      }
    };
  }, []);

  return panel;
}

/** Test helper: number of dialogs currently open. */
export const openDialogCount = () => stack.length;
