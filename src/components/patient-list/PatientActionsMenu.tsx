import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { Patient } from "../../types";
import { DocumentTextIcon, EditIcon, TrashIcon } from "../icons";

const ArchiveIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);

const PortalLinkIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    aria-hidden="true"
    className={`w-4 h-4 shrink-0 ${active ? "text-teal-600" : "text-slate-400"}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

const menuItems = (menu: HTMLElement | null) =>
  Array.from(menu?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

export interface PatientActionsMenuProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewHistory: () => void;
  onManagePortal: () => void;
  onEdit: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
}

/**
 * "More actions" menu button (WAI-ARIA APG menu button pattern): Enter,
 * Space or ArrowDown open it on the first item, ArrowUp on the last; arrows,
 * Home and End move between items; Escape or Tab close it and return focus to
 * the trigger. Choosing an item also returns focus to the trigger first, so a
 * dialog opened by the action gives focus back to it when it closes.
 */
export const PatientActionsMenu: React.FC<PatientActionsMenuProps> = ({
  patient,
  open,
  onOpenChange,
  onViewHistory,
  onManagePortal,
  onEdit,
  onToggleArchive,
  onDelete,
}) => {
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [focusOnOpen, setFocusOnOpen] = useState<"first" | "last">("first");
  const menuId = useId();
  const name = `${patient.firstName} ${patient.lastName}`.trim();
  const archived = patient.status === "Archived";

  const computePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    // Opens upwards when there is little room below, so every option
    // (including "Delete") stays visible.
    const openUp = spaceBelow < 240 && rect.top > spaceBelow;
    const right = Math.max(8, window.innerWidth - rect.right);
    setMenuStyle(
      openUp
        ? {
            position: "fixed",
            bottom: window.innerHeight - rect.top + 4,
            right,
            maxHeight: rect.top - 16,
          }
        : {
            position: "fixed",
            top: rect.bottom + 4,
            right,
            maxHeight: window.innerHeight - rect.bottom - 16,
          },
    );
  };

  const openMenu = (focus: "first" | "last") => {
    computePosition();
    setFocusOnOpen(focus);
    onOpenChange(true);
  };

  const closeMenu = (returnFocus: boolean) => {
    onOpenChange(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  // Focus the requested item once the menu is rendered.
  useEffect(() => {
    if (!open) return;
    const all = menuItems(menuRef.current);
    (focusOnOpen === "last" ? all[all.length - 1] : all[0])?.focus();
  }, [open, focusOnOpen]);

  // Close on outside click, scroll or resize (the menu is position: fixed).
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (ev: MouseEvent) => {
      const target = ev.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      onOpenChange(false);
    };
    const onScrollOrResize = (ev: Event) => {
      if (menuRef.current?.contains(ev.target as Node)) return;
      onOpenChange(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, onOpenChange]);

  // Enter / Space arrive as a click; arrows open the menu directly.
  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openMenu("first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu("last");
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const all = menuItems(menuRef.current);
    const index = all.indexOf(document.activeElement as HTMLElement);
    const move = (to: number) => all[(to + all.length) % all.length]?.focus();
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(index - 1);
        break;
      case "Home":
        e.preventDefault();
        move(0);
        break;
      case "End":
        e.preventDefault();
        move(all.length - 1);
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        closeMenu(true);
        break;
    }
  };

  const choose = (action: () => void) => () => {
    closeMenu(true);
    action();
  };

  const itemCls =
    "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 focus:bg-slate-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sage-600 dark:hover:bg-slate-800 dark:focus:bg-slate-800 transition-colors";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (open) closeMenu(false);
          else openMenu("first");
        }}
        onKeyDown={onTriggerKeyDown}
        aria-label={t("a11y.more_actions", { name })}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={t("a11y.more_actions", { name })}
            style={menuStyle}
            onKeyDown={onMenuKeyDown}
            className="z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-pop min-w-[210px] overflow-y-auto py-1 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={choose(onViewHistory)}
              className={itemCls}
            >
              <DocumentTextIcon className="w-4 h-4 text-slate-400 shrink-0" />
              {t("patients.history_menu")}
            </button>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={choose(onManagePortal)}
              className={itemCls}
            >
              <PortalLinkIcon active={!!patient.portalUid} />
              {patient.portalUid
                ? t("patients.manage_portal_menu")
                : t("patients.invite_portal_menu")}
            </button>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={choose(onEdit)}
              className={itemCls}
            >
              <EditIcon className="w-4 h-4 text-slate-400 shrink-0" />
              {t("patients.edit_patient_menu")}
            </button>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={choose(onToggleArchive)}
              className={itemCls}
            >
              <ArchiveIcon className="w-4 h-4 text-slate-400 shrink-0" />
              {archived
                ? t("patients.unarchive_patient_menu", {
                    defaultValue: "Desarquivar Paciente",
                  })
                : t("patients.archive_patient_menu", {
                    defaultValue: "Arquivar Paciente",
                  })}
            </button>
            <div
              role="separator"
              className="my-1 border-t border-slate-100 dark:border-slate-800"
            />
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={choose(onDelete)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-700 hover:bg-rose-50 focus:bg-rose-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rose-600 dark:hover:bg-rose-900/20 transition-colors"
            >
              <TrashIcon className="w-4 h-4 shrink-0" />
              {t("patients.delete_patient_menu")}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

export default PatientActionsMenu;
