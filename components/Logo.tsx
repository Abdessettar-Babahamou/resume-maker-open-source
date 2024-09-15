import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <div className="flex gap-2 items-center justify-center mt-3">
      <Image src={"/curriculum-vitae.png"} width={30} height={30} alt="LOGO" />
      <h2 className="text-md lg:text-lg text-white">Resume Maker</h2>
    </div>
  );
}

export default Logo;
