import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { InsertSkills } from "@/lib/db/schema";
import { insertSkillsInfo, updateSkills } from "@/lib/db/queries";

const formSchema = z.object({ 
  id: z.string(),
  skillsName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
});

export function useSkillsForm() {
  const { dispatch } = useCvInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      skillsName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const skillData: InsertSkills = {
        ...values,
        resumeId: params.cvId as string,
      };

      const action = isEditing ? updateSkills : insertSkillsInfo;
      const response = await action(skillData);

      if (response.length > 0) {
        dispatch({
          type: isEditing ? "UPDATE_SKILL" : "ADD_SKILL",
          payload: skillData,
        });
        toast({
          title: "Success",
          description: isEditing
            ? "Your skill has been updated"
            : "New skill has been added",
          variant: "succsses",
        });
        resetForm();
      } else {
        throw new Error("Failed to save skill");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while saving the skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({ id: uuidv4(), skillsName: "" });
    setIsEditing(false);
  };

  const handleSkillEdit = (skill: InsertSkills) => {
    form.reset({ id: skill.id, skillsName: skill.skillsName || "" });
    setIsEditing(true);
  };

  return {
    form,
    isEditing,
    isLoading,
    onSubmit,
    resetForm,
    handleSkillEdit,
    setIsEditing,
  };
}
