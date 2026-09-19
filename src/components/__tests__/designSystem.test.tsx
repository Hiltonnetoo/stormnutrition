import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import i18n from "../../i18n";
import { Avatar, Badge, Checkbox, IconButton, Select, Textarea } from "../ui";
import PatientsEmptyState from "../patient-list/EmptyState";
import StepProgress from "../StepProgress";

// Design system primitives (seção 3 — UI02/UI05/UI06/UI09). Rendered styles
// are checked in tests-e2e/design-system.spec.ts; here: names, wiring, i18n.
describe("design system primitives", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("pt");
  });

  it("IconButton requires and exposes an accessible name", () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Excluir consulta" icon={<svg />} onClick={onClick} />,
    );
    const button = screen.getByRole("button", { name: "Excluir consulta" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("btn", "btn-icon", "btn-ghost");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("Badge pairs a semantic tone with text, icon hidden from AT", () => {
    render(
      <Badge tone="warning" icon={<svg data-testid="icon" />}>
        Requer revisão clínica
      </Badge>,
    );
    const badge = screen.getByText("Requer revisão clínica");
    expect(badge).toHaveClass("badge", "badge-warning");
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("Select, Textarea and Checkbox share label, help and error wiring", () => {
    render(
      <>
        <Select label="Tipo" name="type" hint="Escolha um tipo">
          <option>A</option>
        </Select>
        <Textarea label="Notas" name="notes" error="Obrigatório" />
        <Checkbox label="Aceito" name="agree" error="Marque para continuar" />
      </>,
    );
    const select = screen.getByLabelText("Tipo");
    expect(select).toHaveAccessibleDescription("Escolha um tipo");
    expect(select).not.toHaveAttribute("aria-invalid");
    const notes = screen.getByLabelText("Notas");
    expect(notes).toHaveAttribute("aria-invalid", "true");
    expect(notes).toHaveAccessibleDescription("Obrigatório");
    const agree = screen.getByRole("checkbox", { name: "Aceito" });
    expect(agree).toHaveAttribute("aria-invalid", "true");
    expect(agree).toHaveAccessibleDescription("Marque para continuar");
  });

  it("patient empty state is translated in PT and EN", async () => {
    const onAdd = vi.fn();
    const { rerender } = render(<PatientsEmptyState onAddPatient={onAdd} />);
    expect(
      screen.getByRole("heading", { name: "Nenhum paciente cadastrado" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Cadastrar primeiro paciente" }),
    );
    expect(onAdd).toHaveBeenCalledOnce();
    await i18n.changeLanguage("en");
    rerender(<PatientsEmptyState onAddPatient={onAdd} />);
    expect(
      screen.getByRole("heading", { name: "No patients yet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add first patient" }),
    ).toBeInTheDocument();
  });

  it("StepProgress uses one vocabulary for every stepper", () => {
    render(
      <StepProgress
        steps={[
          { number: 1, label: "Objetivos" },
          { number: 2, label: "Nutrição" },
          { number: 3, label: "Plano" },
        ]}
        currentStep={2}
        canNavigate={(n) => n < 2}
        goToStep={() => {}}
      />,
    );
    expect(screen.getByText("Etapa 2 de 3 · Nutrição")).toBeInTheDocument();
    const current = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-current") === "step");
    expect(current).toBeDefined();
    expect(screen.getAllByRole("button")[2]).toBeDisabled();
  });

  it("Avatar falls back to initials when the photo is missing or broken", () => {
    const { container, rerender } = render(
      <Avatar src="https://example.invalid/a.png" name="Ana Silva" />,
    );
    const img = container.querySelector("img")!;
    fireEvent.error(img);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("AS")).toHaveAttribute("aria-hidden", "true");
    rerender(<Avatar src={null} name="Bruno Costa" alt="Bruno Costa" />);
    expect(screen.getByRole("img", { name: "Bruno Costa" })).toHaveTextContent(
      "BC",
    );
  });
});
