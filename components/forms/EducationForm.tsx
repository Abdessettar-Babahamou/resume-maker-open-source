import { useEducationForm } from "@/lib/hooks/useEducationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FormTitle from "./FormTitle";
import EducationItem from "../EducationItem";
import StepperControl from "../StepperControl";
import Editor from "react-simple-wysiwyg";
import { useAIGeneration } from "@/lib/hooks/useAIGeneration";
import { chatSession } from "@/services/AiModal";

function EducationForm() {
  // Custom hook to manage form state and logic
  const {
    form,
    education_item,
    isUpdateInfo,
    isLoading,
    selectedCountry,
    selectedState,
    countries,
    states,
    handleSubmit,
    handleInputChange,
    handleDescriptionChange,
    setIsUpdateInfo,
    setSelectedCountry,
    setSelectedState,
    handleEditEducation,
    resetForm,
  } = useEducationForm(); 

  // Custom hook for AI-powered content generation
  const { generateWithAI, isGenerating } = useAIGeneration(chatSession);

  // Function to handle AI-generated description
  const handleGenerateAI = async () => {
    const generatedContent = await generateWithAI(
      "education",
      form.getValues().degree || "",
      form.getValues().description || ""
    );

    if (generatedContent) {
      form.setValue("description", generatedContent);
    }
  };

  // Watch the degree field for changes
  const degree = form.watch("degree");

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left column: Education form */}
      <div className="flex flex-col gap-4">
        <FormTitle
          title="Tell us about your education"
          description="Include every school, even if you are a current student or did not graduate"
        />
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* School Name field */}
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the school name"
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
              {/* Degree field */}
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: Master's in network administration and security"
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
              {/* Field of Study field */}
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: Computer Science"
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
              {/* Start Date field */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Start Date</FormLabel>
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
                          onSelect={field.onChange}
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
              {/* End Date field */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>End Date</FormLabel>
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
              {/* Country field */}
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
              {/* State field */}
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
                          setSelectedState(value);
                        }}
                        value={selectedState}
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
              Description
              <Button
                className="text-white"
                disabled={!degree}
                type="button"
                onClick={handleGenerateAI}
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Re-write with AI"
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
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form submission and reset buttons */}
            <StepperControl isLoading={isLoading}>
              <Button type="submit" className="text-white" disabled={isLoading}>
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
                {"Clear "}
              </Button>
            </StepperControl>
          </form>
        </Form>
      </div>

      {/* Right column: Display existing education items */}
      <div className="flex flex-col gap-2 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm shadow-sm p-4 h-[calc(100vh-238px)]">
        <h2 className="text-xl font-semibold capitalize">Your education </h2>
        <div className="flex flex-col gap-2 h-full overflow-y-scroll">
          {education_item?.length == 0 ? (
            <div>You do not have any educations</div>
          ) : (
            education_item?.map((item, index) => (
              <EducationItem
                key={item.id}
                education={item}
                handleEditEducation={handleEditEducation}
                setIsUpdateInfo={setIsUpdateInfo}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EducationForm;
