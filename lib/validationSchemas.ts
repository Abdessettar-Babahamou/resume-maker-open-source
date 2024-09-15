import { z } from "zod";
import { phoneRegex } from "./constant";

export const cvProfileSchema = z.object({
    id:z.string(),
    fullName: z.string().min(2, { message: "You must ,min 2 char" }),
    phoneNumber: z.string().min(10, { message: "Phone Number must contain at least 10 character(s)" }).regex(phoneRegex, 'Invalid Number!'),
    emailAddress: z
      .string({ required_error: "Please select an email to display." })
      .email(),
    linkdenUrl: z
      .string()
      .url({ message: "Please enter a valid URL" })
      .optional()
      .or(z.literal("")),
    personalWeb: z
      .string()
      .url({ message: "Please enter a valid URL" })
      .optional()
      .or(z.literal("")),
    country: z.string({ required_error: "Please select your country." }),
    state: z.string().optional(),
    city: z.string().optional(),
    summary: z.string().optional(),
    jobTitle: z.string().min(4, { message: "Please enter your job title" }),
    resumeId:z.string()
});

export const educationSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  schoolName: z
    .string()
    .min(2, { message: "School name must be at least 2 characters" }),
  degree: z
    .string()
    .min(2, { message: "Degree must be at least 2 characters" }),
  fieldOfStudy: z
    .string()
    .min(2, { message: "Field of study must be at least 2 characters" }),
  startDate: z.string({ required_error: "Start date is required" }),
  endDate: z.string().optional().nullable(),
  country: z.string({ required_error: "Country is required" }),
  state: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  // Add more fields as needed
});

export const experienceSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  jobTitle: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters" }),
  employer: z
    .string()
    .min(2, { message: "Employer must be at least 2 characters" }),
  startDate: z.string({ required_error: "Start date is required" }),
  endDate: z.string().optional().nullable(),
  country: z.string({ required_error: "Country is required" }),
  state: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const certificateSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  certificateName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  issuedBy: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  startDate: z.string({ required_error: "A start date is required." }),
  description: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  projectTitle: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  organizationName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  createdDate: z.string({ required_error: "A start date is required." }),
  projectUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  description: z.string().optional().nullable(),
  
});

export const trainingSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  trainingTitle: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  organizationName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
  createdDate: z.string({ required_error: "A start date is required." }),
  description: z.string().optional().nullable(), 
  
});

export const skillSchema = z.object({
  id: z.string().uuid().optional(),
  resumeId: z.string().uuid(),
  skillsName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" })
 
});

export const languageSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  languageName: z
    .string()
    .min(2, { message: "You must enter at least 2 characters" }),
    description: z.string(),
  
});
