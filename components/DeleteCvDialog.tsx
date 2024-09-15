"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteDialogProps = {
  itemType: string;
  onDelete: () => Promise<void>;
};

function DeleteDialog({ itemType, onDelete }: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { refresh } = useRouter();

  async function handleDelete() {
    setIsLoading(true);
    await onDelete();
    setIsLoading(false);
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the{" "}
          {itemType} from our database.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export default DeleteDialog;
