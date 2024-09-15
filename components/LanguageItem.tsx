"use client";

import { useCvInfo } from "@/lib/context/CvInfoContext";
import { deleteLanguage, deleteSkills } from "@/lib/db/queries";
import { InsertLanguage, InsertSkills } from "@/lib/db/schema";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import DeleteDialog from "./DeleteCvDialog";
import { Button } from "./ui/button";

interface LanguageItemProps {
  language: InsertLanguage;
  handleEditLanguage: (data: InsertLanguage) => void;
  index: number;
}

function LanguageItem({
  language,
  handleEditLanguage,
  index,
}: LanguageItemProps) {
  const { state, dispatch } = useCvInfo();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteLanguage(language);
      dispatch({ type: "DELETE_Language", payload: language });
      toast({
        title: "Skill deleted",
        description: "The skill has been successfully removed",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete the skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    handleEditLanguage(language);
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.1 * (index + 1) }}
      className="flex flex-col gap-2 justify-center bg-white p-2 dark:bg-dark_main_bg rounded-sm"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{language.languageName}</h3>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete language"
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <DeleteDialog
              itemType="Language"
              onDelete={async () => {
                await handleDelete();
              }}
            />
          </AlertDialog>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label="Edit language"
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      {/* {skills.skillsLevel && (
        <span className="text-sm text-gray-600">Level: {skills.skillsLevel}</span>
      )} */}
    </motion.div>
  );
}

export default LanguageItem;
