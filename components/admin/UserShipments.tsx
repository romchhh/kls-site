"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Hash, X, Plus, Loader2, Eye, Edit, Trash2, Upload, FileText,
  Clock, Warehouse, Truck, CheckCircle, Archive, Package,
} from "lucide-react";
import { ShipmentTimeline } from "./ShipmentTimeline";
import type { User, ShipmentRow, Batch, InvoiceRow, ShipmentFormItem } from "./types/userDetail.types";
import { getDeliveryTypeCode, formatDateForInput, CARGO_TYPES } from "./utils/shipmentUtils";
import { calculateETA, getDeliveryDays } from "@/lib/utils/shipmentAutomation";

interface UserShipmentsProps {
  user: User;
  shipments: ShipmentRow[];
  loadingShipments: boolean;
  batches: Batch[];
  invoices: InvoiceRow[];
  onError: (error: string) => void;
  onSuccess: (success: string) => void;
  onCreateInvoiceFromShipment: (shipment: ShipmentRow) => void;
  onShipmentsChange: () => void; // Callback to refresh shipments
}

export function UserShipments({
  user,
  shipments: initialShipments,
  loadingShipments: initialLoading,
  batches: initialBatches,
  invoices,
  onError,
  onSuccess,
  onCreateInvoiceFromShipment,
  onShipmentsChange,
}: UserShipmentsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [shipments, setShipments] = useState<ShipmentRow[]>(initialShipments);
  const [loadingShipments, setLoadingShipments] = useState(initialLoading);
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [displayedShipmentsCount, setDisplayedShipmentsCount] = useState(5);
  
  // Shipment form state
  const [shipmentForm, setShipmentForm] = useState({
    cargoLabel: "",
    status: "CREATED",
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
    items: [] as ShipmentFormItem[],
  });

  const [editingShipment, setEditingShipment] = useState<ShipmentRow | null>(null);
  const [viewingShipment, setViewingShipment] = useState<ShipmentRow | null>(null);
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
    items: [] as ShipmentFormItem[],
  });

  const [isUploadingMainPhotoCreate, setIsUploadingMainPhotoCreate] = useState(false);
  const [isUploadingMainPhotoEdit, setIsUploadingMainPhotoEdit] = useState(false);
  const [isUploadingAdditionalFilesCreate, setIsUploadingAdditionalFilesCreate] = useState(false);
  const [isUploadingAdditionalFilesEdit, setIsUploadingAdditionalFilesEdit] = useState(false);

  // Helper function to get status icon and label
  const getStatusInfoLocal = (status: string) => {
    switch (status) {
      case "CREATED":
        return { icon: Clock, label: "Очікується на складі", color: "text-blue-600", bgColor: "bg-blue-50", location: "" };
      case "RECEIVED_CN":
        return { icon: Warehouse, label: "Отримано на складі (Китай)", color: "text-yellow-600", bgColor: "bg-yellow-50", location: "CN warehouse" };
      case "CONSOLIDATION":
        return { icon: Warehouse, label: "Готується до відправлення", color: "text-yellow-600", bgColor: "bg-yellow-50", location: "CN warehouse" };
      case "IN_TRANSIT":
        return { icon: Truck, label: "В дорозі", color: "text-purple-600", bgColor: "bg-purple-50", location: "In transit" };
      case "ARRIVED_UA":
        return { icon: Warehouse, label: "Доставлено на склад (Україна)", color: "text-indigo-600", bgColor: "bg-indigo-50", location: "UA warehouse" };
      case "ON_UA_WAREHOUSE":
        return { icon: Warehouse, label: "На складі України", color: "text-teal-600", bgColor: "bg-teal-50", location: "UA warehouse" };
      case "DELIVERED":
        return { icon: CheckCircle, label: "Доставлено клієнту", color: "text-green-600", bgColor: "bg-green-50", location: "Delivered" };
      case "ARCHIVED":
        return { icon: Archive, label: "Завершено", color: "text-slate-600", bgColor: "bg-slate-50", location: "" };
      default:
        return { icon: Package, label: status, color: "text-slate-600", bgColor: "bg-slate-50", location: "" };
    }
  };

  // Helper function to generate internal track number
  const generateInternalTrack = (batchId: string, clientCode: string, deliveryType: string): string => {
    if (!batchId || batchId.trim() === "" || !clientCode) return "";
    const existingShipmentsInBatch = shipments.filter((s) => s.batchId === batchId).length;
    const deliveryTypeCode = getDeliveryTypeCode(deliveryType);
    const shipmentNumber = String(existingShipmentsInBatch + 1).padStart(4, "0");
    return `${batchId}-${clientCode}${deliveryTypeCode}${shipmentNumber}`;
  };

  const generateItemTrackNumberLocal = (batchId: string, clientCode: string, deliveryType: string, placeNumber: number): string => {
    if (!batchId || batchId.trim() === "" || !clientCode) return "";
    const internalTrack = generateInternalTrack(batchId, clientCode, deliveryType);
    if (!internalTrack) return "";
    return `${internalTrack}-${placeNumber}`;
  };

  // Calculate internal track
  const calculatedInternalTrack = useMemo(() => {
    if (!shipmentForm.batchId || !user?.clientCode) return "";
    const selectedBatch = batches.find(b => b.batchId === shipmentForm.batchId);
    const deliveryType = shipmentForm.deliveryType || selectedBatch?.deliveryType || "AIR";
    return generateInternalTrack(shipmentForm.batchId, user.clientCode, deliveryType);
  }, [shipmentForm.batchId, shipmentForm.deliveryType, batches, user?.clientCode, shipments]);

  // Fetch functions
  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/admin/batches");
      if (res.ok) {
        const data = await res.json();
        setBatches((data.batches || []).map((batch: any) => ({
          id: batch.id,
          batchId: batch.batchId,
          description: batch.description,
          status: batch.status || "FORMING",
          deliveryType: batch.deliveryType || "AIR",
        })));
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchShipments = async () => {
    setLoadingShipments(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/shipments`);
      const data = await res.json();
      if (res.ok) {
        setShipments(data.shipments || []);
        const shipmentId = searchParams.get("shipmentId");
        if (shipmentId && data.shipments) {
          const shipment = data.shipments.find((s: ShipmentRow) => s.id === shipmentId);
          if (shipment) {
            openEditShipment(shipment);
            router.replace(`/admin/dashboard/users/${user.id}`, { scroll: false });
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setLoadingShipments(false);
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchBatches();
  }, [user.id]);

  // Item management functions
  const addItem = () => {
    if (!user) return;
    setShipmentForm((prev) => {
      const placeNumber = prev.items.length + 1;
      const selectedBatch = batches.find(b => b.batchId === prev.batchId);
      const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
      const trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
      return {
        ...prev,
        items: [...prev.items, {
          trackNumber, localTracking: "", description: "", quantity: "",
          insuranceValue: "", insurancePercent: "", lengthCm: "", widthCm: "", heightCm: "",
          weightKg: "", volumeM3: "", density: "", tariffType: "kg", tariffValue: "",
          deliveryCost: "", cargoType: "", cargoTypeCustom: "", note: "",
        }],
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
      items: prev.items.map((item, i) => {
        if (i !== index) return item;
        const updatedItem = { ...item, [field]: value };
        if (field === "lengthCm" || field === "widthCm" || field === "heightCm") {
          const length = parseFloat(updatedItem.lengthCm || "0");
          const width = parseFloat(updatedItem.widthCm || "0");
          const height = parseFloat(updatedItem.heightCm || "0");
          if (length > 0 && width > 0 && height > 0) {
            const volumeM3 = (length * width * height) / 1000000;
            updatedItem.volumeM3 = volumeM3.toFixed(4);
            const weight = parseFloat(updatedItem.weightKg || "0");
            if (weight > 0 && volumeM3 > 0) {
              updatedItem.density = (weight / volumeM3).toFixed(2);
            }
          } else {
            updatedItem.volumeM3 = "";
            updatedItem.density = "";
          }
        }
        if (field === "weightKg" || field === "volumeM3") {
          const weight = parseFloat(updatedItem.weightKg || "0");
          const volume = parseFloat(updatedItem.volumeM3 || "0");
          if (weight > 0 && volume > 0) {
            updatedItem.density = (weight / volume).toFixed(2);
          } else {
            updatedItem.density = "";
          }
        }
        return updatedItem;
      }),
    }));
  };

  const addMultipleItems = (count: number) => {
    if (!user) return;
    setShipmentForm((prev) => {
      const startIndex = prev.items.length;
      const selectedBatch = batches.find(b => b.batchId === prev.batchId);
      const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
      const newItems = Array.from({ length: count }, (_, i) => {
        const placeNumber = startIndex + i + 1;
        const trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
        return {
          trackNumber, localTracking: "", description: "", quantity: "",
          insuranceValue: "", insurancePercent: "", lengthCm: "", widthCm: "", heightCm: "",
          weightKg: "", volumeM3: "", density: "", tariffType: "kg", tariffValue: "",
          deliveryCost: "", cargoType: "", cargoTypeCustom: "", note: "",
        };
      });
      return { ...prev, items: [...prev.items, ...newItems] };
    });
  };

  // Edit item functions (similar logic)
  const addEditItem = () => {
    if (!user || !editingShipment) return;
    setEditingShipmentForm((prev) => {
      const placeNumber = prev.items.length + 1;
      let trackNumber = "";
      if (prev.internalTrack && prev.internalTrack.trim() !== "") {
        const trackBase = prev.internalTrack.replace(/-(\d+)$/, "$1");
        trackNumber = `${trackBase}-${placeNumber}`;
      } else if (editingShipment.internalTrack) {
        const trackBase = editingShipment.internalTrack.replace(/-(\d+)$/, '$1');
        trackNumber = `${trackBase}-${placeNumber}`;
      } else if (prev.batchId && user.clientCode) {
        const selectedBatch = batches.find(b => b.batchId === prev.batchId);
        const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
        trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
      }
      return {
        ...prev,
        items: [...prev.items, {
          trackNumber, localTracking: "", description: "", quantity: "",
          insuranceValue: "", insurancePercent: "", lengthCm: "", widthCm: "", heightCm: "",
          weightKg: "", volumeM3: "", density: "", tariffType: "kg", tariffValue: "",
          deliveryCost: "", cargoType: "", cargoTypeCustom: "", note: "",
        }],
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
      items: prev.items.map((item, i) => {
        if (i !== index) return item;
        const updatedItem = { ...item, [field]: value };
        if (field === "lengthCm" || field === "widthCm" || field === "heightCm") {
          const length = parseFloat(updatedItem.lengthCm || "0");
          const width = parseFloat(updatedItem.widthCm || "0");
          const height = parseFloat(updatedItem.heightCm || "0");
          if (length > 0 && width > 0 && height > 0) {
            const volumeM3 = (length * width * height) / 1000000;
            updatedItem.volumeM3 = volumeM3.toFixed(4);
            const weight = parseFloat(updatedItem.weightKg || "0");
            if (weight > 0 && volumeM3 > 0) {
              updatedItem.density = (weight / volumeM3).toFixed(2);
            }
          } else {
            updatedItem.volumeM3 = "";
            updatedItem.density = "";
          }
        }
        if (field === "weightKg" || field === "volumeM3") {
          const weight = parseFloat(updatedItem.weightKg || "0");
          const volume = parseFloat(updatedItem.volumeM3 || "0");
          if (weight > 0 && volume > 0) {
            updatedItem.density = (weight / volume).toFixed(2);
          } else {
            updatedItem.density = "";
          }
        }
        return updatedItem;
      }),
    }));
  };

  const addMultipleEditItems = (count: number) => {
    if (!user || !editingShipment) return;
    setEditingShipmentForm((prev) => {
      const startIndex = prev.items.length;
      const newItems = Array.from({ length: count }, (_, i) => {
        const placeNumber = startIndex + i + 1;
        let trackNumber = "";
        if (prev.internalTrack && prev.internalTrack.trim() !== "") {
          const trackBase = prev.internalTrack.replace(/-(\d+)$/, "$1");
          trackNumber = `${trackBase}-${placeNumber}`;
        } else if (editingShipment.internalTrack) {
          const trackBase = editingShipment.internalTrack.replace(/-(\d+)$/, "$1");
          trackNumber = `${trackBase}-${placeNumber}`;
        } else if (prev.batchId && user.clientCode) {
          const selectedBatch = batches.find(b => b.batchId === prev.batchId);
          const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
          trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
        }
        return {
          trackNumber, localTracking: "", description: "", quantity: "",
          insuranceValue: "", insurancePercent: "", lengthCm: "", widthCm: "", heightCm: "",
          weightKg: "", volumeM3: "", density: "", tariffType: "kg", tariffValue: "",
          deliveryCost: "", cargoType: "", cargoTypeCustom: "", note: "",
        };
      });
      return { ...prev, items: [...prev.items, ...newItems] };
    });
  };

  // Handler functions
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onError("");
    onSuccess("");
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
        onError(data.error || "Не вдалося створити вантаж");
        return;
      }
      setShowAddShipment(false);
      setShipmentForm({
        cargoLabel: "", status: "CREATED", location: "", routeFrom: "", routeTo: "",
        deliveryType: "AIR", description: "", mainPhotoUrl: "", receivedAtWarehouse: "",
        sentAt: "", deliveredAt: "", eta: "", deliveryFormat: "", deliveryReference: "",
        packing: false, packingCost: "", localDeliveryToDepot: false, localDeliveryCost: "",
        batchId: "", cargoType: "", cargoTypeCustom: "", additionalFiles: [], items: [],
      });
      await fetchShipments();
      onShipmentsChange();
      onSuccess("Вантаж створено");
    } catch {
      onError("Сталася помилка при створенні вантажу");
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm("Видалити цей вантаж?")) return;
    onError("");
    onSuccess("");
    try {
      const res = await fetch(`/api/admin/shipments/${shipmentId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Не вдалося видалити вантаж");
        return;
      }
      await fetchShipments();
      onShipmentsChange();
      onSuccess("Вантаж видалено");
    } catch {
      onError("Сталася помилка при видаленні вантажу");
    }
  };

  // Автоматизація: Позначити вантаж як "прибув на склад"
  const handleMarkAsReceived = async (shipment: ShipmentRow) => {
    const today = new Date().toISOString().split('T')[0];
    const receivedDate = prompt(
      `Введіть дату отримання на складі (формат: РРРР-ММ-ДД):`,
      today
    );
    
    if (!receivedDate) return;
    
    onError("");
    onSuccess("");
    
    try {
      const res = await fetch(`/api/admin/shipments/${shipment.id}/mark-received`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receivedAtWarehouse: receivedDate }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Не вдалося позначити вантаж як прибув на склад");
        return;
      }
      
      await fetchShipments();
      onShipmentsChange();
      onSuccess("Вантаж позначено як прибув на склад. Статус, місцезнаходження та таймлайн оновлено автоматично.");
    } catch {
      onError("Сталася помилка при оновленні вантажу");
    }
  };

  // Автоматизація: Позначити вантаж як "відправлено"
  const handleMarkAsSent = async (shipment: ShipmentRow) => {
    const today = new Date().toISOString().split('T')[0];
    const sentDate = prompt(
      `Введіть дату відправлення (формат: РРРР-ММ-ДД):`,
      today
    );
    
    if (!sentDate) return;
    
    onError("");
    onSuccess("");
    
    try {
      const res = await fetch(`/api/admin/shipments/${shipment.id}/mark-sent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentAt: sentDate }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Не вдалося позначити вантаж як відправлено");
        return;
      }
      
      await fetchShipments();
      onShipmentsChange();
      const deliveryDays = getDeliveryDays(shipment.deliveryType as any);
      onSuccess(`Вантаж позначено як відправлено. Статус, місцезнаходження, ETA (+${deliveryDays} днів) та таймлайн оновлено автоматично.`);
    } catch {
      onError("Сталася помилка при оновленні вантажу");
    }
  };

  const openViewShipment = (shipment: ShipmentRow) => {
    setViewingShipment(shipment);
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
      items: shipment.items ? shipment.items.map((item) => ({
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
      })) : [],
    });
  };

  const handleUpdateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;
    onError("");
    onSuccess("");
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
          mainPhotoUrl: editingShipmentForm.mainPhotoUrl || null,
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
        onError(data.error || "Не вдалося оновити вантаж");
        return;
      }
      setEditingShipment(null);
      await fetchShipments();
      onShipmentsChange();
      onSuccess("Вантаж оновлено");
    } catch {
      onError("Сталася помилка при оновленні вантажу");
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
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Не вдалося завантажити фото");
        return;
      }
      if (mode === "create") {
        setShipmentForm((prev) => ({ ...prev, mainPhotoUrl: data.url }));
      } else {
        setEditingShipmentForm((prev) => ({ ...prev, mainPhotoUrl: data.url }));
      }
      onSuccess("Фото завантажено");
    } catch {
      onError("Сталася помилка при завантаженні фото");
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
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Не вдалося завантажити файл");
        return;
      }
      if (mode === "create") {
        setShipmentForm((prev) => ({ ...prev, additionalFiles: [...prev.additionalFiles, data.url] }));
      } else {
        setEditingShipmentForm((prev) => ({ ...prev, additionalFiles: [...prev.additionalFiles, data.url] }));
      }
      onSuccess("Файл завантажено");
    } catch {
      onError("Сталася помилка при завантаженні файлу");
    } finally {
      if (mode === "create") {
        setIsUploadingAdditionalFilesCreate(false);
      } else {
        setIsUploadingAdditionalFilesEdit(false);
      }
    }
  };

  // Now add the JSX from the extracted section
  return (
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
                    const selectedBatchId = e.target.value;
                    const selectedBatch = batches.find(b => b.batchId === selectedBatchId);
                    setShipmentForm({ 
                      ...shipmentForm, 
                      batchId: selectedBatchId,
                      // Автоматично встановлюємо deliveryType з батча
                      deliveryType: selectedBatch?.deliveryType || shipmentForm.deliveryType || "AIR"
                    });
                  }}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Оберіть партію</option>
                  {batches
                    .filter((batch) => batch.status === "FORMING")
                    .map((batch) => (
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
                  value={calculatedInternalTrack}
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-mono text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Оберіть партію та тип вантажу"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Формат: ID_партії-Код_клієнтаТипНомер (Тип: Авіа=A, Море=S, Потяг=R, Мультимодал=M)
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
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={shipmentForm.receivedAtWarehouse}
                    onChange={(e) => {
                      const receivedDate = e.target.value;
                      // Автоматично встановлюємо статус та місцезнаходження
                      if (receivedDate) {
                        const statusInfo = getStatusInfoLocal("RECEIVED_CN");
                        setShipmentForm({
                          ...shipmentForm,
                          receivedAtWarehouse: receivedDate,
                          status: "RECEIVED_CN",
                          location: statusInfo.location,
                        });
                      } else {
                        setShipmentForm({
                          ...shipmentForm,
                          receivedAtWarehouse: receivedDate,
                        });
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Після встановлення автоматично встановлюється статус "Отримано на складі" та місцезнаходження
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
                    let etaDate = "";
                    
                    if (sentDate) {
                      const sent = new Date(sentDate);
                      // Використовуємо утиліту для розрахунку ETA
                      const eta = calculateETA(sent, shipmentForm.deliveryType as any);
                      etaDate = eta.toISOString().split('T')[0];
                    }
                    
                    setShipmentForm({
                      ...shipmentForm,
                      sentAt: sentDate,
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
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    const statusInfo = getStatusInfoLocal(newStatus);
                    setShipmentForm({
                      ...shipmentForm,
                      status: newStatus,
                      // Автоматично встановлюємо location при зміні статусу
                      location: statusInfo.location || shipmentForm.location,
                    });
                  }}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Оберіть статус</option>
                  {["CREATED", "RECEIVED_CN", "CONSOLIDATION", "IN_TRANSIT", "ARRIVED_UA", "ON_UA_WAREHOUSE", "DELIVERED", "ARCHIVED"].map((status) => {
                    const statusInfo = getStatusInfoLocal(status);
                    return (
                      <option key={status} value={status}>
                        {statusInfo.label}
                      </option>
                    );
                  })}
                </select>
                {shipmentForm.status && (
                  <div className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 ${getStatusInfoLocal(shipmentForm.status).bgColor}`}>
                    {(() => {
                      const statusInfo = getStatusInfoLocal(shipmentForm.status);
                      const Icon = statusInfo.icon;
                      return <Icon className={`h-4 w-4 ${statusInfo.color}`} />;
                    })()}
                    <span className={`text-xs font-semibold ${getStatusInfoLocal(shipmentForm.status).color}`}>
                      {getStatusInfoLocal(shipmentForm.status).label}
                    </span>
                  </div>
                )}
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
                  Після встановлення автоматично встановлюється статус "В дорозі", місцезнаходження та ETA
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
                  Автоматично розраховується: дата відправлено + {getDeliveryDays(shipmentForm.deliveryType as any)} днів ({shipmentForm.deliveryType === "AIR" ? "Авіа" : shipmentForm.deliveryType === "SEA" ? "Море" : shipmentForm.deliveryType === "RAIL" ? "Залізниця" : "Мультимодал"}) (можна встановити вручну)
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
                  {/* Show main photo if exists */}
                  {shipmentForm.mainPhotoUrl && (
                    <div className="mt-3">
                      <div className="mb-2 text-[11px] font-semibold text-slate-700">
                        Головне фото:
                      </div>
                      <div className="relative inline-block group">
                        <img
                          src={shipmentForm.mainPhotoUrl}
                          alt="Головне фото"
                          className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                          onError={(e) => {
                            console.error("Error loading image:", shipmentForm.mainPhotoUrl);
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShipmentForm((prev) => ({
                              ...prev,
                              mainPhotoUrl: "",
                            }));
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
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
                              onError={(e) => {
                                console.error("Error loading image:", url);
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
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
                                  type="text"
                                  value={item.volumeM3}
                                  readOnly
                                  className="w-16 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px] cursor-not-allowed"
                                  placeholder="0.05"
                                  title="Розраховується автоматично: довжина × ширина × висота / 1000000"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.density}
                                  readOnly
                                  className="w-16 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px] cursor-not-allowed"
                                  placeholder="480.00"
                                  title="Розраховується автоматично: КГ / м³"
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
                              <td colSpan={4} className="px-2 py-2 text-center text-[10px] text-slate-900">
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

      <div 
        className="overflow-x-auto rounded-lg border border-slate-200" 
            style={{ 
              overflowX: 'auto',
              overflowY: 'visible',
              scrollbarWidth: 'thin', 
              scrollbarColor: '#cbd5e1 #f1f5f9', 
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <table className="text-xs w-full" style={{ minWidth: '1400px', tableLayout: 'auto' }}>
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">ID</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Вантаж</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Напрям</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Тип</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Статус</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Місцезнаходження</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Маркування</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Місця</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">КГ</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">M³</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Щільність</th>
                  <th className="px-2 py-1.5 text-left whitespace-nowrap">Вартість</th>
                  <th className="px-2 py-1.5 text-right whitespace-nowrap">Дії</th>
                </tr>
              </thead>
              <tbody>
                {loadingShipments ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="px-3 py-6 text-center text-slate-500"
                    >
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      Завантаження вантажів...
                    </td>
                  </tr>
                ) : shipments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="px-3 py-6 text-center text-slate-500"
                    >
                      Вантажів для цього користувача поки немає
                    </td>
                  </tr>
                ) : (
                  shipments.slice(0, displayedShipmentsCount).map((s) => {
                    const totalWeight = s.items?.reduce((sum, item) => sum + (parseFloat(item.weightKg || "0") || 0), 0) || 0;
                    const totalVolume = s.items?.reduce((sum, item) => sum + (parseFloat(item.volumeM3 || "0") || 0), 0) || 0;
                    const density = totalWeight > 0 && totalVolume > 0 ? (totalWeight / totalVolume).toFixed(2) : "-";
                    const deliveryTypeLabel = s.deliveryType === "AIR" ? "Авіа" :
                                             s.deliveryType === "SEA" ? "Море" :
                                             s.deliveryType === "RAIL" ? "Залізниця" :
                                             s.deliveryType === "MULTIMODAL" ? "Мультимодал" :
                                             s.deliveryType || "-";
                    const route = s.routeFrom && s.routeTo ? `${s.routeFrom} → ${s.routeTo}` : 
                                 s.routeFrom || s.routeTo || "-";
                    return (
                    <tr key={s.id} id={`shipment-${s.id}`} className="border-t border-slate-100">
                      <td className="px-2 py-1.5 font-semibold text-slate-900 whitespace-nowrap text-[11px]">
                        {s.internalTrack}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-[10px] text-slate-700 whitespace-nowrap">
                        {s.internalTrack}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {route}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {deliveryTypeLabel}
                      </td>
                      <td className="px-2 py-1.5 whitespace-nowrap">
                        {(() => {
                          const statusInfo = getStatusInfoLocal(s.status);
                          const Icon = statusInfo.icon;
                          return (
                            <div className="flex items-center gap-1.5">
                              <Icon className={`h-3.5 w-3.5 ${statusInfo.color}`} />
                              <span className={`text-[10px] font-semibold ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {s.location || "-"}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {s.cargoLabel || "-"}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {s.pieces || "-"}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {totalWeight > 0 ? `${totalWeight.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {totalVolume > 0 ? `${totalVolume.toFixed(4)}` : "-"}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-slate-700 whitespace-nowrap">
                        {density}
                      </td>
                      <td className="px-2 py-1.5 text-[10px] font-semibold text-slate-900 whitespace-nowrap">
                        {s.totalCost ? `${s.totalCost} $` : "-"}
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="grid grid-cols-2 gap-1 w-48">
                          {!s.receivedAtWarehouse && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsReceived(s)}
                              className="inline-flex items-center justify-center gap-0.5 rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700 hover:bg-green-100"
                              title="Позначити як прибув на склад"
                            >
                              <Warehouse className="h-2.5 w-2.5" />
                              Прибув
                            </button>
                          )}
                          {s.receivedAtWarehouse && !s.sentAt && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsSent(s)}
                              className="inline-flex items-center justify-center gap-0.5 rounded-lg border border-purple-200 bg-purple-50 px-2 py-1 text-[10px] font-semibold text-purple-700 hover:bg-purple-100"
                              title="Позначити як відправлено"
                            >
                              <Truck className="h-2.5 w-2.5" />
                              Відправлено
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (s && s.internalTrack) {
                                onCreateInvoiceFromShipment(s);
                              }
                            }}
                            className="inline-flex items-center justify-center gap-0.5 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-100"
                            title="Створити рахунок"
                          >
                            Рахунок
                          </button>
                          <button
                            type="button"
                            onClick={() => openViewShipment(s)}
                            className="inline-flex items-center justify-center gap-0.5 rounded-lg border border-teal-200 bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-700 hover:bg-teal-100"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            Переглянути
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditShipment(s)}
                            className="inline-flex items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Редагувати
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteShipment(s.id)}
                            className="inline-flex items-center justify-center gap-0.5 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
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
      
      {shipments.length > displayedShipmentsCount && (
        <div className="mt-4 flex justify-center border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setDisplayedShipmentsCount(prev => prev + 5)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
          >
            Показати ще ({shipments.length - displayedShipmentsCount} залишилось)
          </button>
        </div>
      )}

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
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    const statusInfo = getStatusInfoLocal(newStatus);
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      status: newStatus,
                      // Автоматично встановлюємо location при зміні статусу
                      location: statusInfo.location || editingShipmentForm.location,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Без змін</option>
                  {["CREATED", "RECEIVED_CN", "CONSOLIDATION", "IN_TRANSIT", "ARRIVED_UA", "ON_UA_WAREHOUSE", "DELIVERED", "ARCHIVED"].map((status) => {
                    const statusInfo = getStatusInfoLocal(status);
                    return (
                      <option key={status} value={status}>
                        {statusInfo.label}
                      </option>
                    );
                  })}
                </select>
                {editingShipmentForm.status && (
                  <div className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 ${getStatusInfoLocal(editingShipmentForm.status).bgColor}`}>
                    {(() => {
                      const statusInfo = getStatusInfoLocal(editingShipmentForm.status);
                      const Icon = statusInfo.icon;
                      return <Icon className={`h-4 w-4 ${statusInfo.color}`} />;
                    })()}
                    <span className={`text-xs font-semibold ${getStatusInfoLocal(editingShipmentForm.status).color}`}>
                      {getStatusInfoLocal(editingShipmentForm.status).label}
                    </span>
                  </div>
                )}
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
                  {batches
                    .filter((batch) => batch.status === "FORMING")
                    .map((batch) => (
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
                  onChange={(e) => {
                    const receivedDate = e.target.value;
                    // Автоматично встановлюємо статус та місцезнаходження
                    if (receivedDate) {
                      const statusInfo = getStatusInfoLocal("RECEIVED_CN");
                      setEditingShipmentForm({
                        ...editingShipmentForm,
                        receivedAtWarehouse: receivedDate,
                        status: editingShipmentForm.status || "RECEIVED_CN",
                        location: statusInfo.location || editingShipmentForm.location,
                      });
                    } else {
                      setEditingShipmentForm({
                        ...editingShipmentForm,
                        receivedAtWarehouse: receivedDate,
                      });
                    }
                  }}
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
                    let etaDate = editingShipmentForm.eta;
                    
                    if (sentDate) {
                      const sent = new Date(sentDate);
                      // Використовуємо утиліту для розрахунку ETA
                      const eta = calculateETA(sent, editingShipmentForm.deliveryType as any);
                      etaDate = eta.toISOString().split('T')[0];
                    }
                    
                    setEditingShipmentForm({
                      ...editingShipmentForm,
                      sentAt: sentDate,
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
                                  type="text"
                                  value={item.volumeM3}
                                  readOnly
                                  className="w-16 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px] cursor-not-allowed"
                                  placeholder="0.05"
                                  title="Розраховується автоматично: довжина × ширина × висота / 1000000"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item.density}
                                  readOnly
                                  className="w-16 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px] cursor-not-allowed"
                                  placeholder="480.00"
                                  title="Розраховується автоматично: КГ / м³"
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
                              <td colSpan={4} className="px-2 py-2 text-center text-[10px] text-slate-900">
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

      {/* Invoice Warning Modal removed - belongs to UserFinances component */}

      {/* View Shipment Modal */}
      {viewingShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Перегляд вантажу {viewingShipment.internalTrack}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingShipment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Внутрішній трек
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.internalTrack}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маркування
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.cargoLabel || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Статус
                </label>
                {(() => {
                  const statusInfo = getStatusInfoLocal(viewingShipment.status);
                  const Icon = statusInfo.icon;
                  return (
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${statusInfo.bgColor}`}>
                      <Icon className={`h-4 w-4 ${statusInfo.color}`} />
                      <span className={`text-sm font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                })()}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Місцезнаходження
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.location || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маршрут: З
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.routeFrom || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Маршрут: В
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.routeTo || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тип доставки
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingShipment.deliveryType === "AIR" ? "Авіа" :
                   viewingShipment.deliveryType === "SEA" ? "Море" :
                   viewingShipment.deliveryType === "RAIL" ? "Залізниця" :
                   viewingShipment.deliveryType === "MULTIMODAL" ? "Мультимодал" :
                   viewingShipment.deliveryType || "-"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Тип вантажу
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.cargoType || viewingShipment.cargoTypeCustom || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  ID партії
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingShipment.batchId ? batches.find(b => b.batchId === viewingShipment.batchId)?.batchId || viewingShipment.batchId : "-"}
                </p>
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Опис
                </label>
                <p className="text-sm text-slate-900">{viewingShipment.description || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Пакування, $
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.packingCost || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Локальна доставка, $
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.localDeliveryCost || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Вартість (загальна), $
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.totalCost || "-"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата отримано на складі
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingShipment.receivedAtWarehouse ? new Date(viewingShipment.receivedAtWarehouse).toLocaleDateString("uk-UA") : "-"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата відправлено
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingShipment.sentAt ? new Date(viewingShipment.sentAt).toLocaleDateString("uk-UA") : "-"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Дата доставлено
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingShipment.deliveredAt ? new Date(viewingShipment.deliveredAt).toLocaleDateString("uk-UA") : "-"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  ETA (орієнтовна дата прибуття)
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingShipment.eta ? new Date(viewingShipment.eta).toLocaleDateString("uk-UA") : "-"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Формат видачі
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {viewingShipment.deliveryFormat === "NOVA_POSHTA" ? "Нова Пошта" :
                   viewingShipment.deliveryFormat === "SELF_PICKUP" ? "Самовивіз" :
                   viewingShipment.deliveryFormat === "CARGO" ? "Грузоперевізник" :
                   viewingShipment.deliveryFormat || "-"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Номер накладної / коментар
                </label>
                <p className="text-sm font-semibold text-slate-900">{viewingShipment.deliveryReference || "-"}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded border-2 ${viewingShipment.packing ? "border-teal-600 bg-teal-600" : "border-slate-300"}`}>
                  {viewingShipment.packing && <div className="h-full w-full rounded bg-teal-600" />}
                </div>
                <label className="text-xs font-semibold text-slate-700">Пакування</label>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded border-2 ${viewingShipment.localDeliveryToDepot ? "border-teal-600 bg-teal-600" : "border-slate-300"}`}>
                  {viewingShipment.localDeliveryToDepot && <div className="h-full w-full rounded bg-teal-600" />}
                </div>
                <label className="text-xs font-semibold text-slate-700">Локальна доставка до складу</label>
              </div>
              {viewingShipment.mainPhotoUrl && (
                <div className="md:col-span-3">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Головне фото
                  </label>
                  <img
                    src={viewingShipment.mainPhotoUrl}
                    alt="Головне фото вантажу"
                    className="max-w-md rounded-lg border border-slate-200"
                  />
                </div>
              )}
              {viewingShipment.additionalFilesUrls && (() => {
                try {
                  const files = JSON.parse(viewingShipment.additionalFilesUrls);
                  if (files && files.length > 0) {
                    return (
                      <div className="md:col-span-3">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                          Додаткові файли ({files.length})
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {files.map((url: string, idx: number) => (
                            <div key={idx} className="relative">
                              {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img
                                  src={url}
                                  alt={`Фото ${idx + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-slate-200"
                                />
                              ) : (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-center h-24 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:bg-slate-100"
                                >
                                  {url.split('/').pop()}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                } catch (e) {
                  return null;
                }
                return null;
              })()}
              {viewingShipment.items && viewingShipment.items.length > 0 && (
                <div className="md:col-span-3">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Місця вантажу ({viewingShipment.items.length})
                  </label>
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewingShipment.items.map((item, idx) => {
                          // Автоматичний розрахунок м³ та щільності
                          const length = parseFloat(String(item.lengthCm || "0"));
                          const width = parseFloat(String(item.widthCm || "0"));
                          const height = parseFloat(String(item.heightCm || "0"));
                          const weight = parseFloat(String(item.weightKg || "0"));
                          
                          let calculatedVolumeM3 = item.volumeM3;
                          let calculatedDensity = item.density;
                          
                          if (length > 0 && width > 0 && height > 0) {
                            calculatedVolumeM3 = ((length * width * height) / 1000000).toFixed(4);
                            if (weight > 0 && parseFloat(calculatedVolumeM3) > 0) {
                              calculatedDensity = (weight / parseFloat(calculatedVolumeM3)).toFixed(2);
                            }
                          }
                          
                          const insuranceCost = item.insuranceValue && item.insurancePercent
                            ? (parseFloat(String(item.insuranceValue || "0")) * parseFloat(String(item.insurancePercent || "0")) / 100).toFixed(2)
                            : "-";
                          return (
                            <tr key={item.id || idx} className="hover:bg-slate-50">
                              <td className="px-2 py-1.5 font-semibold text-slate-900">{item.placeNumber ? String(item.placeNumber) : String(idx + 1)}</td>
                              <td className="px-2 py-1.5 font-mono text-[10px]">{item.trackNumber || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{item.localTracking || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{item.description || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{item.quantity || "-"}</td>
                              <td className="px-2 py-1.5 text-center text-[10px]">{item.insuranceValue || "-"}</td>
                              <td className="px-2 py-1.5 text-center text-[10px]">{item.insurancePercent ? `${item.insurancePercent}%` : "-"}</td>
                              <td className="px-2 py-1.5 text-center text-[10px] font-semibold text-slate-700">{insuranceCost}</td>
                              <td className="px-2 py-1.5 text-center text-[10px]">{item.lengthCm || "-"}</td>
                              <td className="px-2 py-1.5 text-center text-[10px]">{item.widthCm || "-"}</td>
                              <td className="px-2 py-1.5 text-center text-[10px]">{item.heightCm || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{item.weightKg || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{calculatedVolumeM3 || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{calculatedDensity || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">
                                {item.tariffType && item.tariffValue 
                                  ? `${item.tariffType} ${item.tariffValue}` 
                                  : "-"}
                              </td>
                              <td className="px-2 py-1.5 text-[10px]">{item.deliveryCost || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{item.cargoType || item.cargoTypeCustom || "-"}</td>
                              <td className="px-2 py-1.5 text-[10px]">{item.note || "-"}</td>
                            </tr>
                          );
                        })}
                        {viewingShipment.items.length > 0 && (() => {
                          // Calculate totals
                          const totalPlaces = viewingShipment.items.length;
                          let totalInsuranceSum = 0;
                          let totalInsuranceCost = 0;
                          let totalWeight = 0;
                          let totalVolume = 0;
                          let totalDeliveryCost = 0;
                          let totalDensity = 0;
                          let densityCount = 0;

                          viewingShipment.items.forEach((item) => {
                            const insuranceValue = parseFloat(String(item.insuranceValue || "0")) || 0;
                            const insurancePercent = parseFloat(String(item.insurancePercent || "0")) || 0;
                            const insuranceCost = (insuranceValue * insurancePercent) / 100;
                            const weight = parseFloat(String(item.weightKg || "0")) || 0;
                            const length = parseFloat(String(item.lengthCm || "0"));
                            const width = parseFloat(String(item.widthCm || "0"));
                            const height = parseFloat(String(item.heightCm || "0"));
                            let volume = parseFloat(String(item.volumeM3 || "0"));
                            
                            // Розрахувати м³ якщо є габарити
                            if (length > 0 && width > 0 && height > 0 && volume === 0) {
                              volume = (length * width * height) / 1000000;
                            }
                            
                            const deliveryCost = parseFloat(String(item.deliveryCost || "0")) || 0;
                            let density = parseFloat(String(item.density || "0"));
                            
                            // Розрахувати щільність якщо є вага та м³
                            if (weight > 0 && volume > 0 && density === 0) {
                              density = weight / volume;
                            }

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
                              <td colSpan={4} className="px-2 py-2 text-center text-[10px] text-slate-900">
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
                                {totalVolume > 0 ? totalVolume.toFixed(4) : ""}
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
              )}
              {viewingShipment.statusHistory && viewingShipment.statusHistory.length > 0 && (
                <div className="md:col-span-3">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Історія статусів
                  </label>
                  <ShipmentTimeline 
                    statusHistory={viewingShipment.statusHistory as any} 
                    locale="ua" 
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewingShipment(null);
                  openEditShipment(viewingShipment);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100"
              >
                Редагувати
              </button>
              <button
                type="button"
                onClick={() => setViewingShipment(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
