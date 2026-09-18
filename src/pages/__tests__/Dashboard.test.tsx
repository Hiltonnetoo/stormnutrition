import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

// The user object MUST be a stable reference: effects depend on the uid, so a
// fresh object each render would re-trigger them forever.
vi.mock("../../contexts/AuthContext", () => {
  const user = { uid: "u1", displayName: "Maria Silva" };
  return { useAuth: () => ({ currentUser: user }) };
});

// Every read resolves immediately with empty/zero data so the dashboard renders
// its onboarding/empty state deterministically.
// NOTE: vi.mock is hoisted, so the helpers must live inside the factory.
vi.mock("../../services/firebaseService", () => {
  const emptyList = (_uid: string, ...rest: unknown[]) => {
    const cb = rest.find((r) => typeof r === "function") as (
      rows: unknown[],
    ) => void;
    cb([]);
    return () => {};
  };
  return {
    getPatients: vi.fn(emptyList),
    subscribeRecentDiets: vi.fn(emptyList),
    getDietCountSummary: vi.fn(async (_uid: string, ranges: unknown[]) => ({
      total: 0,
      perMonth: ranges.map(() => 0),
    })),
  };
});

import "../../i18n";
import Dashboard from "../Dashboard";
import { PatientDirectoryProvider } from "../../contexts/PatientDirectoryContext";
import * as firebaseService from "../../services/firebaseService";

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <PatientDirectoryProvider>
        <Dashboard />
      </PatientDirectoryProvider>
    </MemoryRouter>,
  );

describe("Dashboard", () => {
  it("greets the logged-in professional by name", () => {
    renderDashboard();
    // greeting interpolates the first name regardless of the active language
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
  });

  it("renders without crashing when there is no data yet", () => {
    const { container } = renderDashboard();
    // Stat cards grid is present even in the empty state
    expect(container.querySelector(".stagger")).toBeTruthy();
  });

  it("reads bounded data: 6-month diet aggregation and only the latest 6 diets", async () => {
    renderDashboard();
    await screen.findAllByText("0");
    expect(firebaseService.getDietCountSummary).toHaveBeenCalledWith(
      "u1",
      expect.any(Array),
    );
    const ranges = vi.mocked(firebaseService.getDietCountSummary).mock
      .calls[0][1];
    expect(ranges).toHaveLength(6);
    expect(firebaseService.subscribeRecentDiets).toHaveBeenCalledWith(
      "u1",
      6,
      expect.any(Function),
    );
  });
});
