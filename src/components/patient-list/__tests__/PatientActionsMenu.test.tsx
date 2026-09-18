import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "../../../i18n";
import PatientActionsMenu from "../PatientActionsMenu";
import { validatePatient } from "../../../utils/validation";

const patient = validatePatient({
  id: "p1",
  firstName: "Ana",
  lastName: "Silva",
});

const setup = () => {
  const actions = {
    onViewHistory: vi.fn(),
    onManagePortal: vi.fn(),
    onEdit: vi.fn(),
    onToggleArchive: vi.fn(),
    onDelete: vi.fn(),
  };
  const Wrapper = () => {
    const [open, setOpen] = useState(false);
    return (
      <PatientActionsMenu
        patient={patient}
        open={open}
        onOpenChange={setOpen}
        {...actions}
      />
    );
  };
  render(<Wrapper />);
  const trigger = screen.getByRole("button", {
    name: "More actions for Ana Silva",
  });
  return { trigger, actions };
};

describe("PatientActionsMenu (menu button pattern)", () => {
  it("exposes its state and opens on ArrowDown with focus on the first item", () => {
    const { trigger } = setup();
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveFocus();
  });

  it("opens on ArrowUp with focus on the last item and moves with arrows, Home and End", () => {
    const { trigger } = setup();
    fireEvent.keyDown(trigger, { key: "ArrowUp" });
    const menu = screen.getByRole("menu");
    const items = screen.getAllByRole("menuitem");
    expect(items[4]).toHaveFocus();

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(items[0]).toHaveFocus(); // wraps
    fireEvent.keyDown(menu, { key: "End" });
    expect(items[4]).toHaveFocus();
    fireEvent.keyDown(menu, { key: "Home" });
    expect(items[0]).toHaveFocus();
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(items[4]).toHaveFocus(); // wraps backwards
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("runs the chosen action after returning focus to the trigger", () => {
    const { trigger, actions } = setup();
    fireEvent.click(trigger);
    actions.onEdit.mockImplementation(() => {
      // A dialog opened by the action captures this element to restore later.
      expect(trigger).toHaveFocus();
    });
    fireEvent.click(screen.getByRole("menuitem", { name: /Edit/ }));
    expect(actions.onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
