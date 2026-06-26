"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  variableKey: string;
  value: string;
}

export function CopyVariableButton({ variableKey, value }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(`${variableKey}=${value}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      className="p-1 text-muted-foreground hover:text-foreground"
      onClick={copy}
    >
      {copied ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}
