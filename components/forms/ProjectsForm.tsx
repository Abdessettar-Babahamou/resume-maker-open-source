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
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Editor from "react-simple-wysiwyg";
import ProjectItem from "../ProjectItem";
import { useProjectForm } from "@/lib/hooks/useProjectForm";

function ProjectsForm() {
  // Custom hook to manage project form state and logic
  const {
    form,
    isUpdateInfo,
    setIsUpdateInfo,
    isLoading,
    onSubmit,
    resetForm,
    handleEditProject,
    projects,
  } = useProjectForm();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left column: Project form */}
      <div className="flex flex-col gap-4">
        <FormTitle
          title="Tell us what you build"
          description="Let hiring managers know what you built."
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Project Title field */}
            <FormField
              control={form.control}
              name="projectTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl onChange={field.onChange}>
                    <Input placeholder="e.g., E-commerce Platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Name and Created Date fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl onChange={field.onChange}>
                      <Input
                        placeholder="e.g., Master's in network administration and security"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Created Date field with calendar popup */}
              <FormField
                control={form.control}
                name="createdDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Created Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                          selected={field.value}
                          captionLayout="dropdown-buttons"
                          fromYear={1960}
                          toYear={2025}
                          onSelect={(e) => {
                            field.onChange(e);
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
            </div>

            {/* Project URL field */}
            <FormField
              control={form.control}
              name="projectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl onChange={field.onChange}>
                    <Input placeholder="e.g., https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description field */}
            <div className="flex justify-between items-center m-0 p-0 !my-3">
              <FormLabel>Description</FormLabel>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChange={field.onChange}
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
                Don&apos;t have projects to include?{" "}
                <span className="font-semibold text-primary">
                  Skip section.
                </span>{" "}
              </p>
            </div>

            {/* Form submission and reset buttons */}
            <StepperControl isLoading={isLoading}>
              <Button type="submit" className="text-white"  disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isUpdateInfo ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                className="bg-red-400 text-white"
                type="button"
                onClick={resetForm}
                disabled={isLoading}
              >
                Clear
              </Button>
            </StepperControl>
          </form>
        </Form>
      </div>

      {/* Right column: Display existing projects */}
      <div className="flex flex-col gap-2 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm shadow-sm p-4">
        <h2 className="text-xl font-semibold capitalize">Your Projects</h2>
        {projects.length === 0 ? (
          <div>You do not have any Projects</div>
        ) : (
          projects.map((item, index) => (
            <ProjectItem
              key={item.id}
              project={item}
              handleEditProject={handleEditProject}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectsForm;
