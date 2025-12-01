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
import { ShipmentTimeline } from "./ShipmentTimeline";

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

interface ShipmentItemRow {
  id: string;
  trackNumber: string | null;
  placeNumber: number | null;
  localTracking: string | null;
  description: string | null;
  quantity: number | null;
  insuranceValue: string | null;
  insurancePercent: number | null;
  insuranceCost: string | null;
  lengthCm: string | null;
  widthCm: string | null;
  heightCm: string | null;
  weightKg: string | null;
  volumeM3: string | null;
  density: string | null;
  tariffType: string | null;
  tariffValue: string | null;
  deliveryCost: string | null;
  cargoType: string | null;
  cargoTypeCustom: string | null;
  note: string | null;
  photoUrl: string | null;
}

interface ShipmentStatusHistoryRow {
  id: string;
  shipmentId: string;
  status: string;
  location: string | null;
  description: string | null;
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
  totalCost: string | null;
  receivedAtWarehouse: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  eta: string | null;
  deliveryFormat: string | null;
  deliveryReference: string | null;
  packing: boolean | null;
  packingCost: string | null;
  localDeliveryToDepot: boolean | null;
  localDeliveryCost: string | null;
  batchId: string | null;
  cargoType: string | null;
  cargoTypeCustom: string | null;
  createdAt: string;
  items?: ShipmentItemRow[];
  statusHistory?: ShipmentStatusHistoryRow[];
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
  const [batches, setBatches] = useState<Array<{ id: string; batchId: string; description: string | null }>>([]);
  const [shipmentForm, setShipmentForm] = useState({
    cargoLabel: "",
    status: "",
    location: "",
    routeFrom: "",
    routeTo: "",
    deliveryType: "AIR",
    description: "",
    mainPhotoUrl: "",
    receivedAtWarehouse: "",
    sentAt: "",
    deliveredAt: "",
    eta: "",
    deliveryFormat: "",
    deliveryReference: "",
    packing: false,
    packingCost: "",
    localDeliveryToDepot: false,
    localDeliveryCost: "",
    batchId: "",
    cargoType: "",
    cargoTypeCustom: "",
    additionalFiles: [] as string[],
    items: [] as Array<{
      trackNumber: string;
      localTracking: string;
      description: string;
      quantity: string;
      insuranceValue: string;
      insurancePercent: string;
      lengthCm: string;
      widthCm: string;
      heightCm: string;
      weightKg: string;
      volumeM3: string;
      density: string;
      tariffType: string;
      tariffValue: string;
      deliveryCost: string;
      cargoType: string;
      cargoTypeCustom: string;
      note: string;
    }>,
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
    location: "",
    routeFrom: "",
    routeTo: "",
    deliveryType: "AIR",
    description: "",
    mainPhotoUrl: "",
    receivedAtWarehouse: "",
    sentAt: "",
    deliveredAt: "",
    eta: "",
    deliveryFormat: "",
    deliveryReference: "",
    packing: false,
    packingCost: "",
    localDeliveryToDepot: false,
    localDeliveryCost: "",
    batchId: "",
    cargoType: "",
    cargoTypeCustom: "",
    additionalFiles: [] as string[],
    items: [] as Array<{
      trackNumber: string;
      localTracking: string;
      description: string;
      quantity: string;
      insuranceValue: string;
      insurancePercent: string;
      lengthCm: string;
      widthCm: string;
      heightCm: string;
      weightKg: string;
      volumeM3: string;
      density: string;
      tariffType: string;
      tariffValue: string;
      deliveryCost: string;
      cargoType: string;
      cargoTypeCustom: string;
      note: string;
    }>,
  });

  const [isUploadingMainPhotoCreate, setIsUploadingMainPhotoCreate] = useState(false);
  const [isUploadingMainPhotoEdit, setIsUploadingMainPhotoEdit] = useState(false);
  const [isUploadingAdditionalFilesCreate, setIsUploadingAdditionalFilesCreate] = useState(false);
  const [isUploadingAdditionalFilesEdit, setIsUploadingAdditionalFilesEdit] = useState(false);

  // Cargo types
  const CARGO_TYPES = [
    "Електроніка",
    "Одяг",
    "Взуття",
    "Іграшки",
    "Меблі",
    "Косметика",
    "Аксесуари",
    "Інше",
  ];

  // Helper function to generate internal track number for shipment
  const generateInternalTrack = (batchId: string, clientCode: string, cargoType: string): string => {
    if (!batchId || batchId.trim() === "" || !clientCode) {
      return "";
    }
    // Count existing shipments in this batch for this client
    // Use user.clientCode if available, otherwise count all shipments in batch
    const currentClientCode = user?.clientCode || clientCode;
    const existingShipmentsInBatch = shipments.filter(
      (s) => s.batchId === batchId
    ).length;
    
    // Generate internal track: batchId-clientCode-cargoType-number
    // Format: 00010-2661A0001 (без дефісу перед номером)
    const cargoTypeCode = cargoType ? cargoType.substring(0, 1).toUpperCase() : "X";
    const shipmentNumber = String(existingShipmentsInBatch + 1).padStart(4, "0");
    return `${batchId}-${currentClientCode}${cargoTypeCode}${shipmentNumber}`;
  };

