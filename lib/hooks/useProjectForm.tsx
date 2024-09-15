import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { InsertProject } from "@/lib/db/schema";
import { insertProjectInfo, updateProject } from "@/lib/db/queries";
import { useDebouncedCallback } from "use-debounce";

const formSchema = z.object({
  id: z.string(),
  projectTitle: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  organizationName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  createdDate: z.date({ required_error: "A start date is required." }),
  projectUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
});
export const useProjectForm = () => {
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useCvInfo();
  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      projectTitle: "",
      projectUrl: "",
      description: "",
      organizationName: "",
      createdDate: new Date(), // Set default date
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const updatedProject: InsertProject = {
        ...values,
        resumeId: params.cvId as string,
        createdDate: values.createdDate.toISOString(),
      };

      const action = isUpdateInfo ? updateProject : insertProjectInfo;
      const result = await action(updatedProject);

      if (result.length > 0) {
        dispatch({
          type: isUpdateInfo ? "UPDATE_PROJECT" : "ADD_PROJECT",
          payload: updatedProject,
        });
        toast({
          title: isUpdateInfo ? "Project updated" : "Project added",
          description: isUpdateInfo
            ? "Your project has been updated"
            : "New project has been added",
          variant: "succsses",
        });
        resetForm();
      } else {
        throw new Error("Failed to save project");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while saving the project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      id: uuidv4(),
      projectTitle: "",
      organizationName: "",
      createdDate: new Date(),
      description: "",
      projectUrl: undefined,
    });

    setIsUpdateInfo(false);
  };

  const handleEditProject = (project: InsertProject) => {
    form.reset({
      id: project.id,
      projectTitle: project.projectTitle,
      organizationName: project.organizationName,
      createdDate: new Date(project.createdDate),
      description: project.description || "",
      projectUrl: project.projectUrl || undefined,
    });
    setIsUpdateInfo(true);
  };

  return {
    form,
    isUpdateInfo,
    setIsUpdateInfo,
    isLoading,
    onSubmit,
    resetForm,
    handleEditProject,
    projects: state.allCvInfo.project || [],
  };
};
