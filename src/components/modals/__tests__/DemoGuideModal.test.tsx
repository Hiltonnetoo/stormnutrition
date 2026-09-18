import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "../../../i18n";
import { DemoGuideModal } from "../DemoGuideModal";

describe("DemoGuideModal — 5-step evaluator roadmap", () => {
  it("renders when open and lists all 5 clinical evaluation steps", () => {
    const onClose = vi.fn();
    render(<DemoGuideModal open={true} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Dra. Clara Mendes")).toBeInTheDocument();
    expect(screen.getByText("Dr. Marcos Lima")).toBeInTheDocument();
    expect(screen.getByText("Ana Silva (Portal)")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", {
      name: /iniciar avaliação|start evaluation/i,
    });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render dialog content when open is false", () => {
    render(<DemoGuideModal open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
