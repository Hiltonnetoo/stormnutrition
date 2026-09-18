import { useEffect, useRef, type RefObject } from "react";

/**
 * When `key` changes (not on the first render), moves focus to the first
 * element matching `selector` inside `container` — e.g. the heading of a new
 * wizard step or of a freshly generated result — so keyboard and
 * screen-reader users are taken to the content that replaced what they were
 * interacting with.
 */
export function useFocusOnChange(
  key: unknown,
  container: RefObject<HTMLElement | null>,
  selector = "h2, h3",
) {
  const previous = useRef(key);
  useEffect(() => {
    if (Object.is(previous.current, key)) return;
    previous.current = key;
    const target = container.current?.querySelector<HTMLElement>(selector);
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus();
  }, [key, container, selector]);
}
