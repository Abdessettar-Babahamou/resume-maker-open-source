"use client";
import React from "react";
import { useCvInfo } from "@/lib/context/CvInfoContext";
import CvTitle from "./CvTitle";
import { Globe, Linkedin } from "lucide-react";
import Link from "next/link";
import {
  InsertCertficate,
  InsertCvProfile,
  InsertEducations,
  InsertExperineces,
  InsertLanguage,
  InsertProject,
  InsertSkills,
  InsertTraining,
} from "@/lib/db/schema";
import { format } from "date-fns";

const ProfileSection: React.FC<{ profileInfo: InsertCvProfile }> = ({
  profileInfo,
}) => (
  <div className="flex flex-col gap-1">
    <h2 className="font-bold text-lg text-center text-black">
      {profileInfo.fullName}
    </h2>
    <div className="flex justify-center items-center gap-1.5 flex-wrap">
      <span className="text-xs text-gry_text capitalize">
        {`${profileInfo.country?.split("-")[1]}`}
        {profileInfo.state && `, ${profileInfo.state?.split("-")[2]}`}
        {profileInfo.city && `, ${profileInfo.city?.split("-")[2]}`}
      </span>
      <span className="h-[13px] bg-gry_text w-[1px]"></span>
      <span className="text-xs text-gry_text capitalize">
        Phone: {profileInfo.phoneNumber}
      </span>
      <span className="h-[13px] bg-gry_text w-[1px]"></span>
      <span className="text-xs text-gry_text">
        Email: {profileInfo.emailAddress}
      </span>
    </div>
    <div className="flex items-center justify-center gap-4">
      {profileInfo.linkdenUrl && (
        <Link href={profileInfo.linkdenUrl} className="flex gap-2">
          <Linkedin size={18} className="text-black"/>
          <h3 className="text-black text-sm">Linkedin</h3>
        </Link>
      )}
      {profileInfo.personalWeb && (
        <Link href={profileInfo.personalWeb} className="flex gap-2">
          <Globe size={18} />
          <h3 className="text-black text-sm">Website</h3>
        </Link>
      )}
    </div>
    <div className="flex items-center justify-center mt-2">
      <h2 className="font-bold text-ld text-center text-black uppercase">
        {profileInfo.jobTitle}
      </h2>
    </div>
  </div>
);

const SummarySection: React.FC<{ summary: string | undefined }> = ({
  summary,
}) =>
  summary && (
    <div className="flex flex-col gap-2">
      <CvTitle title="Summary" />
      <div
        className="education_description !text-black"
        dangerouslySetInnerHTML={{
          __html: summary,
        }}
      />
    </div>
  );

const ExperienceSection: React.FC<{ experiences: InsertExperineces[] }> = ({
  experiences,
}) =>
  experiences &&
  experiences.length > 0 && (
    <div className="flex flex-col gap-0 w-full">
      <CvTitle title="Work Experience" />
      {experiences.map((item) => (
        <div key={item.id}>
          <div className="flex justify-between items-center mt-2">
            <h4 className="font-bold text-[14px] text-black capitalize">
              {item.jobTitle}
            </h4>
            <div className="flex items-center justify-center gap-2">
              <h4 className="text-gray-700 text-[14px] capitalize">
                {format(new Date(item.startDate), "MMM yyyy")} -{" "}
                {item.endDate
                  ? format(new Date(item.endDate), "MMM yyyy")
                  : "Present"}
              </h4>
            </div>
          </div>
          <span className="text-[12px] text-gray-500">
            {item.employer},{`${item.country?.split("-")[1]}`}
            {item.state && `, ${item.state?.split("-")[2]}`}
          </span>
          <div
            className="education_description text-black"
            dangerouslySetInnerHTML={{
              __html: item.description || "",
            }}
          />
        </div>
      ))}
    </div>
  );

