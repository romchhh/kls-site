import { useMemo } from "react";
import type { ShipmentFormItem, ShipmentForm, Batch } from "../types/userDetail.types";
import { generateItemTrackNumber as generateItemTrackNumberUtil } from "../utils/shipmentUtils";

interface UseShipmentItemsProps {
  user: { clientCode: string } | null;
  batches: Batch[];
  shipments?: Array<{ batchId: string | null }>;
  shipmentForm: ShipmentForm;
  setShipmentForm: React.Dispatch<React.SetStateAction<ShipmentForm>>;
  editingShipment?: { internalTrack: string } | null;
  editingShipmentForm?: ShipmentForm & { internalTrack: string };
  setEditingShipmentForm?: React.Dispatch<React.SetStateAction<ShipmentForm & { internalTrack: string }>>;
}

export function useShipmentItems({
  user,
  batches,
  shipments = [],
  shipmentForm,
  setShipmentForm,
  editingShipment,
  editingShipmentForm,
  setEditingShipmentForm,
}: UseShipmentItemsProps) {
  const getExistingShipmentsInBatch = (batchId: string): number => {
    return shipments.filter((s) => s.batchId === batchId).length;
  };

  const generateItemTrackNumber = (
    batchId: string,
    clientCode: string,
    deliveryType: string,
    placeNumber: number
  ): string => {
    if (!batchId || batchId.trim() === "" || !clientCode) {
      return "";
    }
    const existingShipmentsInBatch = getExistingShipmentsInBatch(batchId);
    return generateItemTrackNumberUtil(
      batchId,
      clientCode,
      deliveryType,
      placeNumber,
      existingShipmentsInBatch
    );
  };

  const addItem = () => {
    if (!user) return;
    
    setShipmentForm((prev) => {
      const placeNumber = prev.items.length + 1;
      const selectedBatch = batches.find(b => b.batchId === prev.batchId);
      const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
      const trackNumber = generateItemTrackNumber(
        prev.batchId,
        user.clientCode,
        deliveryType,
        placeNumber
      );
      
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
            const volumeM3 = (length * width * height) / 1000000;
            updatedItem.volumeM3 = volumeM3.toFixed(4);
            
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
            const density = weight / volume;
            updatedItem.density = density.toFixed(2);
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
        const trackNumber = generateItemTrackNumber(
          prev.batchId,
          user.clientCode,
          deliveryType,
          placeNumber
        );
        
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

  // Edit item functions
  const addEditItem = () => {
    if (!user || !editingShipment || !editingShipmentForm || !setEditingShipmentForm) return;
    
    setEditingShipmentForm((prev) => {
      const placeNumber = prev.items.length + 1;
      let trackNumber = "";
      if (prev.internalTrack && prev.internalTrack.trim() !== "") {
        const trackBase = prev.internalTrack.replace(/-(\d+)$/, '$1');
        trackNumber = `${trackBase}-${placeNumber}`;
      } else if (editingShipment.internalTrack) {
        const trackBase = editingShipment.internalTrack.replace(/-(\d+)$/, '$1');
        trackNumber = `${trackBase}-${placeNumber}`;
      } else if (prev.batchId && user.clientCode) {
        const selectedBatch = batches.find(b => b.batchId === prev.batchId);
        const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
        trackNumber = generateItemTrackNumber(
          prev.batchId,
          user.clientCode,
          deliveryType,
          placeNumber
        );
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
    if (!setEditingShipmentForm) return;
    setEditingShipmentForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateEditItem = (index: number, field: string, value: string) => {
    if (!setEditingShipmentForm) return;
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
              const density = weight / volumeM3;
              updatedItem.density = density.toFixed(2);
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
            const density = weight / volume;
            updatedItem.density = density.toFixed(2);
          } else {
            updatedItem.density = "";
          }
        }
        
        return updatedItem;
      }),
    }));
  };

  const addMultipleEditItems = (count: number) => {
    if (!user || !editingShipment || !editingShipmentForm || !setEditingShipmentForm) return;
    
    setEditingShipmentForm((prev) => {
      const startIndex = prev.items.length;
      const selectedBatch = batches.find(b => b.batchId === prev.batchId);
      const deliveryType = selectedBatch?.deliveryType || prev.deliveryType || "AIR";
      
      const newItems = Array.from({ length: count }, (_, i) => {
        const placeNumber = startIndex + i + 1;
        let trackNumber = "";
        if (prev.internalTrack && prev.internalTrack.trim() !== "") {
          const trackBase = prev.internalTrack.replace(/-(\d+)$/, '$1');
          trackNumber = `${trackBase}-${placeNumber}`;
        } else if (editingShipment.internalTrack) {
          const trackBase = editingShipment.internalTrack.replace(/-(\d+)$/, '$1');
          trackNumber = `${trackBase}-${placeNumber}`;
        } else if (prev.batchId && user.clientCode) {
          trackNumber = generateItemTrackNumber(
            prev.batchId,
            user.clientCode,
            deliveryType,
            placeNumber
          );
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

  return {
    addItem,
    removeItem,
    updateItem,
    addMultipleItems,
    addEditItem,
    removeEditItem,
    updateEditItem,
    addMultipleEditItems,
  };
}

