// ============================================================
// TransactionTable Component
// Renders a list of transactions with status badges and action
// buttons. Used inside the ReceiverModal and Dashboard.
// ============================================================

"use client";

import { useState } from "react";
import { Transaction, TransactionStatus } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { useAppDispatch } from "@/store/hooks";
import { updateTransactionStatus, updateTransactionStatusAsync } from "@/store/slices/transactionSlice";
import {
  Download,
  Eye,
  AlertCircle,
  ArrowDown,
  ArrowUpRight,
  Maximize2,
  ArrowLeftRight,
  Wallet
} from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  /** Number of rows per page */
  pageSize?: number;
  /** 'dashboard' for main page, 'modal' for receiver details popup */
  variant?: "dashboard" | "modal";
  /** External control for search query (optional) */
  externalSearchQuery?: string;
  /** External control for status filter (optional) */
  externalStatusFilter?: string;
  /** External control for action toggle (optional) */
  externalOnlyActionNeeded?: boolean;
  /** Callback for row click */
  onRowClick?: (tx: Transaction) => void;
}

const ROWS_PER_PAGE = 5;

/** Trigger a download of a transaction receipt in Word format */
function downloadReceipt(tx: Transaction | null) {
  if (!tx) return;
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Transaction Receipt</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; color: #333; }
      .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px; }
      .row { margin-bottom: 10px; }
      .label { font-weight: bold; color: #6b7280; width: 150px; display: inline-block; }
      .value { color: #111827; font-weight: 600;}
      .table { border-collapse: collapse; width: 100%; margin-top: 30px; }
      .table th, .table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
      .table th { background-color: #f9fafb; font-weight: bold; color: #374151; }
      .footer { margin-top: 40px; font-size: 12px; color: #9ca3af; text-align: center; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
    </head>
    <body>
      <div class="header">Transaction Receipt - ${tx.requestId}</div>
      <div class="row"><span class="label">Date &amp; Time:</span> <span class="value">${tx.dateTime}</span></div>
      <div class="row"><span class="label">Status:</span> <span class="value" style="text-transform: capitalize;">${tx.status}</span></div>
      <div class="row"><span class="label">Type:</span> <span class="value">${tx.type}</span></div>
      
      <table class="table">
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Account Number</th>
          <th>Amount</th>
        </tr>
        <tr>
          <td>${tx.from || 'N/A'}</td>
          <td>${tx.to}</td>
          <td>${tx.accountNumber || 'N/A'}</td>
          <td><b style="color: #2563eb;">${tx.amount} ${tx.currency}</b></td>
        </tr>
      </table>
      <div class="footer">Generated securely by Modremit Platform</div>
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Receipt_${tx.requestId}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function TransactionTable({
  transactions,
  pageSize = ROWS_PER_PAGE,
  variant = "modal",
  externalSearchQuery,
  externalStatusFilter,
  externalOnlyActionNeeded,
  onRowClick,
}: TransactionTableProps) {
  const dispatch = useAppDispatch();
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalOnlyActionNeeded, setInternalOnlyActionNeeded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All");

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : "All";
  const onlyActionNeeded = externalOnlyActionNeeded !== undefined ? externalOnlyActionNeeded : internalOnlyActionNeeded;

  // ---- Client-side filter ----
  const filtered = transactions.filter((tx) => {
    // 1. Tab filter (for dashboard)
    if (variant === "dashboard" && activeTab !== "All") {
      if (activeTab === "Add money" && tx.type !== "Add money") return false;
      if (activeTab === "Send money" && tx.type !== "Send money") return false;
      if (activeTab === "Conversion" && tx.type !== "Conversion") return false;
    }

    // 2. Search / Action filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      tx.to?.toLowerCase().includes(query) ||
      tx.requestId?.toLowerCase().includes(query) ||
      tx.accountNumber?.toLowerCase().includes(query) ||
      tx.status?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "All" || tx.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesAction = !onlyActionNeeded || tx.status === "needs_action";

    return matchesSearch && matchesStatus && matchesAction;
  });

  // ---- Pagination ----
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /** Format date strings to a standard readable format */
  function formatDate(dateStr: string) {
    if (!dateStr) return "-";
    // If it's already formatted (mock data style), return as is
    if (dateStr.includes("|")) return dateStr;

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return `${formattedDate} | ${formattedTime}`;
    } catch (e) {
      return dateStr;
    }
  }

  // Reset to page 1 whenever filters change
  function handleSearchChange(value: string) {
    setInternalSearchQuery(value);
    setCurrentPage(1);
  }

  function handleActionToggle() {
    setInternalOnlyActionNeeded((prev) => !prev);
    setCurrentPage(1);
  }

  /** Inline status change — dispatches to Redux & would call API in production */
  function handleStatusChange(id: number, status: TransactionStatus) {
    dispatch(updateTransactionStatusAsync({ id, status }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Variant Header: Tabs (Dashboard) or Toolbar (Modal internal) ---- */}
      {variant === "dashboard" ? (
        <div className="flex gap-2 flex-wrap">
          {["All", "Add money", "Send money", "Conversion"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={` px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold transition-all border ${activeTab === tab
                ? "bg-yellow-400/20 text-yellow-700 border-yellow-200/50"
                : "bg-[#dbdcdc85] border-gray-100 text-gray-500 hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center gap-2">
                {tab === "Add money" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
                    <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-5.4a2 2 0 0 0-3-2.7L15 10" />
                    <circle cx="11" cy="5" r="1.5" />
                    <circle cx="18" cy="4" r="1.5" />
                  </svg>
                )}
                {tab === "Send money" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2.5" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                )}
                {tab === "Conversion" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                )}
                {tab}
              </div>
            </button>
          ))}
        </div>
      ) : externalSearchQuery === undefined ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or status..."
          />

          <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
            <span>Only Action Needed</span>
            <label
              className="toggle-switch"
              aria-label="Show only action needed transactions"
            >
              <input
                type="checkbox"
                checked={onlyActionNeeded}
                onChange={handleActionToggle}
              />
              <span className="toggle-track" />
            </label>
          </div>
        </div>
      ) : null}

      {/* ---- Table ---- */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {variant === "modal" && <th>#</th>}
              <th>Date &amp; Time</th>
              <th>Request ID</th>
              <th>Type</th>
              {variant === "dashboard" && <th>From</th>}
              <th>To</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={variant === "modal" ? 8 : 7}
                  className="text-center py-8 text-gray-400"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              paginated.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => onRowClick && onRowClick(tx)}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50/50 transition-colors" : ""}
                >
                  {variant === "modal" && (
                    <td className="text-gray-400 text-[11px] font-medium">
                      {tx.id}
                    </td>
                  )}
                  <td
                    className={`${variant === "dashboard"
                      ? "text-gray-400 text-[13px]"
                      : "text-[11px] text-gray-400"
                      } font-normal whitespace-nowrap`}
                  >
                    {formatDate(tx.dateTime)}
                  </td>
                  <td>
                    <span
                      className={`${variant === "dashboard" ? "text-[13px]" : "text-[11px]"
                        } font-normal text-gray-800 border-b border-gray-800 border-dotted cursor-pointer`}
                    >
                      {tx.requestId}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span
                        className={`${variant === "dashboard"
                          ? "text-[13px]"
                          : "text-[12px]"
                          } font-medium text-gray-800`}
                      >
                        {tx.type}
                      </span>
                      {variant === "dashboard" && (
                        <span className="text-[11px] text-gray-400">
                          (International)
                        </span>
                      )}
                    </div>
                  </td>
                  {variant === "dashboard" && (
                    <td className="font-medium text-[13px] text-gray-800">
                      {tx.from}
                    </td>
                  )}
                  <td className="font-medium text-[13px] text-gray-800">
                    <div className="flex items-center gap-2">
                      {tx.type === "Add money" && (
                        <ArrowDown size={14} className="text-gray-400" />
                      )}
                      {tx.to}
                    </div>
                  </td>
                  <td className="text-[12px] text-gray-500 font-mono">
                    {tx.accountNumber || "—"}
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://flagcdn.com/w40/${getCountryCode(tx.currency)}.png`}
                        alt={tx.currency}
                        className="flag-circle-sm"
                      />
                      <span className="font-medium text-[13px] text-gray-800">
                        {variant === "modal"
                          ? `${tx.currency} ${tx.amount}`
                          : `${tx.amount} ${tx.currency}`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={tx.status} />
                  </td>
                  <td>
                    {(tx.status === "needs_action" || tx.status === "Rejected") ? (
                      <button
                        className="btn-red-outline rounded-md whitespace-nowrap"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Upload logic not implemented");
                        }}
                      >
                        Upload Receipt
                      </button>
                    ) : variant === "dashboard" ? (
                      <div className="flex items-center gap-4 text-[13px] font-normal">
                        <button className="text-blue-600 hover:opacity-70 transition-opacity">
                          View
                        </button>
                        <span className="text-gray-300 text-sm">|</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); downloadReceipt(tx); }}
                          className="text-blue-600 hover:opacity-70 transition-opacity"
                        >
                          Download File
                        </button>
                      </div>
                    ) : (
                      <TransactionActions
                        transaction={tx}
                        onStatusChange={handleStatusChange}
                        onDownload={() => downloadReceipt(tx)}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Pagination ---- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

function getCountryCode(code: string): string {
  const codes: Record<string, string> = {
    USD: "us",
    AED: "ae",
    CAD: "ca",
    INR: "in",
    EUR: "eu",
    GBP: "gb",
  };
  return codes[code] ?? "us";
}

interface TransactionActionsProps {
  transaction: Transaction;
  onStatusChange: (id: number, status: TransactionStatus) => void;
  onDownload: () => void;
}

function TransactionActions({
  transaction,
  onStatusChange,
  onDownload,
}: TransactionActionsProps) {
  const { id, status } = transaction;

  switch (status) {
    case "Pending":
      return (
        <div className="flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStatusChange(id, "approved")}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            Approve
          </Button>
        </div>
      );
    case "Rejected":
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-red-50 text-red-700 border-red-200"
        >
          View Rejection
        </Button>
      );
    case "Cancelled":
      return (
        <Button variant="outline" size="sm" className="text-xs">
          View Reason
        </Button>
      );
    case "Success":
    case "approved":
    case "success":
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
        >
          <Download size={12} />
          Download
        </Button>
      );
    case "needs_action":
    case "Rejected":
      return (
        <button
          className="btn-red-outline rounded-md whitespace-nowrap"
          onClick={() => alert("Upload logic not implemented")}
        >
          Upload Receipt
        </button>
      );
    default:
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
        >
          Download
        </Button>
      );
  }
}
