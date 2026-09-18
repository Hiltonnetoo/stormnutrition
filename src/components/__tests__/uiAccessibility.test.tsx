import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "../../i18n";
import { Input, LoadingState, ErrorState } from "../ui";
import ChartDataTable from "../ChartDataTable";

describe("shared UI accessibility contracts", () => {
  it("Input links its label, hint and error, and flags the invalid state", () => {
    const { rerender } = render(
      <Input label="E-mail" hint="We never share it" name="email" />,
    );
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAccessibleDescription("We never share it");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(<Input label="E-mail" error="Invalid e-mail" name="email" />);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Invalid e-mail");
  });

  it("Input without id or name still gets a unique id for its label", () => {
    render(<Input label="Search" />);
    expect(screen.getByLabelText("Search")).toHaveAttribute("id");
  });

  it("LoadingState announces loading politely", () => {
    render(<LoadingState label="Loading patients" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveTextContent("Loading patients");
  });

  it("ErrorState is an alert with a retry action", () => {
    const retry = vi.fn();
    render(<ErrorState onRetry={retry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("ChartDataTable exposes the plotted values as a captioned table", () => {
    render(
      <ChartDataTable
        caption="Plans per month"
        columns={["Month", "Plans"]}
        rows={[
          ["Aug", 3],
          ["Sep", 5],
        ]}
      />,
    );
    const table = screen.getByRole("table", {
      name: "Plans per month",
      hidden: true,
    });
    expect(table).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Sep", hidden: true }),
    ).toBeInTheDocument();
    expect(screen.getByText("Show data as table")).toBeInTheDocument();
  });
});
