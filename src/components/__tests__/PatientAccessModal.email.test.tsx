import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import i18n from "../../i18n";
import type { Patient } from "../../types";

// R05 (criterion 3): the modal tells a simulated dispatch apart from a real
// delivery, and never claims delivery for a simulation.
const sendPortalAccessEmail = vi.fn();
const revokePatientPortalAccess = vi.fn();
vi.mock("../../services/emailService", () => ({
  isEmailConfigured: () => true,
  sendPortalAccessEmail: (...args: unknown[]) => sendPortalAccessEmail(...args),
}));
vi.mock("../../services/firebaseService", () => ({
  createOrGetPendingInvitation: vi.fn(async () => ({
    id: "inv-synthetic",
    status: "pending",
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  })),
  revokeInvitation: vi.fn(),
  getInvitationByToken: vi.fn(async () => null),
  sendPortalPasswordReset: vi.fn(),
  revokePatientPortalAccess: (...args: unknown[]) =>
    revokePatientPortalAccess(...args),
}));
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: {
      uid: "nutri-1",
      email: "dra@demo.test",
      displayName: "Dra. Teste",
    },
  }),
}));

import PatientAccessModal from "../modals/PatientAccessModal";

const patient = {
  id: "p1",
  firstName: "Paciente",
  lastName: "Sintético",
  email: "paciente@clinica-externa.com.br",
} as Patient;

describe("PatientAccessModal — simulated vs real e-mail feedback (R05)", () => {
  beforeEach(async () => {
    sendPortalAccessEmail.mockReset();
    await i18n.changeLanguage("pt");
  });

  const generate = async () => {
    render(<PatientAccessModal patient={patient} onClose={() => {}} />);
    fireEvent.click(
      await screen.findByRole("button", { name: /Gerar Convite de Acesso/ }),
    );
  };

  it("shows the simulation notice (and no delivery claim) for a simulated dispatch", async () => {
    sendPortalAccessEmail.mockResolvedValue({
      status: "simulated",
      simulated: true,
    });
    await generate();
    expect(
      await screen.findByText(/Disparo simulado com sucesso/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/foi enviado para o paciente/)).toBeNull();
  });

  it("confirms delivery only when the service reports a real send", async () => {
    sendPortalAccessEmail.mockResolvedValue({
      status: "sent",
      simulated: false,
    });
    await generate();
    expect(
      await screen.findByText(/foi enviado para o paciente/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Disparo simulado/)).toBeNull();
  });
});

describe("PatientAccessModal — revocation outcomes (R04)", () => {
  const linked = { ...patient, portalUid: "portal-uid-1" } as Patient;
  const revoke = async () => {
    render(<PatientAccessModal patient={linked} onClose={() => {}} />);
    fireEvent.click(
      await screen.findByRole("button", { name: /Revogar Acesso/ }),
    );
    fireEvent.click(
      await screen.findByRole("button", { name: /Sim, Revogar Acesso/ }),
    );
  };
  beforeEach(async () => {
    revokePatientPortalAccess.mockReset();
    await i18n.changeLanguage("pt");
  });

  it("effective revocation: success only", async () => {
    revokePatientPortalAccess.mockResolvedValue({
      revokedInvitationsCount: 1,
      cleanupIncomplete: false,
    });
    await revoke();
    expect(
      await screen.findByText(/Acesso ao portal revogado com sucesso/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/não puderam ser encerrados/)).toBeNull();
  });

  it("incomplete cleanup: success plus a visible warning (not only a console message)", async () => {
    revokePatientPortalAccess.mockResolvedValue({
      revokedInvitationsCount: 0,
      cleanupIncomplete: true,
    });
    await revoke();
    expect(
      await screen.findByText(/Acesso ao portal revogado com sucesso/),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /não puderam ser encerrados/,
    );
  });

  it("authorization failure: a permission message, no success", async () => {
    revokePatientPortalAccess.mockRejectedValue({ code: "permission-denied" });
    await revoke();
    expect(
      await screen.findByText(/não tem permissão para revogar/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/revogado com sucesso/)).toBeNull();
  });
});
