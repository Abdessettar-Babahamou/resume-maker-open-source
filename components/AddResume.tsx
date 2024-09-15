"use client";
import { Loader2, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";
import { createResume } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

interface AddResumeProps {
  onResumeCreated?: () => void;
  triggerComponent?: React.ReactNode;
}

function AddResume({ onResumeCreated, triggerComponent }: AddResumeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeName, setResumeName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { refresh } = useRouter();

  const { user, isSignedIn } = useUser();

  const handleCreateResume = async () => {
    setIsLoading(true);
    try {
      await createResume({
        id: uuidv4(),
        name: resumeName,
        userId: user?.id!,
      });
      setIsLoading(false);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "The new CV has been created successfully",
        variant: "succsses",
      });
      refresh();
      if (onResumeCreated) {
        onResumeCreated();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create the CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.1 }}
      className="flex items-center justify-center rounded-md shadow-sm w-[240px] h-[280px] p-14 py-24 bg-primary cursor-pointer hover:scale-105 transition-all ease-in-out"
    >
      <PlusCircle className="text-white" size={60} />
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogTrigger asChild>
        {triggerComponent || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="dark:bg-dark_model_color shadow-md p-0 py-4 w-[calc(100%-20px)] rounded-md">
        <DialogHeader className="">
          <DialogTitle className="text-xl font-semibold px-4">
            Create a resume
          </DialogTitle>
        </DialogHeader>
        <Separator className="dark:bg-[#334155]" />{" "}
        <div className="flex flex-col gap-4  w-full">
          <div className="grid w-full  items-center gap-3 px-4">
            <Label htmlFor="picture" className="text-base">
              Resume Name *
            </Label>
            <Input
              id="picture"
              type="text"
              className="focus-visible:ring-0 focus-visible:ring-offset-0
              focus:border-2 focus:border-primary transition-all ease-in-out
              "
              onChange={(e) => {
                setResumeName(e.target.value);
              }}
              placeholder="Enter here..."
            />
          </div>
          <Separator className="dark:bg-[#334155]" />{" "}
          <div className="flex items-end justify-end gap-4 px-4">
            <Button
              className="px-8 text-white"
              onClick={() => {
                handleCreateResume();
              }}
              disabled={!resumeName}
            >
              {isLoading ? <Loader2 className="animate-spin " /> : "Create"}
            </Button>
            <Button
              className="px-8 text-white bg-red-500 hover:bg-red-600"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddResume;
