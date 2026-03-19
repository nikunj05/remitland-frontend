// ============================================================
// Redux Root Store Configuration
// Uses redux-persist to persist currency selection across sessions.
// ============================================================

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import currencyReducer from "./slices/currencySlice";
import transactionReducer from "./slices/transactionSlice";
import uiReducer from "./slices/uiSlice";

// Only persist the currency slice so the last selected currency
// survives modal close/reopen and page refreshes.
const persistConfig = {
  key: "remitland",
  storage,
  whitelist: ["currency"],
};

const rootReducer = combineReducers({
  currency: currencyReducer,
  transactions: transactionReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types to prevent serialization warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
