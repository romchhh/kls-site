"use client";

import { useState, useEffect } from "react";
import { Key, Plus, Trash2, Eye, EyeOff, Loader2, Copy, Check } from "lucide-react";

interface ApiToken {
  id: string;
  name: string;
  token: string;
  fullToken?: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
  lastUsedAt: string | null;
}

export function ApiTokens() {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<number | "">("");
  const [newlyCreatedToken, setNewlyCreatedToken] = useState<string | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/api-tokens");
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/api-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTokenName,
          expiresInDays: expiresInDays ? Number(expiresInDays) : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Токен успішно створено" });
        setNewlyCreatedToken(data.token.token);
        setNewTokenName("");
        setExpiresInDays("");
        setShowCreateForm(false);
        fetchTokens();
      } else {
        setMessage({ type: "error", text: data.error || "Помилка створення токена" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка створення токена" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (tokenId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/api-tokens/${tokenId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (res.ok) {
        fetchTokens();
      }
    } catch (error) {
      console.error("Error updating token:", error);
    }
  };

  const handleDeleteToken = async (tokenId: string, tokenName: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити токен "${tokenName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/api-tokens/${tokenId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchTokens();
        setMessage({ type: "success", text: "Токен успішно видалено" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Помилка видалення токена" });
    }
  };

  const copyToClipboard = async (text: string, tokenId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTokenId(tokenId);
      setTimeout(() => setCopiedTokenId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900">API Токени</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-teal-700"
        >
          <Plus className="h-5 w-5" />
          Створити токен
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Newly Created Token Display */}
      {newlyCreatedToken && (
        <div className="mb-6 rounded-xl border-2 border-teal-500 bg-teal-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Key className="h-5 w-5 text-teal-600" />
            <h3 className="font-bold text-teal-900">Новий токен створено!</h3>
          </div>
          <p className="mb-2 text-sm text-teal-700">
            Збережіть цей токен зараз, він більше не буде показаний:
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-white p-3">
            <code className="flex-1 font-mono text-sm text-slate-900">
              {newlyCreatedToken}
            </code>
            <button
              onClick={() => copyToClipboard(newlyCreatedToken, "new")}
              className="rounded-lg bg-teal-600 p-2 text-white hover:bg-teal-700"
            >
              {copiedTokenId === "new" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            onClick={() => setNewlyCreatedToken(null)}
            className="mt-3 text-sm text-teal-700 hover:text-teal-900"
          >
            Закрити
          </button>
        </div>
      )}

      {/* Create Token Form */}
      {showCreateForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Створити новий токен</h2>
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Назва токена
              </label>
              <input
                type="text"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                required
                minLength={2}
                placeholder="Наприклад: Production API, Test API"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Термін дії (днів, залиште порожнім для безстрокового)
              </label>
              <input
                type="number"
                value={expiresInDays}
                onChange={(e) =>
                  setExpiresInDays(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={1}
                placeholder="Наприклад: 30, 90, 365"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Створення...
                  </>
                ) : (
                  "Створити токен"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTokenName("");
                  setExpiresInDays("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tokens List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="ml-3 text-slate-600">Завантаження токенів...</span>
          </div>
        ) : tokens.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Key className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p>Немає створених токенів</p>
            <p className="mt-2 text-sm">Створіть перший токен для використання API</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Назва
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Токен
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Створено
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Термін дії
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Останнє використання
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tokens.map((token) => (
                  <tr key={token.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{token.name}</span>
                      <p className="text-xs text-slate-500">Створено: {token.createdBy}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs text-slate-600">{token.token}</code>
                        <button
                          onClick={() => copyToClipboard(token.fullToken || token.token, token.id)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          title="Копіювати"
                        >
                          {copiedTokenId === token.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(token.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {token.expiresAt ? formatDate(token.expiresAt) : "Безстроково"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {token.lastUsedAt ? formatDate(token.lastUsedAt) : "Ніколи"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
                          token.isActive
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {token.isActive ? "Активний" : "Неактивний"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(token.id, token.isActive)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title={token.isActive ? "Деактивувати" : "Активувати"}
                        >
                          {token.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteToken(token.id, token.name)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Видалити"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

