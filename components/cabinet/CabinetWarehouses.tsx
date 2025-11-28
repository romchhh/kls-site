"use client";

import { Locale, getTranslations } from "@/lib/translations";
import { Warehouse, MapPin, Phone, Mail } from "lucide-react";

type CabinetWarehousesProps = {
  locale: Locale;
};

export function CabinetWarehouses({ locale }: CabinetWarehousesProps) {
  const t = getTranslations(locale);

  // Mock warehouse data - in real app, fetch from API
  const warehouses = [
    {
      name: "Склад Китай (Гуанчжоу)",
      address: "123 Logistics Street, Guangzhou, China",
      phone: "+86 123 456 7890",
      email: "warehouse.cn@kls.com",
      packingConditions:
        "Стандартна упаковка. Всі товари повинні бути захищені від пошкоджень. Використовуйте міцні коробки та належне заповнення.",
    },
    {
      name: "Склад Україна (Київ)",
      address: "456 Delivery Avenue, Kyiv, Ukraine",
      phone: "+380 12 345 6789",
      email: "warehouse.ua@kls.com",
      packingConditions:
        "Всі вантажі перевіряються на митниці. Переконайтеся, що всі документи готові.",
    },
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.warehouses || "Склади"}
      </h2>
      <div className="space-y-6">
        {warehouses.map((warehouse, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-2xl bg-teal-500 p-3 text-white shadow-md">
                <Warehouse className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {warehouse.name}
                </h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {warehouse.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {warehouse.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {warehouse.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-white p-4">
              <h4 className="mb-2 text-sm font-semibold text-slate-900">
                Умови упаковки:
              </h4>
              <p className="text-sm text-slate-600">
                {warehouse.packingConditions}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

