"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Edit2, Save, X, Loader2, CheckCircle, AlertCircle, Search, Warehouse, Truck } from "lucide-react";
import { getDeliveryDays } from "@/lib/utils/shipmentAutomation";
import Link from "next/link";

interface Shipment {
  id: string;
  internalTrack: string;
  status: string;
  clientCode: string;
  cargoLabel: string | null;
  createdAt: string;
  userId?: string;
  receivedAtWarehouse?: string | null;
  sentAt?: string | null;
  routeFrom?: string | null;
}

interface Batch {
  id: string;
  batchId: string;
  description: string | null;
  deliveryType: "AIR" | "SEA" | "RAIL" | "MULTIMODAL";
  status: "FORMING" | "FORMED";
  createdAt: string;
  shipments: Shipment[];
}

export function BatchManagement() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [newBatchId, setNewBatchId] = useState("");
  const [newBatchDescription, setNewBatchDescription] = useState("");
  const [newBatchDeliveryType, setNewBatchDeliveryType] = useState<"AIR" | "SEA" | "RAIL" | "MULTIMODAL">("AIR");
  const [newBatchStatus, setNewBatchStatus] = useState<"FORMING" | "FORMED">("FORMING");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState<Batch | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loadingNextId, setLoadingNextId] = useState(false);
  const [availableShipments, setAvailableShipments] = useState<any[]>([]);
  const [loadingAvailableShipments, setLoadingAvailableShipments] = useState(false);
  const [showAddShipmentModal, setShowAddShipmentModal] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState("");
  const [addingShipment, setAddingShipment] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  // Load next batch ID when create form is opened
  useEffect(() => {
    if (showCreateForm) {
      fetchNextBatchId();
    }
  }, [showCreateForm]);

  const fetchNextBatchId = async () => {
    setLoadingNextId(true);
    try {
      const res = await fetch("/api/admin/batches/next-id");
      if (res.ok) {
        const data = await res.json();
        setNewBatchId(data.nextBatchId || "");
      }
    } catch (error) {
      console.error("Error fetching next batch ID:", error);
    } finally {
      setLoadingNextId(false);
    }
  };

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/batches");
      if (res.ok) {
        const data = await res.json();
        setBatches(data.batches || []);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      setMessage({ type: "error", text: "Помилка завантаження партій" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: newBatchDescription || null,
          deliveryType: newBatchDeliveryType,
          status: newBatchStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Партія успішно створена" });
        setNewBatchId("");
        setNewBatchDescription("");
        setNewBatchDeliveryType("AIR");
        setShowCreateForm(false);
        fetchBatches();
      } else {
        setMessage({ type: "error", text: data.error || "Помилка створення партії" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка створення партії" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/batches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBatch.id,
          description: newBatchDescription || null,
          deliveryType: newBatchDeliveryType,
          status: newBatchStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Партія успішно оновлена" });
        setEditingBatch(null);
        setNewBatchId("");
        setNewBatchDescription("");
        setNewBatchDeliveryType("AIR");
        fetchBatches();
      } else {
        setMessage({ type: "error", text: data.error || "Помилка оновлення партії" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка оновлення партії" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBatch = async (batchId: string, batchDisplayId: string) => {
    if (!confirm(`Видалити партію "${batchDisplayId}"?`)) return;

    try {
      const res = await fetch(`/api/admin/batches?id=${batchId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Партія успішно видалена" });
        fetchBatches();
      } else {
        setMessage({ type: "error", text: data.error || "Помилка видалення партії" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка видалення партії" });
    }
  };

  const handleUpdateBatchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showStatusUpdateModal || !newStatus) return;

    setUpdatingStatus(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/batches/${showStatusUpdateModal.id}/update-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          location: newLocation || null,
          description: `Масове оновлення статусу для партії ${showStatusUpdateModal.batchId}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: `Статус оновлено для ${data.updatedCount} вантажів` });
        setShowStatusUpdateModal(null);
        setNewStatus("");
        setNewLocation("");
        fetchBatches();
      } else {
        setMessage({ type: "error", text: data.error || "Помилка оновлення статусу" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка оновлення статусу" });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Автоматизація: Позначити всі вантажі в партії як "прибули на склад"
  const handleMarkBatchAsReceived = async (batch: Batch) => {
    const today = new Date().toISOString().split('T')[0];
    const receivedDate = prompt(
      `Введіть дату отримання на складі для всіх вантажів партії ${batch.batchId} (формат: РРРР-ММ-ДД):`,
      today
    );
    
    if (!receivedDate) return;
    
    setUpdatingStatus(true);
    setMessage(null);
    
    try {
      const res = await fetch(`/api/admin/batches/${batch.id}/mark-received`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receivedAtWarehouse: receivedDate }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ 
          type: "success", 
          text: `Всі вантажі партії ${batch.batchId} позначено як прибули на склад. Статус, місцезнаходження та таймлайн оновлено автоматично для ${data.shipments?.length || 0} вантажів.` 
        });
        fetchBatches();
      } else {
        setMessage({ type: "error", text: data.error || "Не вдалося позначити вантажі як прибули на склад" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Сталася помилка при оновленні вантажів" });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Автоматизація: Позначити всі вантажі в партії як "відправлено"
  const handleMarkBatchAsSent = async (batch: Batch) => {
    const today = new Date().toISOString().split('T')[0];
    const sentDate = prompt(
      `Введіть дату відправлення для всіх вантажів партії ${batch.batchId} (формат: РРРР-ММ-ДД):`,
      today
    );
    
    if (!sentDate) return;
    
    setUpdatingStatus(true);
    setMessage(null);
    
    try {
      const res = await fetch(`/api/admin/batches/${batch.id}/mark-sent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentAt: sentDate }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const deliveryDays = getDeliveryDays(batch.deliveryType);
        setMessage({ 
          type: "success", 
          text: `Всі вантажі партії ${batch.batchId} позначено як відправлено. Статус, місцезнаходження, ETA (+${deliveryDays} днів) та таймлайн оновлено автоматично для ${data.shipments?.length || 0} вантажів.` 
        });
        fetchBatches();
      } else {
        setMessage({ type: "error", text: data.error || "Не вдалося позначити вантажі як відправлено" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Сталася помилка при оновленні вантажів" });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const startEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setNewBatchId(batch.batchId);
    setNewBatchDescription(batch.description || "");
    setNewBatchDeliveryType(batch.deliveryType || "AIR");
    setNewBatchStatus(batch.status || "FORMING");
    fetchAvailableShipments();
  };

  const cancelEdit = () => {
    setEditingBatch(null);
    setNewBatchId("");
    setNewBatchDescription("");
    setNewBatchDeliveryType("AIR");
    setNewBatchStatus("FORMING");
    setAvailableShipments([]);
    setShowAddShipmentModal(false);
  };

  const fetchAvailableShipments = async () => {
    if (!editingBatch) return;
    setLoadingAvailableShipments(true);
    try {
      const res = await fetch(`/api/admin/batches/${editingBatch.id}/shipments`);
      if (res.ok) {
        const data = await res.json();
        setAvailableShipments(data.shipments || []);
      }
    } catch (error) {
      console.error("Error fetching available shipments:", error);
    } finally {
      setLoadingAvailableShipments(false);
    }
  };

  const handleAddShipment = async (shipmentId: string) => {
    if (!editingBatch) return;
    setAddingShipment(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/batches/${editingBatch.id}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipmentId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Вантаж успішно додано до партії" });
        setSelectedShipmentId("");
        setShowAddShipmentModal(false);
        fetchBatches();
        fetchAvailableShipments();
      } else {
        setMessage({ type: "error", text: data.error || "Помилка додавання вантажу" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка додавання вантажу" });
    } finally {
      setAddingShipment(false);
    }
  };

  const handleRemoveShipment = async (shipmentId: string) => {
    if (!editingBatch) return;
    if (!confirm("Видалити вантаж з партії?")) return;

    setMessage(null);

    try {
      const res = await fetch(`/api/admin/batches/${editingBatch.id}/shipments?shipmentId=${shipmentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Вантаж успішно видалено з партії" });
        fetchBatches();
        fetchAvailableShipments();
      } else {
        setMessage({ type: "error", text: data.error || "Помилка видалення вантажу" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка видалення вантажу" });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CREATED: "bg-blue-100 text-blue-700",
      RECEIVED_CN: "bg-yellow-100 text-yellow-700",
      IN_TRANSIT: "bg-purple-100 text-purple-700",
      ARRIVED_UA: "bg-indigo-100 text-indigo-700",
      ON_UA_WAREHOUSE: "bg-teal-100 text-teal-700",
      DELIVERED: "bg-green-100 text-green-700",
      ARCHIVED: "bg-slate-100 text-slate-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Управління партіями</h1>
          <p className="mt-2 text-sm text-slate-600">
            Створюйте та керуйте партіями вантажів для зручного групування та масового оновлення статусів
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreateForm(true);
            setNewBatchId("");
            setNewBatchDescription("");
            setNewBatchDeliveryType("AIR");
            setNewBatchStatus("FORMING");
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Створити партію
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border p-3 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {showCreateForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Створити нову партію</h2>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewBatchId("");
                setNewBatchDescription("");
                setNewBatchDeliveryType("AIR");
              }}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                ID партії *
              </label>
              <input
                type="text"
                value={loadingNextId ? "Завантаження..." : newBatchId || "000001"}
                disabled
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-700 font-mono cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">
                ID партії буде автоматично згенеровано після створення
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Тип доставки партії *
              </label>
              <select
                value={newBatchDeliveryType}
                onChange={(e) => setNewBatchDeliveryType(e.target.value as "AIR" | "SEA" | "RAIL" | "MULTIMODAL")}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="AIR">Авіа</option>
                <option value="SEA">Море</option>
                <option value="RAIL">Потяг</option>
                <option value="MULTIMODAL">Мультимодальна</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Статус партії *
              </label>
              <select
                value={newBatchStatus}
                onChange={(e) => setNewBatchStatus(e.target.value as "FORMING" | "FORMED")}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="FORMING">Формується</option>
                <option value="FORMED">Сформована</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Опис (опціонально)
              </label>
              <input
                type="text"
                value={newBatchDescription}
                onChange={(e) => setNewBatchDescription(e.target.value)}
                placeholder="Опис партії"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Створення...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Створити
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewBatchId("");
                  setNewBatchDescription("");
                  setNewBatchDeliveryType("AIR");
                  setNewBatchStatus("FORMING");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : batches.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">Немає партій. Створіть першу партію.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-teal-600" />
                    <h3 className="text-xl font-black text-slate-900">Партія {batch.batchId}</h3>
                  </div>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Тип доставки:</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {batch.deliveryType === "AIR" && "Авіа"}
                        {batch.deliveryType === "SEA" && "Море"}
                        {batch.deliveryType === "RAIL" && "Потяг"}
                        {batch.deliveryType === "MULTIMODAL" && "Мультимодальна"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Статус:</span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          batch.status === "FORMING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {batch.status === "FORMING" ? "Формується" : "Сформована"}
                      </span>
                    </div>
                  </div>
                  {batch.description && (
                    <p className="mt-1 text-sm text-slate-600">{batch.description}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    Створено: {new Date(batch.createdAt).toLocaleString("uk-UA")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    Вантажів в партії: {batch.shipments.length}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {batch.shipments.length > 0 && (
                    <>
                      {/* Перевіряємо, чи є вантажі без дати отримання на складі */}
                      {batch.shipments.some(s => !s.receivedAtWarehouse) && (
                        <button
                          type="button"
                          onClick={() => handleMarkBatchAsReceived(batch)}
                          disabled={updatingStatus}
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                          title="Позначити всі вантажі як прибули на склад"
                        >
                          <Warehouse className="h-3 w-3" /> Прибули на склад
                        </button>
                      )}
                      {/* Перевіряємо, чи є вантажі з датою отримання, але без дати відправлення */}
                      {batch.shipments.some(s => s.receivedAtWarehouse && !s.sentAt) && (
                        <button
                          type="button"
                          onClick={() => handleMarkBatchAsSent(batch)}
                          disabled={updatingStatus}
                          className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                          title="Позначити всі вантажі як відправлено"
                        >
                          <Truck className="h-3 w-3" /> Відправлено
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowStatusUpdateModal(batch);
                          setNewStatus("");
                          setNewLocation("");
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        Оновити статус всіх
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(batch)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Edit2 className="h-3 w-3" /> Редагувати
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBatch(batch.id, batch.batchId)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" /> Видалити
                  </button>
                </div>
              </div>

              {editingBatch?.id === batch.id ? (
                <div className="mt-4 space-y-4">
                  <form onSubmit={handleUpdateBatch} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">
                        ID партії
                      </label>
                      <input
                        type="text"
                        value={newBatchId}
                        disabled
                        className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        ID партії не можна змінити
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">
                        Тип доставки партії *
                      </label>
                      <select
                        value={newBatchDeliveryType}
                        onChange={(e) => setNewBatchDeliveryType(e.target.value as "AIR" | "SEA" | "RAIL" | "MULTIMODAL")}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      >
                        <option value="AIR">Авіа</option>
                        <option value="SEA">Море</option>
                        <option value="RAIL">Потяг</option>
                        <option value="MULTIMODAL">Мультимодальна</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">
                        Статус партії *
                      </label>
                      <select
                        value={newBatchStatus}
                        onChange={(e) => setNewBatchStatus(e.target.value as "FORMING" | "FORMED")}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      >
                        <option value="FORMING">Формується</option>
                        <option value="FORMED">Сформована</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">
                        Опис
                      </label>
                      <input
                        type="text"
                        value={newBatchDescription}
                        onChange={(e) => setNewBatchDescription(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Збереження...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" /> Зберегти
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Скасувати
                      </button>
                    </div>
                  </form>

                  {/* Shipments Management */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">
                        Вантажі в партії ({batch.shipments.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddShipmentModal(true);
                          fetchAvailableShipments();
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700"
                      >
                        <Plus className="h-3 w-3" /> Додати вантаж
                      </button>
                    </div>

                    {batch.shipments.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="min-w-full text-xs">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                                Трек номер
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                                Код клієнта
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                                Маркування
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                                Статус
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                                Дії
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {batch.shipments.map((shipment) => (
                              <tr key={shipment.id} className="hover:bg-slate-50">
                                <td className="px-3 py-2 font-mono text-slate-900">
                                  {shipment.internalTrack}
                                </td>
                                <td className="px-3 py-2 text-slate-900">{shipment.clientCode}</td>
                                <td className="px-3 py-2 text-slate-900">
                                  {shipment.cargoLabel || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                                      shipment.status
                                    )}`}
                                  >
                                    {shipment.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    {shipment.userId && (
                                      <Link
                                        href={`/admin/dashboard/users/${shipment.userId}?shipmentId=${shipment.id}`}
                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                      >
                                        <Edit2 className="h-3 w-3" /> Редагувати
                                      </Link>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveShipment(shipment.id)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                                    >
                                      <Trash2 className="h-3 w-3" /> Видалити
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Немає вантажів в партії</p>
                    )}
                  </div>
                </div>
              ) : (
                batch.shipments.length > 0 && (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                            Трек номер
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                            Код клієнта
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                            Маркування
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                            Статус
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                            Створено
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {batch.shipments.map((shipment) => (
                          <tr key={shipment.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-mono text-slate-900">
                              {shipment.internalTrack}
                            </td>
                            <td className="px-3 py-2 text-slate-900">{shipment.clientCode}</td>
                            <td className="px-3 py-2 text-slate-900">
                              {shipment.cargoLabel || "-"}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                                  shipment.status
                                )}`}
                              >
                                {shipment.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-600">
                              {new Date(shipment.createdAt).toLocaleDateString("uk-UA")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Shipment Modal */}
      {showAddShipmentModal && editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Додати вантаж до партії {editingBatch.batchId}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddShipmentModal(false);
                  setSelectedShipmentId("");
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingAvailableShipments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              </div>
            ) : availableShipments.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Немає доступних вантажів для додавання
              </p>
            ) : (
              <div className="space-y-2">
                <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200">
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                          Трек номер
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                          Код клієнта
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                          Клієнт
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                          Статус
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                          Дії
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {availableShipments.map((shipment: any) => (
                        <tr key={shipment.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono text-slate-900">
                            {shipment.internalTrack}
                          </td>
                          <td className="px-3 py-2 text-slate-900">{shipment.clientCode}</td>
                          <td className="px-3 py-2 text-slate-900">
                            {shipment.user?.name || "-"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                                shipment.status
                              )}`}
                            >
                              {shipment.status}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => handleAddShipment(shipment.id)}
                              disabled={addingShipment}
                              className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 disabled:opacity-50"
                            >
                              {addingShipment ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" /> Додавання...
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3 w-3" /> Додати
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddShipmentModal(false);
                  setSelectedShipmentId("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Оновити статус для партії {showStatusUpdateModal.batchId}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowStatusUpdateModal(null);
                  setNewStatus("");
                  setNewLocation("");
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Це оновить статус для всіх {showStatusUpdateModal.shipments.length} вантажів в партії
            </p>
            <form onSubmit={handleUpdateBatchStatus} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Новий статус *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="">Оберіть статус</option>
                  <option value="CREATED">CREATED</option>
                  <option value="RECEIVED_CN">RECEIVED_CN</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="ARRIVED_UA">ARRIVED_UA</option>
                  <option value="ON_UA_WAREHOUSE">ON_UA_WAREHOUSE</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Місцезнаходження (опціонально)
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Напр. CN warehouse, UA warehouse"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {updatingStatus ? (
                    <>
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Оновлення...
                    </>
                  ) : (
                    "Оновити статус"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusUpdateModal(null);
                    setNewStatus("");
                    setNewLocation("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

