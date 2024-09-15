import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { useToast } from "@/components/ui/use-toast";
import { InsertTraining } from "@/lib/db/schema";
import { insertTrainingInfo, updateTraining } from "@/lib/db/queries";

const formSchema = z.object({
  id: z.string(),
  trainingTitle: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  organizationName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  createdDate: z.date({ required_error: "A start date is required." }),
  description: z.string().optional(),
});

export function useTrainingForm(resumeId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const { dispatch: updateCvInfo } = useCvInfo();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      trainingTitle: "",
      organizationName: "",
      createdDate: new Date(),
      description: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const trainingData: InsertTraining = {
        ...values,
        resumeId,
        createdDate: values.createdDate.toISOString(),
      };

      const action = isUpdateInfo ? updateTraining : insertTrainingInfo;
      const response = await action(trainingData);

      if (response.length > 0) {
        updateCvInfo({
          type: isUpdateInfo ? "UPDATE_TRAINING" : "ADD_TRAINING",
          payload: trainingData,
        });
        toast({
          title: "Success",
          description: isUpdateInfo
            ? "Your training has been updated"
            : "New training has been added",
          variant: "succsses",
        });
        resetForm();
      } else {
        throw new Error("Failed to save training");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while saving the training",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      id: uuidv4(),
      trainingTitle: "",
      organizationName: "",
      createdDate: new Date(),
      description: undefined,
    });
    setIsUpdateInfo(false);
  };

  const handleEditTraining = (data: InsertTraining) => {
    form.reset({
      id: data.id,
      trainingTitle: data.trainingTitle,
      organizationName: data.organizationName,
      createdDate: new Date(data.createdDate),
      description: data.description || "",
    });
    setIsUpdateInfo(true);
  };

  return {
    form,
    isLoading,
    isUpdateInfo,
    setIsUpdateInfo,
    onSubmit,
    resetForm,
    handleEditTraining,
  };
}
