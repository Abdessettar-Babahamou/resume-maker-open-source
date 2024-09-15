"use server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "./index";
import {
  certificates,
  cvProfile,
  educations,
  experiences,
  InsertCvProfile,
  InsertEducations,
  InsertProject,
  InsertResume,
  InsertSkills,
  InsertTraining,
  InsertCertficate,
  InsertExperineces, 
  InsertUser,
  projects,
  resumes,
  SelectCvProfile,
  skills, 
  trainings,
  users,
  languages,
  InsertLanguage,
} from "./schema"; 

import {
  cvProfileSchema,
  educationSchema,
  experienceSchema,
  certificateSchema,
  projectSchema,
  trainingSchema,
  skillSchema,
  languageSchema
} from "../validationSchemas";
import { z } from "zod";

async function validateData<T>(schema: z.ZodSchema<T>, data: T) {
  try {
    await schema.parseAsync(data);
  } catch (error) {

    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(", "));
    }
    throw error;
  }
}
 
async function insertRecord<T extends Record<string, any>>(table: any, data: T,schema?: z.ZodSchema<T>) {
  try {
    if (schema) {
      await validateData(schema, data);
    }
    return await db.insert(table).values(data).returning();
   
  } catch (error) {
    console.error(`Error inserting into ${table.name}:`, error);
    throw new Error(`Failed to insert into ${table.name}`);
  }
}

async function getRecords<T>(table: any, whereClause: any,) {
  try {
    return await db.select().from(table).where(whereClause);
  } catch (error) {
    console.error(`Error fetching from ${table.name}:`, error);
    throw new Error(`Failed to fetch from ${table.name}`);
  }
}

async function updateRecord<T extends Record<string, any>>(table: any, data: T, whereClause: any,schema?: z.ZodSchema<T>) {
  try {
    if (schema) {
      await validateData(schema, data);
    }
    return await db.update(table).set(data).where(whereClause).returning(); 
  } catch (error) {
    console.error(`Error updating ${table.name}:`, error);
    throw new Error(`Failed to update ${table.name}`);
  }
}

async function deleteRecord(table: any, whereClause: any) {
  try {
    return await db.delete(table).where(whereClause);
  } catch (error) {
    console.error(`Error deleting from ${table.name}:`, error);
    throw new Error(`Failed to delete from ${table.name}`);
  }
}

export async function createResume(data: InsertResume) {
  return insertRecord(resumes, data);
}
 
export async function addUser(data: InsertUser) {
  return insertRecord(users, data);
}

export async function getUserCvs(userId: string) {
  return getRecords(resumes, eq(resumes.userId, userId));
}

export async function deleteCV(cvId: string) {
  return deleteRecord(resumes, eq(resumes.id, cvId));
}

export async function insertCvProfileToDB(params: InsertCvProfile) {
  return insertRecord(cvProfile, params,cvProfileSchema);
}

export async function updateCvProfile(params: InsertCvProfile) {
  console.log(params)
  return updateRecord(cvProfile, params, eq(cvProfile.resumeId, params.resumeId),cvProfileSchema);
}

export async function insertEducationInfo(params: InsertEducations) {
   const validatedParams = educationSchema.parse({
    ...params,
    endDate: params.endDate ? params.endDate : null
   });
   return insertRecord(educations, validatedParams);
}

export async function getEducations(cvId: string) {
  return getRecords(educations, eq(educations.resumeId, cvId));
}

export async function updateEducation(params: InsertEducations) {
  const validatedParams = educationSchema.parse({
    ...params,
    endDate: params.endDate ? params.endDate : null
   });
  return updateRecord(educations, validatedParams, eq(educations.id, params.id));
}

export async function deleteEducation(params: InsertEducations) {
  return deleteRecord(educations, eq(educations.id, params.id));
}

export async function insertExperienceInfo(params: InsertExperineces) {
  const validatedParams = experienceSchema.parse({
    ...params,
    endDate: params.endDate ? params.endDate : null
  });

  return insertRecord(experiences, validatedParams);
}

export async function getExperiences(cvId: string) {
  return getRecords(experiences, eq(experiences.resumeId, cvId));
}

