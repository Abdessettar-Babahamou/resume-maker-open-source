"use client";
import React, { useEffect, useState } from "react";
import Stepper from "./Stepper";
import FormSection from "./FormSection";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CvPreview from "./CvPreview";
import { checkCvIsBelongToUser, getAllcvInformation } from "@/lib/db/queries";
import { useParams, useRouter } from "next/navigation";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import { useUser } from "@clerk/nextjs";
import Loading from "./Loading";
import { CvProfileType } from "@/lib/types/types"; 

function FormBuilder() {
	// Get route parameters and router instance
	const params = useParams();
	const router = useRouter();
	
	// Get user information from Clerk
	const { user, isLoaded } = useUser();
	
	// Access CV information context
	const { dispatch } = useCvInfo();

	// State to manage loading status
	const [isLoading, setIsLoading] = useState(true); 

	useEffect(() => {
		const loadProfileInfo = async () => {
			if (isLoaded && user) {
				// Check if the CV belongs to the current user
				const cvBelongsToUser = await checkCvIsBelongToUser(
					user.id,
					params.cvId.toString()
				);
				if (!cvBelongsToUser) {
					// Redirect to dashboard if CV doesn't belong to user
					router.replace("/dashboard");
					return;
				}
				// Fetch CV information
				const response = (await getAllcvInformation(
					params.cvId.toString()
				)) as CvProfileType;
				// Update context with CV information
				dispatch({ type: "SET_ALL_CV_INFO", payload: response });
				// Set loading to false after data is fetched
				setIsLoading(false);
			}
		};
		loadProfileInfo();
	}, [params.cvId, dispatch, isLoaded, user, router]);

	// Show loading component while data is being fetched
	if (isLoading) return <Loading />;

	return (
		<div className="flex flex-col gap-12 md:gap-4 bg-white dark:bg-dark_main_bg p-8 remove-bg">
			<div className="flex justify-between items-center flex-wrap">
				{/* Stepper component to show progress */}
				<Stepper /> 
				{/* CV Preview Sheet */}
				<Sheet>
					<SheetTrigger className="no-print-area hidden lg:flex">
						<span className="bg-primary text-white p-2 rounded-md">
							Preview
						</span>
					</SheetTrigger>
					<SheetContent className="!w-[900px] md:max-w-[1000px] h-screen overflow-auto">
						{/* CvPreview component to show real-time preview */}
						<CvPreview />
					</SheetContent>
				</Sheet>
			</div>
			{/* FormSection component containing the actual form fields */}
			<FormSection />
		</div>
	);
}

export default FormBuilder;
