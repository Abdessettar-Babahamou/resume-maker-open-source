import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { useToast } from "@/components/ui/use-toast";
import { insertEducationInfo, updateEducation } from "@/lib/db/queries";
import { InsertEducations } from "@/lib/db/schema";
import { Country, State } from "country-state-city";

// Define form schema
const formSchema = z.object({
  id: z.string(),
  schoolName: z
    .string()
    .min(2, { message: "School name must be at least 2 characters" }),
  degree: z
    .string()
    .min(2, { message: "Degree must be at least 2 characters" }),
  fieldOfStudy: z
    .string()
    .min(2, { message: "Field of study must be at least 2 characters" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  country: z.string({ required_error: "Country is required" }),
  state: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const useEducationForm = () => {
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined
  );

  const [selectedState, setSelectedState] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const { state, dispatch } = useCvInfo();
  const { toast } = useToast();
  const params = useParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      id: uuidv4(),
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: new Date(),
      endDate: undefined,
      country: selectedCountry,
      state: selectedState,
      description: undefined,
    },
  });

  useEffect(() => {
    const loadCountries = async () => {
      const allCountries = await Country.getAllCountries(); 
      setCountries(allCountries);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(
        selectedCountry.split("-")[0]
      ).sort(
        (a, b) => parseInt(a.isoCode) - parseInt(b.isoCode)
      );
      setStates(countryStates);
    }
  }, [selectedCountry]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setIsLoading(true);
        const educationData: InsertEducations = {
          ...values,
          country: selectedCountry || "",
          state: selectedState || "",
          resumeId: params.cvId as string,
          startDate: values.startDate.toISOString().split("T")[0],
          endDate: values.endDate ? values.endDate.toISOString().split("T")[0] : null,
        };
        
        if (isUpdateInfo) {
          const response = await updateEducation(educationData);
          if (response.length > 0) {
            const newEducations = state.allCvInfo.education?.map((edu) =>
              edu.id === educationData.id ? educationData : edu
            );
            dispatch({
              type: "SET_CV_EDUCATION",
              payload: sortEducations(newEducations || []),
            });
            toast({
              description: "Education information updated",
              variant: "succsses",
              
            });
            resetForm();
          } else {
            toast({
              description: "An error occurred while saving your information",
              variant: "destructive",
            });
          }
        } else {
          const response = await insertEducationInfo({
            ...educationData,
          });

          if (response.length > 0) {
            dispatch({
              type: "SET_CV_EDUCATION",
              payload: sortEducations([
                ...(state.allCvInfo.education || []),
                educationData,
              ]),
            });
            toast({ description: "New education added", variant: "succsses" });
            resetForm();
          } else {
            toast({
              description: "An error occurred while saving your information",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error saving education information:", error);
        toast({
          description: "An error occurred while saving your information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      selectedCountry,
      selectedState,
      isUpdateInfo,
      params.cvId,
      state.allCvInfo.education,
      dispatch,
      toast,
    ]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // setActiveEducation((prev) => ({ ...prev, [name]: value }));
      form.setValue(name as keyof FormValues, value);
    },
    [form]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      // setActiveEducation((prev) => ({ ...prev, description: value }));
      form.setValue("description", value);
    },
    [form]
  );
  const resetForm = () => {
    form.reset({
      id:uuidv4(),
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: undefined,
      endDate: undefined,
      country: undefined,
      state: undefined,
      description: undefined,
    });
    console.log("reset");
    setSelectedCountry("");
    setSelectedState("");
    setIsUpdateInfo(false);
    setStates([])
   
  };

  const sortEducations = (educations: InsertEducations[]) => {
    return educations.sort(
      (a, b) =>
        new Date(b.startDate || "").getTime() -
        new Date(a.startDate || "").getTime()
    );
  };

  const handleEditEducation = (education: InsertEducations) => {
    form.reset({
      id: education.id || "",
      description: education.description || "",
      country: education.country || "",
      schoolName: education.schoolName || "",
      degree: education.degree || "",
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate
        ? new Date(education.startDate)
        : undefined,
      state: education.state || undefined,
      endDate: education.endDate ? new Date(education.endDate) : undefined,
    });
    education.country && setSelectedCountry(education.country);
    education.state && setSelectedState(education.state);
  };
  return {
    form,
    education_item: state.allCvInfo.education,
    isUpdateInfo,
    isLoading,
    selectedCountry,
    selectedState,
    countries,
    states,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleInputChange,
    handleDescriptionChange,
    setIsUpdateInfo,
    setSelectedCountry,
    setSelectedState,
    handleEditEducation,
    resetForm,
  };
};
