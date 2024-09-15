"use client";

import { useCvInfo } from "@/lib/context/CvInfoContext";
import { deleteProject } from "@/lib/db/queries";
import { InsertProject } from "@/lib/db/schema";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils/utils";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import DeleteDialog from "./DeleteCvDialog";
import { Button } from "./ui/button";

interface ProjectItemProps {
  project: InsertProject;
  handleEditProject: (data: InsertProject) => void;
  index: number;
}

function ProjectItem({ project, handleEditProject, index }: ProjectItemProps) {
  const { dispatch } = useCvInfo();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteProject(project);
      toast({
        title: "Project deleted",
        description: "The project has been successfully removed",
        variant: "destructive",
      });
      dispatch({ type: "DELETE_PROJECT", payload: project });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    handleEditProject(project);
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.1 * (index + 1) }}
      className="flex flex-col gap-2 bg-white dark:bg-dark_main_bg p-2 rounded-sm"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{project.projectTitle}</h3>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Delete Project">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <DeleteDialog
              itemType="Project"
              onDelete={async () => {
                await handleDelete();
              }}
            />
          </AlertDialog>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label="Edit project"
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {project.organizationName}
        </span>
        <div className="flex justify-center items-center gap-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {project.createdDate && formatDate(project.createdDate)}
          </span>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-500 hover:underline"
            >
              View Project
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectItem;
