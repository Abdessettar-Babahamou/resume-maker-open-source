"use client";
import { useCertificateForm } from "@/lib/hooks/useCertificateForm";
import FormTitle from "./FormTitle";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import Editor, { ContentEditableEvent } from "react-simple-wysiwyg";
import CertficateItem from "../CertficateItem";
import { useAIGeneration } from "@/lib/hooks/useAIGeneration";
import { chatSession } from "@/services/AiModal";

function CertificateForm() {
  const {
    form,
    resetForm,
    isUpdateInfo,
    setIsUpdateInfo,
    isLoading,
    handleSubmit,
    handleEditCertificate,
  } = useCertificateForm();

  const { state } = useCvInfo();

  console.log("rendering");



  const handleDescriptionChange = (e: ContentEditableEvent) => {
    // setActiveCertificate((prev) => ({ ...prev, description: e.target.value }));
  };

  const onSubmit = form.handleSubmit(handleSubmit);
  const name = form.watch("certificateName");

  const { generateWithAI, isGenerating } = useAIGeneration(chatSession);
  const handleGenerateAI = async () => {
    const generatedContent = await generateWithAI(
      "Certificate",
      form.getValues().certificateName || "",
      form.getValues().description || ""
    );

    if (generatedContent) {
      form.setValue("description", generatedContent);
    }
  };
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Certificate Form */}
      <div className="flex flex-col gap-4">
        <FormTitle
          title="License or Certification"
          description="Include any professional licenses or certifications you have received"
        />
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="certificateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Name</FormLabel>
                  <FormControl onChange={field.onChange}>
                    <Input
                      placeholder="ex:university Kasdi Merbah Ouargla"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* degree */}
              <FormField
                control={form.control}
                name="issuedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Authority</FormLabel>
                    <FormControl onChange={field.onChange}>
                      <Input
                        placeholder="ex: Master's in network administration and security"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Issued date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Issued Date</FormLabel>
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
                              format(field.value, "yyy-MM-dd")
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
                            // setActiveCertificate({
                            //   ...activeCertificate,
                            //   startDate: e?.toLocaleDateString(),
                            // });
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
              <span>Description</span>
              <Button
                className="text-white"
                disabled={name ? name.length === 0 : false}
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
            <p className="m-0 p-0 text-gray-600 !my-1 text-sm">
              Please describe the certificate you obtained.
            </p>
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

            <div className="flex p-4 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm">
              <p>
                Dont have any Certificates?{" "}
                <span className="font-semibold text-primary">
                  Skip section. 
                </span>{" "}
              </p>
            </div>

            <StepperControl isLoading ={isLoading}>
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
      {/* Certificate List */}
      <div className="flex flex-col gap-2 bg-[#f5f8fa] dark:bg-dark_sec_bg rounded-sm shadow-sm p-4">
        <h2 className="text-xl font-semibold capitalize">Your Certificates</h2>

        {state.allCvInfo.certificate?.length === 0 ? (
          <div>You do not have any Certificates</div>
        ) : (
          state.allCvInfo.certificate?.map((item, index) => (
            <CertficateItem
              key={item.id}
              certificate={item}
              handlEditCertificate={handleEditCertificate}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CertificateForm;
