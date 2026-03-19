// ============================================================
// Root Layout
// Wraps all pages with Redux Provider and renders the ReceiverModal
// globally (so it works from any page).
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { ReceiverModal } from "@/components/receivers/ReceiverModal";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RemitLand — Smart Money Transfers",
  description:
    "RemitLand dashboard for managing international money transfers, beneficiaries, and transactions.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ReduxProvider>
          {/* ReceiverModal is rendered at root level so it can be
              triggered from any page (Dashboard, Receivers, etc.) */}
          <ReceiverModal />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
