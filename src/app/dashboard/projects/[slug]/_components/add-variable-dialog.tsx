"use client";

import { useState } from "react";
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
import { addVariable } from "@/features/variables/variables.actions";

interface Props {
  environments: { id: string; name: string }[];
  projectId: string;
}

export function AddVariableDialog({ environments, projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [envId, setEnvId] = useState(environments[0]?.id || "");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("environmentId", envId);
    formData.append("projectId", projectId);

    try {
      await addVariable(formData);
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
        <Button size="sm">Add Variable</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Variable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="key" placeholder="DATABASE_URL" required />
          <Input name="value" placeholder="postgres://..." required />

          <Select value={envId} onValueChange={setEnvId}>
            <SelectTrigger>
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              {environments.map((env) => (
                <SelectItem key={env.id} value={env.id}>
                  {env.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Variable"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
