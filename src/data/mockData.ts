// ============================================================
// Mock Data — Replace with real API calls after backend is ready
// ============================================================

import { Currency, Receiver, Transaction } from "@/types";

export const CURRENCIES: (Currency & { countryCode: string })[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", countryCode: "us", balance: "$14,000" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", countryCode: "in", balance: "₹1,191,680" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", countryCode: "ca", balance: "$2,878.48" },
];

export const ACCOUNT_BALANCE = {
  totalUsd: "$30,000",
  currencies: CURRENCIES,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    dateTime: "Apr 19 2025 | 14:30",
    requestId: "6A5S1D5A",
    type: "Send Money International",
    from: "John Bonham",
    to: "Sarah Johnson",
    currency: "AED",
    amount: "12,000.00",
    status: "Success",
  },
  {
    id: 2,
    dateTime: "Apr 19 2025 | 14:30",
    requestId: "6A5S1D5A",
    type: "Send Money International",
    from: "Michael Brown",
    to: "Sarah Johnson",
    currency: "AED",
    amount: "50,000.00",
    status: "Rejected",
  },
  {
    id: 3,
    dateTime: "Apr 19 2025 | 14:30",
    requestId: "6A5S1D5A",
    type: "Send Money International",
    from: "Jessica Taylor",
    to: "Sarah Johnson",
    currency: "USD",
    amount: "50,000.00",
    status: "Rejected",
  },
  {
    id: 4,
    dateTime: "Jun 12 2025 | 20:15",
    requestId: "6A5S1D5A",
    type: "Add money",
    from: "Alice Smith",
    to: "You",
    currency: "AED",
    amount: "50,000,000.00",
    status: "success",
  },
  {
    id: 5,
    dateTime: "Jun 12 2025 | 20:15",
    requestId: "6A5S1D5A",
    type: "Add money",
    from: "John Bonham",
    to: "You",
    currency: "AED",
    amount: "50,000,000.00",
    status: "needs_action",
  },
  {
    id: 6,
    dateTime: "Apr 19 2025 | 14:30",
    requestId: "6A5S1D5A",
    type: "Send Money International",
    from: "Emily Carter",
    to: "John Bonham",
    currency: "USD",
    amount: "12,000.00",
    status: "Pending",
  },
  {
    id: 7,
    dateTime: "Apr 19 2025 | 14:30",
    requestId: "6A5S1D5A",
    type: "Send Money International",
    from: "You",
    to: "Emily Carter",
    currency: "AED",
    amount: "50,000.00",
    status: "Cancelled",
  },
  {
    id: 8,
    dateTime: "Apr 19 2025 | 14:30",
    requestId: "6A5S1D5A",
    type: "Send Money International",
    from: "You",
    to: "Emily Carter",
    currency: "AED",
    amount: "50,000.00",
    status: "Rejected",
  },
  {
    id: 9,
    dateTime: "Apr 19 2025 | 14:30",
    requestId: "6A5S1D5A",
    type: "Send Money International",
    from: "You",
    to: "Emily Carter",
    currency: "USD",
    amount: "12,000.00",
    status: "Success",
  },
  {
    id: 10,
    dateTime: "Mar 05 2025 | 09:00",
    requestId: "6A5S1D5A",
    type: "Conversion",
    from: "Emily Carter",
    to: "CAD Account",
    currency: "CAD",
    amount: "5,000.00",
    status: "approved",
  },
  {
    id: 11,
    dateTime: "Mar 06 2025 | 11:30",
    requestId: "6A5S1D5B",
    type: "Send Money Domestic",
    from: "David Robinson",
    to: "Liam Brown",
    currency: "CAD",
    amount: "3,200.00",
    status: "Pending",
  },
];

export const MOCK_RECEIVER: Receiver = {
  id: 1,
  name: "John Bonham",
  email: "john@email.com",
  type: "individual",
  accounts: [
    { currency: "AED", accountNumber: "1982631287368", flag: "🇦🇪", countryCode: "ae" },
    { currency: "USD", accountNumber: "1982631287368", flag: "🇺🇸", countryCode: "us" },
    { currency: "CAD", accountNumber: "1982631287368", flag: "🇨🇦", countryCode: "ca" },
  ],
  country: "United States",
  bankName: "Bank of America",
  branchName: "Main Street Branch",
  swiftBic: "KJA98127",
  transactions: MOCK_TRANSACTIONS.filter(
    (t) => t.from === "John Bonham" || t.to === "John Bonham"
  ),
};

export const MOCK_RECEIVERS: Receiver[] = [
  MOCK_RECEIVER,
  {
    id: 2,
    name: "Kasra Nourani",
    email: "kasra@email.com",
    type: "Business",
    accounts: [
      { currency: "AED", accountNumber: "9876543210123", flag: "🇦🇪", countryCode: "ae" },
      { currency: "USD", accountNumber: "9876543210123", flag: "🇺🇸", countryCode: "us" },
      { currency: "CAD", accountNumber: "9876543210123", flag: "🇨🇦", countryCode: "ca" },
    ],
    country: "Canada",
    bankName: "RBC Royal Bank",
    branchName: "Downtown Branch",
    swiftBic: "ROYCCAT2",
    transactions: MOCK_TRANSACTIONS.filter((t) => t.currency === "CAD"),
  },
];
