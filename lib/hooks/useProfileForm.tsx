import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { useAIGeneration } from "@/lib/hooks/useAIGeneration";
import { chatSession } from "@/services/AiModal";
import { insertCvProfileToDB, updateCvProfile } from "@/lib/db/queries";
import { InsertCvProfile } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { useLocationData } from "./useLocationData";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long" }),
  emailAddress: z
    .string({ required_error: "Please enter an email address." })
    .email({ message: "Please enter a valid email address." }),
  linkdenUrl: z
    .string()
    .url({ message: "Please enter a valid LinkedIn URL" })
    .optional()
    .or(z.literal("")),
  personalWeb: z
    .string()
    .url({ message: "Please enter a valid website URL" })
    .optional()
    .or(z.literal("")),
  country: z.string({ required_error: "Please select your country." }),
  state: z.string().optional(),
  city: z.string().optional(),
  summary: z.string().optional(),
  jobTitle: z
    .string()
    .min(4, { message: "Job title must be at least 4 characters long" }),
});

export function useProfileForm() {
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const { state: cvInfoState, dispatch: cvInfoDispatch } = useCvInfo();
  const { generateWithAI, isGenerating } = useAIGeneration(chatSession);
  const { country, states, cities, location, setLocation ,setCities } = useLocationData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      linkdenUrl: "",
      personalWeb: "",
      country: "",
      state: "",
      city: "",
      summary: "",
      jobTitle: "",
    },
  });

  useEffect(() => {
    if (cvInfoState.allCvInfo.ProfileInfo) {
      const { ProfileInfo } = cvInfoState.allCvInfo;
      form.reset({
        fullName: ProfileInfo.fullName || "",
        phoneNumber: ProfileInfo.phoneNumber || "",
        emailAddress: ProfileInfo.emailAddress || "",
        linkdenUrl: ProfileInfo.linkdenUrl || "",
        personalWeb: ProfileInfo.personalWeb || "",
        country: ProfileInfo.country || "",
        state: ProfileInfo.state || "",
        city: ProfileInfo.city || "",
        summary: ProfileInfo.summary || "",
        jobTitle: ProfileInfo.jobTitle || "",
      });
      setLocation((prev) => ({
        ...prev,
        country: ProfileInfo.country || "",
        state: ProfileInfo.state || "",
        city:ProfileInfo.city || "",
      }));

      setCities(cities)
      setIsUpdateInfo(true);
    }
  }, [cvInfoState, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const profileData: InsertCvProfile = {
        id: uuidv4(),
        resumeId: params.cvId as string,
        ...values,
      };

      if (isUpdateInfo) {
        await updateCvProfile(profileData);
        toast({
          title: "Profile updated successfully",
          description: "Your profile information has been updated.",
        });
      } else {
        await insertCvProfileToDB(profileData);
        toast({
          title: "Profile created successfully",
          description: "Your profile information has been saved.",
        });
      }

      cvInfoDispatch({ type: "SET_ALL_CV_INFO", payload: profileData });
      setIsUpdateInfo(true);
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast({
        title: "Error",
        description:
          "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    const jobTitle = form.getValues("jobTitle");
    if (!jobTitle) {
      toast({
        title: "Job Title Required",
        description: "Please enter a job title before generating a summary.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Generate a professional summary for a ${jobTitle} position. The summary should be concise, highlighting key skills and experiences relevant to the role.`;

    try {
      const generatedSummary = await generateWithAI(
        "Job",
        form.getValues("jobTitle") || "",
        form.getValues("summary") || ""
      );
      if (generatedSummary) {
        form.setValue("summary", generatedSummary);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description:
          "There was an error generating the summary. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    isUpdateInfo,
    isLoading,
    handleSubmit,
    handleGenerateAI,
    isGenerating,
    country,
    states,
    cities,
    location,
    setLocation,
  };
}
