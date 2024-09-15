"use client";
import React, { useRef, useCallback, useState } from "react";
import { Button } from "../ui/button";
import CvPreviewContent from "../CvPreviewContent";
import { useStepper } from "@/lib/context/StepperContex";
import { Loader2 } from "lucide-react";

function Done() {
  const { dispatch } = useStepper();
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, [dispatch]);

  const handleDownloadPDF = useCallback(() => {
    setIsLoading(true);

    window.print();
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 my-3">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 no-print-area">
        <h2 className="text-lg font-semibold">
          You&apos;ve finished creating your resume 🙌 
        </h2>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleBack}
            className="text-white"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleDownloadPDF}
            className="text-white"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Print PDF"}
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        {/* <div id="cv-preview" ref={cvPreviewRef}> */}
          <CvPreviewContent targetRef={undefined} />
        {/* </div> */}
      </div>
    </div>
  );
}

export default Done;
