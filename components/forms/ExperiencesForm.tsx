"use client";
import React, { useMemo } from "react";
import { Country, State } from "country-state-city";
import Editor from "react-simple-wysiwyg";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import {
  Form, 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import FormTitle from "./FormTitle";
import StepperControl from "../StepperControl";
import ExperienceItem from "../ExperienceItem";
import { cn } from "@/lib/utils";
import useExperienceForm from "@/lib/hooks/useExperienceForm";
import { useCvInfo } from "@/lib/context/CvInfoContext";

function ExperiencesForm() {
  // Custom hook to manage form state and logic
  const {
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
  } = useExperienceForm();

  const { isUpdateInfo, isLoading, aiIsLoading } = formState;
  const { state, dispatch } = useCvInfo();

  // Memoize countries and states to prevent unnecessary re-renders
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () =>
      State.getStatesOfCountry(selectedCountry?.split("-")[0] || "").sort(
        (a, b) => parseInt(a.isoCode) - parseInt(b.isoCode)
      ),
    [selectedCountry]
  );

  // Watch the jobTitle field for changes
  const jobeTitle = form.watch("jobTitle");

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left column: Experience form */}
      <div className="flex flex-col gap-4">
        <FormTitle
          title="Tell us where you worked"
          description="Let hiring managers know where you worked and what you accomplished"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Form fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title field */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Software Engineer"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Google"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          fromYear={1960}
                          toYear={2025}

                          selected={field.value}
                          onSelect={(value) => {
                            field.onChange(value);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                               format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start"> 
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          fromYear={1960}
                          toYear={2025}

                          selected={field.value}
                          onSelect={(value) => {
                            field.onChange(value);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        field.onChange(value);
                        setSelectedCountry(value);
                      }}
                      value={selectedCountry}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.isoCode}
                            value={`${country.isoCode}-${country.name}`}
                          >
                            {country.name}
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
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem
                              key={state.isoCode}
                              value={`${state.countryCode}-${state.isoCode}-${state.name}`}
                            >
                              <div className="flex gap-2  ">
                                <span>{state.isoCode}</span>
                                <span>{state.name}</span>
                              </div>
                              {}
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

            {/* Description section with AI generation button */}
            <div className="flex justify-between items-center m-0 p-0 !my-3">
              <FormLabel>Description</FormLabel>
              <Button
              className="text-white"
                type="button"
                onClick={handleGenerateAI}
                disabled={jobeTitle ? jobeTitle.length === 0 : false}
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Generate with AI"
                )}
              </Button>
            </div>

            {/* Description input field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
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

            {/* Skip section message */}
            <div className="flex p-4 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm">
              <p>
                Don&apos;t have work experience to include?{" "}
                <span className="font-semibold text-primary">
                  Skip section.
                </span>
              </p>
            </div>

            {/* Form submission and reset buttons */}
            <StepperControl isLoading={isLoading}>
              <Button type="submit" className="text-white" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isUpdateInfo ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                type="button"
                className="bg-red-400 text-white" 
                 onClick={resetForm}
                disabled={isLoading}
              >
                Clear
              </Button>
            </StepperControl>
          </form>
        </Form>
      </div>

      {/* Right column: Display existing experiences */}
      <div className="flex flex-col flex-1 gap-2 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm shadow-sm p-4 h-[calc(100vh-238px)]">
        <h2 className="text-xl font-semibold capitalize">Your Experiences</h2>
        <div className="flex flex-col gap-2 h-full overflow-y-scroll">
          {/* Display message if no experiences, otherwise map through experiences */}
          {state.allCvInfo.experience?.length === 0 ? (
            <div>You do not have any experiences</div>
          ) : (
            state.allCvInfo.experience?.map((item, index) => (
              <ExperienceItem
                key={item.id}
                experience={item}
                handleEditExperience={handleEditExperience}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ExperiencesForm);
