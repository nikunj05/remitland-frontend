// ============================================================
// Custom 404 Not Found Page
// Displays a polite "Coming Soon" or "Not Found" message.
// Matches the RemitLand brand and design system.
// ============================================================

"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <AppShell>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-10 border border-gray-100 shadow-sm">
            <FileQuestion size={48} className="text-gray-300" />
          </div>

          {/* Heading */}
          <h1 className="text-[32px] font-bold text-gray-900 mb-4 tracking-tight">
            Feature coming soon
          </h1>

          {/* Polite Message */}
          <p className="text-base text-gray-500 mb-10 leading-relaxed">
            We couldn&apos;t find this page. It will be available soon or under development.
            Thank you for your patience!
          </p>

          {/* Action Button */}
          <Link href="/dashboard">
            <Button
              variant="primary"
              size="lg"
              className=" sm:w-auto sm:px-10 py-4 rounded-2xl flex items-center justify-center gap-3 mx-auto shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all text-base font-bold"
            >
              <Home size={18} />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
