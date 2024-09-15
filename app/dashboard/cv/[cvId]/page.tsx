import FormBuilder from "@/components/FormBuilder";
import { StepperProvider } from "@/lib/context/StepperContex";
import React from "react";

function CvPage() {
  return (
    // Main container for the CV page
    // Full height minus header (60px), with light/dark mode background
    <div className="remove-bg h-[calc(100vh-60px)] bg-[#f5f8fa] dark:bg-dark_main_bg">
      {/* 
        StepperProvider wraps the FormBuilder to manage the multi-step form process
        It provides context for tracking current step, navigation between steps, etc.
      */}
      <StepperProvider>
        {/* 
          FormBuilder component
          This is the main component for creating/editing the CV
          It likely contains multiple form steps, input fields, and validation logic
        */}
        <FormBuilder />
        
      </StepperProvider> 
    </div>
  ); 
}

export default CvPage; 
