import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import i18n from "../../i18n";
import DietStatusBadge from "../diet-generator/DietStatusBadge";
import type { DietPlan } from "../../types";

// UI02/UI09 — one badge per state, same text and tone on every surface.
const base = {
  validation: { status: "requires_review", isApproved: false, issues: [] },
} as unknown as DietPlan;
const cases: [string, Partial<DietPlan>, string, string][] = [
  [
    "approved",
    { status: "clinically_approved" },
    "status_approved",
    "badge-brand",
  ],
  [
    "awaiting review",
    { status: "awaiting_review" },
    "status_requires_review",
    "badge-warning",
  ],
  ["blocked", { status: "blocked" }, "status_blocked", "badge-danger"],
  [
    "draft",
    {
      status: "draft",
      validation: { status: "valid", isApproved: false, issues: [] } as never,
    },
    "status_draft",
    "badge-neutral",
  ],
  [
    "saved before status existed",
    { id: "old" },
    "status_needs_reapproval",
    "badge-warning",
  ],
  [
    "no validation",
    { validation: undefined },
    "status_legacy",
    "badge-neutral",
  ],
];

describe("DietStatusBadge", () => {
  beforeEach(async () => i18n.changeLanguage("pt"));
  it.each(cases)("%s", (_label, patch, key, tone) => {
    render(<DietStatusBadge plan={{ ...base, ...patch } as DietPlan} />);
    const badge = screen.getByText(i18n.t(`diet_generator.display.${key}`));
    expect(badge.closest(".badge")).toHaveClass(tone);
  });
});
