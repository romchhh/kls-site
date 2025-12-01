"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Shield, LayoutDashboard, BarChart3, Key } from "lucide-react";

interface AdminSidebarProps {
  isSuperAdmin: boolean;
}

export function AdminSidebar({ isSuperAdmin }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: "Головна",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/dashboard/statistics",
      label: "Статистика",
      icon: BarChart3,
    },
    {
      href: "/admin/dashboard/users",
      label: "Користувачі",
      icon: Users,
    },
    {
      href: "/admin/dashboard/api-tokens",
      label: "API Токени",
      icon: Key,
    },
    ...(isSuperAdmin
      ? [
          {
            href: "/admin/dashboard/admins",
            label: "Адміни",
            icon: Shield,
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-semibold transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

