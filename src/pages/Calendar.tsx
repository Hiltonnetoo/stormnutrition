import React, { useState, useEffect, useCallback, useId } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import {
  getAppointmentsInRange,
  getUpcomingAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/firebaseService";
import { usePatientDirectory } from "../hooks/usePatientDirectory";
import type { Appointment, AppointmentType, Patient } from "../types";
import { PageHeader, Card, Button, Modal, ErrorState } from "../components/ui";
import { PlusIcon, ChevronRightIcon } from "../components/icons";
import { ConfirmationModal } from "../components/modals/PatientModal";
import { getCivilMonthRange, parseLocalDateTime } from "../utils/dateTime";

const UPCOMING_LIMIT = 5;

const TYPE_DOT: Record<AppointmentType, string> = {
  consultation: "bg-sage-500",
  followup: "bg-sky-500",
  assessment: "bg-violet-500",
  other: "bg-amber-500",
};
const TYPE_LIGHT: Record<AppointmentType, string> = {
  consultation:
    "bg-sage-50 text-sage-700 border-sage-200 dark:bg-sage-500/10 dark:border-sage-800",
  followup:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:border-sky-800",
  assessment:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:border-violet-800",
  other:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:border-amber-800",
};

const fieldClass = "input-field";

/* ----------------------------------------------------------- Appointment modal */
interface ApptModalProps {
  date: Date;
  appointment?: Appointment;
  patients: Patient[];
  onSave: (data: Omit<Appointment, "id">) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
  defaultPatientId?: string;
  defaultPatientName?: string;
}

const AppointmentModal: React.FC<ApptModalProps> = ({
  date,
  appointment,
  patients,
  onSave,
  onDelete,
  onClose,
  defaultPatientId,
  defaultPatientName,
}) => {
  const { t, i18n } = useTranslation();
  const pad = (n: number) => String(n).padStart(2, "0");
  const defaultTime = `${pad(date.getHours() || 9)}:${pad(date.getMinutes() || 0)}`;
  const [patientId, setPatientId] = useState(
    appointment?.patientId || defaultPatientId || "",
  );
  const [patientName, setPatientName] = useState(
    appointment?.patientName || defaultPatientName || "",
  );
  const [time, setTime] = useState(
    appointment ? appointment.dateTime.slice(11, 16) : defaultTime,
  );
  const [duration, setDuration] = useState(appointment?.durationMinutes || 60);
  const [type, setType] = useState<AppointmentType>(
    appointment?.type || "consultation",
  );
  const [notes, setNotes] = useState(appointment?.notes || "");
  const [status, setStatus] = useState(appointment?.status || "scheduled");
  const [saving, setSaving] = useState(false);
  const [patientError, setPatientError] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const fieldId = useId();
  const ids = {
    patient: `${fieldId}-patient`,
    time: `${fieldId}-time`,
    duration: `${fieldId}-duration`,
    type: `${fieldId}-type`,
    status: `${fieldId}-status`,
    notes: `${fieldId}-notes`,
    patientError: `${fieldId}-patient-error`,
  };

  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = patients.find((p) => p.id === e.target.value);
    if (p) {
      setPatientId(p.id!);
      setPatientName(`${p.firstName} ${p.lastName}`);
      setPatientError("");
    }
  };

  const handleSave = async () => {
    if (!patientId) {
      setPatientError(t("calendar.patient_error"));
      return;
    }
    setSaving(true);
    await onSave({
      patientId,
      patientName,
      dateTime: `${dateStr}T${time}:00`,
      durationMinutes: duration,
      type,
      notes,
      status,
      createdAt: appointment?.createdAt || new Date().toISOString(),
    });
    setSaving(false);
    onClose();
  };

  return (
    <>
      {confirmDeleteOpen && onDelete && (
        <ConfirmationModal
          isOpen={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={async () => {
            setConfirmDeleteOpen(false);
            await onDelete();
            onClose();
          }}
          title={t("calendar.delete_confirm_title")}
          message={t("calendar.delete_confirm_msg")}
          confirmText={t("calendar.delete_confirm_btn")}
        />
      )}
      <Modal
        open
        onClose={onClose}
        title={
          appointment
            ? t("calendar.edit_appointment")
            : t("calendar.new_appointment")
        }
        description={date.toLocaleDateString(
          i18n.language === "pt" ? "pt-BR" : "en-US",
          { weekday: "long", day: "2-digit", month: "long" },
        )}
        footer={
          <>
            {onDelete && (
              <button
                onClick={() => setConfirmDeleteOpen(true)}
                className="mr-auto px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                {t("calendar.delete_btn")}
              </button>
            )}
            <Button variant="ghost" onClick={onClose}>
              {t("calendar.cancel_btn")}
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {t("calendar.save_btn")}
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div>
            <label htmlFor={ids.patient} className="input-label">
              {t("calendar.patient_label")}
            </label>
            <select
              id={ids.patient}
              aria-invalid={patientError ? true : undefined}
              aria-describedby={patientError ? ids.patientError : undefined}
              value={patientId}
              onChange={handlePatientChange}
              className={`${fieldClass} ${patientError ? "!border-rose-400" : ""}`}
            >
              <option value="">
                {t("calendar.select_patient_placeholder")}
              </option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
            {patientError && (
              <p id={ids.patientError} className="mt-1 text-xs text-rose-600">
                {patientError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={ids.time} className="input-label">
                {t("calendar.time_label")}
              </label>
              <input
                id={ids.time}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor={ids.duration} className="input-label">
                {t("calendar.duration_label")}
              </label>
              <select
                id={ids.duration}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={fieldClass}
              >
                {[30, 45, 60, 90, 120].map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={ids.type} className="input-label">
                {t("calendar.type_label")}
              </label>
              <select
                id={ids.type}
                value={type}
                onChange={(e) => setType(e.target.value as AppointmentType)}
                className={fieldClass}
              >
                {Object.keys(TYPE_DOT).map((k) => (
                  <option key={k} value={k}>
                    {t(`calendar.types.${k}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={ids.status} className="input-label">
                {t("calendar.status_label")}
              </label>
              <select
                id={ids.status}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Appointment["status"])
                }
                className={fieldClass}
              >
                <option value="scheduled">
                  {t("calendar.status_options.scheduled")}
                </option>
                <option value="completed">
                  {t("calendar.status_options.completed")}
                </option>
                <option value="cancelled">
                  {t("calendar.status_options.cancelled")}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={ids.notes} className="input-label">
              {t("calendar.notes_label")}
            </label>
            <textarea
              id={ids.notes}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`${fieldClass} resize-none`}
              placeholder={t("calendar.notes_placeholder")}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

/* ----------------------------------------------------------------- Calendar */
const Calendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const location = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upcomingAppts, setUpcomingAppts] = useState<Appointment[]>([]);
  const [today] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [editingAppt, setEditingAppt] = useState<Appointment | undefined>(
    undefined,
  );
  const [prePatientId, setPrePatientId] = useState<string>("");
  const [prePatientName, setPrePatientName] = useState<string>("");
  const [loadError, setLoadError] = useState<
    "permission_denied" | "load_error" | null
  >(null);
  const [refreshCount, setRefreshCount] = useState(0);
  // The patient picker is only needed while the appointment modal is open.
  const { patients } = usePatientDirectory(modalDate !== null);

  const locale = i18n.language === "pt" ? "pt-BR" : "en-US";
  const uid = currentUser?.uid;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Only the visible month is read; navigating re-subscribes to the new range.
  useEffect(() => {
    if (!uid) return;
    setLoadError(null);
    const { start, end } = getCivilMonthRange(year, month);
    return getAppointmentsInRange(
      uid,
      start,
      end,
      (appts) => {
        setAppointments(appts);
        setLoadError(null);
      },
      (err) => {
        setLoadError(
          err.code === "permission-denied" ? "permission_denied" : "load_error",
        );
      },
    );
  }, [uid, year, month, refreshCount]);

  useEffect(() => {
    if (!uid) return;
    return getUpcomingAppointments(
      uid,
      todayStr,
      UPCOMING_LIMIT,
      setUpcomingAppts,
    );
  }, [uid, todayStr]);

  // Abre o modal de nova consulta pré-selecionando o paciente vindo de PatientProfile (item 3 FASE 1)
  useEffect(() => {
    const state = location.state as {
      prePatientId?: string;
      prePatientName?: string;
    } | null;
    if (state?.prePatientId) {
      setPrePatientId(state.prePatientId);
      setPrePatientName(state.prePatientName || "");
      setEditingAppt(undefined);
      setModalDate(new Date());
      // Limpa o state para não re-abrir em navegações subsequentes
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getApptForDay = useCallback(
    (day: number) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      const prefix = `${year}-${pad(month + 1)}-${pad(day)}`;
      return appointments.filter((a) => a.dateTime.startsWith(prefix));
    },
    [appointments, year, month],
  );

  const selectedDayAppts = selectedDate
    ? getApptForDay(selectedDate.getDate())
    : [];

  const handleSave = async (data: Omit<Appointment, "id">) => {
    if (!currentUser) return;
    if (editingAppt?.id)
      await updateAppointment(currentUser.uid, editingAppt.id, data);
    else await addAppointment(currentUser.uid, data);
  };

  const handleDelete = async () => {
    if (!currentUser || !editingAppt?.id) return;
    await deleteAppointment(currentUser.uid, editingAppt.id);
  };

  const DAYS_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title={t("calendar.title")}
        subtitle={t("calendar.subtitle")}
        actions={
          <Button
            onClick={() => {
              setEditingAppt(undefined);
              setModalDate(new Date());
            }}
            leftIcon={<PlusIcon className="w-5 h-5" />}
          >
            {t("calendar.new_appointment")}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              aria-label={t("a11y.previous_month")}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 focus-ring"
            >
              <ChevronRightIcon className="w-5 h-5 rotate-180" />
            </button>
            <h2
              aria-live="polite"
              className="text-lg font-bold text-slate-800 dark:text-white"
            >
              {(() => {
                const mName = currentDate.toLocaleDateString(
                  i18n.language === "pt" ? "pt-BR" : "en-US",
                  { month: "long" },
                );
                return mName.charAt(0).toUpperCase() + mName.slice(1);
              })()}{" "}
              {year}
            </h2>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              aria-label={t("a11y.next_month")}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 focus-ring"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {loadError ? (
            <div className="p-8">
              <ErrorState
                title={
                  loadError === "permission_denied"
                    ? t("calendar.error_permission")
                    : t("calendar.error_load")
                }
                message={
                  loadError === "permission_denied"
                    ? t("calendar.error_permission_desc")
                    : t("calendar.error_load_desc")
                }
                onRetry={() => setRefreshCount((c) => c + 1)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {DAYS_KEYS.map((k) => (
                <div
                  key={k}
                  aria-hidden="true"
                  className="py-2.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  {t(`calendar.days_short.${k}`)}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  aria-hidden="true"
                  className="border-t border-slate-50 dark:border-slate-800 min-h-[84px]"
                />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === month &&
                  today.getFullYear() === year;
                const isSelected =
                  selectedDate?.getDate() === day &&
                  selectedDate?.getMonth() === month &&
                  selectedDate?.getFullYear() === year;
                const dayAppts = getApptForDay(day);
                const dayDate = new Date(year, month, day);
                const dayLabel = `${dayDate.toLocaleDateString(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}, ${t("a11y.appointments_count", { count: dayAppts.length })}`;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dayDate)}
                    className={`min-h-[84px] p-1.5 border-t border-slate-50 dark:border-slate-800 cursor-pointer transition-colors hover:bg-sage-50/50 dark:hover:bg-slate-800/50 ${isSelected ? "bg-sage-50 dark:bg-sage-900/20" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(dayDate);
                      }}
                      aria-label={dayLabel}
                      aria-pressed={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mb-1 focus-ring ${isToday ? "bg-sage-600 text-white" : "text-slate-700 dark:text-slate-300"}`}
                    >
                      {day}
                    </button>
                    <div className="space-y-0.5">
                      {dayAppts.slice(0, 2).map((a) => (
                        <button
                          type="button"
                          key={a.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAppt(a);
                            setModalDate(parseLocalDateTime(a.dateTime));
                          }}
                          aria-label={t("a11y.edit_appointment", {
                            name: a.patientName,
                            time: a.dateTime.slice(11, 16),
                          })}
                          className={`block w-full text-left text-[11px] font-semibold px-1.5 py-0.5 rounded-md truncate cursor-pointer border focus-ring ${TYPE_LIGHT[a.type]}`}
                        >
                          {a.dateTime.slice(11, 16)}{" "}
                          {a.patientName.split(" ")[0]}
                        </button>
                      ))}
                      {dayAppts.length > 2 && (
                        <div className="text-[11px] text-slate-500 pl-1">
                          {t("calendar.more_events", {
                            count: dayAppts.length - 2,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Side panel */}
        <div className="space-y-4">
          {selectedDate && (
            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm capitalize">
                  {selectedDate.toLocaleDateString(
                    i18n.language === "pt" ? "pt-BR" : "en-US",
                    { weekday: "long", day: "2-digit", month: "long" },
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAppt(undefined);
                    setModalDate(selectedDate);
                  }}
                  aria-label={t("a11y.new_appointment_on", {
                    date: selectedDate.toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                    }),
                  })}
                  className="p-1.5 bg-sage-50 hover:bg-sage-100 dark:bg-sage-500/15 rounded-lg transition-colors text-sage-700 focus-ring"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                {selectedDayAppts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    {t("calendar.no_appts_today")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayAppts.map((a) => (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => {
                          setEditingAppt(a);
                          setModalDate(parseLocalDateTime(a.dateTime));
                        }}
                        className={`block w-full text-left p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-shadow focus-ring ${TYPE_LIGHT[a.type]}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">
                            {a.dateTime.slice(11, 16)} · {a.durationMinutes}min
                          </span>
                          <span className="text-xs">
                            {t(`calendar.types.${a.type}`)}
                          </span>
                        </div>
                        <p className="font-semibold text-sm mt-1">
                          {a.patientName}
                        </p>
                        {a.notes && (
                          <p className="text-xs mt-0.5 truncate">{a.notes}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                {t("calendar.upcoming_appointments")}
              </h3>
            </div>
            <div className="p-4">
              {upcomingAppts.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  {t("calendar.no_appts_scheduled")}
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppts.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${TYPE_DOT[a.type]}`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {a.patientName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {parseLocalDateTime(a.dateTime).toLocaleDateString(
                            i18n.language === "pt" ? "pt-BR" : "en-US",
                            { day: "2-digit", month: "short" },
                          )}{" "}
                          às {a.dateTime.slice(11, 16)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">
              {t("calendar.legend")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(TYPE_DOT).map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${TYPE_DOT[k as AppointmentType]}`}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {t(`calendar.types.${k}`)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {modalDate && (
        <AppointmentModal
          date={modalDate}
          appointment={editingAppt}
          patients={patients}
          onSave={handleSave}
          onDelete={editingAppt?.id ? handleDelete : undefined}
          defaultPatientId={!editingAppt ? prePatientId : undefined}
          defaultPatientName={!editingAppt ? prePatientName : undefined}
          onClose={() => {
            setModalDate(null);
            setEditingAppt(undefined);
            setPrePatientId("");
            setPrePatientName("");
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
