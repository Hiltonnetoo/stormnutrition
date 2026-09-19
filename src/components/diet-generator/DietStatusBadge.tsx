import React from "react";
import { useTranslation } from "react-i18next";
import type { DietPlan } from "../../types";
import { Badge } from "../ui";
import {
  AlertTriangleIcon,
  DocumentTextIcon,
  ShieldIcon,
  XCircleIcon,
} from "../icons";

/**
 * UI02/UI09 — the plan's state with the same tone, icon and text on every
 * surface (generator, saved-plan viewer, profile history). Approval is only
 * the professional's (A6); plans saved before 19/09/2026 without `status`
 * need a new approval.
 */
const DietStatusBadge: React.FC<{ plan: DietPlan }> = ({ plan }) => {
  const { t } = useTranslation();
  const icon = (Icon: React.FC<{ className?: string }>) => (
    <Icon className="w-3.5 h-3.5" />
  );
  if (!plan.validation) {
    return (
      <Badge tone="neutral">{t("diet_generator.display.status_legacy")}</Badge>
    );
  }
  if (plan.status === "blocked" || plan.validation.status === "infeasible") {
    return (
      <Badge tone="danger" icon={icon(XCircleIcon)}>
        {t("diet_generator.display.status_blocked")}
      </Badge>
    );
  }
  if (plan.status === "clinically_approved" || plan.clinicalApproval) {
    return (
      <Badge
        tone="brand"
        icon={icon(ShieldIcon)}
        title={
          plan.clinicalApproval?.professionalCrn
            ? `CRN ${plan.clinicalApproval.professionalCrn}`
            : undefined
        }
      >
        {t("diet_generator.display.status_approved")}
      </Badge>
    );
  }
  // a saved plan (has an id) from before the status field existed
  if (!plan.status && plan.id) {
    return (
      <Badge tone="warning" icon={icon(AlertTriangleIcon)}>
        {t("diet_generator.display.status_needs_reapproval")}
      </Badge>
    );
  }
  if (
    plan.status === "awaiting_review" ||
    plan.validation.status === "requires_review"
  ) {
    return (
      <Badge tone="warning" icon={icon(AlertTriangleIcon)}>
        {t("diet_generator.display.status_requires_review")}
      </Badge>
    );
  }
  return (
    <Badge tone="neutral" icon={icon(DocumentTextIcon)}>
      {t("diet_generator.display.status_draft")}
    </Badge>
  );
};

export default DietStatusBadge;
