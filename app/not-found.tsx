import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  // Use default locale (ua) navigation; content is in English as requested
  const locale = "ua" as const;

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />

      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
            404 · Page not found
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            This page sailed off the route
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            The page you’re looking for doesn’t exist or has been moved. Try going back to
            the homepage and choose a new direction for your shipment.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-700 hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            If you believe this is an error, please contact your manager or support.
          </p>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}

