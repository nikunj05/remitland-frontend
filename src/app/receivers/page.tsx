// ============================================================
// Receivers Page
// Requirements:
//   - Single page called "Receivers"  
//   - A single CTA "View receiver" displayed on the page only
//   - Clicking opens ReceiverModal (Appendix 1)
// ============================================================

"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store/hooks";
import { openReceiverModal } from "@/store/slices/uiSlice";
import { MOCK_RECEIVER } from "@/data/mockData";
import { Users } from "lucide-react";

export default function ReceiversPage() {
  const dispatch = useAppDispatch();

  function handleViewReceiver() {
    // Opens the ReceiverModal (Appendix 1) with John Bonham's data
    dispatch(openReceiverModal(MOCK_RECEIVER));
  }

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col">
        {/* ---- Page Header ---- */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Users size={16} className="text-green-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Receivers</h1>
              <p className="text-xs text-gray-500">
                Manage your beneficiaries and view their transactions
              </p>
            </div>
          </div>
        </header>

        {/* ---- Page Body ---- */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center max-w-sm">
            {/* Illustration */}
            <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6">
              <Users size={36} className="text-green-700" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              View Receiver Details
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Click below to view the receiver profile, account details, and
              associated transactions.
            </p>

            {/* Per requirements: "a single CTA called View receiver" */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleViewReceiver}
              className="w-full sm:w-auto px-10 rounded-xl"
            >
              View Receiver
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
