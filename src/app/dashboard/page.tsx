// ============================================================
// Dashboard Page (Appendix 2)
// Displays:
//   - Account Balance card (with currency breakdown)
//   - Quick Conversion widget
//   - Transactions table (clicking any row opens ReceiverModal)
// Non-functional UI — only the transaction click is wired up.
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { openReceiverModal } from "@/store/slices/uiSlice";
import { fetchTransactions } from "@/store/slices/transactionSlice";
import { MOCK_RECEIVER, MOCK_RECEIVERS, ACCOUNT_BALANCE } from "@/data/mockData";
import { Transaction } from "@/types";
import { getSocket } from "@/lib/socket";
import {
  ArrowUpRight,
  SlidersHorizontal,
  Maximize2,
  ArrowLeftRight,
  ChevronDown,
} from "lucide-react";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items: transactions, loading } = useAppSelector((state) => state.transactions);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    dispatch(fetchTransactions());

    // WebSocket listener for real-time updates
    const s = getSocket();
    if (s) {
      s.emit("join", "transactions");
      s.on("transactions", (data: any) => {
        console.log("Real-time update received:", data);
        dispatch(fetchTransactions());
      });
    }

    return () => {
      const s = getSocket();
      if (s) {
        s.off("transactions");
        s.emit("leave", "transactions");
      }
    };
  }, [dispatch]);

  function downloadSampleFile() {
    const link = document.createElement("a");
    link.href = "/sample.docx";
    link.download = "remitland-transaction-report.docx";
    link.click();
  }

  /**
   * Opens the ReceiverModal when a transaction row is clicked.

   * Finds the receiver for the transaction's "to" field.
   */
  function handleTransactionClick(tx: Transaction) {
    let receiver =
      tx.receiverDetails ??
      MOCK_RECEIVERS.find((r) => r.name === tx.to) ??
      MOCK_RECEIVER;

    // Ensure transactions are populated for the modal
    if (receiver && (!receiver.transactions || receiver.transactions.length === 0)) {
      receiver = {
        ...receiver,
        transactions: transactions.filter(t => t.to === receiver.name)
      };
    }

    dispatch(openReceiverModal(receiver));
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6 sm:gap-8 lg:gap-10">
          {/* ---- Top Row: Balance + Quick Conversion ---- */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Account Balance Card */}
            <div className="bg-white rounded-[1.5rem] p-6 sm:p-10 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] xl:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <h2 className="text-3xl sm:text-[39px] font-bold text-gray-900 leading-[1.1] tracking-tight">
                  Account
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Balance
                </h2>
                <button
                  onClick={() => router.push('/transactions/new')}
                  className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-blue-600 hover:opacity-80 transition-opacity cursor-pointer self-start sm:self-auto"
                >
                  New Transaction
                  <ArrowUpRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <p className="text-base sm:text-lg font-bold text-gray-300 leading-none">
                  Overall (in USD)
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">
                  {ACCOUNT_BALANCE.totalUsd}
                </p>
              </div>

              <div className="w-full h-[1px] bg-gray-100 mb-8" />

              {/* Currency breakdown */}
              <div className="flex flex-col gap-5 mb-8">
                {ACCOUNT_BALANCE.currencies.map((c: any) => (
                  <div
                    key={c.code}
                    className="flex items-center justify-between text-base"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://flagcdn.com/w40/${c.countryCode}.png`}
                        alt={c.name}
                        className="flag-circle"
                      />
                      <span className="font-bold text-gray-400 w-10">{c.code}</span>
                    </div>
                    <span className="font-bold text-gray-400">{c.balance}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-auto">
                <button className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-900 hover:opacity-70 transition-opacity">

                  <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Show More
                </button>
              </div>
            </div>

            {/* Quick Conversion Widget */}
            <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Conversion</h2>

              <div className="flex flex-col gap-3">
                {/* From */}
                <div className="flex items-center justify-between px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-[10px] font-bold text-gray-600 uppercase">
                        {paymentMethod}
                      </span>
                      <ChevronDown size={10} className="text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400">To Pay</span>
                  </div>
                  <div className="dropdown-select border-0">
                    <img
                      src="https://flagcdn.com/w40/us.png"
                      alt="USD"
                      className="flag-circle-sm"
                    />
                    <span className="text-[11px] font-bold">USD</span>
                    <span className="text-[10px] text-gray-300">▾</span>
                  </div>
                </div>

                {/* Swap icon */}
                <div className="flex justify-center -my-1 relative z-10">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center">
                    <ArrowLeftRight size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* To */}
                <div className="flex items-center justify-between px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100  rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-[10px] font-bold text-gray-600 uppercase">
                        Cash
                      </span>
                      <ChevronDown size={10} className="text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400">To Receive</span>
                  </div>
                  <div className="dropdown-select border-0">
                    <img
                      src="https://flagcdn.com/w40/eu.png"
                      alt="EUR"
                      className="flag-circle-sm"
                    />
                    <span className="text-[11px] font-bold">EUR</span>
                    <span className="text-[10px] text-gray-300">▾</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-[1.5px] bg-gray-50" />

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-gray-400">
                  <span>Rate</span>
                  <span className="text-gray-900">1 USD = 0.98 EUR</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-gray-400">
                  <span>Fee</span>
                  <span className="text-gray-900">$0</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/transactions/new')}
                className="w-full py-2 bg-white border border-gray-200 shadow-sm rounded-full text-base font-bold text-gray-900 hover:bg-gray-50 transition-colors mt-4"
              >
                Proceed
              </button>
            </div>
          </div>

          {/* ---- Transactions Table Section ---- */}
          <div className="flex flex-col gap-6">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Transactions</h2>
              <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-hide">
                <button onClick={downloadSampleFile} className="flex items-center gap-2 px-4 py-2 bg-[#dbdcdc85] rounded-full text-xs sm:text-[13px] font-bold text-gray-500 hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Export as
                  <span className="text-[10px] opacity-30">▾</span>
                </button>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100/50 border border-gray-200 cursor-pointer flex items-center justify-center rounded-full text-gray-500 flex-shrink-0">
                  <SlidersHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100/50 border border-gray-200 cursor-pointer flex items-center justify-center rounded-full text-gray-500 flex-shrink-0">
                  <Maximize2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] min-h-[400px] flex flex-col relative overflow-hidden">
              {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2rem]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                    <span className="text-sm font-bold text-gray-500">Fetching transactions...</span>
                  </div>
                </div>
              )}
              <TransactionTable
                transactions={transactions}
                variant="dashboard"
                onRowClick={handleTransactionClick}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
