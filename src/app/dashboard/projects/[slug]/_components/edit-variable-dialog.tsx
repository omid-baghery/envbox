"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { updateVariable } from "@/features/variables/variables.actions";

interface Props {
  projectId: string;
  variableId: string;
  currentKey: string;
  currentValue: string;
  currentEnvironmentId: string;
  environments: { id: string; name: string }[];
}

export function EditVariableDialog({
  projectId,
  variableId,
  currentKey,
  currentValue,
  currentEnvironmentId,
  environments,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(currentKey);
  const [value, setValue] = useState(currentValue);
  const [envId, setEnvId] = useState(currentEnvironmentId);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateVariable({
        projectId,
        variableId,
        key: key.trim(),
        value: value.trim(),
        environmentId: envId,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1 text-muted-foreground hover:text-foreground">
          <Pencil size={14} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Variable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Key
            </label>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Value
            </label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Environment
            </label>
            <Select value={envId} onValueChange={setEnvId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {environments.map((env) => (
                  <SelectItem key={env.id} value={env.id}>
                    {env.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
