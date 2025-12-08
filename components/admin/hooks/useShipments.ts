import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ShipmentRow, Batch } from "../types/userDetail.types";

export function useShipments(userId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [editingShipment, setEditingShipment] = useState<ShipmentRow | null>(null);
  const [viewingShipment, setViewingShipment] = useState<ShipmentRow | null>(null);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/admin/batches");
      if (res.ok) {
        const data = await res.json();
        setBatches(
          (data.batches || []).map((batch: any) => ({
            id: batch.id,
            batchId: batch.batchId,
            description: batch.description,
            status: batch.status || "FORMING",
            deliveryType: batch.deliveryType || "AIR",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
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
            setEditingShipment(shipment);
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

  useEffect(() => {
    fetchShipments();
    fetchBatches();
  }, [userId]);

  const createShipment = async (shipmentData: any) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipmentData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Не вдалося створити вантаж" };
      }
      await fetchShipments();
      return { success: true };
    } catch {
      return { success: false, error: "Сталася помилка при створенні вантажу" };
    }
  };

  const updateShipment = async (shipmentId: string, shipmentData: any) => {
    try {
      const res = await fetch(`/api/admin/shipments/${shipmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipmentData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Не вдалося оновити вантаж" };
      }
      await fetchShipments();
      return { success: true };
    } catch {
      return { success: false, error: "Сталася помилка при оновленні вантажу" };
    }
  };

  const deleteShipment = async (shipmentId: string) => {
    try {
      const res = await fetch(`/api/admin/shipments/${shipmentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Не вдалося видалити вантаж" };
      }
      await fetchShipments();
      return { success: true };
    } catch {
      return { success: false, error: "Сталася помилка при видаленні вантажу" };
    }
  };

  const openViewShipment = (shipment: ShipmentRow) => {
    setViewingShipment(shipment);
  };

  const openEditShipment = (shipment: ShipmentRow) => {
    setEditingShipment(shipment);
  };

  const closeViewShipment = () => {
    setViewingShipment(null);
  };

  const closeEditShipment = () => {
    setEditingShipment(null);
  };

  return {
    shipments,
    loadingShipments,
    batches,
    editingShipment,
    viewingShipment,
    setEditingShipment,
    setViewingShipment,
    fetchShipments,
    fetchBatches,
    createShipment,
    updateShipment,
    deleteShipment,
    openViewShipment,
    openEditShipment,
    closeViewShipment,
    closeEditShipment,
  };
}

