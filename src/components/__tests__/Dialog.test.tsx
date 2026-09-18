import React, { useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import "../../i18n";
import { Modal } from "../ui";
import { openDialogCount } from "../../hooks/useDialog";

const Harness: React.FC<{ nested?: boolean }> = ({ nested }) => {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <button>Background action</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit patient"
        description="Update the record"
        footer={
          <>
            <button onClick={() => setOpen(false)}>Cancel</button>
            {nested && <button onClick={() => setInner(true)}>Delete</button>}
          </>
        }
      >
        <label htmlFor="name">Name</label>
        <input id="name" />
      </Modal>
      <Modal
        open={inner}
        onClose={() => setInner(false)}
        title="Confirm deletion"
        role="alertdialog"
      >
        <p>Are you sure?</p>
      </Modal>
    </div>
  );
};

const openDialog = () =>
  fireEvent.click(screen.getByRole("button", { name: "Open dialog" }));

describe("Dialog / Modal accessibility", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("is named by its title and described by its description", () => {
    render(<Harness />);
    openDialog();
    const dialog = screen.getByRole("dialog", { name: "Edit patient" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Update the record");
  });

  it("moves focus into the dialog (first field) and returns it to the trigger on close", () => {
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByLabelText("Name")).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("keeps Tab and Shift+Tab inside the dialog", () => {
    render(<Harness />);
    openDialog();
    const close = screen.getByRole("button", { name: "Close" });
    const cancel = screen.getByRole("button", { name: "Cancel" });

    cancel.focus(); // last focusable
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus(); // wrapped to the first

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(cancel).toHaveFocus(); // wrapped back to the last
  });

  it("makes the page behind the dialog inert and restores it on close", () => {
    const { container } = render(<Harness />);
    openDialog();
    expect(container).toHaveAttribute("inert");
    expect(screen.getByRole("dialog").closest("[inert]")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(container).not.toHaveAttribute("inert");
  });

  it("with nested dialogs, Escape closes only the top one and scroll stays locked until the last closes", () => {
    render(<Harness nested />);
    openDialog();
    expect(document.body.style.overflow).toBe("hidden");

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    deleteButton.focus();
    fireEvent.click(deleteButton);
    const confirm = screen.getByRole("alertdialog", {
      name: "Confirm deletion",
    });
    expect(openDialogCount()).toBe(2);
    // The outer dialog is inert while the confirmation is on top
    expect(
      screen.getByRole("dialog", { name: "Edit patient", hidden: true })
        .parentElement,
    ).toHaveAttribute("inert");
    expect(confirm.closest("[inert]")).toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(screen.getByRole("dialog", { name: "Edit patient" })).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");
    expect(deleteButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(openDialogCount()).toBe(0);
  });

  it("restores the page when the dialog unmounts without closing (navigation)", () => {
    const { unmount, container } = render(<Harness />);
    openDialog();
    act(() => unmount());
    expect(container).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("");
    expect(openDialogCount()).toBe(0);
  });
});
