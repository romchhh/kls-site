import { useState, useEffect } from "react";
import type { User } from "../types/userDetail.types";

export function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    lastName: "",
    middleName: "",
    phone: "",
    companyName: "",
  });
  const [userPassword, setUserPassword] = useState<string | null>(null);

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
          lastName: data.user.lastName || "",
          middleName: data.user.middleName || "",
          phone: data.user.phone,
          companyName: data.user.companyName || "",
        });
        setUserPassword(data.user.password || null);
      } else {
        setError(data.error || "Не вдалося завантажити користувача");
      }
    } catch (e) {
      setError("Сталася помилка при завантаженні користувача");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const updateUser = async (userData: {
    email: string;
    name: string;
    lastName?: string | null;
    middleName?: string | null;
    phone: string;
    companyName?: string | null;
  }) => {
    if (!user) return { success: false, error: "Користувач не знайдено" };

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Не вдалося оновити користувача" };
      }
    } catch (e) {
      return { success: false, error: "Сталася помилка при оновленні користувача" };
    }
  };

  const deleteUser = async () => {
    if (!user) return { success: false, error: "Користувач не знайдено" };

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Не вдалося видалити користувача" };
      }
    } catch (e) {
      return { success: false, error: "Сталася помилка при видаленні користувача" };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) return { success: false, error: "Користувач не знайдено" };

    if (!newPassword || newPassword.trim() === "") {
      return { success: false, error: "Введіть новий пароль" };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Пароль повинен містити мінімум 6 символів" };
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserPassword(data.newPassword || newPassword);
        await fetchUser();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Помилка оновлення паролю" };
      }
    } catch (error) {
      return { success: false, error: "Сталася помилка при оновленні паролю" };
    }
  };

  return {
    user,
    loading,
    error,
    formData,
    setFormData,
    userPassword,
    fetchUser,
    updateUser,
    deleteUser,
    updatePassword,
  };
}

