"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash } from "lucide-react";

import { useCvInfo } from "@/lib/context/CvInfoContext";
import { deleteExperience } from "@/lib/db/queries";
import { InsertExperineces } from "@/lib/db/schema";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { formatDate } from "@/lib/utils/utils";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import DeleteDialog from "./DeleteCvDialog";

interface ExperienceItemProps {
  experience: InsertExperineces;
  handleEditExperience: (exeperience: InsertExperineces) => void;
  index: number;
}

const ExperienceItem: React.FC<ExperienceItemProps> = React.memo(
  ({ experience, handleEditExperience, index }) => {
    const { state, dispatch } = useCvInfo();
    const { toast } = useToast();

    const removeExperience = async () => {
      try {
        await deleteExperience(experience);
        toast({
          title: "Experience deleted",
          description: "The experience has been successfully removed",
          variant: "succsses",
        });
        dispatch({
          type: "SET_CV_EXPERIENCE",
          payload:
            state.allCvInfo.experience?.filter(
              (value) => value.id !== experience.id
            ) || [],
        });
      } catch (error) {
        console.error("Error deleting experience:", error);
        toast({
          title: "Error",
          description: "Failed to delete the experience. Please try again.",
          variant: "destructive",
        });
      }
    };

    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1, delay: 0.1 * (index + 1) }}
        className="flex flex-col gap-2 bg-white dark:bg-dark_main_bg px-4 py-2 rounded-md shadow-sm"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">{experience.jobTitle}</h3>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete experience"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <DeleteDialog
                itemType="Experience"
                onDelete={async () => {
                  await removeExperience();
                }}
              />
            </AlertDialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditExperience(experience)}
              aria-label="Edit experience"
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>
   <div className="flex items-center justify-between">
   <span className="text-sm text-gray-600 dark:text-gray-300">
          {experience.employer}
        </span>
        <div className="flex justify-center items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{formatDate(experience.startDate)}</span>- 
          <span>
            {experience.endDate ? formatDate(experience.endDate) : "Present"}
          </span>
        </div>
   </div>
      </motion.div>
    );
  }
);

ExperienceItem.displayName = "ExperienceItem";

export default ExperienceItem;
