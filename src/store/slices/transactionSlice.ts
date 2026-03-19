// ============================================================
// Transaction Redux Slice
// Manages transaction list and real-time updates via Socket.IO.
// ============================================================

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Transaction, ApiTransaction, ApiResponse, TransactionType, TransactionStatus } from "@/types";
import { MOCK_TRANSACTIONS } from "@/data/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * mapApiTransactionToTransaction — Converts backend snake_case to frontend camelCase
 */
const mapApiTransactionToTransaction = (apiTx: ApiTransaction): Transaction => {
  // Map backend status/type to frontend strings
  const typeMap: Record<string, TransactionType> = {
    "send_money": "Send money",
    "add_money": "Add money",
    "conversion": "Conversion",
    "send_money_international": "Send Money International",
    "send_money_domestic": "Send Money Domestic",
  };

  const statusMap: Record<string, TransactionStatus> = {
    "pending": "Pending",
    "approved": "Approved",
    "success": "Success",
    "failed": "Failed",
    "cancelled": "Cancelled",
    "rejected": "Rejected",
    "needs_action": "needs_action",
  };

  return {
    id: apiTx.id,
    dateTime: apiTx.created_at,
    requestId: apiTx.request_id,
    type: typeMap[apiTx.type] || "Send money",
    from: apiTx.user.name,
    to: apiTx.to_name,
    currency: apiTx.currency,
    amount: apiTx.amount,
    status: statusMap[apiTx.status] || "Pending",
    accountNumber: apiTx.account_number, // Direct mapping from API
    receiverDetails: {
      id: apiTx.user.id,
      name: apiTx.user.name,
      email: apiTx.user.email,
      type: apiTx.user.type,
      accounts: [
        {
          currency: apiTx.currency,
          accountNumber: apiTx.account_number,
          flag: apiTx.currency === "USD" ? "🇺🇸" : apiTx.currency === "AED" ? "🇦🇪" : apiTx.currency === "CAD" ? "🇨🇦" : "🏳️",
          countryCode: apiTx.currency === "USD" ? "US" : apiTx.currency === "AED" ? "AE" : apiTx.currency === "CAD" ? "CA" : "us",
        }
      ],
      country: apiTx.user.country,
      bankName: apiTx.user.bank_name,
      branchName: apiTx.user.branch_name,
      swiftBic: apiTx.user.swift_code,
    }
  };
};

/**
 * fetchTransactions — Async thunk to get live data from API (for Dashboard)
 */
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (currency: string | void, { rejectWithValue }) => {
    try {
      const url = currency 
        ? `/api/transactions?currency=${currency}`
        : `/api/transactions`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      
      const data: ApiResponse<ApiTransaction[]> = await response.json();
      return data.data.map(mapApiTransactionToTransaction);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchModalTransactions = createAsyncThunk(
  "transactions/fetchModal",
  async (currency: string | void, { rejectWithValue }) => {
    try {
      const url = currency 
        ? `/api/transactions?currency=${currency}`
        : `/api/transactions`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch modal transactions");
      
      const data: ApiResponse<ApiTransaction[]> = await response.json();
      return data.data.map(mapApiTransactionToTransaction);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * updateTransactionStatusAsync — Async thunk to update transaction status via API
 */
export const updateTransactionStatusAsync = createAsyncThunk(
  "transactions/updateStatusAsync",
  async ({ id, status }: { id: number; status: TransactionStatus }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/transactions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update transaction status");
      }
      
      // Update local state immediately on success
      dispatch(updateTransactionStatus({ id, status }));
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface TransactionState {
  items: Transaction[];
  loading: boolean;
  modalItems: Transaction[];
  modalLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  items: [],
  loading: false,
  modalItems: [],
  modalLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = action.payload;
    },
    upsertTransaction(state, action: PayloadAction<Transaction>) {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }
    },
    updateTransactionStatus(
      state,
      action: PayloadAction<{ id: number; status: Transaction["status"] }>
    ) {
      const mainTx = state.items.find((t) => t.id === action.payload.id);
      if (mainTx) {
        mainTx.status = action.payload.status;
      }
      const modalTx = state.modalItems.find((t) => t.id === action.payload.id);
      if (modalTx) {
        modalTx.status = action.payload.status;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Modal Transactions
      .addCase(fetchModalTransactions.pending, (state) => {
        state.modalLoading = true;
      })
      .addCase(fetchModalTransactions.fulfilled, (state, action) => {
        state.modalItems = action.payload;
        state.modalLoading = false;
      })
      .addCase(fetchModalTransactions.rejected, (state) => {
        state.modalLoading = false;
      });
  },
});

export const {
  setTransactions,
  upsertTransaction,
  updateTransactionStatus,
  setLoading,
  setError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