const CertificatesSection: React.FC<{ certificates: InsertCertficate[] }> = ({
  certificates,
}) =>
  certificates &&
  certificates.length > 0 && (
    <div className="flex flex-col gap-0 w-full">
      <CvTitle title="Certificates" />
      {certificates.map((certificate) => (
        <div className="" key={certificate.id}>
          <div className="flex justify-between items-center mt-2">
            <h4 className="font-bold text-[14px] text-gray-700 uppercase">
              {certificate.issuedBy}
            </h4>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-[14px] text-black capitalize">
              {certificate.certificateName}
            </h4>
            <h4 className="text-gray-700 text-[14px] capitalize">
              {format(new Date(certificate.startDate), "MMM yyyy")}
            </h4>
          </div>
          {certificate.description && (
            <div
              className="education_description text-black"
              dangerouslySetInnerHTML={{
                __html: certificate.description,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

const EducationSection: React.FC<{ educations: InsertEducations[] }> = ({
  educations,
}) =>
  educations &&
  educations.length > 0 && (
    <div className="flex flex-col gap-0 w-full">
      <CvTitle title="Education" />
      {educations.map((education) => (
        <div key={education.id} className="flex flex-col gap-0 w-full">
          <div className="flex justify-between items-center mt-2">
            <h4 className="font-semibold text-gray-700 text-[13px] uppercase">
              {education.schoolName}
            </h4>
            <h4 className="text-gray-700 text-[14px] capitalize">
              {`${education.country?.split("-")[1]}`}
              {education.state && `, ${education.state?.split("-")[2]}`}
            </h4>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-[14px] capitalize text-black">
              {education.degree}
            </h4>
            <div className="flex items-center justify-center gap-2">
              <h4 className="text-gray-700 text-[14px] capitalize">
                {format(new Date(education.startDate), "MMM yyyy")} -{" "}
                {education.endDate
                  ? format(new Date(education.endDate), "MMM yyyy")
                  : "Present"}
              </h4>
            </div>
          </div>
          {education.description && (
            <div
              className="education_description text-black"
              dangerouslySetInnerHTML={{
                __html: education.description || "",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

const ProjectsSection: React.FC<{ projects: InsertProject[] }> = ({
  projects,
}) =>
  projects &&
  projects.length > 0 && (
    <div className="flex flex-col gap-0 w-full">
      <CvTitle title="Projects" />
      {projects.map((project) => (
        <div key={project.id} className="flex flex-col mt-2">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-[14px] capitalize text-black">
              {project.projectTitle}
            </h4>
            <h4 className="text-gray-700 text-[13px] capitalize">
              {format(new Date(project.createdDate), "MMM yyyy")}
            </h4>
          </div>
          {project.description && (
            <div
              className="education_description text-black"
              dangerouslySetInnerHTML={{
                __html: project.description,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

const TrainingSection: React.FC<{ trainings: InsertTraining[] }> = ({
  trainings,
}) =>
  trainings &&
  trainings.length > 0 && (
    <div className="flex flex-col gap-0 w-full">
      <CvTitle title="Training" />
      {trainings.map((training) => (
        <div className="" key={training.id}>
          <div className="flex justify-between items-center mt-2">
            <h4 className="font-semibold text-[14px] capitalize text-black">
              {training.trainingTitle}
            </h4>
            <h4 className="text-gray-700 text-[14px] capitalize">
              {format(new Date(training.createdDate), "MMM yyyy")}
            </h4>
          </div>
          <span className="text-[12px] text-gray-500">
            {training.organizationName}
          </span>
          {training.description && (
            <div
              className="education_description !text-black"
              dangerouslySetInnerHTML={{
                __html: training.description,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

const SkillsSection: React.FC<{ skills: InsertSkills[] }> = ({ skills }) =>
  skills &&
  skills.length > 0 && (
    <div className="flex flex-col gap-0 w-full">
      <CvTitle title="Skills" />
      <div className="flex items-center flex-wrap gap-x-8 gap-y-4 mt-2">
        {skills.map((item) => (
          <div className="flex items-center gap-2" key={item.id}>
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <h2 className="text-sm text-gray-700 font-semibold">
              {item.skillsName
                ? item.skillsName.charAt(0).toUpperCase() +
                  item.skillsName.slice(1)
                : ""}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );

const LanguagesSection: React.FC<{ languages: InsertLanguage[] }> = ({
  languages,
}) =>
  languages &&
  languages.length > 0 && (
    <div className="flex flex-col gap-0 w-full">
      <CvTitle title="Languages" />
      <div className="flex items-center flex-wrap gap-8 mt-2">
        {languages.map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-black">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <h2 className="text-sm font-semibold">{item.languageName}</h2>
          </div>
        ))}
      </div>
    </div>
  );

function CvPreviewContent({
  targetRef,
}: {
  targetRef: React.MutableRefObject<any> | undefined;
}) {
  const { state } = useCvInfo();
  const { allCvInfo } = state;

  return (
    <div
      ref={targetRef}
      id="print-area"
      className="flex flex-col gap-1 w-full bg-white lg:w-[793px] lg:min-h-[1123px] shadow-xl rounded-md p-8"
    >
      {allCvInfo.ProfileInfo && (
        <>
          <ProfileSection profileInfo={allCvInfo.ProfileInfo} />
          <SummarySection
            summary={allCvInfo.ProfileInfo.summary || undefined}
          />
        </>
      )}
      <ExperienceSection experiences={allCvInfo.experience || []} />
      <CertificatesSection certificates={allCvInfo.certificate || []} />
      <EducationSection educations={allCvInfo.education || []} />
      <ProjectsSection projects={allCvInfo.project || []} />
      <TrainingSection trainings={allCvInfo.training || []} />
      <SkillsSection skills={allCvInfo.skills || []} />
      <LanguagesSection languages={allCvInfo.languages || []} />
    </div>
  );
}

export default CvPreviewContent;
