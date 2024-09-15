"use client";
import { SelectResume } from "@/lib/db/schema";
import { Settings, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
 import { deleteCV } from "@/lib/db/queries";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import DeleteDialog from "./DeleteCvDialog";

interface CvItemProps {
  cvItem: SelectResume;
  index: number;
}

function CvItem({ cvItem, index }: CvItemProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteCv = async () => {
    try {
      await deleteCV(cvItem.id);
      toast({
        title: "Success",
        description: "CV deleted successfully",
        variant: "succsses",
      });
      router.refresh(); // Refresh the page to reflect the changes
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast({
        title: "Error",
        description: "Failed to delete CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.2 * (index + 1) }}
      className="h-[280px] w-[240px] bg-gray-200 dark:bg-dark_sec_bg rounded-md shadow-md flex flex-col justify-between"
    >
      <div className="flex flex-1 py-2 justify-between px-3 rounded-b-md">
        <Link
          href={`/dashboard/cv/${cvItem.id}?type=edit`}
          className="w-full h-full"
        >
          <h2 className="text-lg font-semibold truncate">{cvItem.name}</h2>
        </Link>
      </div>
      <div className="flex items-end justify-center gap-4 py-4 px-3">
        <Link
          href={`/dashboard/cv/${cvItem.id}?type=edit`}
          className="w-11 h-11 flex items-center justify-center shadow-md bg-white dark:bg-dark_main_bg rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
          aria-label="Edit CV"
        >
          <Settings size={20} />
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="w-11 h-11 flex items-center justify-center shadow-md bg-white dark:bg-dark_main_bg rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
              aria-label="Delete CV"
            >
              <Trash2 size={20} />
            </button>
          </AlertDialogTrigger>
          <DeleteDialog
            itemType="CV"
            onDelete={handleDeleteCv}
          />
        </AlertDialog>
      </div>
    </motion.div>
  );
}

export default CvItem;
