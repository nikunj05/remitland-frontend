"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAppDispatch } from "@/store/hooks";
import { fetchTransactions } from "@/store/slices/transactionSlice";
import { ChevronDown, ArrowLeft, CheckCircle2 } from "lucide-react";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "us" },
  { code: "AED", name: "UAE Dirham", flag: "ae" },
  { code: "CAD", name: "Canadian Dollar", flag: "ca" },
];

export default function NewTransactionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Flash Message state
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    user_id: 2,
    account_number: "",
    to_name: "",
    amount: "",
    type: "send_money",
    status: "pending"
  });

  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const json = await res.json();
          setUsers(json.data || []);
          if (json.data && json.data.length > 0) {
            setFormData(prev => ({ ...prev, user_id: json.data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  // Close dropdown when typing outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.to_name || formData.to_name.trim() === "") {
      errs.to_name = "The to name field is required.";
    } else if (formData.to_name.length > 255) {
      errs.to_name = "The to name may not be greater than 255 characters.";
    }

    if (formData.account_number && formData.account_number.length > 255) {
      errs.account_number = "The account number may not be greater than 255 characters.";
    } else if (!formData.account_number || formData.account_number.trim() === "") {
      errs.account_number = "The account number field is required.";
    }

    if (!formData.amount || formData.amount.toString().trim() === "") {
      errs.amount = "The amount field is required.";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) < 0.01) {
      errs.amount = "The amount must be at least 0.01.";
    }

    if (!["send_money", "add_money"].includes(formData.type)) {
      errs.type = "The selected type is invalid.";
    }

    if (!["pending", "approved", "cancelled", "rejected", "success"].includes(formData.status)) {
      errs.status = "The selected status is invalid.";
    }

    if (!selectedCurrency.code || selectedCurrency.code.length !== 3) {
      errs.currency = "The currency must be exactly 3 characters.";
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setFlashMessage(null);

    try {
      const res = await fetch(`/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          currency: selectedCurrency.code,
          amount: parseFloat(formData.amount) || 0
        })
      });

      if (res.ok) {
        dispatch(fetchTransactions());

        setFormData({
          user_id: 2,
          account_number: "",
          to_name: "",
          amount: "",
          type: "send_money",
          status: "pending"
        });

        // Show flash message
        setFlashMessage("Transaction successfully created!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);

      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.message || "Failed to create transaction.");
      }
    } catch (err) {
      console.error("Error creating transaction", err);
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 relative">

        {/* Flash Message Popup */}
        {flashMessage && (
          <div className="fixed top-8 right-8 z-[100] bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={20} className="text-green-600" />
            <span className="font-bold text-sm tracking-tight">{flashMessage}</span>
          </div>
        )}

        <div className=" mx-auto flex flex-col gap-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors w-fit"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-[2rem] p-6 sm:p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Transaction</h1>
            <p className="text-gray-500 text-sm mb-8">Enter the required details below to post a new transaction to the network.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Sender (User)</label>
                <div className="relative">
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
                    disabled={loadingUsers}
                    className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium w-full appearance-none pr-10"
                  >
                    {loadingUsers ? (
                      <option>Loading users...</option>
                    ) : users.length === 0 ? (
                      <option>No users found</option>
                    ) : (
                      users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown size={18} className="text-gray-400 absolute right-4 top-[18px] pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Receiver Name</label>
                  <input
                    type="text"
                    name="to_name"
                    placeholder="e.g. Aisha Khan"
                    value={formData.to_name}
                    onChange={handleChange}
                    className={`px-5 py-3.5 bg-gray-50 border ${validationErrors.to_name ? "border-red-500 bg-red-50/20" : "border-gray-200"} rounded-xl text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium`}
                  />
                  {validationErrors.to_name && <span className="text-red-500 text-[11px] font-bold mt-1 px-1">{validationErrors.to_name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    placeholder="e.g. ACC-1002345"
                    value={formData.account_number}
                    onChange={handleChange}
                    className={`px-5 py-3.5 bg-gray-50 border ${validationErrors.account_number ? "border-red-500 bg-red-50/20" : "border-gray-200"} rounded-xl text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium`}
                  />
                  {validationErrors.account_number && <span className="text-red-500 text-[11px] font-bold mt-1 px-1">{validationErrors.account_number}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`px-5 py-3.5 bg-gray-50 border ${validationErrors.amount ? "border-red-500 bg-red-50/20" : "border-gray-200"} rounded-xl text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium`}
                  />
                  {validationErrors.amount && <span className="text-red-500 text-[11px] font-bold mt-1 px-1">{validationErrors.amount}</span>}
                </div>

                <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
                  <label className="text-sm font-bold text-gray-700">Currency</label>
                  <div
                    className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base transition-all font-medium flex items-center justify-between cursor-pointer hover:bg-gray-100"
                    onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://flagcdn.com/w40/${selectedCurrency.flag}.png`}
                        alt={selectedCurrency.code}
                        className="w-5 h-5 rounded-full object-cover shadow-sm"
                      />
                      <span>{selectedCurrency.code} <span className="text-gray-400 font-normal">({selectedCurrency.name})</span></span>
                    </div>
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>

                  {isCurrencyDropdownOpen && (
                    <div className="absolute top-[80px] left-0 right-0 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl py-2 z-20 max-h-[220px] overflow-y-auto scrollbar-thin">
                      {CURRENCIES.map(c => (
                        <div
                          key={c.code}
                          className="px-5 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedCurrency(c);
                            setIsCurrencyDropdownOpen(false);
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/w40/${c.flag}.png`}
                            alt={c.code}
                            className="w-5 h-5 rounded-full object-cover shadow-sm"
                          />
                          <span className="font-bold text-gray-800">{c.code}</span>
                          <span className="text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {validationErrors.currency && <span className="text-red-500 text-[11px] font-bold mt-1 px-1">{validationErrors.currency}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Type</label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`px-5 py-3.5 bg-gray-50 border ${validationErrors.type ? "border-red-500" : "border-gray-200"} rounded-xl text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium w-full appearance-none pr-10`}
                    >
                      <option value="send_money">Send Money</option>
                      <option value="add_money">Add Money</option>
                    </select>
                    <ChevronDown size={18} className="text-gray-400 absolute right-4 top-[18px] pointer-events-none" />
                  </div>
                  {validationErrors.type && <span className="text-red-500 text-[11px] font-bold mt-1 px-1">{validationErrors.type}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Initial Status</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`px-5 py-3.5 bg-gray-50 border ${validationErrors.status ? "border-red-500" : "border-gray-200"} rounded-xl text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium w-full appearance-none pr-10`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>
                    <ChevronDown size={18} className="text-gray-400 absolute right-4 top-[18px] pointer-events-none" />
                  </div>
                  {validationErrors.status && <span className="text-red-500 text-[11px] font-bold mt-1 px-1">{validationErrors.status}</span>}
                </div>
              </div>

              <div className="text-right pt-4 border-t border-gray-100 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-4 rounded-xl text-base font-bold text-white transition-all ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-[#062121] hover:bg-[#0d3d3d] hover:shadow-[0_8px_20px_rgb(37,99,235,0.2)]"
                    }`}
                >
                  {loading ? "Processing..." : "Submit Transaction"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
