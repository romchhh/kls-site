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

export function UserDetail({ userId }: UserDetailProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  });

  useEffect(() => {
    fetchUser();
    fetchShipments();
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
          mainPhotoUrl: shipmentForm.mainPhotoUrl || null,
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
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Фото (URL)
                </label>
                <input
                  type="url"
                  value={shipmentForm.mainPhotoUrl}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      mainPhotoUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teал-500/20"
                />
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
                    <tr key={s.id} className="border-t border-slate-100">
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
                        <button
                          type="button"
                          onClick={() => handleDeleteShipment(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                          Видалити
                        </button>
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
    </div>
  );
}

