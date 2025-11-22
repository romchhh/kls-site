"use client";

import Link from "next/link";
import { ReactNode } from "react";

type LiquidGlassButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "transparent" | "semi-transparent";
};

export function LiquidGlassButton({ 
  href, 
  children, 
  className = "",
  variant = "transparent"
}: LiquidGlassButtonProps) {
  const baseStyles = "group relative overflow-hidden rounded-xl border backdrop-blur-sm px-4 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 sm:px-8 sm:text-base w-full text-center flex items-center justify-center";
  
  const variantStyles = {
    transparent: "border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/40",
    "semi-transparent": "border-white/40 bg-white/15 hover:bg-white/25 hover:border-white/50"
  };

  const liquidGlassStyle = {
    background: variant === "transparent" 
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: variant === "transparent"
      ? "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)"
      : "0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)",
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={liquidGlassStyle}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
