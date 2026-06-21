"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CommandPreviewProps {
  command: string;
}

export function CommandPreview({ command }: CommandPreviewProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <code className="flex-1 font-mono text-sm text-foreground">{command}</code>
      <button
        onClick={copy}
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Copy command"
      >
        {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
      </button>
    </div>
  );
}
