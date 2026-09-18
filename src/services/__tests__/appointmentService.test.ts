import { describe, it, expect } from "vitest";
import {
  validateAppointmentData,
  findAppointmentConflict,
} from "../appointmentService";
import type { Appointment } from "../../types";

const mockAppointments: Appointment[] = [
  {
    id: "appt_1",
    patientId: "pat_1",
    patientName: "Lucas Mendes",
    dateTime: "2026-09-20T14:00:00",
    durationMinutes: 60, // 14:00 - 15:00
    type: "consultation",
    status: "scheduled",
    createdAt: "2026-09-17T10:00:00Z",
  },
  {
    id: "appt_2",
    patientId: "pat_2",
    patientName: "Ana Clara",
    dateTime: "2026-09-20T16:00:00",
    durationMinutes: 45, // 16:00 - 16:45
    type: "followup",
    status: "scheduled",
    createdAt: "2026-09-17T11:00:00Z",
  },
  {
    id: "appt_3",
    patientId: "pat_3",
    patientName: "Pedro Alvares",
    dateTime: "2026-09-20T15:00:00",
    durationMinutes: 60, // 15:00 - 16:00
    type: "assessment",
    status: "cancelled", // Cancelled!
    createdAt: "2026-09-17T12:00:00Z",
  },
];

describe("appointmentService - Validations and Conflict Resolution", () => {
  describe("validateAppointmentData", () => {
    it("accepts valid appointment data", () => {
      expect(() =>
        validateAppointmentData({
          patientId: "pat_1",
          dateTime: "2026-09-20T14:00:00",
          durationMinutes: 60,
          type: "consultation",
          status: "scheduled",
        }),
      ).not.toThrow();
    });

    it("rejects non-positive or excessive duration", () => {
      expect(() =>
        validateAppointmentData({ durationMinutes: 5 }),
      ).toThrowError(/entre 10 e 480 minutos/);

      expect(() =>
        validateAppointmentData({ durationMinutes: 600 }),
      ).toThrowError(/entre 10 e 480 minutos/);
    });

    it("rejects invalid date format", () => {
      expect(() =>
        validateAppointmentData({ dateTime: "invalid-date" }),
      ).toThrowError(/Data\/horário inválido/);
    });

    it("rejects unrecognized appointment type or status", () => {
      expect(() =>
        validateAppointmentData({
          type: "arbitrary_type" as unknown as Appointment["type"],
        }),
      ).toThrowError(/Tipo de consulta inválido/);

      expect(() =>
        validateAppointmentData({
          status: "arbitrary_status" as unknown as Appointment["status"],
        }),
      ).toThrowError(/Status de consulta inválido/);
    });
  });

  describe("findAppointmentConflict", () => {
    it("detects exact overlap with scheduled appointment", () => {
      // Trying to schedule at 14:30 (during appt_1 14:00-15:00)
      const conflict = findAppointmentConflict(mockAppointments, {
        dateTime: "2026-09-20T14:30:00",
        durationMinutes: 30,
      });

      expect(conflict).not.toBeNull();
      expect(conflict!.id).toBe("appt_1");
    });

    it("allows back-to-back non-overlapping appointments", () => {
      // 15:00 to 16:00 (right after appt_1 14:00-15:00 and right before appt_2 16:00-16:45)
      const conflict = findAppointmentConflict(mockAppointments, {
        dateTime: "2026-09-20T15:00:00",
        durationMinutes: 60,
      });

      // appt_3 is at 15:00 but is CANCELLED, so it shouldn't conflict!
      expect(conflict).toBeNull();
    });

    it("ignores self when updating existing appointment", () => {
      // Updating appt_1 itself with the same time
      const conflict = findAppointmentConflict(mockAppointments, {
        id: "appt_1",
        dateTime: "2026-09-20T14:00:00",
        durationMinutes: 60,
      });

      expect(conflict).toBeNull();
    });
  });
});
