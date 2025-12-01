"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Building,
  Hash,
  Calendar,
  Loader2,
  Trash2,
  Save,
  ArrowLeft,
  Plus,
  X,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

interface UserDetailProps {
  userId: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  companyName?: string | null;
  clientCode: string;
  createdAt: string;
}

interface ShipmentRow {
  id: string;
  internalTrack: string;
  cargoLabel: string | null;
  status: string;
  location: string | null;
  pieces: number;
  routeFrom: string;
  routeTo: string;
  deliveryType: string;
  localTrackingOrigin: string | null;
  localTrackingDestination: string | null;
  description: string | null;
  mainPhotoUrl: string | null;
  additionalFilesUrls: string | null;
  insuranceTotal: string | null;
  insurancePercentTotal: number | null;
  insurancePerPlacePercent: number | null;
  weightKg: string | null;
  volumeM3: string | null;
  density: string | null;
  tariffType: string | null;
  tariffValue: string | null;
  deliveryCost: string | null;
  deliveryCostPerPlace: string | null;
  totalCost: string | null;
  receivedAtWarehouse: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  eta: string | null;
  deliveryFormat: string | null;
  deliveryReference: string | null;
  packing: boolean | null;
  localDeliveryToDepot: boolean | null;
  createdAt: string;
}

interface TransactionRow {
  id: string;
  type: string;
  amount: string;
  description: string | null;
  createdAt: string;
}

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  amount: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  shipmentId: string | null;
  shipment?: {
    id: string;
    internalTrack: string;
    totalCost: string | null;
    createdAt: string;
  } | null;
}

