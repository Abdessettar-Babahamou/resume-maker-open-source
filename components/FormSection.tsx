"use client";

import { useStepper } from "@/lib/context/StepperContex";
import ProfileForm from "./forms/ProfileForm";
import EducationForm from "./forms/EducationForm";
import ExperiencesForm from "./forms/ExperiencesForm";
import CertficateForm from "./forms/CertficateForm";
import ProjectsForm from "./forms/ProjectsForm";
import TrainingForm from "./forms/TrainingForm";
import SkillsForm from "./forms/SkillsForm";
import Done from "./forms/Done";
import LanguagesForm from "./forms/LanguagesForm"; 

// Map of step numbers to their corresponding components
const STEP_COMPONENTS = {
  0: ProfileForm,
  1: EducationForm,
  2: ExperiencesForm,
  3: CertficateForm,
  4: ProjectsForm,
  5: TrainingForm,
  6: SkillsForm,
  7: LanguagesForm,
  8: Done,
};

function FormSection() {
  const { state } = useStepper();
  
  // Function to display the appropriate form based on the current step
  const displayActiveStep = (step: number) => {
    const StepComponent = STEP_COMPONENTS[step as keyof typeof STEP_COMPONENTS];
    return StepComponent ? <StepComponent /> : null;
  };

  return (
    <div className="my-8 h-full">
      {displayActiveStep(state.activeStep)}
    </div>
  );
}

export default FormSection;
