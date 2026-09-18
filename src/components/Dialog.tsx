import React from "react";
import { createPortal } from "react-dom";
import { useDialog } from "../hooks/useDialog";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** id of the visible title (preferred accessible name). */
  labelledBy?: string;
  /** Accessible name when there is no visible title. */
  label?: string;
  /** id of the element that describes the dialog. */
  describedBy?: string;
  /** "alertdialog" for confirmations that interrupt the user. */
  role?: "dialog" | "alertdialog";
  initialFocus?: React.RefObject<HTMLElement | null>;
  /** Classes of the fixed container that positions the dialog. */
  overlayClassName?: string;
  /** Classes of the dimmed backdrop; omit for full-screen dialogs. */
  backdropClassName?: string;
  /** Clicking the backdrop closes the dialog (default true). */
  closeOnBackdrop?: boolean;
  /** Classes of the element that carries role="dialog". */
  className?: string;
  children: React.ReactNode;
}

const DialogPanel: React.FC<Omit<DialogProps, "open">> = ({
  onClose,
  labelledBy,
  label,
  describedBy,
  role = "dialog",
  initialFocus,
  overlayClassName = "fixed inset-0 z-50 flex items-center justify-center p-4",
  backdropClassName,
  closeOnBackdrop = true,
  className,
  children,
}) => {
  const panel = useDialog({ onClose, initialFocus });
  return createPortal(
    <div className={overlayClassName}>
      {backdropClassName && (
        <div
          className={backdropClassName}
          aria-hidden="true"
          onClick={closeOnBackdrop ? onClose : undefined}
        />
      )}
      <div
        ref={panel}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        aria-describedby={describedBy}
        tabIndex={-1}
        // The container only receives focus so its name is announced.
        className={`${className ?? ""} focus:outline-none`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

/**
 * Accessible modal dialog primitive: portal to <body>, focus management,
 * Escape, inert background and scroll lock (see `useDialog`). Layout and
 * styling stay with the caller.
 */
export const Dialog: React.FC<DialogProps> = ({ open, ...props }) =>
  open ? <DialogPanel {...props} /> : null;
