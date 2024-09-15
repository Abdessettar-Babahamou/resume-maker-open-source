"use client";

import { useParams } from "next/navigation";
import { useCvInfo } from "../context/CvInfoContext";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useCallback } from "react";
import { InsertExperineces } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDebouncedCallback } from "use-debounce";
import { chatSession } from "@/services/AiModal";
import { insertExperienceInfo, updateExperience } from "../db/queries";
import { sortExperiencesByDate } from "../utils/utils";
import { useAIGeneration } from "./useAIGeneration";

const formSchema = z.object({
  id: z.string(),
  jobTitle: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters" }),
  employer: z
    .string()
    .min(2, { message: "Employer must be at least 2 characters" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  country: z.string({ required_error: "Country is required" }),
  state: z.string().optional(),
  description: z.string().optional(), 
}); 
const useExperienceForm = () => {
  const { state, dispatch } = useCvInfo();
  const params = useParams();
  const { toast } = useToast();
  const [activeExperience, setActiveExperience] = useState<InsertExperineces>({
    id: uuidv4(),
    jobTitle: "",
    employer: "",
    startDate: new Date().toISOString(), 
    endDate: new Date().toISOString(),
    country: "",
    state: "",
    description: "",
    resumeId: params.cvId.toString(),
  });
  const [formState, setFormState] = useState({
    isUpdateInfo: false,
    isLoading: false,
    aiIsLoading: false,
  });
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      startDate: new Date(),
      endDate: undefined,
      state: undefined,
      description: undefined,
      country: selectedCountry,
    },
  });

  // useEffect(() => {
  //   console.log(activeExperience);
  //   form.reset({
  //     ...activeExperience,
  //     startDate: new Date(activeExperience.startDate),
  //     endDate: new Date(activeExperience.endDate),
  //     state: activeExperience.state|| "",
  //     description: activeExperience.description || "",
  //     jobTitle:"abdou"
  //   });
  // }, [activeExperience]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormState((prev) => ({ ...prev, isLoading: true }));
    try {
      const experienceData = {
        ...values,
        resumeId: params.cvId as string,
        startDate: values.startDate.toISOString().split("T")[0],
        endDate: values.endDate
          ? values.endDate.toISOString().split("T")[0]
          : null,
      };

      if (formState.isUpdateInfo) {
        const response = await updateExperience(experienceData);
        if (response.length > 0) {
          updateAllCvInfo(experienceData);
          toast({
            description: "Experience updated successfully",
            variant: "succsses",
          });
        } else {
          toast({
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
      } else {
        const response = await insertExperienceInfo(experienceData);
        if (response.length > 0) {
          addNewExperience(experienceData);
          toast({
            description: "New experience added successfully",
            variant: "succsses",
          });
        } else {
          toast({
            description: "An unknown error occurred please try again",
            variant: "destructive",
          });
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        description: "An unknown error occurred please try again",
        variant: "destructive",
      });
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleInputChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // setActiveExperience((prev) => ({ ...prev, [name]: value }));
    },
    500
  );

  const { generateWithAI, isGenerating } = useAIGeneration(chatSession);
  const handleGenerateAI = async () => {
    const generatedContent = await generateWithAI(
      "Experience",
      form.getValues().jobTitle || "",
      form.getValues().description || ""
    );

    if (generatedContent) {
      form.setValue("description", generatedContent);
    }
  };

  const updateAllCvInfo = useCallback(
    (updatedExperience: InsertExperineces) => {
      dispatch({
        type: "SET_CV_EXPERIENCE",
        payload: sortExperiencesByDate(
          (state.allCvInfo.experience || []).map((exp) =>
            exp.id === updatedExperience.id ? updatedExperience : exp
          )
        ),
      });
    },
    [dispatch, state.allCvInfo.experience]
  );

  const addNewExperience = useCallback(
    (newExperience: InsertExperineces) => {
      dispatch({
        type: "SET_CV_EXPERIENCE",
        payload: sortExperiencesByDate([
          ...(state.allCvInfo.experience || []),
          newExperience,
        ]),
      });
    },
    [dispatch, state.allCvInfo.experience]
  );
  const resetForm = () => {
    form.reset({
      id: uuidv4(),
      jobTitle: "",
      employer: "",
      startDate: new Date(),
      endDate: undefined,
      country:undefined,
      state: undefined,
      description: undefined,
    });

    setFormState((prev) => ({ ...prev, isUpdateInfo: false }));
    setSelectedCountry("");
  };

  useEffect(() => {
    console.log("rendered");
    console.log(activeExperience.state);
    console.log(activeExperience.country);
  }, [activeExperience]);

  const handleEditExperience = (experience: InsertExperineces) => {
    form.reset({
      id: experience.id,
      jobTitle: experience.jobTitle,
      employer: experience.employer,
      startDate: new Date(experience.startDate),
      endDate: experience.endDate ? new Date(experience.endDate) : undefined,
      country: experience.country,
      state: experience.state || undefined,
      description: experience.description || undefined,
    });
    experience.country && setSelectedCountry(experience.country);
    setFormState((prev) => ({ ...prev, isUpdateInfo: true }));
  };
  return {
    form,
    activeExperience,
    setActiveExperience,
    formState,
    setFormState,
    onSubmit,
    handleInputChange,
    handleGenerateAI,
    isGenerating,
    resetForm,
    handleEditExperience,
    selectedCountry,
    setSelectedCountry,
  };
};

export default useExperienceForm;
