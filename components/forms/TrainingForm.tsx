'use client'
import FormTitle from "./FormTitle";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import StepperControl from "../StepperControl";
import { useStepper } from "@/lib/context/StepperContex";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, Loader2, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Editor from "react-simple-wysiwyg";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
import { Textarea } from "../ui/textarea";
import EducationItem from "../EducationItem";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { useParams } from "next/navigation";
import {
  getTrainings,
  insertTrainingInfo,
  updateTraining,
} from "@/lib/db/queries";
import TrainingItem from "../TrainingItem";
import { useToast } from "../ui/use-toast";
import { InsertTraining } from "@/lib/db/schema";
import { useDebouncedCallback } from "use-debounce";
import { useTrainingForm } from "@/lib/hooks/useTrainingForm";

function TrainingForm() {
  const params = useParams();
  const {
    form,
    isLoading,
    isUpdateInfo,
    setIsUpdateInfo,
    onSubmit,
    resetForm,
    handleEditTraining,
  } = useTrainingForm(params.cvId.toString());

  const { state } = useCvInfo();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4 ">
        <FormTitle
          title={"Tell us what type of training you did"}
          description={"Let hiring managers know what you've learned."}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="trainingTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Title</FormLabel>
                  <FormControl onChange={field.onChange}>
                    <Input
                      placeholder="ex: Advanced JavaScript Course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl onChange={field.onChange}>
                      <Input
                        placeholder="ex: Udemy"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          captionLayout="dropdown-buttons"
                          fromYear={1960}
                          toYear={2025}
                          selected={field.value}
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
            <div className="flex justify-between items-center m-0 p-0 !my-3">
              <FormLabel>Description</FormLabel>
            </div>
            <p className="m-0 p-0 text-gray-600 !my-1 text-sm">
              Please describe the training you completed.
            </p>
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
            <div className="flex p-4 bg-[#f5f8fa] rounded-sm dark:bg-dark_sec_bg">
              <p>
                Don&apos;t have any training to include?{" "}
                <span className="font-semibold text-primary">
                  Skip section.
                </span>{" "}
              </p>
            </div>

            <StepperControl isLoading={isLoading}>
              <Button type="submit" className="text-white"  disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin " />
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
      <div className="flex flex-col gap-2 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm shadow-sm p-4">
        <h2 className="text-xl font-semibold capitalize">Your Training</h2>

        {state.allCvInfo.training?.length === 0 ? (
          <div>You do not have any Trainings</div>
        ) : (
          state.allCvInfo.training?.map((item, index) => (
            <TrainingItem
              index={index}
              key={item.id}
              training={item}
              handleEditTraining={handleEditTraining}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TrainingForm;
