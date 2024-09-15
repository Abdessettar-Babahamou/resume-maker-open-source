"use client";
import React, { useEffect, useRef, useState } from "react";
import FormTitle from "./FormTitle";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import StepperControl from "../StepperControl";
import { useStepper } from "@/lib/context/StepperContex";
import { v4 as uuidv4 } from "uuid";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { InsertCvProfile } from "@/lib/db/schema";
import { useToast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { useAIGeneration } from "@/lib/hooks/useAIGeneration";
import { insertCvProfileToDB, updateCvProfile } from "@/lib/db/queries";
import { chatSession } from "@/services/AiModal";
import Editor from "react-simple-wysiwyg";
import { phoneRegex } from "@/lib/constant";

// Define the form schema using Zod for validation

const formSchema = z.object({
  fullName: z.string(),
  phoneNumber: z.string().min(10, { message: "Phone Number must contain at least 10 character(s)" }).regex(phoneRegex, 'Invalid Number!'),
  emailAddress: z
    .string({ required_error: "Please select an email to display." })
    .email(),
  linkdenUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  personalWeb: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  country: z.string({ required_error: "Please select your country." }),
  state: z.string().optional(),
  city: z.string().optional(),
  summary: z.string().optional(),
  jobTitle: z.string().min(4, { message: "Please enter tour job title" }),
});

// Define a type for the form status
type FormStatus = "idle" | "loading" | "updating";

export default function ProfileForm() {
  const [country, setCountry] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [location, setLocation] = useState<{
    country: string;
    state: string;
  }>({ country: "", state: "" });

  // Combined state for form status
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");

  const { toast } = useToast();
  const params = useParams();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { state: cvInfoState, dispatch: cvInfoDispatch } = useCvInfo();
  const { dispatch: stepperDispatch } = useStepper();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: undefined,
      state: undefined,
      city: undefined,
      summary: undefined,
    },
  });

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      const countries = await Country.getAllCountries();
      setCountry(countries);
    };

    loadCountries();
  }, []);

  // Load states when country is selected
  useEffect(() => {
    if (location.country) {
      const loadStatesOfCountry = async () => {
        const states = await State.getStatesOfCountry(
          location.country.split("-")[0] || ""
        );
        setStates(
          states.sort((a, b) => parseInt(a.isoCode) - parseInt(b.isoCode))
        );
      };
      loadStatesOfCountry();
    }
  }, [location.country]);

  // Load cities when state is selected
  useEffect(() => {
    if (location.state) {
      const loadCities = async () => {
        const [countryCode, stateCode] = location.state.split("-");
        const cities = await City.getCitiesOfState(countryCode, stateCode);
        setCities(cities);
      };
      loadCities();
    }
  }, [location.state]);

  // Populate form with existing data if available
  useEffect(() => {
    const { ProfileInfo } = cvInfoState.allCvInfo;

    if (ProfileInfo) {
      console.log(ProfileInfo);
      form.reset({
        fullName: ProfileInfo.fullName,
        phoneNumber: ProfileInfo.phoneNumber,
        emailAddress: ProfileInfo.emailAddress,
        country: ProfileInfo.country,
        jobTitle: ProfileInfo.jobTitle,
        linkdenUrl: ProfileInfo.linkdenUrl || undefined,
        personalWeb: ProfileInfo.personalWeb || undefined,
        state: ProfileInfo.state || undefined,
        city: ProfileInfo.city || undefined,
        summary: ProfileInfo.summary || undefined,
      });
      setFormStatus("updating");
      setLocation({
        country: ProfileInfo.country,
        state: ProfileInfo.state || "",
      });
    }
  }, [cvInfoState]);

  const jobeTitle = form.watch("jobTitle");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setFormStatus("loading");
      const profileData = {
        id: uuidv4(),
        resumeId: params.cvId.toString(),
        ...values,
        country: location.country,
        state: location.state,
      } as InsertCvProfile;

      if (formStatus === "updating") {
        const response = await updateCvProfile(profileData);
        if (response.length > 0) {
          cvInfoDispatch({ type: "SET_CV_PROFILE", payload: profileData });
          toast({
            description: "Your information has been updated",
            variant: "succsses",
          });
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        const response = await insertCvProfileToDB(profileData);
        if (response.length > 0) {
          toast({
            description: "Your information has been saved",
            variant: "succsses",
          });
          cvInfoDispatch({ type: "SET_CV_PROFILE", payload: profileData });
        } else {
          throw new Error("Failed to insert profile");
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        description: "An error occurred while saving your information",
        variant: "destructive",
      });
    } finally {
      setFormStatus("idle");
    }
  };

  const { generateWithAI, isGenerating } = useAIGeneration(chatSession);
  const handleGenerateAI = async () => {
    try {
      const generatedContent = await generateWithAI(
        "Job",
        form.getValues("jobTitle") || "",
        form.getValues("summary") || ""
      );

      if (generatedContent) {
        form.reset({ ...form.getValues(), summary: generatedContent });
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast({
        description: "An error occurred while generating AI content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <FormTitle
        title={"Let employers know who you are"}
        description={
          "Include your full name and an email for employers to contact you"
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="test"
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkdenUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.linkedin.com/in/johndoe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalWeb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.johndoe.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setLocation((prev) => ({ ...prev, country: value }));
                      field.onChange(value);
                    }}
                    value={location.country}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {country.map((item, index) => (
                        <SelectItem
                          key={item.phonecode + index}
                          value={`${item.isoCode}-${item.name}`}
                        >
                          <div className="flex gap-2">
                            <span>{item.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {states.length > 0 && (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setLocation((prev) => ({ ...prev, state: value }));
                        field.onChange(value);
                      }}
                      value={location.state}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((item, index) => (
                          <SelectItem
                            key={item.isoCode + index + item.name}
                            value={`${item.countryCode}-${item.isoCode}-${item.name}`}
                          >
                            <div className="flex gap-2">
                              <span>{item.isoCode}</span>
                              <span>{item.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {cities.length > 0 && (
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((item, index) => (
                          <SelectItem
                            key={item.name + index}
                            value={`${item.name}`}
                          >
                            <div className="flex gap-2">
                              <span>{item.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="md:max-w-[calc(100%-50%)]">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex w-full justify-between items-center">
                      Summary
                      <Button
                        className="dark:text-white"
                        disabled={!jobeTitle}
                        type="button"
                        onClick={handleGenerateAI}
                      >
                        {isGenerating ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Rewrite with AI"
                        )}
                      </Button>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <StepperControl isLoading={formStatus === "loading"}>
            <Button
              type="submit"
              className="dark:text-white"
              disabled={formStatus === "loading"}
            >
              {formStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : formStatus === "updating" ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </StepperControl>
        </form>
      </Form>
    </div>
  );
}
