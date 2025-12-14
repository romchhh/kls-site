"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Trash2,
  ArrowLeft,
  Warehouse,
  Truck,
  CheckCircle,
  Archive,
  Clock,
  Package,
} from "lucide-react";
import { UserEditForm } from "./UserEditForm";
import { UserFinances } from "./UserFinances";
import { UserShipments } from "./UserShipments";
import { Toast } from "./Toast";
import type {
  UserDetailProps,
  User,
  ShipmentRow,
} from "./types/userDetail.types";
import {
  getDeliveryTypeCode,
  formatDateForInput,
} from "./utils/shipmentUtils";

export function UserDetail({ userId }: UserDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [batches, setBatches] = useState<Array<{ id: string; batchId: string; description: string | null; status: string; deliveryType: string }>>([]);
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



  const createInvoiceFromShipmentRef = useRef<((shipment: ShipmentRow) => void) | null>(null);

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


  // Helper function to get status icon and label
  // Note: We keep this local version because it uses icons imported at the top
  const getStatusInfoLocal = (status: string) => {
    switch (status) {
      case "CREATED":
        return {
          icon: Clock,
          label: "Очікується на складі",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          location: "Китай — склад",
        };
      case "RECEIVED_CN":
        return {
          icon: Warehouse,
          label: "Отримано на складі (Китай)",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          location: "Китай — склад",
        };
      case "CONSOLIDATION":
        return {
          icon: Truck,
          label: "Готується до відправлення",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          location: "Дорога",
        };
      case "IN_TRANSIT":
        return {
          icon: Truck,
          label: "В дорозі",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          location: "Дорога",
        };
      case "ARRIVED_UA":
        return {
          icon: Warehouse,
          label: "Доставлено на склад (Україна)",
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          location: "Україна — склад",
        };
      case "ON_UA_WAREHOUSE":
        return {
          icon: Warehouse,
          label: "Готово до видачі",
          color: "text-teal-600",
          bgColor: "bg-teal-50",
          location: "Україна — склад",
        };
      case "DELIVERED":
        return {
          icon: CheckCircle,
          label: "Завершено",
          color: "text-green-600",
          bgColor: "bg-green-50",
          location: "",
        };
      case "ARCHIVED":
        return {
          icon: Archive,
          label: "Архів",
          color: "text-slate-600",
          bgColor: "bg-slate-50",
          location: "",
        };
      default:
        return {
          icon: Package,
          label: status,
          color: "text-slate-600",
          bgColor: "bg-slate-50",
          location: "",
        };
    }
  };

  // Helper function to generate internal track number for shipment
  // Номер замовлення рахується глобально для користувача, а не в партії
  const generateInternalTrack = (batchId: string, clientCode: string, deliveryType: string): string => {
    if (!batchId || batchId.trim() === "" || !clientCode) {
      return "";
    }
    // Count ALL existing shipments for this client (globally), not per batch
    // Use user.clientCode if available, otherwise use provided clientCode
    const currentClientCode = user?.clientCode || clientCode;
    const existingShipmentsForClient = shipments.length;
    
    // Generate internal track: batchId-clientCode-deliveryType-number
    // Format: 00010-2661A0001 (без дефісу перед номером)
    // A = Авіа, S = Море, R = Потяг, M = Мультимодальна
    const deliveryTypeCode = getDeliveryTypeCode(deliveryType);
    const shipmentNumber = String(existingShipmentsForClient + 1).padStart(4, "0");
    return `${batchId}-${currentClientCode}${deliveryTypeCode}${shipmentNumber}`;
  };

  // Helper function to generate track number for item (wrapper for utils function)
  const generateItemTrackNumberLocal = (
    batchId: string,
    clientCode: string,
    deliveryType: string,
    placeNumber: number
  ): string => {
    if (!batchId || batchId.trim() === "" || !clientCode) {
      return "";
    }
    const existingShipmentsInBatch = shipments.filter(
      (s) => s.batchId === batchId
    ).length;
    const internalTrack = generateInternalTrack(batchId, clientCode, deliveryType);
    if (!internalTrack) return "";
    return `${internalTrack}-${placeNumber}`;
  };

  // Helper functions for items
  const addItem = () => {
    if (!user) return;
    
    setShipmentForm((prev) => {
      const placeNumber = prev.items.length + 1;
      // Get deliveryType from batch or use form deliveryType
      const selectedBatch = batches.find(b => b.batchId === prev.batchId);
      const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
      const trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
      
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
      items: prev.items.map((item, i) => {
        if (i !== index) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        // Автоматичний розрахунок м³ при зміні габаритів
        if (field === "lengthCm" || field === "widthCm" || field === "heightCm") {
          const length = parseFloat(updatedItem.lengthCm || "0");
          const width = parseFloat(updatedItem.widthCm || "0");
          const height = parseFloat(updatedItem.heightCm || "0");
          
          if (length > 0 && width > 0 && height > 0) {
            // м³ = довжина * ширина * висота / 1000000
            const volumeM3 = (length * width * height) / 1000000;
            updatedItem.volumeM3 = volumeM3.toFixed(4);
            
            // Автоматичний розрахунок щільності, якщо є вага
            const weight = parseFloat(updatedItem.weightKg || "0");
            if (weight > 0 && volumeM3 > 0) {
              const density = weight / volumeM3;
              updatedItem.density = density.toFixed(2);
            }
          } else {
            updatedItem.volumeM3 = "";
            updatedItem.density = "";
          }
        }
        
        // Автоматичний розрахунок щільності при зміні ваги або м³
        if (field === "weightKg" || field === "volumeM3") {
          const weight = parseFloat(updatedItem.weightKg || "0");
          const volume = parseFloat(updatedItem.volumeM3 || "0");
          
          if (weight > 0 && volume > 0) {
            // щільність = КГ / м³
            const density = weight / volume;
            updatedItem.density = density.toFixed(2);
          } else {
            updatedItem.density = "";
          }
        }
        
        // Автоматичний розрахунок вартості: Тариф * кг/м3 (в залежності від вибору)
        if (field === "tariffType" || field === "tariffValue" || field === "weightKg" || field === "volumeM3" || field === "lengthCm" || field === "widthCm" || field === "heightCm") {
          const tariffValue = parseFloat(updatedItem.tariffValue || "0");
          const weight = parseFloat(updatedItem.weightKg || "0");
          let volume = parseFloat(updatedItem.volumeM3 || "0");
          
          // Якщо змінили габарити, перерахувати об'єм
          if (field === "lengthCm" || field === "widthCm" || field === "heightCm") {
            const length = parseFloat(updatedItem.lengthCm || "0");
            const width = parseFloat(updatedItem.widthCm || "0");
            const height = parseFloat(updatedItem.heightCm || "0");
            if (length > 0 && width > 0 && height > 0) {
              volume = (length * width * height) / 1000000;
            }
          }
          
          if (tariffValue > 0) {
            if (updatedItem.tariffType === "kg" && weight > 0) {
              updatedItem.deliveryCost = (tariffValue * weight).toFixed(2);
            } else if (updatedItem.tariffType === "m3" && volume > 0) {
              updatedItem.deliveryCost = (tariffValue * volume).toFixed(2);
            } else {
              updatedItem.deliveryCost = "";
            }
          } else {
            updatedItem.deliveryCost = "";
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
      const newItems = Array.from({ length: count }, (_, i) => {
        const placeNumber = startIndex + i + 1;
        // Get deliveryType from batch or use form deliveryType
      const selectedBatch = batches.find(b => b.batchId === prev.batchId);
      const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
      const trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
        
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
      } else if (prev.batchId && user.clientCode) {
        // Get deliveryType from batch or use form deliveryType
        const selectedBatch = batches.find(b => b.batchId === prev.batchId);
        const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
        // Generate new track number if internalTrack is not available
        trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
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
      items: prev.items.map((item, i) => {
        if (i !== index) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        // Автоматичний розрахунок м³ при зміні габаритів
        if (field === "lengthCm" || field === "widthCm" || field === "heightCm") {
          const length = parseFloat(updatedItem.lengthCm || "0");
          const width = parseFloat(updatedItem.widthCm || "0");
          const height = parseFloat(updatedItem.heightCm || "0");
          
          if (length > 0 && width > 0 && height > 0) {
            // м³ = довжина * ширина * висота / 1000000
            const volumeM3 = (length * width * height) / 1000000;
            updatedItem.volumeM3 = volumeM3.toFixed(4);
            
            // Автоматичний розрахунок щільності, якщо є вага
            const weight = parseFloat(updatedItem.weightKg || "0");
            if (weight > 0 && volumeM3 > 0) {
              const density = weight / volumeM3;
              updatedItem.density = density.toFixed(2);
            }
          } else {
            updatedItem.volumeM3 = "";
            updatedItem.density = "";
          }
        }
        
        // Автоматичний розрахунок щільності при зміні ваги або м³
        if (field === "weightKg" || field === "volumeM3") {
          const weight = parseFloat(updatedItem.weightKg || "0");
          const volume = parseFloat(updatedItem.volumeM3 || "0");
          
          if (weight > 0 && volume > 0) {
            // щільність = КГ / м³
            const density = weight / volume;
            updatedItem.density = density.toFixed(2);
          } else {
            updatedItem.density = "";
          }
        }
        
        // Автоматичний розрахунок вартості: Тариф * кг/м3 (в залежності від вибору)
        if (field === "tariffType" || field === "tariffValue" || field === "weightKg" || field === "volumeM3" || field === "lengthCm" || field === "widthCm" || field === "heightCm") {
          const tariffValue = parseFloat(updatedItem.tariffValue || "0");
          const weight = parseFloat(updatedItem.weightKg || "0");
          let volume = parseFloat(updatedItem.volumeM3 || "0");
          
          // Якщо змінили габарити, перерахувати об'єм
          if (field === "lengthCm" || field === "widthCm" || field === "heightCm") {
            const length = parseFloat(updatedItem.lengthCm || "0");
            const width = parseFloat(updatedItem.widthCm || "0");
            const height = parseFloat(updatedItem.heightCm || "0");
            if (length > 0 && width > 0 && height > 0) {
              volume = (length * width * height) / 1000000;
            }
          }
          
          if (tariffValue > 0) {
            if (updatedItem.tariffType === "kg" && weight > 0) {
              updatedItem.deliveryCost = (tariffValue * weight).toFixed(2);
            } else if (updatedItem.tariffType === "m3" && volume > 0) {
              updatedItem.deliveryCost = (tariffValue * volume).toFixed(2);
            } else {
              updatedItem.deliveryCost = "";
            }
          } else {
            updatedItem.deliveryCost = "";
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
      // Get deliveryType from batch or use form deliveryType
      const selectedBatch = batches.find(b => b.batchId === prev.batchId);
      const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
      
      const newItems = Array.from({ length: count }, (_, i) => {
        const placeNumber = startIndex + i + 1;
        // For editing, use the existing internalTrack from the shipment
        // Format: 00010-2661A0001-1, 00010-2661A0001-2, etc.
        let trackNumber = "";
        if (prev.internalTrack && prev.internalTrack.trim() !== "") {
          const trackBase = prev.internalTrack.replace(/-(\d+)$/, '$1'); // Remove last dash, keep number
          trackNumber = `${trackBase}-${placeNumber}`;
        } else if (editingShipment.internalTrack) {
          const trackBase = editingShipment.internalTrack.replace(/-(\d+)$/, '$1');
          trackNumber = `${trackBase}-${placeNumber}`;
        } else if (prev.batchId && user.clientCode) {
          // Generate new track number if internalTrack is not available
          trackNumber = generateItemTrackNumberLocal(prev.batchId, user.clientCode, deliveryType, placeNumber);
        }
        
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

  useEffect(() => {
    fetchUser();
    fetchShipments();
    fetchBatches();
  }, [userId]);

  // Обчислюємо internalTrack автоматично при зміні batchId або deliveryType
  const calculatedInternalTrack = useMemo(() => {
    if (!shipmentForm.batchId || !user?.clientCode) return "";
    // Використовуємо deliveryType з форми (якщо встановлено), інакше з батча, інакше "AIR"
    // Пріоритет: shipmentForm.deliveryType > selectedBatch.deliveryType > "AIR"
    const selectedBatch = batches.find(b => b.batchId === shipmentForm.batchId);
    const deliveryType = shipmentForm.deliveryType || selectedBatch?.deliveryType || "AIR";
    return generateInternalTrack(
      shipmentForm.batchId,
      user.clientCode,
      deliveryType
    );
  }, [shipmentForm.batchId, shipmentForm.deliveryType, batches, user?.clientCode]);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/admin/batches");
      if (res.ok) {
        const data = await res.json();
        // Map batches to include only necessary fields
        setBatches(
          (data.batches || []).map((batch: any) => ({
            id: batch.id,
            batchId: batch.batchId,
            description: batch.description,
            status: batch.status || "CREATED",
            deliveryType: batch.deliveryType || "AIR",
          }))
        );
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
        
        // Auto-open edit modal if shipmentId is in URL
        const shipmentId = searchParams.get("shipmentId");
        if (shipmentId && data.shipments) {
          const shipment = data.shipments.find((s: ShipmentRow) => s.id === shipmentId);
          if (shipment) {
            openEditShipment(shipment);
            // Remove shipmentId from URL
            router.replace(`/admin/dashboard/users/${userId}`, { scroll: false });
          }
        }
      }
    } catch {
      // ignore for now
    } finally {
      setLoadingShipments(false);
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

  // formatDateForInput is imported from utils

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

  const handleSavePassword = async (newPassword: string) => {
    if (!user) return;
    
    if (!newPassword || newPassword.trim() === "") {
      setError("Введіть новий пароль");
      return;
    }

    if (newPassword.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Пароль успішно оновлено!");
        // Refresh user data
        await fetchUser();
      } else {
        setError(data.error || "Помилка оновлення паролю");
      }
    } catch (error) {
      setError("Сталася помилка при оновленні паролю");
    }
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
              Код клієнта: {user.clientCode}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Користувач: {user.name}{user.lastName ? ` ${user.lastName}` : ""}{user.middleName ? ` ${user.middleName}` : ""}
            </p>
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

      {/* Toast notifications */}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      {success && (
        <Toast
          message={success}
          type="success"
          onClose={() => setSuccess("")}
        />
      )}

      <div className="p-8 space-y-8">
        <UserEditForm
          user={user}
          onSave={async (data) => {
            setSaving(true);
            setError("");
            setSuccess("");

            try {
              const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              const responseData = await res.json();
              if (!res.ok) {
                setError(responseData.error || "Не вдалося оновити користувача");
                return;
              }
              await fetchUser();
              setSuccess("Користувача оновлено");
            } catch {
              setError("Сталася помилка при оновленні користувача");
            } finally {
              setSaving(false);
            }
          }}
          onSavePassword={handleSavePassword}
          saving={saving}
          error={error}
          success={success}
        />

        {/* Balance and Invoices management */}
        <UserFinances
          userId={userId}
          shipments={shipments}
          error={error}
          success={success}
          onError={setError}
          onSuccess={setSuccess}
          onCreateInvoiceFromShipment={(fn) => {
            createInvoiceFromShipmentRef.current = fn;
          }}
        />

        {/* Shipments management */}
        <UserShipments
          user={user}
          shipments={shipments}
          loadingShipments={loadingShipments}
          batches={batches}
          invoices={[]}
          onError={setError}
          onSuccess={setSuccess}
          onCreateInvoiceFromShipment={createInvoiceFromShipmentRef.current}
          onShipmentsChange={fetchShipments}
        />

      </div>
    </div>
  );
}

