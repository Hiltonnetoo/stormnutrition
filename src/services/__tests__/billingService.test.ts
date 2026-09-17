import { describe, it, expect, beforeEach } from "vitest";
import {
  getBillingState,
  changePlan,
  cancelSubscription,
  reactivateSubscription,
} from "../billingService";

describe("billingService - multi-account isolation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("isolates subscription plans between User A and User B", () => {
    const userA = "uid_nutritionist_A";
    const userB = "uid_nutritionist_B";

    // User A changes plan to "clinic"
    changePlan("clinic", userA);
    const stateA = getBillingState(userA);
    expect(stateA.tier).toBe("clinic");

    // User B initializes independently (default is "pro")
    const stateBInitial = getBillingState(userB);
    expect(stateBInitial.tier).toBe("pro");

    // User B switches to "free"
    changePlan("free", userB);
    const stateB = getBillingState(userB);
    expect(stateB.tier).toBe("free");

    // Re-verifying User A: still "clinic"!
    const stateAFinal = getBillingState(userA);
    expect(stateAFinal.tier).toBe("clinic");
  });

  it("isolates cancellation between accounts", () => {
    const userA = "uid_alice";
    const userB = "uid_bob";

    getBillingState(userA);
    getBillingState(userB);

    // User A cancels
    cancelSubscription(userA);
    expect(getBillingState(userA).status).toBe("canceled");

    // User B must remain active!
    expect(getBillingState(userB).status).toBe("active");

    // User A reactivates
    reactivateSubscription(userA);
    expect(getBillingState(userA).status).toBe("active");
  });

  it("handles corrupted storage safely by returning default state", () => {
    const userC = "uid_charlie";
    localStorage.setItem(
      "isanutri:uid_charlie:billingState:v1",
      "corrupted json{",
    );

    const state = getBillingState(userC);
    expect(state.tier).toBe("pro");
    expect(state.status).toBe("active");
  });
});
