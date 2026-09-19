import { describe, it, expect } from "vitest";
import { renderStartupError } from "../startupErrorScreen";

describe("renderStartupError", () => {
  it("replaces the root with an accessible alert listing each problem", () => {
    const root = document.createElement("div");
    root.innerHTML = "<p>stale</p>";
    renderStartupError(root, ["Missing VITE_FIREBASE_API_KEY", "Other"]);

    const alert = root.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(root.querySelector("h1")?.textContent).toMatch(/could not start/);
    expect(
      Array.from(root.querySelectorAll("li")).map((li) => li.textContent),
    ).toEqual(["Missing VITE_FIREBASE_API_KEY", "Other"]);
    expect(root.textContent).not.toContain("stale");
  });

  it("renders details as text, never as HTML", () => {
    const root = document.createElement("div");
    renderStartupError(root, ['<img src=x onerror="alert(1)">']);
    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector("li")?.textContent).toContain("<img");
  });
});