export function UserDetail({ userId }: UserDetailProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balance, setBalance] = useState<{
    balance: number;
    incomeTotal: number;
    expenseTotal: number;
    currency: string;
  } | null>(null);
  const [balanceForm, setBalanceForm] = useState<{
    type: "income" | "expense";
    amount: string;
    description: string;
  }>({
    type: "income",
    amount: "",
    description: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    companyName: "",
  });

  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({
    internalTrack: "",
    cargoLabel: "",
    status: "",
    pieces: 1,
    weightKg: "",
    volumeM3: "",
    location: "",
    routeFrom: "",
    routeTo: "",
    deliveryType: "AIR",
    localTrackingOrigin: "",
    localTrackingDestination: "",
    description: "",
    mainPhotoUrl: "",
    insuranceTotal: "",
    insurancePercentTotal: "",
    insurancePerPlacePercent: "",
    density: "",
    tariffType: "kg",
    tariffValue: "",
    deliveryCost: "",
    deliveryCostPerPlace: "",
    totalCost: "",
    receivedAtWarehouse: "",
    sentAt: "",
    deliveredAt: "",
    eta: "",
    deliveryFormat: "",
    deliveryReference: "",
    packing: false,
    localDeliveryToDepot: false,
    additionalFiles: [] as string[],
  });

  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    amount: "",
    shipmentId: "",
    status: "UNPAID",
    dueDate: "",
  });
  const [editingInvoice, setEditingInvoice] = useState<InvoiceRow | null>(null);
  const [invoiceWarningModal, setInvoiceWarningModal] = useState<{
    show: boolean;
    shipmentTrack: string;
    existingInvoices: InvoiceRow[];
    onConfirm: () => void;
  }>({
    show: false,
    shipmentTrack: "",
    existingInvoices: [],
    onConfirm: () => {},
  });

  const [editingShipment, setEditingShipment] = useState<ShipmentRow | null>(null);
  const [editingShipmentForm, setEditingShipmentForm] = useState({
    internalTrack: "",
    cargoLabel: "",
    status: "",
    pieces: 1,
    weightKg: "",
    volumeM3: "",
    location: "",
    routeFrom: "",
    routeTo: "",
    deliveryType: "AIR",
    localTrackingOrigin: "",
    localTrackingDestination: "",
    description: "",
    mainPhotoUrl: "",
    insuranceTotal: "",
    insurancePercentTotal: "",
    insurancePerPlacePercent: "",
    density: "",
    tariffType: "kg",
    tariffValue: "",
    deliveryCost: "",
    deliveryCostPerPlace: "",
    totalCost: "",
    receivedAtWarehouse: "",
    sentAt: "",
    deliveredAt: "",
    eta: "",
    deliveryFormat: "",
    deliveryReference: "",
    packing: false,
    localDeliveryToDepot: false,
    additionalFiles: [] as string[],
  });

  const [isUploadingMainPhotoCreate, setIsUploadingMainPhotoCreate] = useState(false);
  const [isUploadingMainPhotoEdit, setIsUploadingMainPhotoEdit] = useState(false);
  const [isUploadingAdditionalFilesCreate, setIsUploadingAdditionalFilesCreate] = useState(false);
  const [isUploadingAdditionalFilesEdit, setIsUploadingAdditionalFilesEdit] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchShipments();
    fetchBalance();
    fetchTransactions();
    fetchInvoices();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setFormData({
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          companyName: data.user.companyName || "",
        });
      } else {
        setError(data.error || "Не вдалося завантажити користувача");
      }
    } catch (e) {
      setError("Сталася помилка при завантаженні користувача");
    } finally {
      setLoading(false);
    }
  };

  const fetchShipments = async () => {
    setLoadingShipments(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/shipments`);
      const data = await res.json();
      if (res.ok) {
        setShipments(data.shipments || []);
      }
    } catch {
      // ignore for now
    } finally {
      setLoadingShipments(false);
    }
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          companyName: formData.companyName || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setSuccess("Дані користувача оновлено");
      } else {
        setError(data.error || "Не вдалося оновити користувача");
      }
    } catch (e) {
      setError("Сталася помилка при оновленні користувача");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/dashboard/users");
        router.refresh();
      } else {
        setError(data.error || "Не вдалося видалити користувача");
      }
    } catch (e) {
      setError("Сталася помилка при видаленні користувача");
    } finally {
      setDeleting(false);
    }
  };

  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: balanceForm.type,
          amount: balanceForm.amount,
          description: balanceForm.description || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося оновити баланс");
        return;
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
      });
      setSuccess("Баланс оновлено");
      await fetchTransactions();
    } catch {
      setError("Сталася помилка при оновленні балансу");
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalTrack: shipmentForm.internalTrack,
          cargoLabel: shipmentForm.cargoLabel || null,
          status: shipmentForm.status || "CREATED",
          location: shipmentForm.location || null,
          pieces: shipmentForm.pieces,
          routeFrom: shipmentForm.routeFrom || null,
          routeTo: shipmentForm.routeTo || null,
          deliveryType: shipmentForm.deliveryType,
          localTrackingOrigin: shipmentForm.localTrackingOrigin || null,
          localTrackingDestination:
            shipmentForm.localTrackingDestination || null,
          description: shipmentForm.description || null,
          mainPhotoUrl: shipmentForm.mainPhotoUrl || (shipmentForm.additionalFiles && shipmentForm.additionalFiles.length > 0 ? shipmentForm.additionalFiles[0] : null),
          insuranceTotal: shipmentForm.insuranceTotal || null,
          insurancePercentTotal:
            shipmentForm.insurancePercentTotal || null,
          insurancePerPlacePercent:
            shipmentForm.insurancePerPlacePercent || null,
          weightKg: shipmentForm.weightKg || null,
          volumeM3: shipmentForm.volumeM3 || null,
          density: shipmentForm.density || null,
          tariffType: shipmentForm.tariffType || null,
          tariffValue: shipmentForm.tariffValue || null,
          deliveryCost: shipmentForm.deliveryCost || null,
          deliveryCostPerPlace: shipmentForm.deliveryCostPerPlace || null,
          totalCost: shipmentForm.totalCost || null,
          receivedAtWarehouse: shipmentForm.receivedAtWarehouse || null,
          sentAt: shipmentForm.sentAt || null,
          deliveredAt: shipmentForm.deliveredAt || null,
          eta: shipmentForm.eta || null,
          deliveryFormat: shipmentForm.deliveryFormat || null,
          deliveryReference: shipmentForm.deliveryReference || null,
          packing: shipmentForm.packing,
          localDeliveryToDepot: shipmentForm.localDeliveryToDepot,
          additionalFiles: shipmentForm.additionalFiles || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося створити вантаж");
        return;
      }
      setShowAddShipment(false);
      setShipmentForm({
        internalTrack: "",
        cargoLabel: "",
        status: "",
        pieces: 1,
        weightKg: "",
        volumeM3: "",
        location: "",
        routeFrom: "",
        routeTo: "",
        deliveryType: "AIR",
        localTrackingOrigin: "",
        localTrackingDestination: "",
        description: "",
        mainPhotoUrl: "",
        insuranceTotal: "",
        insurancePercentTotal: "",
        insurancePerPlacePercent: "",
        density: "",
        tariffType: "kg",
        tariffValue: "",
        deliveryCost: "",
        deliveryCostPerPlace: "",
        totalCost: "",
        receivedAtWarehouse: "",
        sentAt: "",
        deliveredAt: "",
        eta: "",
        deliveryFormat: "",
        deliveryReference: "",
        packing: false,
        localDeliveryToDepot: false,
        additionalFiles: [],
      });
      await fetchShipments();
      setSuccess("Вантаж створено");
    } catch {
      setError("Сталася помилка при створенні вантажу");
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm("Видалити цей вантаж?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/shipments/${shipmentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося видалити вантаж");
        return;
      }
      await fetchShipments();
      setSuccess("Вантаж видалено");
    } catch {
      setError("Сталася помилка при видаленні вантажу");
    }
  };

  const openEditShipment = (shipment: ShipmentRow) => {
    setEditingShipment(shipment);
    setEditingShipmentForm({
      internalTrack: shipment.internalTrack,
      cargoLabel: shipment.cargoLabel || "",
      status: shipment.status || "",
      pieces: shipment.pieces,
      weightKg: shipment.weightKg || "",
      volumeM3: shipment.volumeM3 || "",
      location: shipment.location || "",
      routeFrom: shipment.routeFrom || "",
      routeTo: shipment.routeTo || "",
      deliveryType: shipment.deliveryType || "AIR",
      localTrackingOrigin: shipment.localTrackingOrigin || "",
      localTrackingDestination: shipment.localTrackingDestination || "",
      description: shipment.description || "",
      mainPhotoUrl: shipment.mainPhotoUrl || "",
      insuranceTotal: shipment.insuranceTotal || "",
      insurancePercentTotal: shipment.insurancePercentTotal?.toString() || "",
      insurancePerPlacePercent: shipment.insurancePerPlacePercent?.toString() || "",
      density: shipment.density || "",
      tariffType: shipment.tariffType || "kg",
      tariffValue: shipment.tariffValue || "",
      deliveryCost: shipment.deliveryCost || "",
      deliveryCostPerPlace: shipment.deliveryCostPerPlace || "",
      totalCost: shipment.totalCost || "",
      receivedAtWarehouse: shipment.receivedAtWarehouse || "",
      sentAt: shipment.sentAt || "",
      deliveredAt: shipment.deliveredAt || "",
      eta: shipment.eta || "",
      deliveryFormat: shipment.deliveryFormat || "",
      deliveryReference: shipment.deliveryReference || "",
      packing: shipment.packing || false,
      localDeliveryToDepot: shipment.localDeliveryToDepot || false,
      additionalFiles: shipment.additionalFilesUrls ? JSON.parse(shipment.additionalFilesUrls) : [],
    });
  };

  const handleUpdateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/shipments/${editingShipment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalTrack: editingShipmentForm.internalTrack,
          cargoLabel: editingShipmentForm.cargoLabel || null,
          status: editingShipmentForm.status || editingShipment.status,
          location: editingShipmentForm.location || null,
          pieces: editingShipmentForm.pieces,
          routeFrom: editingShipmentForm.routeFrom || null,
          routeTo: editingShipmentForm.routeTo || null,
          deliveryType: editingShipmentForm.deliveryType || editingShipment.deliveryType,
          localTrackingOrigin: editingShipmentForm.localTrackingOrigin || null,
          localTrackingDestination:
            editingShipmentForm.localTrackingDestination || null,
          description: editingShipmentForm.description || null,
          mainPhotoUrl: editingShipmentForm.mainPhotoUrl || (editingShipmentForm.additionalFiles && editingShipmentForm.additionalFiles.length > 0 ? editingShipmentForm.additionalFiles[0] : null),
          insuranceTotal: editingShipmentForm.insuranceTotal || null,
          insurancePercentTotal: editingShipmentForm.insurancePercentTotal || null,
          insurancePerPlacePercent: editingShipmentForm.insurancePerPlacePercent || null,
          weightKg: editingShipmentForm.weightKg || null,
          volumeM3: editingShipmentForm.volumeM3 || null,
          density: editingShipmentForm.density || null,
          tariffType: editingShipmentForm.tariffType || null,
          tariffValue: editingShipmentForm.tariffValue || null,
          deliveryCost: editingShipmentForm.deliveryCost || null,
          deliveryCostPerPlace: editingShipmentForm.deliveryCostPerPlace || null,
          totalCost: editingShipmentForm.totalCost || null,
          receivedAtWarehouse: editingShipmentForm.receivedAtWarehouse || null,
          sentAt: editingShipmentForm.sentAt || null,
          deliveredAt: editingShipmentForm.deliveredAt || null,
          eta: editingShipmentForm.eta || null,
          deliveryFormat: editingShipmentForm.deliveryFormat || null,
          deliveryReference: editingShipmentForm.deliveryReference || null,
          packing: editingShipmentForm.packing,
          localDeliveryToDepot: editingShipmentForm.localDeliveryToDepot,
          additionalFiles: editingShipmentForm.additionalFiles || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося оновити вантаж");
        return;
      }
      setEditingShipment(null);
      await fetchShipments();
      setSuccess("Вантаж оновлено");
    } catch {
      setError("Сталася помилка при оновленні вантажу");
    }
  };

  const uploadMainPhoto = async (file: File, mode: "create" | "edit") => {
    try {
      if (mode === "create") {
        setIsUploadingMainPhotoCreate(true);
      } else {
        setIsUploadingMainPhotoEdit(true);
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося завантажити фото");
        return;
      }
      if (mode === "create") {
        setShipmentForm((prev) => ({ ...prev, mainPhotoUrl: data.url }));
      } else {
        setEditingShipmentForm((prev) => ({ ...prev, mainPhotoUrl: data.url }));
      }
      setSuccess("Фото завантажено");
    } catch {
      setError("Сталася помилка при завантаженні фото");
    } finally {
      if (mode === "create") {
        setIsUploadingMainPhotoCreate(false);
      } else {
        setIsUploadingMainPhotoEdit(false);
      }
    }
  };

  const uploadAdditionalFile = async (file: File, mode: "create" | "edit") => {
    try {
      if (mode === "create") {
        setIsUploadingAdditionalFilesCreate(true);
      } else {
        setIsUploadingAdditionalFilesEdit(true);
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося завантажити файл");
        return;
      }
      if (mode === "create") {
        setShipmentForm((prev) => {
          const newFiles = [...(prev.additionalFiles || []), data.url];
          return {
            ...prev,
            additionalFiles: newFiles,
            mainPhotoUrl: newFiles[0] || prev.mainPhotoUrl || "",
          };
        });
      } else if (mode === "edit") {
        setEditingShipmentForm((prev) => {
          const newFiles = [...(prev.additionalFiles || []), data.url];
          return {
            ...prev,
            additionalFiles: newFiles,
            mainPhotoUrl: newFiles[0] || prev.mainPhotoUrl || "",
          };
        });
      }
      setSuccess("Фото завантажено");
    } catch {
      setError("Сталася помилка при завантаженні файлу");
    } finally {
      if (mode === "create") {
        setIsUploadingAdditionalFilesCreate(false);
      } else {
        setIsUploadingAdditionalFilesEdit(false);
      }
    }
  };

  const getTransactionsWithBalance = (
    source: TransactionRow[],
  ): (TransactionRow & { runningBalance: number })[] => {
    let balanceValue = 0;
    return source.map((tx) => {
      const amountNum = Number(tx.amount);
      if (tx.type === "income") {
        balanceValue += amountNum;
      } else {
        balanceValue -= amountNum;
      }
      return { ...tx, runningBalance: balanceValue };
    });
  };

  const proceedWithInvoiceCreation = async () => {
    if (!user) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: invoiceForm.invoiceNumber,
          amount: invoiceForm.amount,
          shipmentId: invoiceForm.shipmentId || null,
          status: invoiceForm.status,
          dueDate: invoiceForm.dueDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося створити рахунок");
        return;
      }
      setShowAddInvoice(false);
      setInvoiceForm({
        invoiceNumber: "",
        amount: "",
        shipmentId: "",
        status: "UNPAID",
        dueDate: "",
      });
      await fetchInvoices();
      setSuccess("Рахунок створено");
    } catch {
      setError("Сталася помилка при створенні рахунка");
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");

    // Перевірка, чи вже існує рахунок для цього вантажу
    if (invoiceForm.shipmentId && invoiceForm.shipmentId.trim() !== "") {
      const existingInvoices = invoices.filter(
        (inv) => inv.shipmentId === invoiceForm.shipmentId && inv.status !== "ARCHIVED"
      );

      if (existingInvoices.length > 0) {
        const shipment = shipments.find((s) => s.id === invoiceForm.shipmentId);
        const shipmentTrack = shipment?.internalTrack || "невідомий";
        
        // Показуємо модальне вікно з попередженням
        setInvoiceWarningModal({
          show: true,
          shipmentTrack,
          existingInvoices,
          onConfirm: () => {
            setInvoiceWarningModal({ show: false, shipmentTrack: "", existingInvoices: [], onConfirm: () => {} });
            proceedWithInvoiceCreation();
          },
        });
        return;
      }
    }

    await proceedWithInvoiceCreation();
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося оновити рахунок");
        return;
      }
      await fetchInvoices();
      setSuccess("Статус рахунка оновлено");
    } catch {
      setError("Сталася помилка при оновленні рахунка");
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Видалити цей рахунок?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Не вдалося видалити рахунок");
        return;
      }
      await fetchInvoices();
      setSuccess("Рахунок видалено");
    } catch {
      setError("Сталася помилка при видаленні рахунка");
    }
  };

  const createInvoiceFromShipment = (shipment: ShipmentRow) => {
    // Перевірка, чи вже існує рахунок для цього вантажу
    const existingInvoices = invoices.filter(
      (inv) => inv.shipmentId === shipment.id && inv.status !== "ARCHIVED"
    );

    if (existingInvoices.length > 0) {
      // Показуємо модальне вікно з попередженням
      setInvoiceWarningModal({
        show: true,
        shipmentTrack: shipment.internalTrack,
        existingInvoices,
        onConfirm: () => {
          setInvoiceWarningModal({ show: false, shipmentTrack: "", existingInvoices: [], onConfirm: () => {} });
          setInvoiceForm({
            invoiceNumber: `INV-${shipment.internalTrack}-${Date.now()}`,
            amount: shipment.totalCost || "0",
            shipmentId: shipment.id,
            status: "UNPAID",
            dueDate: "",
          });
          setShowAddInvoice(true);
        },
      });
      return;
    }

    setInvoiceForm({
      invoiceNumber: `INV-${shipment.internalTrack}-${Date.now()}`,
      amount: shipment.totalCost || "0",
      shipmentId: shipment.id,
      status: "UNPAID",
      dueDate: "",
    });
    setShowAddInvoice(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>
        <p className="text-slate-600">Користувача не знайдено</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3 w-3" />
              Назад
            </button>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Користувач: {user.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1">Код клієнта: {user.clientCode}</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Видалення...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" /> Видалити користувача
              </>
            )}
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
              {success}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ім'я
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Телефон
              </label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Назва компанії (опціонально)
              </label>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Дата створення
              </label>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                {new Date(user.createdAt).toLocaleString("uk-UA")}
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Збереження...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Зберегти зміни
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Balance management */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <DollarSign className="h-5 w-5" />
      </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Баланс користувача</h2>
              <p className="text-sm text-slate-600">
                Поточний баланс:{" "}
                <span className="font-bold text-teal-700">
                  {balanceLoading && !balance
                    ? "Завантаження..."
                    : `${(balance?.balance ?? 0).toFixed(2)} ${balance?.currency ?? "USD"}`}
                </span>
              </p>
              {balance && (
                <p className="mt-1 text-xs text-slate-500">
                  Поповнення: {balance.incomeTotal.toFixed(2)} {balance.currency} · Списання:{" "}
                  {balance.expenseTotal.toFixed(2)} {balance.currency}
                </p>
              )}
            </div>
          </div>

          <form
            onSubmit={handleBalanceSubmit}
            className="mb-6 grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-3"
          >
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Тип операції
              </label>
              <select
                value={balanceForm.type}
                onChange={(e) =>
                  setBalanceForm({
                    ...balanceForm,
                    type: e.target.value === "expense" ? "expense" : "income",
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
              >
                <option value="income">Поповнення</option>
                <option value="expense">Списання</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Сума, USD
              </label>
              <input
                type="number"
                min={0.01}
                step="0.01"
                value={balanceForm.amount}
                onChange={(e) =>
                  setBalanceForm({
                    ...balanceForm,
                    amount: e.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
              />
            </div>
            <div className="md:col-span-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Коментар (опціонально)
              </label>
              <input
                type="text"
                value={balanceForm.description}
                onChange={(e) =>
                  setBalanceForm({
                    ...balanceForm,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Оновити баланс
              </button>
            </div>
          </form>

          <div className="mt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Історія транзакцій</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Дата</th>
                    <th className="px-3 py-2 text-left">Тип</th>
                    <th className="px-3 py-2 text-left">Опис</th>
                    <th className="px-3 py-2 text-right">Сума, USD</th>
                    <th className="px-3 py-2 text-right">Баланс, USD</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTransactions ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                        <Loader2 className="mr-2 inline h-3 w-3 animate-spin" />
                        Завантаження транзакцій...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                        Немає транзакцій
                      </td>
                    </tr>
                  ) : (
                    getTransactionsWithBalance(transactions).map((tx) => (
                      <tr key={tx.id} className="border-t border-slate-100">
                        <td className="px-3 py-2">
                          {new Date(tx.createdAt).toLocaleDateString("uk-UA")}
                        </td>
                        <td className="px-3 py-2">
                          {tx.type === "income" ? "Вхідна" : "Вихідна"}
                        </td>
                        <td className="px-3 py-2">{tx.description || "—"}</td>
                        <td
                          className={`px-3 py-2 text-right font-semibold ${
                            tx.type === "income" ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-800">
                          {tx.runningBalance.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Рахунки
              </h2>
              {invoices.length > 0 && (
                <p className="mt-1 text-sm text-slate-600">
                  Загалом до сплати:{" "}
                  <span className="font-bold text-red-600">
                    {invoices
                      .filter((inv) => inv.status === "UNPAID")
                      .reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
                      .toFixed(2)}{" "}
                    USD
                  </span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAddInvoice((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              {showAddInvoice ? (
                <>
                  <X className="h-4 w-4" /> Закрити форму
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Додати рахунок
                </>
              )}
            </button>
          </div>

          {showAddInvoice && (
            <form
              onSubmit={handleCreateInvoice}
              className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Номер рахунка
                </label>
                <input
                  type="text"
                  value={invoiceForm.invoiceNumber}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Сума, USD
                </label>
                <input
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={invoiceForm.amount}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, amount: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Прив'язати до вантажу
                </label>
                <select
                  value={invoiceForm.shipmentId}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, shipmentId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Без прив'язки</option>
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.internalTrack} {s.totalCost ? `(${s.totalCost} $)` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Статус
                </label>
                <select
                  value={invoiceForm.status}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, status: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="UNPAID">Неоплачено</option>
                  <option value="PAID">Оплачено</option>
                  <option value="ARCHIVED">Архів</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Термін оплати (опціонально)
                </label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Створити рахунок
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Дата</th>
                  <th className="px-3 py-2 text-left">Трек номер</th>
                  <th className="px-3 py-2 text-right">Сума до сплати</th>
                  <th className="px-3 py-2 text-left">Статус</th>
                  <th className="px-3 py-2 text-right">Дії</th>
                </tr>
              </thead>
              <tbody>
                {loadingInvoices ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                      <Loader2 className="mr-2 inline h-3 w-3 animate-spin" />
                      Завантаження рахунків...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                      Немає рахунків
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        {new Date(inv.createdAt).toLocaleDateString("uk-UA")}
                      </td>
                      <td className="px-3 py-2">
                        {inv.shipment ? (
                          <button
                            onClick={() => {
                              const shipmentElement = document.getElementById(`shipment-${inv.shipmentId}`);
                              if (shipmentElement) {
                                shipmentElement.scrollIntoView({ behavior: "smooth", block: "center" });
                                shipmentElement.classList.add("ring-2", "ring-teal-500");
                                setTimeout(() => {
                                  shipmentElement.classList.remove("ring-2", "ring-teal-500");
                                }, 2000);
                              }
                            }}
                            className="text-teal-600 hover:text-teal-700 hover:underline font-semibold"
                          >
                            {inv.shipment.internalTrack}
                          </button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {parseFloat(inv.amount).toFixed(2)} USD
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={inv.status}
                          onChange={(e) => handleUpdateInvoiceStatus(inv.id, e.target.value)}
                          className={`rounded-md border-0 px-2 py-1 text-xs font-semibold ${
                            inv.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : inv.status === "ARCHIVED"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <option value="UNPAID">Неоплачено</option>
                          <option value="PAID">Оплачено</option>
                          <option value="ARCHIVED">Архів</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipments management */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Вантаж
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                <Hash className="h-3 w-3" />
                {user.clientCode}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setShowAddShipment((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              {showAddShipment ? (
                <>
                  <X className="h-4 w-4" /> Закрити форму
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Додати вантаж
                </>
              )}
            </button>
          </div>

          {showAddShipment && (
            <form
              onSubmit={handleCreateShipment}
              className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3"
            >
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Внутрішній трек *
                </label>
                <input
                  type="text"
                  value={shipmentForm.internalTrack}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, internalTrack: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teал-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маркування
                </label>
                <input
                  type="text"
                  value={shipmentForm.cargoLabel}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, cargoLabel: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Статус *
                </label>
                <select
                  value={shipmentForm.status}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, status: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Оберіть статус</option>
                  <option value="CREATED">CREATED</option>
                  <option value="RECEIVED_CN">RECEIVED_CN</option>
                  <option value="CONSOLIDATION">CONSOLIDATION</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="ARRIVED_UA">ARRIVED_UA</option>
                  <option value="ON_UA_WAREHOUSE">ON_UA_WAREHOUSE</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Місцезнаходження
                </label>
                <input
                  type="text"
                  value={shipmentForm.location}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, location: e.target.value })
                  }
                  placeholder="Напр. CN warehouse, UA warehouse"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маршрут: З
                </label>
                <select
                  value={shipmentForm.routeFrom}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, routeFrom: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Не вказано</option>
                  <option value="CN">China (CN)</option>
                  <option value="HK">Hong Kong (HK)</option>
                  <option value="KR">Korea (KR)</option>
                  <option value="TR">Turkey (TR)</option>
                  <option value="EU">EU</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маршрут: В
                </label>
                <select
                  value={shipmentForm.routeTo}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, routeTo: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                >
                  <option value="">Не вказано</option>
                  <option value="UA">Ukraine (UA)</option>
                  <option value="PL">Poland (PL)</option>
                  <option value="EU">EU</option>
                  <option value="US">USA (US)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тип доставки
                </label>
                <select
                  value={shipmentForm.deliveryType}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      deliveryType: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="AIR">Авіа</option>
                  <option value="SEA">Море</option>
                  <option value="RAIL">Залізниця</option>
                  <option value="MULTIMODAL">Мультимодал</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Локальний трек (країна відпр.)
                </label>
                <input
                  type="text"
                  value={shipmentForm.localTrackingOrigin}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      localTrackingOrigin: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Локальний трек (країна отр.)
                </label>
                <input
                  type="text"
                  value={shipmentForm.localTrackingDestination}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      localTrackingDestination: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Опис
                </label>
                <input
                  type="text"
                  value={shipmentForm.description}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Фото вантажу (можна додати кілька)
                </label>
                <div
                  className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-xs text-slate-600"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                    if (files.length > 0) {
                      files.forEach(file => uploadAdditionalFile(file, "create"));
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      Перетягніть фото сюди або оберіть вручну (jpg, png, webp)
                    </span>
                    <label className="inline-flex cursor-pointer items-center rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                      Обрати фото
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            Array.from(files).forEach(file => {
                              if (file.type.startsWith('image/')) {
                                uploadAdditionalFile(file, "create");
                              }
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                  {isUploadingAdditionalFilesCreate && (
                    <span className="text-[11px] text-slate-500">
                      Завантаження фото...
                    </span>
                  )}
                  {shipmentForm.additionalFiles && shipmentForm.additionalFiles.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-[11px] font-semibold text-slate-700">
                        Завантажені фото ({shipmentForm.additionalFiles.length}):
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {shipmentForm.additionalFiles.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={url}
                              alt={`Фото ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = shipmentForm.additionalFiles.filter((_, i) => i !== idx);
                                setShipmentForm((prev) => ({
                                  ...prev,
                                  additionalFiles: newFiles,
                                  mainPhotoUrl: newFiles[0] || "",
                                }));
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Додаткові файли (документи, інвойси, тощо)
                </label>
                <div
                  className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-xs text-slate-600"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        uploadAdditionalFile(files[i], "create");
                      }
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      Перетягніть файли сюди або оберіть вручну (PDF, DOC, XLS, JPG, PNG)
                    </span>
                    <label className="inline-flex cursor-pointer items-center rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                      Обрати файли
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            for (let i = 0; i < files.length; i++) {
                              uploadAdditionalFile(files[i], "create");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {isUploadingAdditionalFilesCreate && (
                    <span className="text-[11px] text-slate-500">
                      Завантаження файлів...
                    </span>
                  )}
                  {shipmentForm.additionalFiles && shipmentForm.additionalFiles.length > 0 && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      <div className="font-semibold">Завантажені файли:</div>
                      <ul className="list-inside list-disc space-y-1">
                        {shipmentForm.additionalFiles.map((file, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <a href={file} target="_blank" rel="noreferrer" className="text-teal-600 underline">
                              {file.split('/').pop()}
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setShipmentForm((prev) => ({
                                  ...prev,
                                  additionalFiles: prev.additionalFiles.filter((_, i) => i !== idx),
                                }));
                              }}
                              className="ml-2 inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-200"
                            >
                              Видалити
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Місць
                </label>
                <input
                  type="number"
                  min={1}
                  value={shipmentForm.pieces}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      pieces: Number(e.target.value) || 1,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вага, кг
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={shipmentForm.weightKg}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, weightKg: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Щільність
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={shipmentForm.density}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, density: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тариф тип
                </label>
                <select
                  value={shipmentForm.tariffType}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      tariffType: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="kg">За кг</option>
                  <option value="m3">За м³</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тариф, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={shipmentForm.tariffValue}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      tariffValue: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вартість доставки, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={shipmentForm.deliveryCost}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      deliveryCost: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teал-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Доставка за місце, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={shipmentForm.deliveryCostPerPlace}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      deliveryCostPerPlace: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Обʼєм, м³
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={shipmentForm.volumeM3}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, volumeM3: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teал-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата отримано на складі
                </label>
                <input
                  type="date"
                  value={shipmentForm.receivedAtWarehouse}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      receivedAtWarehouse: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата відправлено
                </label>
                <input
                  type="date"
                  value={shipmentForm.sentAt}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      sentAt: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата доставлено
                </label>
                <input
                  type="date"
                  value={shipmentForm.deliveredAt}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      deliveredAt: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  ETA (якщо потрібно задати вручну)
                </label>
                <input
                  type="date"
                  value={shipmentForm.eta}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      eta: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Формат видачі
                </label>
                <select
                  value={shipmentForm.deliveryFormat}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      deliveryFormat: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                >
                  <option value="">Не вказано</option>
                  <option value="NOVA_POSHTA">Нова Пошта</option>
                  <option value="SELF_PICKUP">Самовивіз</option>
                  <option value="CARGO">Грузоперевізник</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Номер накладної / коментар
                </label>
                <input
                  type="text"
                  value={shipmentForm.deliveryReference}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      deliveryReference: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="packing"
                  type="checkbox"
                  checked={shipmentForm.packing}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      packing: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teал-500"
                />
                <label
                  htmlFor="packing"
                  className="text-xs font-semibold text-slate-700"
                >
                  Пакування
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="localDelivery"
                  type="checkbox"
                  checked={shipmentForm.localDeliveryToDepot}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      localDeliveryToDepot: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teал-600 focus:ring-teал-500"
                />
                <label
                  htmlFor="localDelivery"
                  className="text-xs font-semibold text-slate-700"
                >
                  Локальна доставка до складу
                </label>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вартість, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={shipmentForm.totalCost}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, totalCost: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teал-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Створити вантаж
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Статус</th>
                  <th className="px-3 py-2 text-left">Місц</th>
                  <th className="px-3 py-2 text-left">Кг</th>
                  <th className="px-3 py-2 text-left">m³</th>
                  <th className="px-3 py-2 text-left">Вартість</th>
                  <th className="px-3 py-2 text-left">Створено</th>
                  <th className="px-3 py-2 text-right">Дії</th>
                </tr>
              </thead>
              <tbody>
                {loadingShipments ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-slate-500"
                    >
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      Завантаження вантажів...
                    </td>
                  </tr>
                ) : shipments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-slate-500"
                    >
                      Вантажів для цього користувача поки немає
                    </td>
                  </tr>
                ) : (
                  shipments.map((s) => (
                    <tr key={s.id} id={`shipment-${s.id}`} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold">
                        {s.internalTrack}
                      </td>
                      <td className="px-3 py-2">{s.status}</td>
                      <td className="px-3 py-2">{s.pieces}</td>
                      <td className="px-3 py-2">
                        {s.weightKg ? `${s.weightKg}` : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {s.volumeM3 ? `${s.volumeM3}` : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {s.totalCost ? `${s.totalCost} $` : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {new Date(s.createdAt).toLocaleDateString("uk-UA")}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => createInvoiceFromShipment(s)}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                            title="Створити рахунок"
                          >
                            Рахунок
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditShipment(s)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Редагувати
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteShipment(s.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                            Видалити
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Детальні позиції вантажу (товари, таймлайн статусів, локальні треки)
            ми зможемо додати в окремому модалі після узгодження структури.
          </p>
        </div>
      </div>

      {editingShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Редагувати вантаж {editingShipment.internalTrack}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingShipment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={handleUpdateShipment}
              className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Внутрішній трек
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.internalTrack}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      internalTrack: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маркування
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.cargoLabel}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      cargoLabel: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Статус
                </label>
                <select
                  value={editingShipmentForm.status}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Без змін</option>
                  <option value="CREATED">CREATED</option>
                  <option value="RECEIVED_CN">RECEIVED_CN</option>
                  <option value="CONSOLIDATION">CONSOLIDATION</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="ARRIVED_UA">ARRIVED_UA</option>
                  <option value="ON_UA_WAREHOUSE">ON_UA_WAREHOUSE</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Місцезнаходження
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.location}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маршрут: З
                </label>
                <select
                  value={editingShipmentForm.routeFrom}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      routeFrom: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Не вказано</option>
                  <option value="CN">China (CN)</option>
                  <option value="HK">Hong Kong (HK)</option>
                  <option value="KR">Korea (KR)</option>
                  <option value="TR">Turkey (TR)</option>
                  <option value="EU">EU</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маршрут: В
                </label>
                <select
                  value={editingShipmentForm.routeTo}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      routeTo: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Не вказано</option>
                  <option value="UA">Ukraine (UA)</option>
                  <option value="PL">Poland (PL)</option>
                  <option value="EU">EU</option>
                  <option value="US">USA (US)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тип доставки
                </label>
                <select
                  value={editingShipmentForm.deliveryType}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      deliveryType: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="AIR">Авіа</option>
                  <option value="SEA">Море</option>
                  <option value="RAIL">Залізниця</option>
                  <option value="MULTIMODAL">Мультимодал</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Локальний трек (країна відпр.)
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.localTrackingOrigin}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      localTrackingOrigin: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Локальний трек (країна отр.)
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.localTrackingDestination}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      localTrackingDestination: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Опис
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.description}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Місць
                </label>
                <input
                  type="number"
                  min={1}
                  value={editingShipmentForm.pieces}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      pieces: Number(e.target.value) || 1,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вага, кг
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={editingShipmentForm.weightKg}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      weightKg: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Щільність
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={editingShipmentForm.density}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      density: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тариф тип
                </label>
                <select
                  value={editingShipmentForm.tariffType}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      tariffType: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="kg">За кг</option>
                  <option value="m3">За м3</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тариф, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingShipmentForm.tariffValue}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      tariffValue: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вартість доставки, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingShipmentForm.deliveryCost}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      deliveryCost: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Доставка за місце, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingShipmentForm.deliveryCostPerPlace}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      deliveryCostPerPlace: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Обєм, м3
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={editingShipmentForm.volumeM3}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      volumeM3: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата отримано на складі
                </label>
                <input
                  type="date"
                  value={editingShipmentForm.receivedAtWarehouse}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      receivedAtWarehouse: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата відправлено
                </label>
                <input
                  type="date"
                  value={editingShipmentForm.sentAt}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      sentAt: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата доставлено
                </label>
                <input
                  type="date"
                  value={editingShipmentForm.deliveredAt}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      deliveredAt: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  ETA (якщо потрібно задати вручну)
                </label>
                <input
                  type="date"
                  value={editingShipmentForm.eta}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      eta: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Страхування, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingShipmentForm.insuranceTotal}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      insuranceTotal: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Страхування %, загалом
                </label>
                <input
                  type="number"
                  value={editingShipmentForm.insurancePercentTotal}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      insurancePercentTotal: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Страхування % за місце
                </label>
                <input
                  type="number"
                  value={editingShipmentForm.insurancePerPlacePercent}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      insurancePerPlacePercent: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Формат видачі
                </label>
                <select
                  value={editingShipmentForm.deliveryFormat}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      deliveryFormat: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Не вказано</option>
                  <option value="NOVA_POSHTA">Нова Пошта</option>
                  <option value="SELF_PICKUP">Самовивіз</option>
                  <option value="CARGO">Грузоперевізник</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Номер накладної / коментар
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.deliveryReference}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      deliveryReference: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="edit-packing"
                  type="checkbox"
                  checked={editingShipmentForm.packing}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      packing: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <label
                  htmlFor="edit-packing"
                  className="text-xs font-semibold text-slate-700"
                >
                  Пакування
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="edit-localDelivery"
                  type="checkbox"
                  checked={editingShipmentForm.localDeliveryToDepot}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      localDeliveryToDepot: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label
                  htmlFor="edit-localDelivery"
                  className="text-xs font-semibold text-slate-700"
                >
                  Локальна доставка до складу
                </label>
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Фото вантажу (можна додати кілька)
                </label>
                <div
                  className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-xs text-slate-600"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                    if (files.length > 0) {
                      files.forEach(file => uploadAdditionalFile(file, "edit"));
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      Перетягніть фото сюди або оберіть вручну (jpg, png, webp)
                    </span>
                    <label className="inline-flex cursor-pointer items-center rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                      Обрати фото
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            Array.from(files).forEach(file => {
                              if (file.type.startsWith('image/')) {
                                uploadAdditionalFile(file, "edit");
                              }
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                  {isUploadingAdditionalFilesEdit && (
                    <span className="text-[11px] text-slate-500">
                      Завантаження фото...
                    </span>
                  )}
                  {editingShipmentForm.additionalFiles && editingShipmentForm.additionalFiles.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-[11px] font-semibold text-slate-700">
                        Завантажені фото ({editingShipmentForm.additionalFiles.length}):
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {editingShipmentForm.additionalFiles.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={url}
                              alt={`Фото ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = editingShipmentForm.additionalFiles.filter((_, i) => i !== idx);
                                setEditingShipmentForm((prev) => ({
                                  ...prev,
                                  additionalFiles: newFiles,
                                  mainPhotoUrl: newFiles[0] || "",
                                }));
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Додаткові файли (документи, інвойси, тощо - не фото)
                </label>
                <div
                  className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-xs text-slate-600"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        uploadAdditionalFile(files[i], "edit");
                      }
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      Перетягніть файли сюди або оберіть вручну (PDF, DOC, XLS, JPG, PNG)
                    </span>
                    <label className="inline-flex cursor-pointer items-center rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                      Обрати файли
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            for (let i = 0; i < files.length; i++) {
                              uploadAdditionalFile(files[i], "edit");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {isUploadingAdditionalFilesEdit && (
                    <span className="text-[11px] text-slate-500">
                      Завантаження файлів...
                    </span>
                  )}
                  {editingShipmentForm.additionalFiles && editingShipmentForm.additionalFiles.length > 0 && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      <div className="font-semibold">Завантажені файли:</div>
                      <ul className="list-inside list-disc space-y-1">
                        {editingShipmentForm.additionalFiles.map((file, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <a href={file} target="_blank" rel="noreferrer" className="text-teal-600 underline">
                              {file.split('/').pop()}
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingShipmentForm((prev) => ({
                                  ...prev,
                                  additionalFiles: prev.additionalFiles.filter((_, i) => i !== idx),
                                }));
                              }}
                              className="ml-2 inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-200"
                            >
                              Видалити
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вартість, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingShipmentForm.totalCost}
                  onChange={(e) =>
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      totalCost: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingShipment(null)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Зберегти зміни
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Warning Modal */}
      {invoiceWarningModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  Увага: Рахунок вже існує
                </h3>
                <p className="mb-4 text-sm text-slate-600">
                  Для вантажу <span className="font-semibold text-slate-900">"{invoiceWarningModal.shipmentTrack}"</span> вже створено{" "}
                  <span className="font-bold text-red-600">{invoiceWarningModal.existingInvoices.length}</span> рахунок(ів):
                </p>
                <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-2">
                    {invoiceWarningModal.existingInvoices.map((inv) => {
                      const status = inv.status === "PAID" 
                        ? { label: "Оплачено", color: "text-green-700 bg-green-50" }
                        : inv.status === "ARCHIVED"
                        ? { label: "Архів", color: "text-slate-700 bg-slate-100" }
                        : { label: "Неоплачено", color: "text-red-700 bg-red-50" };
                      const date = new Date(inv.createdAt).toLocaleDateString("uk-UA");
                      return (
                        <div
                          key={inv.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{inv.invoiceNumber}</div>
                            <div className="text-xs text-slate-500">{date}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900">
                              {parseFloat(inv.amount).toFixed(2)} USD
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                              {status.label}
                            </span>
      </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="mb-4 text-sm font-semibold text-amber-700">
                  Ви впевнені, що хочете створити ще один рахунок для цього вантажу?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setInvoiceWarningModal({
                        show: false,
                        shipmentTrack: "",
                        existingInvoices: [],
                        onConfirm: () => {},
                      })
                    }
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={invoiceWarningModal.onConfirm}
                    className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    Так, створити рахунок
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

