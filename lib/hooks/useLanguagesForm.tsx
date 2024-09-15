import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { InsertLanguage, InsertSkills } from "@/lib/db/schema";
import {
  insertLanguageInfo,
  insertSkillsInfo,
  updateLanguage,
  updateSkills,
} from "@/lib/db/queries";

const formSchema = z.object({
  id: z.string(),
  languageName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
    description: z.string(),
});

export function useLanguagesForm() {
  const { dispatch } = useCvInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      languageName: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const languageData: InsertLanguage = {
        ...values,
        resumeId: params.cvId as string,
      };
      console.log(languageData);
      const action = isEditing ? updateLanguage : insertLanguageInfo;
      const response = await action(languageData);

      if (response.length > 0) {
        dispatch({
          type: isEditing ? "UPDATE_Language" : "ADD_Language",
          payload: languageData,
        });
        toast({
          title: "Success",
          description: isEditing
            ? "Your language has been updated"
            : "New language has been added",
          variant: "succsses",
        });
        resetForm();
      } else {
        throw new Error("Failed to save language");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while saving the language",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({ id: uuidv4(), languageName: "", description: "" });
    setIsEditing(false);
  };

  const handleEditLanguage = (language: InsertLanguage) => {
    form.reset({
      id: language.id,
      languageName: language.languageName || "",
      description: language.description || "",
    });
    setIsEditing(true);
  };

  return {
    form,
    isEditing,
    isLoading,
    onSubmit,
    resetForm,
    handleEditLanguage,
    setIsEditing,
  };
}
