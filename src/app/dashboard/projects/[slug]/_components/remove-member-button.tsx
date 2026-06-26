"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { removeMember } from "@/features/members/members.actions";

interface Props {
  projectId: string;
  memberId: string;
}

export function RemoveMemberButton({ projectId, memberId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    await removeMember(projectId, memberId);
    setLoading(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-red-500 text-xs">
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            This will revoke all API keys and remove access to the project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={loading}
            className="bg-red-800 hover:bg-red-900 text-white"
          >
            {loading ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
