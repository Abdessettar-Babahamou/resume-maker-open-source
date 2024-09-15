import { useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { insertCertificateInfo, updateCertificate } from "@/lib/db/queries";
import { InsertCertficate } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({  
  id: z.string(),
  certificateName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  issuedBy: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  startDate: z.date({ required_error: "A start date is required." }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const useCertificateForm = () => {

  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { toast } = useToast();
  const { dispatch } = useCvInfo();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      certificateName: "",
      issuedBy: "",
      description: undefined,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      const certificateData = {
        ...values,
        resumeId: params.cvId as string,
        startDate: values.startDate.toISOString().split("T")[0],
      };

      const action = isUpdateInfo ? updateCertificate : insertCertificateInfo;
      const response = await action(certificateData);

      if (response.length > 0) {
        dispatch({
          type: isUpdateInfo ? "UPDATE_CERTIFICATES" : "ADD_CERTIFICATE",
          payload: certificateData,
        });

        toast({
          title: "Success",
          description: isUpdateInfo
            ? "Certificate updated"
            : "New certificate added",
          variant: "succsses",
        });

        setIsUpdateInfo(false);
        resetForm();
      } else {
        throw new Error("Failed to save certificate");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save certificate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    form.reset({ id: uuidv4(), certificateName: "" ,description:undefined });
    setIsUpdateInfo(false);
  };
  const handleEditCertificate = (certificate: InsertCertficate) => {
    form.reset({
      id: certificate.id,
      certificateName: certificate.certificateName || '',
      issuedBy: certificate.issuedBy || '',
      startDate: certificate.startDate ? new Date(certificate.startDate) : undefined,
      description: certificate.description || undefined,
    });
    setIsUpdateInfo(true);
  };

  return {
    form,
    resetForm,
     isUpdateInfo,
    setIsUpdateInfo,
    isLoading,
    handleSubmit,
    handleEditCertificate,
   };
};

// export const useAIGeneration = () => {
//   const [aiIsLoading, setAiIsLoading] = useState(false);

//   const generateWithAI = async (certificate: InsertCertficate) => {
//     // Implement your AI generation logic here
//     // This is a placeholder implementation
//     setAiIsLoading(true);
//     // Simulating API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setAiIsLoading(false);
//     return "AI generated description";
//   };

//   return { aiIsLoading, generateWithAI };
// };
