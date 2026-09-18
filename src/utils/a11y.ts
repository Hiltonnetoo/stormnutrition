/**
 * Small helpers to wire validation messages to form controls so assistive
 * technology announces them with the field (aria-invalid + aria-describedby).
 */
export const errorIdFor = (fieldId: string) => `${fieldId}-error`;

export const fieldErrorProps = (fieldId: string, error?: string) =>
  error
    ? {
        "aria-invalid": true as const,
        "aria-describedby": errorIdFor(fieldId),
      }
    : {};

/**
 * Moves focus to the first invalid field after a failed validation. Waits a
 * frame so the error message is rendered (and read with the field).
 */
export const focusFirstInvalid = (fieldIds: string[]) => {
  requestAnimationFrame(() => {
    for (const id of fieldIds) {
      const el = document.getElementById(id);
      if (el) {
        el.focus();
        return;
      }
    }
  });
};
