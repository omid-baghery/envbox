"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface Props {
  environments: { id: string; name: string }[];
  projectId: string;
}

export function InviteMemberDialog({ environments, projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [expiry, setExpiry] = useState("24h");
  const [command, setCommand] = useState("");

  function toggleEnv(envId: string) {
    setSelectedEnvs((prev) =>
      prev.includes(envId)
        ? prev.filter((id) => id !== envId)
        : [...prev, envId],
    );
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // TODO: صدا زدن Server Action inviteMember

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Invite Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a Member</DialogTitle>
        </DialogHeader>

        {command ? (
          // بعد از ساخت Token
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this command with your team member:
            </p>
            <div className="rounded-md bg-muted p-3">
              <code className="text-xs font-mono">{command}</code>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(command);
              }}
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCommand("");
                setSelectedEnvs([]);
                setEmail("");
              }}
            >
              Invite Another
            </Button>
          </div>
        ) : (
          // فرم دعوت
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email (optional)</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
              />
            </div>

            <div>
              <Label>Environments</Label>
              <div className="space-y-2 mt-2">
                {environments.map((env) => (
                  <div key={env.id} className="flex items-center gap-2">
                    <Checkbox
                      id={env.id}
                      checked={selectedEnvs.includes(env.id)}
                      onCheckedChange={() => toggleEnv(env.id)}
                    />
                    <Label htmlFor={env.id} className="text-sm">
                      {env.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Expires in</Label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading || selectedEnvs.length === 0}
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Invite Command"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
