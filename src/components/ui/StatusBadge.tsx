// ============================================================
// StatusBadge Component
// Renders a colored badge based on transaction status.
// All styles come from global CSS classes (no inline styles).
// ============================================================

import { TransactionStatus } from "@/types";

interface StatusBadgeProps {
  status: TransactionStatus;
}

// Maps each status to the corresponding global CSS class
const STATUS_CLASS_MAP: Record<TransactionStatus, string> = {
  success: "badge-success",
  Success: "badge-success",
  approved: "badge-success",
  Approved: "badge-success",
  Pending: "badge-pending",
  Cancelled: "badge-cancelled",
  Rejected: "badge-action",
  failed: "badge-action",
  Failed: "badge-action",
  needs_action: "badge-action",
};

const STATUS_LABEL_MAP: Record<TransactionStatus, string> = {
  success: "success",
  Success: "Success",
  approved: "approved",
  Approved: "Approved",
  Pending: "Pending",
  Cancelled: "Cancelled",
  Rejected: "needs action",
  failed: "needs action",
  Failed: "needs action",
  needs_action: "needs action",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const badgeClass = STATUS_CLASS_MAP[status] ?? "badge-cancelled";
  const label = STATUS_LABEL_MAP[status] ?? status.toLowerCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
    >
      {label}
    </span>
  );
}
