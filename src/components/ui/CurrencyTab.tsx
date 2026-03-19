// ============================================================
// CurrencyTab Component
// Displays a currency selector tab (AED / USD / CAD).
// Active tab is highlighted with yellow border (design system class).
// ============================================================

import { CurrencyCode } from "@/types";

interface CurrencyTabProps {
  code: CurrencyCode;
  accountNumber: string;
  flag: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CurrencyTab({
  code,
  accountNumber,
  flag,
  isSelected,
  onClick,
}: CurrencyTabProps) {
  return (
    <button
      onClick={onClick}
      className={`currency-tab ${isSelected ? "selected" : ""}`}
      aria-pressed={isSelected}
      aria-label={`Select ${code} account ${accountNumber}`}
      type="button"
    >
      <span className="text-sm">{flag}</span>
      <span className="font-mono text-xs tracking-wider">{accountNumber}</span>
      <span className="text-xs font-semibold">{code}</span>
    </button>
  );
}
