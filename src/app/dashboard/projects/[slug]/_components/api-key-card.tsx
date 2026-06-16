"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Copy, Eye, EyeOff } from "lucide-react";

interface Props {
  apiKey: string;
}

export function ApiKeyCard({ apiKey }: Props) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const visibleKey = show ? apiKey : "••••••••••••••••••••••••••••••••";
  const command = `npx envbox-cli init --key=envbox_sk_${visibleKey} --url=https://envbox.vercel.app`;

  function copyToClipboard() {
    const fullCommand = `npx envbox-cli init --key=${apiKey} --url=https://envbox.vercel.app`;
    navigator.clipboard.writeText(fullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="rounded-lg border bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
          API Key
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs font-mono text-foreground truncate">
            {command}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={copyToClipboard}
          >
            <Copy size={14} />
          </Button>
        </div>
        {copied && <p className="text-xs text-green-600 mt-1">Copied!</p>}
      </div>

      <div className="rounded-lg border bg-muted/20 p-4 mt-2">
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
          after init
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs font-mono text-foreground truncate">
            npx envbox-cli pull --env=production
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={copyToClipboard}
          >
            <Copy size={14} />
          </Button>
        </div>
        {copied && <p className="text-xs text-green-600 mt-1">Copied!</p>}
      </div>
    </>
  );
}
