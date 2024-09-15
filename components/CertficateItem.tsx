"use client";

import { useCvInfo } from "@/lib/context/CvInfoContext";
import { deleteCertificate } from "@/lib/db/queries";
import { InsertCertficate } from "@/lib/db/schema";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { formatDate } from "date-fns";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import DeleteDialog from "./DeleteCvDialog";

interface CertificateItemProps {
  certificate: InsertCertficate;
  handlEditCertificate: (data: InsertCertficate) => void;
  index: number;
}

function CertificateItem({
  certificate,
  handlEditCertificate,
  index,
}: CertificateItemProps) {
  const { dispatch } = useCvInfo();
  const { toast } = useToast();

  const removeCertificate = async () => {
    try {
      await deleteCertificate(certificate);
      toast({
        title: "Certificate deleted",
        description: "The certificate has been successfully removed",
        variant: "default",
      });

      dispatch({ type: "DELETE_CERTIFICATES", payload: certificate });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast({
        title: "Error",
        description: "Failed to delete the certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.1 * (index + 1) }}
      className="flex flex-col gap-2 bg-white dark:bg-dark_main_bg p-2 rounded-sm"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{certificate.certificateName}</h3>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete Certificate"
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <DeleteDialog
              itemType="Certificate"
              onDelete={async () => {
                await removeCertificate();
              }}
            />
          </AlertDialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlEditCertificate(certificate)}
            aria-label="Edit Certificate"
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{certificate.issuedBy}</span>
        <div className="flex justify-center items-center">
          <span className="text-xs text-gray-500">
            {certificate.startDate
              ? formatDate(new Date(certificate.startDate), "MMMM yyyy")
              : "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(CertificateItem);
