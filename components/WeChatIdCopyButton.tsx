"use client";

import { useCallback, useState } from "react";

type WeChatIdCopyButtonProps = {
  wechatId: string;
  copiedLabel: string;
  className?: string;
  /** Викликається перед копіюванням (наприклад, позначити месенджер у формі) */
  onPress?: () => void;
  children?: React.ReactNode;
};

export function WeChatIdCopyButton({
  wechatId,
  copiedLabel,
  className,
  onPress,
  children,
}: WeChatIdCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handle = useCallback(async () => {
    onPress?.();
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = wechatId;
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
  }, [wechatId, onPress]);

  return (
    <button type="button" onClick={handle} className={className}>
      {children ? (
        <span className="flex w-full items-center gap-3">{children}</span>
      ) : (
        <span className="font-mono text-base font-semibold">{wechatId}</span>
      )}
      {copied ? (
        <span
          className={`mt-1 block text-xs font-medium text-emerald-600 ${
            children ? "w-full pl-8 text-left" : "text-center"
          }`}
        >
          {copiedLabel}
        </span>
      ) : null}
    </button>
  );
}
