import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../contexts/AuthContext", () => {
  const user = { uid: "u1" };
  return { useAuth: () => ({ currentUser: user }) };
});
vi.mock("../../../services/firebaseService", () => ({
  addPatient: vi.fn(),
  updatePatient: vi.fn(),
}));

import "../../../i18n";
import NewPatientModal from "../NewPatientModal";

const renderModal = () =>
  render(<NewPatientModal isOpen onClose={vi.fn()} showToast={vi.fn()} />);

describe("NewPatientModal — accessible multi-step form", () => {
  beforeEach(() => localStorage.clear());

  it("is a named dialog that starts on the first field and exposes the current step", () => {
    renderModal();
    const dialog = screen.getByRole("dialog", {
      name: "Register New Patient",
    });
    expect(dialog).toHaveAccessibleDescription(/1/);
    expect(screen.getByLabelText("First Name")).toHaveFocus();
    expect(
      screen.getByRole("button", { name: /Step 1: .*\(current step\)/ }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("links validation errors to their fields and moves focus to the first invalid one", async () => {
    renderModal();
    const next = screen.getByRole("button", { name: "Next" });
    next.focus();
    fireEvent.click(next);

    const firstName = screen.getByLabelText("First Name");
    expect(firstName).toHaveAttribute("aria-invalid", "true");
    expect(firstName).toHaveAccessibleDescription(
      "First name must have at least 2 characters.",
    );
    await waitFor(() => expect(firstName).toHaveFocus());
  });

  it("moves focus to the heading of the next step", async () => {
    renderModal();
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Silva" },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: "12051994" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Contact & Address" }),
      ).toHaveFocus(),
    );
  });

  it("asks before discarding a filled form; Escape then closes only the confirmation", () => {
    renderModal();
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Ana" },
    });
    fireEvent.keyDown(document, { key: "Escape" });
    const confirm = screen.getByRole("alertdialog", {
      name: "Discard registration?",
    });
    expect(confirm).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(
      screen.getByRole("dialog", { name: "Register New Patient" }),
    ).toBeInTheDocument();
  });
});
