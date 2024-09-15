"use client";

import { useCvInfo } from "@/lib/context/CvInfoContext";
import { deleteTraining } from "@/lib/db/queries";
import {
  InsertCertficate,
  InsertProject,
  InsertTraining,
} from "@/lib/db/schema";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils/utils";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import DeleteDialog from "./DeleteCvDialog";
import { Button } from "./ui/button";

function TrainingItem({
  training,
  handleEditTraining,
  index,
}: {
  training: InsertTraining;
  handleEditTraining: (data: InsertTraining) => void;
  index: number;
}) {
  const { dispatch } = useCvInfo();
  const { toast } = useToast();

  const removeTraining = async () => {
    try {
      await deleteTraining(training);
      toast({
        title: "Training deleted",
        description: "The training has been successfully removed",
        variant: "destructive",
      });

      dispatch({ type: "DELETE_TRAINING", payload: training });
    } catch (error) {
      console.error("Error deleting training:", error);
      toast({
        title: "Error",
        description: "Failed to delete the training. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.1 * (index + 1) }}
      className="flex flex-col gap-2 bg-white dark:bg-dark_main_bg p-2 rounded-sm"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{training.trainingTitle}</h3>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Delete Training">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <DeleteDialog
              itemType="Training"
              onDelete={async () => {
                await removeTraining();
              }}
            />
          </AlertDialog>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditTraining(training)}
            aria-label="Edit training"
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {training.organizationName}
        </span>
        <div className="flex justify-center items-center">
          <span className="text-[12px] text-gray-500">
            {formatDate(training.createdDate)}
          </span>
          <span className="text-[12px] text-gray-500">
            {/* {certficate.startDate} */}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default TrainingItem;
