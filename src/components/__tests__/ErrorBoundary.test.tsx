import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import i18n from "../../i18n";
import { ErrorBoundary } from "../ErrorBoundary";

const ProblemChild: React.FC<{ shouldThrow?: boolean }> = ({
  shouldThrow = true,
}) => {
  if (shouldThrow) {
    throw new Error("Simulated rendering crash");
  }
  return <div>Controle normal renderizado com sucesso</div>;
};

describe("ErrorBoundary component", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Filho saudável</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Filho saudável")).toBeInTheDocument();
  });

  it("catches render errors and displays localized fallback UI with correlation ID", () => {
    // Suppress console.error in test output for expected crash
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary level="route">
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("error_boundary.title")),
    ).toBeInTheDocument();

    const correlationBadge = screen.getByText(/ERR-[A-Z0-9]{6}/);
    expect(correlationBadge).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("invokes onCatch callback when an error is caught", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onCatch = vi.fn();

    render(
      <ErrorBoundary onCatch={onCatch}>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(onCatch).toHaveBeenCalledTimes(1);
    expect(onCatch.mock.calls[0][0].message).toBe("Simulated rendering crash");
    expect(onCatch.mock.calls[0][2]).toMatch(/^ERR-[A-Z0-9]{6}$/);

    errorSpy.mockRestore();
  });

  it("allows recovering via retry button after error condition resolves", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const TestHarness: React.FC = () => {
      const [hasError, setHasError] = useState(true);
      return (
        <div>
          <button onClick={() => setHasError(false)}>Fix Error</button>
          <ErrorBoundary>
            <ProblemChild shouldThrow={hasError} />
          </ErrorBoundary>
        </div>
      );
    };

    render(<TestHarness />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Fix the underlying issue
    fireEvent.click(screen.getByText("Fix Error"));

    // Click retry
    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("error_boundary.btn_retry") }),
    );

    expect(
      screen.getByText("Controle normal renderizado com sucesso"),
    ).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("automatically resets when resetKey changes", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const TestHarness: React.FC = () => {
      const [path, setPath] = useState("/page-1");
      return (
        <div>
          <button onClick={() => setPath("/page-2")}>Navigate</button>
          <ErrorBoundary resetKey={path}>
            <ProblemChild shouldThrow={path === "/page-1"} />
          </ErrorBoundary>
        </div>
      );
    };

    render(<TestHarness />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Navigate to page-2 (updates resetKey)
    fireEvent.click(screen.getByText("Navigate"));

    expect(
      screen.getByText("Controle normal renderizado com sucesso"),
    ).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("supports custom fallback render function with reset callback and correlationId", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary
        fallback={(err, reset, correlationId) => (
          <div>
            <span>Custom: {err.message}</span>
            <span>Code: {correlationId}</span>
            <button onClick={reset}>Custom Reset</button>
          </div>
        )}
      >
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText("Custom: Simulated rendering crash"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Code: ERR-[A-Z0-9]{6}/)).toBeInTheDocument();

    errorSpy.mockRestore();
  });
});
