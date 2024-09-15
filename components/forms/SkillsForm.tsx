'use client'
import React from "react";
import FormTitle from "./FormTitle";
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
import StepperControl from "../StepperControl";
import { Loader2 } from "lucide-react";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import SkillsItem from "../SkillsItem";
import { useSkillsForm } from "@/lib/hooks/useSkillsForm";

function SkillsForm() {
  // Custom hook to manage skills form state and logic
  const {
    form,
    isEditing,
    isLoading,
    onSubmit,
    resetForm,
    handleSkillEdit,
    setIsEditing,
  } = useSkillsForm();

  // Access the global CV info state
  const { state } = useCvInfo();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left column: Skills form */}
      <div className="flex flex-col gap-4">
        <FormTitle
          title="Tell us about your skills"
          description="Let hiring managers know what your skills are."
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Skill Name field */}
            <FormField
              control={form.control}
              name="skillsName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl onChange={field.onChange}>
                    <Input
                      placeholder="e.g., JavaScript, Project Management"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skip section message */}
            <div className="flex p-4 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm">
              <p>
                Don&apos;t have skills to include?{" "}
                <span className="font-semibold text-primary">
                  Skip section.
                </span>
              </p>
            </div> 

            {/* Form submission and reset buttons */}
            <StepperControl>
              <Button type="submit" className="text-white" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isEditing ? (
                  "Update"
                ) : (
                  "Add Skill" 
                )}
              </Button>
              <Button
                className="bg-red-400 text-white"
                type="button"
                onClick={resetForm}
              >
                Clear
              </Button>
            </StepperControl>
          </form>
        </Form>
      </div>

      {/* Right column: Display existing skills */}
      <div className="flex flex-col gap-2 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm shadow-sm p-4 h-[calc(100vh-238px)]">
        <h2 className="text-xl font-semibold capitalize">Your Skills</h2>
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          {/* Display message if no skills, otherwise map through skills */}
          {state.allCvInfo.skills?.length === 0 ? (
            <div>You do not have any skills listed</div>
          ) : (
            state.allCvInfo.skills?.map((item, index) => (
              <SkillsItem
                key={item.id}
                skills={item}
                handleSkillEdit={handleSkillEdit}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillsForm;
