"use client";
import { format } from "date-fns";
import { Edit, Edit2, Trash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InsertEducations } from "@/lib/db/schema";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { deleteEducation } from "@/lib/db/queries";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import DeleteDialog from "./DeleteCvDialog";

interface EducationItemProps {
  education: InsertEducations;
  handleEditEducation: (education: InsertEducations) => void;
  setIsUpdateInfo: (isUpdate: boolean) => void;
  index: number;
}

const EducationItem: React.FC<EducationItemProps> = ({
  education,
  handleEditEducation,
  setIsUpdateInfo,
  index,
}) => {
  const { state, dispatch } = useCvInfo();
  const { toast } = useToast();

  const handleEdit = () => {
    // console.log(education)
    handleEditEducation({ ...education });
    setIsUpdateInfo(true);
  };

  const handleDelete = async () => {
    try {
      await deleteEducation(education);
      const updatedEducations = state.allCvInfo.education?.filter(
        (edu) => edu.id !== education.id
      );
      dispatch({ type: "SET_CV_EDUCATION", payload: updatedEducations || [] });
      toast({
        description: "Education entry deleted successfully",
        variant: "succsses",
      });
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({
        description: "Failed to delete education entry",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.1 * (index + 1) }}
      className="flex flex-col gap-2 bg-white dark:bg-dark_main_bg px-4 py-2 rounded-sm"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{education.degree}</h3>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Delete education">
                <Trash className="h-4 w-4 text-red-500" size={20} />
              </Button>
            </AlertDialogTrigger>
            <DeleteDialog
              itemType="education"
              onDelete={async () => {
                await handleDelete();
              }}
            />
          </AlertDialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label="Edit education"
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{education.schoolName}</span>
        <div className="flex justify-center items-center">
          <span className="text-[12px] text-gray-500">
            {education.startDate
              ? format(new Date(education.startDate), "MMM yyyy")
              : ""}{" "}
            {"-"}
          </span>
          <span className="text-[12px] text-gray-500">
            {education.endDate
              ? format(new Date(education.endDate), "MMM yyyy")
              : "Present"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EducationItem;
