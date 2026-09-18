import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AnyDietPlan, Patient } from "../../types";

vi.mock("../../contexts/AuthContext", () => {
  const user = { uid: "u1", displayName: "Maria Silva" };
  return { useAuth: () => ({ currentUser: user }) };
});

const latestDietListeners = vi.hoisted(
  () => new Map<string, (diet: AnyDietPlan | null) => void>(),
);
const roster = vi.hoisted(() => ({ patients: [] as Patient[] }));

// Only the reads the page performs on render are relevant here.
vi.mock("../../services/firebaseService", () => ({
  getPatients: (_uid: string, cb: (p: Patient[]) => void) => {
    cb(roster.patients);
    return () => {};
  },
  subscribeLatestDiet: vi.fn(
    (_uid: string, patientId: string, cb: (d: AnyDietPlan | null) => void) => {
      latestDietListeners.set(patientId, cb);
      return () => latestDietListeners.delete(patientId);
    },
  ),
}));

import "../../i18n";
import Patients from "../Patients";
import { PatientDirectoryProvider } from "../../contexts/PatientDirectoryContext";
import { subscribeLatestDiet } from "../../services/firebaseService";
import { validatePatient } from "../../utils/validation";

const TOTAL = 45;
const pad = (n: number) => String(n).padStart(2, "0");

const renderPage = () =>
  render(
    <MemoryRouter>
      <PatientDirectoryProvider>
        <Patients />
      </PatientDirectoryProvider>
    </MemoryRouter>,
  );

const desktopRows = () =>
  within(screen.getAllByRole("table")[0]).getAllByRole("row").slice(1);

describe("Patients page — pagination and bounded diet reads", () => {
  beforeEach(() => {
    latestDietListeners.clear();
    vi.mocked(subscribeLatestDiet).mockClear();
    roster.patients = Array.from({ length: TOTAL }, (_, i) =>
      validatePatient({
        id: `p${pad(i)}`,
        firstName: `Paciente${pad(i)}`,
        lastName: "Teste",
        email: `p${pad(i)}@example.test`,
        status: i === 0 ? "Archived" : "Active",
        createdAt: "2026-01-01T12:00:00.000Z",
      }),
    );
  });

  it("renders the first 20 patients and reads diet status only for them", () => {
    renderPage();
    expect(desktopRows()).toHaveLength(20);
    expect(subscribeLatestDiet).toHaveBeenCalledTimes(20);
    expect(latestDietListeners.size).toBe(20);
    // Tabs and counters still reflect the whole roster
    expect(screen.getByText(/\(45\)/)).toBeInTheDocument();
  });

  it("loads the next page on demand without re-reading visible rows", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Show 20 more" }));
    expect(desktopRows()).toHaveLength(40);
    expect(subscribeLatestDiet).toHaveBeenCalledTimes(40);

    fireEvent.click(screen.getByRole("button", { name: "Show 5 more" }));
    expect(desktopRows()).toHaveLength(45);
    expect(subscribeLatestDiet).toHaveBeenCalledTimes(45);
    expect(screen.queryByRole("button", { name: /Show \d+ more/ })).toBeNull();
  });

  it("searches the whole roster, not only the loaded page", () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Paciente44" },
    });
    expect(desktopRows()).toHaveLength(1);
    // Rows that left the screen stop listening
    expect(latestDietListeners.size).toBe(1);
    expect(latestDietListeners.has("p44")).toBe(true);
  });

  it("shows loading, then 'no diet' or the latest plan per row", () => {
    renderPage();
    const firstRow = () => desktopRows()[0];
    expect(within(firstRow()).getByText("Loading…")).toBeInTheDocument();

    act(() => latestDietListeners.get("p00")!(null));
    expect(within(firstRow()).getByText("No diet")).toBeInTheDocument();

    act(() =>
      latestDietListeners.get("p00")!({
        id: "d1",
        patientId: "p00",
        createdAt: new Date().toISOString(),
      } as AnyDietPlan),
    );
    expect(within(firstRow()).getByText(/^Active ·/)).toBeInTheDocument();
  });
});
