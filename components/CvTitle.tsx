import React from "react";

function CvTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2 items-start w-full mt-4">
      <h2 className="text-base text-black font-semibold uppercase">{title}</h2>
      <div className="w-full h-[1px] bg-gray-800"></div>
    </div>
  );
}

export default CvTitle;
