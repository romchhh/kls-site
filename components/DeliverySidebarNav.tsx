"use client";

import { useEffect, useRef, useState } from "react";

interface DeliveryType {
  id: string;
  title: string;
  iconId: string;
  color: string;
}

interface DeliverySidebarNavProps {
  deliveryTypes: DeliveryType[];
  locale: string;
  title?: string;
}

export default function DeliverySidebarNav({ 
  deliveryTypes, 
  locale,
  title 
}: DeliverySidebarNavProps) {
  const [isFixed, setIsFixed] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number | undefined>(undefined);
  const [sidebarLeft, setSidebarLeft] = useState<number | undefined>(undefined);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !containerRef.current) return;

      const sidebar = sidebarRef.current;
      const container = containerRef.current;
      const contentSection = document.getElementById("content-section");
      const footer = document.querySelector("footer");

      if (!contentSection) return;

      // Отримуємо позиції елементів
      const contentSectionRect = contentSection.getBoundingClientRect();
      const contentSectionTop = contentSectionRect.top + window.scrollY;
      const sidebarHeight = sidebar.offsetHeight;
      const scrollY = window.scrollY;
      const headerHeight = 128; // pt-32 = 128px
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left + window.scrollX;

      // Визначаємо, чи досягли початку контентної секції
      const hasReachedContent = scrollY + headerHeight >= contentSectionTop;

      if (hasReachedContent && footer) {
        const footerRect = footer.getBoundingClientRect();
        const footerTop = footerRect.top + window.scrollY;
        const sidebarBottom = scrollY + headerHeight + sidebarHeight;
        const contentSectionBottom = contentSectionRect.bottom + window.scrollY;
        
        // Перевіряємо, чи сайдбар не перетинається з футером
        // Також перевіряємо, чи ми не досягли кінця контентної секції
        if (sidebarBottom >= footerTop - 20 || scrollY + headerHeight + sidebarHeight >= contentSectionBottom) {
          setIsAtBottom(true);
          setIsFixed(false);
        } else {
          setIsAtBottom(false);
          setIsFixed(true);
          // Оновлюємо ширину та позицію для фіксованого стану
          setSidebarWidth(container.offsetWidth);
          setSidebarLeft(containerRect.left);
        }
      } else {
        setIsFixed(false);
        setIsAtBottom(false);
      }
    };

    const handleResize = () => {
      if (containerRef.current) {
        setSidebarWidth(containerRef.current.offsetWidth);
      }
      handleScroll();
    };

    // Спочатку встановлюємо ширину
    if (containerRef.current) {
      setSidebarWidth(containerRef.current.offsetWidth);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Визначаємо заголовок
  const sidebarTitle = title || (locale === "ua" ? "Види доставки" : locale === "ru" ? "Виды доставки" : "Delivery Types");

  return (
    <aside className="hidden lg:block lg:col-span-1 relative" ref={containerRef}>
      <div
        ref={sidebarRef}
        className={`transition-all duration-300 ${
          isFixed && !isAtBottom
            ? "fixed"
            : isAtBottom
            ? "absolute bottom-0"
            : "relative"
        }`}
        style={
          isFixed && !isAtBottom && sidebarWidth !== undefined && sidebarLeft !== undefined
            ? {
                top: "128px",
                left: `${sidebarLeft}px`,
                width: `${sidebarWidth}px`,
              }
            : {}
        }
      >
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            {sidebarTitle}
          </h3>
          <nav className="space-y-2">
            {deliveryTypes.map((type) => {
              return (
                <a
                  key={type.id}
                  href={`#${type.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E8FDF8] hover:text-teal-700 transition-all duration-300"
                >
                  <span>{type.title}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

