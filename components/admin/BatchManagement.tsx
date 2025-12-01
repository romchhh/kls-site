"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Edit2, Save, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Shipment {
  id: string;
  internalTrack: string;
  status: string;
  clientCode: string;
  cargoLabel: string | null;
  createdAt: string;
}

interface Batch {
  id: string;
  batchId: string;
  description: string | null;
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState<Batch | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

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
          batchId: newBatchId,
          description: newBatchDescription || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Партія успішно створена" });
        setNewBatchId("");
        setNewBatchDescription("");
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
          batchId: newBatchId,
          description: newBatchDescription || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Партія успішно оновлена" });
        setEditingBatch(null);
        setNewBatchId("");
        setNewBatchDescription("");
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

  const startEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setNewBatchId(batch.batchId);
    setNewBatchDescription(batch.description || "");
  };

  const cancelEdit = () => {
    setEditingBatch(null);
    setNewBatchId("");
    setNewBatchDescription("");
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
                value={newBatchId}
                onChange={(e) => setNewBatchId(e.target.value)}
                required
                placeholder="00010"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
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
                <div className="flex gap-2">
                  {batch.shipments.length > 0 && (
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
                <form onSubmit={handleUpdateBatch} className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      ID партії *
                    </label>
                    <input
                      type="text"
                      value={newBatchId}
                      onChange={(e) => setNewBatchId(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
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