  // Helper function to generate track number for item
  const generateItemTrackNumber = (batchId: string, clientCode: string, cargoType: string, placeNumber: number): string => {
    if (!batchId || batchId.trim() === "" || !clientCode) {
      return "";
    }
    // Generate internal track first
    const internalTrack = generateInternalTrack(batchId, clientCode, cargoType);
    if (!internalTrack) return "";
    // Add place number: 00010-2661A0001-1
    return `${internalTrack}-${placeNumber}`;
  };

  // Helper functions for items
  const addItem = () => {
    if (!user) return;
    
    setShipmentForm((prev) => {
      const placeNumber = prev.items.length + 1;
      const trackNumber = generateItemTrackNumber(prev.batchId, user.clientCode, prev.cargoType || prev.cargoTypeCustom, placeNumber);
      
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            trackNumber: trackNumber,
            localTracking: "",
            description: "",
            quantity: "",
            insuranceValue: "",
            insurancePercent: "",
            lengthCm: "",
            widthCm: "",
            heightCm: "",
            weightKg: "",
            volumeM3: "",
            density: "",
            tariffType: "kg",
            tariffValue: "",
            deliveryCost: "",
            cargoType: "",
            cargoTypeCustom: "",
            note: "",
          },
        ],
      };
    });
  };

  const removeItem = (index: number) => {
    setShipmentForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: string, value: string) => {
    setShipmentForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addMultipleItems = (count: number) => {
    if (!user) return;
    
    setShipmentForm((prev) => {
      const startIndex = prev.items.length;
      const newItems = Array.from({ length: count }, (_, i) => {
        const placeNumber = startIndex + i + 1;
        const trackNumber = generateItemTrackNumber(prev.batchId, user.clientCode, prev.cargoType || prev.cargoTypeCustom, placeNumber);
        
        return {
          trackNumber: trackNumber,
          localTracking: "",
          description: "",
          quantity: "",
          insuranceValue: "",
          insurancePercent: "",
          lengthCm: "",
          widthCm: "",
          heightCm: "",
          weightKg: "",
          volumeM3: "",
          density: "",
          tariffType: "kg",
          tariffValue: "",
          deliveryCost: "",
          cargoType: "",
          cargoTypeCustom: "",
          note: "",
        };
      });
      
      return {
        ...prev,
        items: [...prev.items, ...newItems],
      };
    });
  };

  // Helper functions for editing items
  const addEditItem = () => {
    if (!user || !editingShipment) return;
    
    setEditingShipmentForm((prev) => {
      const placeNumber = prev.items.length + 1;
      // For editing, use the existing internalTrack from the shipment
      // Format: 00010-2661A0001-1, 00010-2661A0001-2, etc.
      let trackNumber = "";
      if (prev.internalTrack && prev.internalTrack.trim() !== "") {
        const trackBase = prev.internalTrack.replace(/-(\d+)$/, '$1'); // Remove last dash, keep number
        trackNumber = `${trackBase}-${placeNumber}`;
      } else if (editingShipment.internalTrack) {
        const trackBase = editingShipment.internalTrack.replace(/-(\d+)$/, '$1');
        trackNumber = `${trackBase}-${placeNumber}`;
      }
      
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            trackNumber: trackNumber,
            localTracking: "",
            description: "",
            quantity: "",
            insuranceValue: "",
            insurancePercent: "",
            lengthCm: "",
            widthCm: "",
            heightCm: "",
            weightKg: "",
            volumeM3: "",
            density: "",
            tariffType: "kg",
            tariffValue: "",
            deliveryCost: "",
            cargoType: "",
            cargoTypeCustom: "",
            note: "",
          },
        ],
      };
    });
  };

  const removeEditItem = (index: number) => {
    setEditingShipmentForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateEditItem = (index: number, field: string, value: string) => {
    setEditingShipmentForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addMultipleEditItems = (count: number) => {
    const newItems = Array.from({ length: count }, () => ({
      trackNumber: "",
      localTracking: "",
      description: "",
      quantity: "",
      insuranceValue: "",
      insurancePercent: "",
      lengthCm: "",
      widthCm: "",
      heightCm: "",
      weightKg: "",
      volumeM3: "",
      density: "",
      tariffType: "kg",
      tariffValue: "",
      deliveryCost: "",
      cargoType: "",
      cargoTypeCustom: "",
      note: "",
    }));
    setEditingShipmentForm((prev) => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
  };

  useEffect(() => {
    fetchUser();
    fetchShipments();
    fetchBalance();
    fetchTransactions();
    fetchInvoices();
    fetchBatches();
  }, [userId]);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/admin/batches");
      if (res.ok) {
        const data = await res.json();
        setBatches(data.batches || []);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

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
          cargoLabel: shipmentForm.cargoLabel || null,
          status: shipmentForm.status || "CREATED",
          location: shipmentForm.location || null,
          routeFrom: shipmentForm.routeFrom || null,
          routeTo: shipmentForm.routeTo || null,
          deliveryType: shipmentForm.deliveryType,
          description: shipmentForm.description || null,
          mainPhotoUrl: shipmentForm.mainPhotoUrl || (shipmentForm.additionalFiles && shipmentForm.additionalFiles.length > 0 ? shipmentForm.additionalFiles[0] : null),
          receivedAtWarehouse: shipmentForm.receivedAtWarehouse || null,
          sentAt: shipmentForm.sentAt || null,
          deliveredAt: shipmentForm.deliveredAt || null,
          eta: shipmentForm.eta || null,
          deliveryFormat: shipmentForm.deliveryFormat || null,
          deliveryReference: shipmentForm.deliveryReference || null,
          packing: shipmentForm.packing,
          packingCost: shipmentForm.packingCost || null,
          localDeliveryToDepot: shipmentForm.localDeliveryToDepot,
          localDeliveryCost: shipmentForm.localDeliveryCost || null,
          batchId: shipmentForm.batchId || null,
          cargoType: shipmentForm.cargoType || null,
          cargoTypeCustom: shipmentForm.cargoType ? null : (shipmentForm.cargoTypeCustom || null),
          additionalFiles: shipmentForm.additionalFiles || [],
          items: shipmentForm.items || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не вдалося створити вантаж");
        return;
      }
      setShowAddShipment(false);
      setShipmentForm({
        cargoLabel: "",
        status: "",
        location: "",
        routeFrom: "",
        routeTo: "",
        deliveryType: "AIR",
        description: "",
        mainPhotoUrl: "",
        receivedAtWarehouse: "",
        sentAt: "",
        deliveredAt: "",
        eta: "",
        deliveryFormat: "",
        deliveryReference: "",
        packing: false,
        packingCost: "",
        localDeliveryToDepot: false,
        localDeliveryCost: "",
        batchId: "",
        cargoType: "",
        cargoTypeCustom: "",
        additionalFiles: [],
        items: [],
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

  // Helper function to format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (date: string | Date | null | undefined): string => {
    if (!date) return "";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return "";
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const openEditShipment = (shipment: ShipmentRow) => {
    setEditingShipment(shipment);
    setEditingShipmentForm({
      internalTrack: shipment.internalTrack,
      cargoLabel: shipment.cargoLabel || "",
      status: shipment.status || "",
      location: shipment.location || "",
      routeFrom: shipment.routeFrom || "",
      routeTo: shipment.routeTo || "",
      deliveryType: shipment.deliveryType || "AIR",
      description: shipment.description || "",
      mainPhotoUrl: shipment.mainPhotoUrl || "",
      receivedAtWarehouse: formatDateForInput(shipment.receivedAtWarehouse),
      sentAt: formatDateForInput(shipment.sentAt),
      deliveredAt: formatDateForInput(shipment.deliveredAt),
      eta: formatDateForInput(shipment.eta),
      deliveryFormat: shipment.deliveryFormat || "",
      deliveryReference: shipment.deliveryReference || "",
      packing: shipment.packing || false,
      packingCost: shipment.packingCost || "",
      localDeliveryToDepot: shipment.localDeliveryToDepot || false,
      localDeliveryCost: shipment.localDeliveryCost || "",
      batchId: shipment.batchId || "",
      cargoType: shipment.cargoType || "",
      cargoTypeCustom: shipment.cargoTypeCustom || "",
      additionalFiles: shipment.additionalFilesUrls ? JSON.parse(shipment.additionalFilesUrls) : [],
      items: shipment.items
        ? shipment.items.map((item) => ({
            trackNumber: item.trackNumber || "",
            localTracking: item.localTracking || "",
            description: item.description || "",
            quantity: item.quantity?.toString() || "",
            insuranceValue: item.insuranceValue || "",
            insurancePercent: item.insurancePercent?.toString() || "",
            lengthCm: item.lengthCm || "",
            widthCm: item.widthCm || "",
            heightCm: item.heightCm || "",
            weightKg: item.weightKg || "",
            volumeM3: item.volumeM3 || "",
            density: item.density || "",
            tariffType: item.tariffType || "kg",
            tariffValue: item.tariffValue || "",
            deliveryCost: item.deliveryCost || "",
            cargoType: item.cargoType || "",
            cargoTypeCustom: item.cargoTypeCustom || "",
            note: item.note || "",
          }))
        : [],
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
          routeFrom: editingShipmentForm.routeFrom || null,
          routeTo: editingShipmentForm.routeTo || null,
          deliveryType: editingShipmentForm.deliveryType || editingShipment.deliveryType,
          description: editingShipmentForm.description || null,
          mainPhotoUrl: editingShipmentForm.mainPhotoUrl || (editingShipmentForm.additionalFiles && editingShipmentForm.additionalFiles.length > 0 ? editingShipmentForm.additionalFiles[0] : null),
          receivedAtWarehouse: editingShipmentForm.receivedAtWarehouse || null,
          sentAt: editingShipmentForm.sentAt || null,
          deliveredAt: editingShipmentForm.deliveredAt || null,
          eta: editingShipmentForm.eta || null,
          deliveryFormat: editingShipmentForm.deliveryFormat || null,
          deliveryReference: editingShipmentForm.deliveryReference || null,
          packing: editingShipmentForm.packing,
          packingCost: editingShipmentForm.packingCost || null,
          localDeliveryToDepot: editingShipmentForm.localDeliveryToDepot,
          localDeliveryCost: editingShipmentForm.localDeliveryCost || null,
          batchId: editingShipmentForm.batchId || null,
          cargoType: editingShipmentForm.cargoType || null,
          cargoTypeCustom: editingShipmentForm.cargoType ? null : (editingShipmentForm.cargoTypeCustom || null),
          additionalFiles: editingShipmentForm.additionalFiles || [],
          items: editingShipmentForm.items || [],
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
              onClick={() => {
                setShowAddShipment((prev) => !prev);
              }}
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
              {/* Перший рядок: ID партії *, Трек номер вантажу (автозаповнений), Маркування */}
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  ID партії *
                </label>
                <select
                  value={shipmentForm.batchId}
                  onChange={(e) => {
                    setShipmentForm({ 
                      ...shipmentForm, 
                      batchId: e.target.value 
                    });
                  }}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Оберіть партію</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.batchId}>
                      {batch.batchId} {batch.description ? `- ${batch.description}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Трек номер вантажу (автоматично)
                </label>
                <input
                  type="text"
                  value={generateInternalTrack(
                    shipmentForm.batchId,
                    user?.clientCode || "",
                    shipmentForm.cargoType || shipmentForm.cargoTypeCustom || ""
                  )}
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-mono text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Оберіть партію та тип вантажу"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Формат: ID_партії-Код_клієнтаТипНомер
                </p>
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              {/* Другий рядок: Маршрути (в стовпчик), Дата отримано на складі */}
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Після встановлення запускається автоматизація
                </p>
              </div>
              {/* Третій рядок: Місцезнаходження, Тип вантажу, Дата відправлено */}
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
                  Тип вантажу
                </label>
                <input
                  type="text"
                  list="cargo-types"
                  value={shipmentForm.cargoType || shipmentForm.cargoTypeCustom || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Check if value is from the list
                    const isFromList = CARGO_TYPES.includes(value);
                    setShipmentForm({
                      ...shipmentForm,
                      cargoType: isFromList ? value : "",
                      cargoTypeCustom: isFromList ? "" : value,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Оберіть зі списку або введіть вручну"
                />
                <datalist id="cargo-types">
                  {CARGO_TYPES.map((type) => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата відправлено
                </label>
                <input
                  type="date"
                  value={shipmentForm.sentAt}
                  onChange={(e) => {
                    const sentDate = e.target.value;
                    let deliveredDate = "";
                    let etaDate = "";
                    
                    if (sentDate) {
                      const sent = new Date(sentDate);
                      // Calculate transit days based on delivery type
                      const transitDays =
                        shipmentForm.deliveryType === "SEA"
                          ? 40
                          : shipmentForm.deliveryType === "RAIL"
                          ? 18
                          : shipmentForm.deliveryType === "MULTIMODAL"
                          ? 25
                          : 21; // AIR default
                      
                      // Calculate deliveredAt and ETA
                      const delivered = new Date(sent);
                      delivered.setDate(delivered.getDate() + transitDays);
                      deliveredDate = delivered.toISOString().split('T')[0];
                      etaDate = deliveredDate;
                    }
                    
                    setShipmentForm({
                      ...shipmentForm,
                      sentAt: sentDate,
                      deliveredAt: deliveredDate,
                      eta: etaDate,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Автоматично: дата отримано + 3 дні (можна встановити вручну)
                </p>
              </div>
              {/* Четвертий рядок: Статус *, Дата доставлено, ETA */}
              <div>
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Автоматично: дата відправлено + N днів (можна встановити вручну)
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  ETA (орієнтовна дата прибуття)
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Автоматично: дата відправлено + N днів (можна встановити вручну)
                </p>
              </div>
              {/* Додаткові поля */}
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                  Пакування, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={shipmentForm.packingCost}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, packingCost: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Локальна доставка, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={shipmentForm.localDeliveryCost}
                  onChange={(e) =>
                    setShipmentForm({ ...shipmentForm, localDeliveryCost: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вартість (загальна), $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={(() => {
                    // Calculate total: insuranceCost + deliveryCost + packingCost + localDeliveryCost
                    let total = 0;
                    
                    // Sum insurance costs from items
                    shipmentForm.items.forEach((item) => {
                      if (item.insuranceValue && item.insurancePercent) {
                        const insuranceValue = parseFloat(item.insuranceValue) || 0;
                        const insurancePercent = parseFloat(item.insurancePercent) || 0;
                        total += (insuranceValue * insurancePercent) / 100;
                      }
                    });
                    
                    // Sum delivery costs from items
                    shipmentForm.items.forEach((item) => {
                      if (item.deliveryCost) {
                        total += parseFloat(item.deliveryCost) || 0;
                      }
                    });
                    
                    // Add packing cost
                    if (shipmentForm.packingCost) {
                      total += parseFloat(shipmentForm.packingCost) || 0;
                    }
                    
                    // Add local delivery cost
                    if (shipmentForm.localDeliveryCost) {
                      total += parseFloat(shipmentForm.localDeliveryCost) || 0;
                    }
                    
                    return total > 0 ? total.toFixed(2) : "";
                  })()}
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Автоматично: страхування + доставка + пакування + локальна доставка
                </p>
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
              {/* Items Table */}
              <div className="md:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Місця вантажу</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Кількість місць"
                      className="w-32 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const count = parseInt((e.target as HTMLInputElement).value) || 1;
                          if (count > 0) {
                            addMultipleItems(count);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700"
                    >
                      <Plus className="h-3 w-3" />
                      Додати місце
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="min-w-full text-[10px]">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">№</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Трек номери</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Локальний трек</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Опис</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Кількість</th>
                          <th className="px-2 py-1.5 text-center font-semibold text-slate-700" colSpan={3}>
                            Страхування
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-slate-700" colSpan={3}>
                            Габарити (СМ)
                          </th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">КГ</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">м³</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Щільність</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Тариф</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Вартість</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Тип вантажу</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Примітка</th>
                          <th className="px-2 py-1.5 text-center font-semibold text-slate-700">Дії</th>
                        </tr>
                        <tr className="bg-slate-50">
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Сумма</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">%</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Вартість</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Довжина</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Ширина</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Висота</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {shipmentForm.items.map((item, index) => {
                          const insuranceCost = item.insuranceValue && item.insurancePercent
                            ? (parseFloat(item.insuranceValue) * parseFloat(item.insurancePercent) / 100).toFixed(2)
                            : "";
                          return (
                            <tr key={index} className="hover:bg-slate-50">
                              <td className="px-2 py-1.5 font-semibold text-slate-900">{index + 1}</td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.trackNumber}
                                  onChange={(e) => updateItem(index, "trackNumber", e.target.value)}
                                  className="w-24 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="00010-2661A0001-1"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.localTracking}
                                  onChange={(e) => updateItem(index, "localTracking", e.target.value)}
                                  className="w-20 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => updateItem(index, "description", e.target.value)}
                                  className="w-32 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="іграшки"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.insuranceValue}
                                  onChange={(e) => updateItem(index, "insuranceValue", e.target.value)}
                                  className="w-20 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="1000.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={item.insurancePercent}
                                  onChange={(e) => updateItem(index, "insurancePercent", e.target.value)}
                                  className="w-12 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="5"
                                />
                              </td>
                              <td className="px-2 py-1.5 text-center text-[10px] font-semibold text-slate-700">
                                {insuranceCost || "-"}
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.lengthCm}
                                  onChange={(e) => updateItem(index, "lengthCm", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="10.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.widthCm}
                                  onChange={(e) => updateItem(index, "widthCm", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="50.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.heightCm}
                                  onChange={(e) => updateItem(index, "heightCm", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="100.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.001"
                                  value={item.weightKg}
                                  onChange={(e) => updateItem(index, "weightKg", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="24.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={item.volumeM3}
                                  onChange={(e) => updateItem(index, "volumeM3", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="0.05"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.001"
                                  value={item.density}
                                  onChange={(e) => updateItem(index, "density", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="480.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <div className="flex gap-1">
                                  <select
                                    value={item.tariffType}
                                    onChange={(e) => updateItem(index, "tariffType", e.target.value)}
                                    className="w-12 rounded border border-slate-300 bg-white px-1 py-0.5 text-[9px] focus:border-teal-500 focus:outline-none"
                                  >
                                    <option value="kg">кг</option>
                                    <option value="m3">м³</option>
                                  </select>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.tariffValue}
                                    onChange={(e) => updateItem(index, "tariffValue", e.target.value)}
                                    className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                    placeholder="10.00"
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.deliveryCost}
                                  onChange={(e) => updateItem(index, "deliveryCost", e.target.value)}
                                  className="w-20 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="240.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <div className="flex flex-col gap-1">
                                  <select
                                    value={item.cargoType}
                                    onChange={(e) => updateItem(index, "cargoType", e.target.value)}
                                    className="w-full rounded border border-slate-300 bg-white px-1 py-0.5 text-[9px] focus:border-teal-500 focus:outline-none"
                                  >
                                    <option value="">-</option>
                                    {CARGO_TYPES.map((type) => (
                                      <option key={type} value={type}>
                                        {type}
                                      </option>
                                    ))}
                                  </select>
                                  {item.cargoType === "" && (
                                    <input
                                      type="text"
                                      value={item.cargoTypeCustom}
                                      onChange={(e) => updateItem(index, "cargoTypeCustom", e.target.value)}
                                      className="w-full rounded border border-slate-300 bg-white px-1 py-0.5 text-[9px] focus:border-teal-500 focus:outline-none"
                                      placeholder="Кастомний тип"
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.note}
                                  onChange={(e) => updateItem(index, "note", e.target.value)}
                                  className="w-24 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                />
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeItem(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {shipmentForm.items.length === 0 && (
                          <tr>
                            <td colSpan={18} className="px-4 py-8 text-center text-xs text-slate-500">
                              Немає місць. Додайте місця для вантажу.
                            </td>
                          </tr>
                        )}
                        {shipmentForm.items.length > 0 && (() => {
                          // Calculate totals
                          const totalPlaces = shipmentForm.items.length;
                          let totalInsuranceSum = 0;
                          let totalInsuranceCost = 0;
                          let totalWeight = 0;
                          let totalVolume = 0;
                          let totalDeliveryCost = 0;
                          let totalDensity = 0;
                          let densityCount = 0;

                          shipmentForm.items.forEach((item) => {
                            const insuranceValue = parseFloat(item.insuranceValue) || 0;
                            const insurancePercent = parseFloat(item.insurancePercent) || 0;
                            const insuranceCost = (insuranceValue * insurancePercent) / 100;
                            const weight = parseFloat(item.weightKg) || 0;
                            const volume = parseFloat(item.volumeM3) || 0;
                            const deliveryCost = parseFloat(item.deliveryCost) || 0;
                            const density = parseFloat(item.density) || 0;

                            totalInsuranceSum += insuranceValue;
                            totalInsuranceCost += insuranceCost;
                            totalWeight += weight;
                            totalVolume += volume;
                            totalDeliveryCost += deliveryCost;
                            if (density > 0) {
                              totalDensity += density;
                              densityCount++;
                            }
                          });

                          const avgDensity = densityCount > 0 ? totalDensity / densityCount : 0;

                          return (
                            <tr className="bg-slate-100 font-bold">
                              <td colSpan={4} className="px-2 py-2 text-left text-[10px] text-slate-900">
                                Загалом
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalPlaces}
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalInsuranceSum > 0 ? totalInsuranceSum.toFixed(2) : ""}
                              </td>
                              <td className="px-2 py-2"></td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalInsuranceCost > 0 ? totalInsuranceCost.toFixed(2) : ""}
                              </td>
                              <td colSpan={3} className="px-2 py-2"></td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalWeight > 0 ? totalWeight.toFixed(2) : ""}
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalVolume > 0 ? totalVolume.toFixed(2) : ""}
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {avgDensity > 0 ? avgDensity.toFixed(0) : ""}
                              </td>
                              <td className="px-2 py-2"></td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalDeliveryCost > 0 ? totalDeliveryCost.toFixed(2) : ""}
                              </td>
                              <td colSpan={3} className="px-2 py-2"></td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              <div className="md:col-span-3">
                <p className="text-xs text-slate-500">
                  Вартість розраховується автоматично на основі місць, страхування, пакування та локальної доставки
                </p>
              </div>
              <div className="md:col-span-3 flex items-end">
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
                  shipments.map((s) => {
                    const totalWeight = s.items?.reduce((sum, item) => sum + (parseFloat(item.weightKg || "0") || 0), 0) || 0;
                    const totalVolume = s.items?.reduce((sum, item) => sum + (parseFloat(item.volumeM3 || "0") || 0), 0) || 0;
                    return (
                    <tr key={s.id} id={`shipment-${s.id}`} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold">
                        {s.internalTrack}
                      </td>
                      <td className="px-3 py-2">{s.status}</td>
                      <td className="px-3 py-2">{s.pieces}</td>
                      <td className="px-3 py-2">
                        {totalWeight > 0 ? `${totalWeight.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {totalVolume > 0 ? `${totalVolume.toFixed(4)}` : "-"}
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
                    );
                  })
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
                  ID партії
                </label>
                <select
                  value={editingShipmentForm.batchId}
                  onChange={(e) =>
                    setEditingShipmentForm({ ...editingShipmentForm, batchId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Оберіть партію</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.batchId}>
                      {batch.batchId} {batch.description ? `- ${batch.description}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тип вантажу
                </label>
                <select
                  value={editingShipmentForm.cargoType}
                  onChange={(e) =>
                    setEditingShipmentForm({ ...editingShipmentForm, cargoType: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Оберіть тип</option>
                  {CARGO_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тип вантажу (кастомний)
                </label>
                <input
                  type="text"
                  value={editingShipmentForm.cargoTypeCustom}
                  onChange={(e) =>
                    setEditingShipmentForm({ ...editingShipmentForm, cargoTypeCustom: e.target.value })
                  }
                  placeholder="Якщо не вказано вище"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Пакування, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingShipmentForm.packingCost}
                  onChange={(e) =>
                    setEditingShipmentForm({ ...editingShipmentForm, packingCost: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Локальна доставка, $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingShipmentForm.localDeliveryCost}
                  onChange={(e) =>
                    setEditingShipmentForm({ ...editingShipmentForm, localDeliveryCost: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вартість (загальна), $
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={(() => {
                    // Calculate total: insuranceCost + deliveryCost + packingCost + localDeliveryCost
                    let total = 0;
                    
                    // Sum insurance costs from items
                    editingShipmentForm.items.forEach((item) => {
                      if (item.insuranceValue && item.insurancePercent) {
                        const insuranceValue = parseFloat(item.insuranceValue) || 0;
                        const insurancePercent = parseFloat(item.insurancePercent) || 0;
                        total += (insuranceValue * insurancePercent) / 100;
                      }
                    });
                    
                    // Sum delivery costs from items
                    editingShipmentForm.items.forEach((item) => {
                      if (item.deliveryCost) {
                        total += parseFloat(item.deliveryCost) || 0;
                      }
                    });
                    
                    // Add packing cost
                    if (editingShipmentForm.packingCost) {
                      total += parseFloat(editingShipmentForm.packingCost) || 0;
                    }
                    
                    // Add local delivery cost
                    if (editingShipmentForm.localDeliveryCost) {
                      total += parseFloat(editingShipmentForm.localDeliveryCost) || 0;
                    }
                    
                    return total > 0 ? total.toFixed(2) : "";
                  })()}
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Автоматично: страхування + доставка + пакування + локальна доставка
                </p>
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
                  onChange={(e) => {
                    const sentDate = e.target.value;
                    let deliveredDate = editingShipmentForm.deliveredAt;
                    let etaDate = editingShipmentForm.eta;
                    
                    if (sentDate) {
                      const sent = new Date(sentDate);
                      // Calculate transit days based on delivery type
                      const transitDays =
                        editingShipmentForm.deliveryType === "SEA"
                          ? 40
                          : editingShipmentForm.deliveryType === "RAIL"
                          ? 18
                          : editingShipmentForm.deliveryType === "MULTIMODAL"
                          ? 25
                          : 21; // AIR default
                      
                      // Calculate deliveredAt and ETA
                      const delivered = new Date(sent);
                      delivered.setDate(delivered.getDate() + transitDays);
                      deliveredDate = delivered.toISOString().split('T')[0];
                      etaDate = deliveredDate;
                    }
                    
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      sentAt: sentDate,
                      deliveredAt: deliveredDate,
                      eta: etaDate,
                    });
                  }}
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
                <p className="mt-1 text-[10px] text-slate-500">
                  Автоматично: дата відправлено + N днів (можна встановити вручну)
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  ETA (орієнтовна дата прибуття)
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
                <p className="mt-1 text-[10px] text-slate-500">
                  Автоматично: дата відправлено + N днів (можна встановити вручну)
                </p>
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
              {/* Items Table for Edit */}
              <div className="md:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Місця вантажу</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Кількість місць"
                      className="w-32 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const count = parseInt((e.target as HTMLInputElement).value) || 1;
                          if (count > 0) {
                            addMultipleEditItems(count);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addEditItem}
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700"
                    >
                      <Plus className="h-3 w-3" />
                      Додати місце
                    </button>
                  </div>
                </div>
                {editingShipmentForm.items.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="min-w-full text-[10px]">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">№</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Трек номери</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Локальний трек</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Опис</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Кількість</th>
                          <th className="px-2 py-1.5 text-center font-semibold text-slate-700" colSpan={3}>
                            Страхування
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-slate-700" colSpan={3}>
                            Габарити (СМ)
                          </th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">КГ</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">м³</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Щільність</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Тариф</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Вартість</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Тип вантажу</th>
                          <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Примітка</th>
                          <th className="px-2 py-1.5 text-center font-semibold text-slate-700">Дії</th>
                        </tr>
                        <tr className="bg-slate-50">
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Сумма</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">%</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Вартість</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Довжина</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Ширина</th>
                          <th className="px-2 py-1 text-center text-[9px] font-medium text-slate-600">Висота</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {editingShipmentForm.items.map((item, index) => {
                          const insuranceCost = item.insuranceValue && item.insurancePercent
                            ? (parseFloat(item.insuranceValue) * parseFloat(item.insurancePercent) / 100).toFixed(2)
                            : "";
                          return (
                            <tr key={index} className="hover:bg-slate-50">
                              <td className="px-2 py-1.5 font-semibold text-slate-900">{index + 1}</td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.trackNumber}
                                  onChange={(e) => updateEditItem(index, "trackNumber", e.target.value)}
                                  className="w-24 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="00010-2661A0001-1"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.localTracking}
                                  onChange={(e) => updateEditItem(index, "localTracking", e.target.value)}
                                  className="w-20 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => updateEditItem(index, "description", e.target.value)}
                                  className="w-32 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="іграшки"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateEditItem(index, "quantity", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.insuranceValue}
                                  onChange={(e) => updateEditItem(index, "insuranceValue", e.target.value)}
                                  className="w-20 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="1000.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={item.insurancePercent}
                                  onChange={(e) => updateEditItem(index, "insurancePercent", e.target.value)}
                                  className="w-12 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="5"
                                />
                              </td>
                              <td className="px-2 py-1.5 text-center text-[10px] font-semibold text-slate-700">
                                {insuranceCost || "-"}
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.lengthCm}
                                  onChange={(e) => updateEditItem(index, "lengthCm", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="10.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.widthCm}
                                  onChange={(e) => updateEditItem(index, "widthCm", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="50.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.heightCm}
                                  onChange={(e) => updateEditItem(index, "heightCm", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="100.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.001"
                                  value={item.weightKg}
                                  onChange={(e) => updateEditItem(index, "weightKg", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="24.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={item.volumeM3}
                                  onChange={(e) => updateEditItem(index, "volumeM3", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="0.05"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.001"
                                  value={item.density}
                                  onChange={(e) => updateEditItem(index, "density", e.target.value)}
                                  className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="480.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <div className="flex gap-1">
                                  <select
                                    value={item.tariffType}
                                    onChange={(e) => updateEditItem(index, "tariffType", e.target.value)}
                                    className="w-12 rounded border border-slate-300 bg-white px-1 py-0.5 text-[9px] focus:border-teal-500 focus:outline-none"
                                  >
                                    <option value="kg">кг</option>
                                    <option value="m3">м³</option>
                                  </select>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.tariffValue}
                                    onChange={(e) => updateEditItem(index, "tariffValue", e.target.value)}
                                    className="w-16 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                    placeholder="10.00"
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.deliveryCost}
                                  onChange={(e) => updateEditItem(index, "deliveryCost", e.target.value)}
                                  className="w-20 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                  placeholder="240.00"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <div className="flex flex-col gap-1">
                                  <select
                                    value={item.cargoType}
                                    onChange={(e) => updateEditItem(index, "cargoType", e.target.value)}
                                    className="w-full rounded border border-slate-300 bg-white px-1 py-0.5 text-[9px] focus:border-teal-500 focus:outline-none"
                                  >
                                    <option value="">-</option>
                                    {CARGO_TYPES.map((type) => (
                                      <option key={type} value={type}>
                                        {type}
                                      </option>
                                    ))}
                                  </select>
                                  {item.cargoType === "" && (
                                    <input
                                      type="text"
                                      value={item.cargoTypeCustom}
                                      onChange={(e) => updateEditItem(index, "cargoTypeCustom", e.target.value)}
                                      className="w-full rounded border border-slate-300 bg-white px-1 py-0.5 text-[9px] focus:border-teal-500 focus:outline-none"
                                      placeholder="Кастомний тип"
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.note}
                                  onChange={(e) => updateEditItem(index, "note", e.target.value)}
                                  className="w-24 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] focus:border-teal-500 focus:outline-none"
                                />
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeEditItem(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {editingShipmentForm.items.length > 0 && (() => {
                          // Calculate totals
                          const totalPlaces = editingShipmentForm.items.length;
                          let totalInsuranceSum = 0;
                          let totalInsuranceCost = 0;
                          let totalWeight = 0;
                          let totalVolume = 0;
                          let totalDeliveryCost = 0;
                          let totalDensity = 0;
                          let densityCount = 0;

                          editingShipmentForm.items.forEach((item) => {
                            const insuranceValue = parseFloat(item.insuranceValue) || 0;
                            const insurancePercent = parseFloat(item.insurancePercent) || 0;
                            const insuranceCost = (insuranceValue * insurancePercent) / 100;
                            const weight = parseFloat(item.weightKg) || 0;
                            const volume = parseFloat(item.volumeM3) || 0;
                            const deliveryCost = parseFloat(item.deliveryCost) || 0;
                            const density = parseFloat(item.density) || 0;

                            totalInsuranceSum += insuranceValue;
                            totalInsuranceCost += insuranceCost;
                            totalWeight += weight;
                            totalVolume += volume;
                            totalDeliveryCost += deliveryCost;
                            if (density > 0) {
                              totalDensity += density;
                              densityCount++;
                            }
                          });

                          const avgDensity = densityCount > 0 ? totalDensity / densityCount : 0;

                          return (
                            <tr className="bg-slate-100 font-bold">
                              <td colSpan={4} className="px-2 py-2 text-left text-[10px] text-slate-900">
                                Загалом
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalPlaces}
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalInsuranceSum > 0 ? totalInsuranceSum.toFixed(2) : ""}
                              </td>
                              <td className="px-2 py-2"></td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalInsuranceCost > 0 ? totalInsuranceCost.toFixed(2) : ""}
                              </td>
                              <td colSpan={3} className="px-2 py-2"></td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalWeight > 0 ? totalWeight.toFixed(2) : ""}
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalVolume > 0 ? totalVolume.toFixed(2) : ""}
                              </td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {avgDensity > 0 ? avgDensity.toFixed(0) : ""}
                              </td>
                              <td className="px-2 py-2"></td>
                              <td className="px-2 py-2 text-center text-[10px] text-slate-900">
                                {totalDeliveryCost > 0 ? totalDeliveryCost.toFixed(2) : ""}
                              </td>
                              <td colSpan={3} className="px-2 py-2"></td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-xs text-slate-500">
                    Немає місць. Додайте місця для вантажу.
                  </div>
                )}
              </div>
              <div className="md:col-span-3">
                <p className="text-xs text-slate-500">
                  Вартість розраховується автоматично на основі місць, страхування, пакування та локальної доставки
                </p>
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
            
            {/* Status Timeline */}
            {editingShipment.statusHistory && editingShipment.statusHistory.length > 0 && (
              <div className="mt-6">
                <ShipmentTimeline 
                  statusHistory={editingShipment.statusHistory.map(h => ({
                    id: h.id,
                    shipmentId: h.shipmentId,
                    status: h.status as any,
                    location: h.location,
                    description: h.description,
                    createdAt: h.createdAt,
                  }))} 
                  locale="ua"
                />
              </div>
            )}
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

