"use client";
import { useStepper } from "@/lib/context/StepperContex";
import Step from "./Step";

function Stepper() { 
  const { state, dispatch } = useStepper();

  return (
    <div className="md:mx-4 p-2 mx:p-4 flex  w-full   md:flex-1  no-print-area" aria-label="Step progress">
      {/* display numbers */}
      {/* display title */}
      {state.steps.map((item, index) => {
        return (
          <Step
            key={index}
            title={item}
            isLast={index === state.steps.length - 1}
            index={index}
          />
        );
      })}
    </div>
  );
}

export default Stepper;
