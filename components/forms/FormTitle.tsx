import React from "react";

function FormTitle({ title ,description }: { title: string,description:string }) {
  return (
    <div className="w-full  flex flex-col gap-2">
      <h3 className="text-2xl text-[#1f344c] dark:text-white"> {title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
       {description}
      </p>
    </div>
  );
}

export default FormTitle;
