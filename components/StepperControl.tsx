"use client";

import { useStepper } from "@/lib/context/StepperContex";
import { Button } from "./ui/button";

interface StepperControlProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

function StepperControl({ children, isLoading = false }: StepperControlProps) {
  const { dispatch } = useStepper();

  const handlePrevStep = () => dispatch({ type: "PREV_STEP" });
  const handleNextStep = () => dispatch({ type: "NEXT_STEP" });

  return (
    <nav
      className="flex justify-between items-center flex-wrap gap-4 lg:ml-[250px] 
    fixed bottom-0 left-0 right-0 w-full lg:w-[calc(100%-250px)] 
    shadow-lg px-8 py-2 bg-[#f5f8fa] dark:bg-dark_main_bg border-t border-primary/50 z-50" 
    >
      <Button
        className="px-8 dark:text-white"
        type="button"
        onClick={handlePrevStep}
        disabled={isLoading}
      >
        Prev
      </Button>
      <div className="flex-1" />

      {children}
      <Button
        className="px-8 dark:text-white"
        // disabled={!isSaved}
        type="button"
        onClick={handleNextStep}
        disabled={isLoading}
      >
        Next
      </Button>
    </nav>
  );
}

export default StepperControl;
