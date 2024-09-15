import { Suspense } from "react";
import DashboardClient from "@/components/DashboardClient";
import Cvs from "@/components/Cvs";
import AddResume from "@/components/AddResume";
import Loading from "@/components/Loading";

export default function Dashboard() {
  return (
    <main className="remove-bg flex flex-col gap-4 min-h-[calc(100vh-60px)] p-8 bg-main_gry_color dark:bg-dark_main_bg w-s">
      <div className="flex flex-col flex-wrap  gap-4">
        <h2 className="text-3xl font-semibold">My Resumes</h2>
        <p>Create new resume with help of AI</p>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <AddResume />
          <Suspense fallback={<Loading />}>
            <Cvs />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
