import { redirect } from "next/navigation";

function page() {
  redirect("/dashboard");
  return <div></div>;
}

export default page;
