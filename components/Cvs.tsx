import React from "react";
import CvItem from "./CvItem";
import { getUserCvs } from "@/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SelectResume } from "@/lib/db/schema";

async function Cvs() {
  const { userId } = auth();
  // chek if the user is signed in if not redirect to sign in page
  if (!userId) redirect("/sign-in");
  // get the user cvs
  const data = await getUserCvs(userId) as SelectResume[];

  return (
    <>
      {data.map((item, index) => (
        <CvItem key={item.id} cvItem={item} index={index} />
      ))}
    </>
  );
}

export default Cvs;
