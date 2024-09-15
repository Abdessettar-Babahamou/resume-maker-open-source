"use client";

import { useStepper } from "@/lib/context/StepperContex";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

enum StepStatus {
  Active = "active",
  Complete = "complete",
  Pending = "pending"
}

const stepCircleClasses = {
  [StepStatus.Active]: "bg-primary text-white shadow-[0px_0px_6px_2px_#8576FF]",
  [StepStatus.Pending]: "bg-[#dde1ea] dark:bg-dark_sec_bg",
  [StepStatus.Complete]: "bg-green-500",
};

const stepTitleClasses: Record<StepStatus, string> = {
  [StepStatus.Active]: "text-primary font-semibold",
  [StepStatus.Complete]: "",
  [StepStatus.Pending]: "",
};

function Step({
  title,
  isLast,
  index,
}: {
  index: number;
  title: string;
  isLast: boolean;
}) {
  const { state } = useStepper();

  const status: StepStatus =
    state.activeStep === index
      ? StepStatus.Active
      : state.activeStep > index
      ? StepStatus.Complete
      : StepStatus.Pending;

  const stepDelay = index * 0.3; // Base delay for each step
  const animationDuration = 0.2; // Duration for each animation

  return ( 
    <div 
      className="flex flex-1 items-center"
      role="listitem"
      aria-current={status === StepStatus.Active ? "step" : undefined}
    >
      <div className="relative flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: animationDuration, delay: stepDelay }}
          className={cn(
            "rounded-full transition-all duration-500 ease-in-out border md:border-2 border-gray-300 dark:border-primary w-6 h-6 md:w-12 md:h-12 flex items-center justify-center py-3 shadow-[0px_0px_8px_4px_#dde1ea] dark:shadow-dark_sec_bg",
            stepCircleClasses[status]
          )}
        >
          {status === StepStatus.Complete ? <Check className="text-white" /> : index + 1}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration, delay: stepDelay + animationDuration }}
          className={cn(
            "absolute top-0 mt-16 md:mt-16 w-32 !-rotate-90 md:!rotate-0 text-center text-[10px] font-medium uppercase text-gry_text",
            stepTitleClasses[status]
          )}
        >
          {title}
        </motion.div>
      </div>
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: animationDuration, delay: stepDelay + (animationDuration * 2) }}
          className={cn(
            `flex-auto border-t-2 dark:border-white/90 transition-all duration-500 ease-in-out`,
            {
              "border-green-500": status === StepStatus.Complete,
            }
          )}
        />
      )}
    </div>
  );
}

export default Step;
