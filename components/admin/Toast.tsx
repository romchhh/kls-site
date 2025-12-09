"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Анімація появи
    setTimeout(() => setIsVisible(true), 10);

    // Автоматичне закриття
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Чекаємо завершення анімації
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const iconColor = type === "success" ? "text-green-600" : "text-red-600";
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-xl border px-6 py-4 shadow-2xl min-w-[400px] max-w-[600px] ${bgColor}`}
      >
        <div className={`flex-shrink-0 ${iconColor}`}>
          <Icon size={24} />
        </div>
        <p className={`flex-1 text-sm font-semibold ${textColor}`}>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-black/10 ${textColor}`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

