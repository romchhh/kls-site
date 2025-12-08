import { useState, useEffect, useMemo } from "react";
import type { BalanceData, BalanceForm, TransactionRow } from "../types/userDetail.types";
import { getTransactionsWithBalance } from "../utils/shipmentUtils";

export function useBalance(userId: string) {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [balanceForm, setBalanceForm] = useState<BalanceForm>({
    type: "income",
    amount: "",
    description: "",
    selectedInvoiceId: "",
  });

  const fetchBalance = async () => {
    setBalanceLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/balance`);
      if (!res.ok) return;
      const data = await res.json();
      setBalance(data);
    } catch {
      // ignore for now
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/transactions`);
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [userId]);

  const updateBalance = async (
    type: "income" | "expense",
    amount: string,
    description?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount,
          description: description || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Не вдалося оновити баланс" };
      }
      setBalance({
        balance: data.balance,
        incomeTotal: data.incomeTotal,
        expenseTotal: data.expenseTotal,
        currency: data.currency,
      });
      setBalanceForm({
        type: "income",
        amount: "",
        description: "",
        selectedInvoiceId: "",
      });
      await fetchTransactions();
      return { success: true };
    } catch {
      return { success: false, error: "Сталася помилка при оновленні балансу" };
    }
  };

  // Calculate balance with transactions sorted from oldest to newest, then sort for display (newest first)
  const sortedTransactionsWithBalance = useMemo(() => {
    if (transactions.length === 0) return [];
    
    // First, sort from oldest to newest for correct balance calculation
    const sortedForBalance = [...transactions].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB; // Oldest first
    });
    
    // Calculate running balance
    const withBalance = getTransactionsWithBalance(sortedForBalance);
    
    // Then sort for display: newest first (by date and time)
    return [...withBalance].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      // If dates are equal, sort by ID (newer transactions have higher IDs typically)
      if (dateB === dateA) {
        return b.id.localeCompare(a.id); // Reverse order for IDs
      }
      return dateB - dateA; // Newest first
    });
  }, [transactions]);

  return {
    balance,
    balanceLoading,
    transactions,
    loadingTransactions,
    transactionsWithBalance: sortedTransactionsWithBalance,
    balanceForm,
    setBalanceForm,
    fetchBalance,
    fetchTransactions,
    updateBalance,
  };
}

