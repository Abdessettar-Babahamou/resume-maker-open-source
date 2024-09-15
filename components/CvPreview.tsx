"use client";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import CvTitle from "./CvTitle";
import { useEffect } from "react";
import CvPreviewContent from "./CvPreviewContent";

function CvPreview() {
  return (
    <div className="flex-1 bg-[#f5f8fa] p-4 overflow-y-auto">
      {/* paper */}
      <CvPreviewContent targetRef={undefined} />
    </div>
  );
}

export default CvPreview;
