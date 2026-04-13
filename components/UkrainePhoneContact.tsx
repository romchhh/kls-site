"use client";

import { useCallback, useState } from "react";

function formatUaMobile(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("380")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return e164;
}

type UkrainePhoneContactProps = {
  /** E.164 без пробілів, напр. +380689701270 */
  phoneE164: string;
  note: string;
  copyLabel: string;
  copiedLabel: string;
};

export function UkrainePhoneContact({
  phoneE164,
  note,
  copyLabel,
  copiedLabel,
}: UkrainePhoneContactProps) {
  const [copied, setCopied] = useState(false);
  const formatted = formatUaMobile(phoneE164);
  const telHref = `tel:${phoneE164.replace(/\s/g, "")}`;

  const copy = useCallback(async () => {
    const text = phoneE164.replace(/\s/g, "");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      } catch {
        // ignore
      }
    }
  }, [phoneE164]);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <a
        href={telHref}
        className="block text-lg font-semibold tracking-tight text-[#006D77] transition-colors hover:text-[#005a63] focus:outline-none focus:ring-2 focus:ring-[#006D77]/25 rounded-md px-1"
      >
        {formatted}
      </a>
      <button
        type="button"
        onClick={copy}
        className="text-xs font-medium text-slate-600 underline-offset-2 transition-colors hover:text-[#006D77] hover:underline focus:outline-none focus:ring-2 focus:ring-[#006D77]/20 rounded px-1"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
      <p className="mt-2 w-full text-balance text-center text-sm leading-relaxed text-gray-600">
        {note}
      </p>
    </div>
  );
}
