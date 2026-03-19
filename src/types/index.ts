// ============================================================
// Global TypeScript Type Definitions
// ============================================================

export type CurrencyCode = "AED" | "USD" | "CAD" | "INR" | "EUR" | "USDT";

export type TransactionStatus =
  | "success"
  | "approved"
  | "Approved"
  | "Pending"
  | "Cancelled"
  | "Rejected"
  | "failed"
  | "Failed"
  | "Success"
  | "needs_action";

export type TransactionType =
  | "Send money"
  | "Add money"
  | "Conversion"
  | "Send Money International"
  | "Send Money Domestic";

export interface Currency {
  code: CurrencyCode;
  name: string;
  flag: string;
  countryCode: string;
  balance: string;
}

export interface AccountBalance {
  totalUsd: string;
  currencies: Currency[];
}

export interface Transaction {
  id: number;
  dateTime: string;
  requestId: string;
  type: TransactionType;
  from: string;
  to: string;
  currency: CurrencyCode;
  amount: string;
  status: TransactionStatus;
  accountNumber?: string;
  receiverDetails?: Receiver;
}

export interface ReceiverAccount {
  currency: CurrencyCode;
  accountNumber: string;
  flag: string;
  countryCode: string;
}

export interface Receiver {
  id: number;
  name: string;
  email: string;
  type: string;
  accounts: ReceiverAccount[];
  country: string;
  bankName: string;
  branchName: string;
  swiftBic: string;
  transactions?: Transaction[];
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  type: string;
  country: string;
  bank_name: string;
  branch_name: string;
  swift_code: string;
  account_number: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTransaction {
  id: number;
  request_id: string;
  user_id: number;
  account_number: string;
  type: string;
  to_name: string;
  amount: string;
  currency: CurrencyCode;
  status: string;
  is_queued: boolean;
  created_at: string;
  updated_at: string;
  user: ApiUser;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface QuickConversion {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: string;
  fee: string;
}
