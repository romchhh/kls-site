import { useState, useEffect } from "react";
import type { InvoiceRow } from "../types/userDetail.types";

export function useInvoices(userId: string) {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/invoices`);
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.invoices || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [userId]);

  const createInvoice = async (invoiceData: {
    invoiceNumber: string;
    amount: string;
    status: string;
    dueDate: string;
    shipmentId: string;
  }) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Не вдалося створити рахунок" };
      }
      await fetchInvoices();
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: "Сталася помилка при створенні рахунку" };
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Не вдалося оновити статус рахунку" };
      }
      await fetchInvoices();
      return { success: true };
    } catch {
      return { success: false, error: "Сталася помилка при оновленні статусу рахунку" };
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Не вдалося видалити рахунок" };
      }
      await fetchInvoices();
      return { success: true };
    } catch {
      return { success: false, error: "Сталася помилка при видаленні рахунку" };
    }
  };

  return {
    invoices,
    loadingInvoices,
    fetchInvoices,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
  };
}