export async function updateExperience(params: InsertExperineces) {
  const validatedParams = experienceSchema.parse({
    ...params,
    endDate: params.endDate ? params.endDate : null
  });
  return updateRecord(experiences, validatedParams, eq(experiences.id, params.id));
}

export async function deleteExperience(params: InsertExperineces) {
  return deleteRecord(experiences, eq(experiences.id, params.id));
}

export async function insertCertificateInfo(params: InsertCertficate) {
  const validatedParams = certificateSchema.parse({
    ...params,
  });
 
  return insertRecord(certificates, validatedParams);
}

export async function getCertificates(cvId: string) {
  return getRecords(certificates, eq(certificates.resumeId, cvId));
}

export async function updateCertificate(params: InsertCertficate) {
  const validatedParams = certificateSchema.parse({
    ...params,
    
  });
  return updateRecord(certificates, validatedParams, eq(certificates.id, params.id));
}

export async function deleteCertificate(params: InsertCertficate) {
  return deleteRecord(certificates, eq(certificates.id, params.id));
}
export async function insertProjectInfo(params: InsertProject) {
  const validatedParams = projectSchema.parse(params);
  
  return insertRecord(projects, validatedParams);
}

export async function getProjects(cvId: string) {
  return getRecords(projects, eq(projects.resumeId, cvId));
}

export async function updateProject(params: InsertProject) {
  const validatedParams = projectSchema.parse(params);
  return updateRecord(projects, validatedParams, eq(projects.id, params.id));
}

export async function deleteProject(params: InsertProject) {
  return deleteRecord(projects, eq(projects.id, params.id));
}
export async function insertTrainingInfo(params: InsertTraining) {
  const validatedParams = trainingSchema.parse(params);
 
  return insertRecord(trainings, validatedParams);
}

export async function getTrainings(cvId: string) {
  return getRecords(trainings, eq(trainings.resumeId, cvId));
}

export async function updateTraining(params: InsertTraining) {
  const validatedParams = trainingSchema.parse(params);
  return updateRecord(trainings, validatedParams, eq(trainings.id, params.id));
}

export async function deleteTraining(params: InsertTraining) {
  return deleteRecord(trainings, eq(trainings.id, params.id));
}

// skills

export async function insertSkillsInfo(params: InsertSkills) {
  console.log(params)
  return insertRecord(skills, params,skillSchema);
}

export async function getSkills(cvId: string) {
  return getRecords(skills, eq(skills.resumeId, cvId));
}

export async function updateSkills(params: InsertSkills) {
  return updateRecord(skills, params, eq(skills.id, params.id),skillSchema);
}

export async function deleteSkills(params: InsertSkills) {
  return deleteRecord(skills, eq(skills.id, params.id));
}
export async function insertLanguageInfo(params: InsertLanguage) {
  return insertRecord(languages, params,languageSchema);
}

export async function getLanguages(cvId: string) {
  return getRecords(languages, eq(languages.resumeId, cvId));
}

export async function updateLanguage(params: InsertLanguage) {
  return updateRecord(languages, params, eq(languages.id, params.id),languageSchema);
}

export async function deleteLanguage(params: InsertLanguage) {
  return deleteRecord(languages, eq(languages.id, params.id));
}

export async function getcvProfileInfo(cvId: string) {
  const response = await getRecords(cvProfile, eq(cvProfile.resumeId, cvId));
  return response[0] as SelectCvProfile;
}
export async function checkCvIsBelongToUser(userId: string, cvId: string) {
  const response = await getRecords(resumes, and(eq(resumes.id, cvId), eq(resumes.userId, userId)));
  return response.length > 0;
}

export async function getAllcvInformation(cvId: string) {
  return await db.query.resumes.findFirst({
    where: eq(resumes.id, cvId),
    with: {
      education: {
        orderBy: (educations, { desc }) => [desc(educations.startDate)],
      },
      experience: {
        orderBy: (experiences, { desc }) => [desc(experiences.startDate)],
      },
      certificate: {
        orderBy: (certificates, { desc }) => [desc(certificates.startDate)],
      },
      skills: true,
      ProfileInfo: true,
      project:  {
        orderBy: (projects, { desc }) => [desc(projects.createdDate)],
      },
      training:  {
        orderBy: (trainings, { desc }) => [desc(trainings.createdDate)],
      },
      languages:true
    },
  });
}