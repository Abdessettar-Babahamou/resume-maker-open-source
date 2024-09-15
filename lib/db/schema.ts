import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core"; 
import { nullable } from "zod";
export const users = pgTable("users", { 
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age"),
  email: text("email").notNull().unique(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey(),
  name: text("name"),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
}); 

export const cvProfile = pgTable("cv_profile", {
  id: varchar("id").primaryKey(),
  fullName: text("fullName").notNull(),
  emailAddress: text("emailAddress").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  linkdenUrl: text("linkdenUrl"),
  personalWeb: text("personalWeb"),
  country: text("country").notNull(),
  state: text("state"),
  city: text("city"),
  summary: text("summary"),
  jobTitle: text("jobTitle").notNull(),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const cvProfileRelation = relations(cvProfile, ({ one }) => ({
  resume: one(resumes, {
    fields: [cvProfile.resumeId],
    references: [resumes.id],
  }),
}));

// education Table

export const educations = pgTable("education_info", {
  id: varchar("id").primaryKey(),
  schoolName: text("schoolName").notNull(),
  degree: text("degree").notNull(),
  fieldOfStudy: text("field_of_study").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  country: text("country").notNull(),
  state: text("state"),
  description: text("description"),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

// experience table

export const experiences = pgTable("experience_info", { 
  id: varchar("id").primaryKey(),
  jobTitle: text("jobTitle").notNull(),
  employer: text("employer").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  country: text("country").notNull(),
  state: text("state"),
  description: text("description"),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

// certficate table

export const certificates = pgTable("certificate_info", {
  id: varchar("id").primaryKey(),
  certificateName: text("certificate_name").notNull(),
  issuedBy: text("issuedBy").notNull(),
  startDate: date("startDate").notNull(),
  description: text("description"),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

// projects table

export const projects = pgTable("project_info", {
  id: varchar("id").primaryKey(),
  projectTitle: text("projectTitle").notNull(),
  organizationName: text("organizationName").notNull(),
  createdDate: date("createdDate").notNull(),
  projectUrl: text("projectUrl"),
  description: text("description"),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

// skills table

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey(),
  skillsName: text("skillsName").notNull(),
  description: text("description"),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
// training table

export const trainings = pgTable("training_info", {
  id: varchar("id").primaryKey(),
  trainingTitle: text("projectTitle").notNull(),
  organizationName: text("organizationName").notNull(),
  createdDate: date("createdDate").notNull(),
  description: text("description"),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const languages = pgTable("languages", {
  id: varchar("id").primaryKey(),
  languageName: text("languageName").notNull(),
  description: text("description"),
  resumeId: varchar("resume_id").notNull().references(() => resumes.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
//  relations

export const userRelations = relations(users, ({ many, one }) => ({
  resumes: many(resumes),
}));

export const resumeRelations = relations(resumes, ({ one, many }) => ({
  author: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  ProfileInfo: one(cvProfile),
  education: many(educations),
  experience: many(experiences),
  certificate: many(certificates),
  project: many(projects),
  training: many(trainings),
  skills: many(skills),
  languages:many(languages),
}));

export const educationsRelation = relations(educations, ({ one }) => ({
  resume: one(resumes, {
    fields: [educations.resumeId],
    references: [resumes.id],
  }),
}));

export const experiencesRelation = relations(experiences, ({ one }) => ({
  resume: one(resumes, {
    fields: [experiences.resumeId],
    references: [resumes.id],
  }),
}));

export const certificatesRelation = relations(certificates, ({ one }) => ({
  resume: one(resumes, {
    fields: [certificates.resumeId],
    references: [resumes.id],
  }),
}));

export const projectsRelation = relations(projects, ({ one }) => ({
  resume: one(resumes, {
    fields: [projects.resumeId],
    references: [resumes.id],
  }),
}));

export const trainingRelation = relations(trainings, ({ one }) => ({
  resume: one(resumes, {
    fields: [trainings.resumeId],
    references: [resumes.id],
  }),
}));

export const skillsRelation = relations(skills, ({ one }) => ({
  resume: one(resumes, {
    fields: [skills.resumeId],
    references: [resumes.id],
  }),
}));

export const languageRelation = relations(languages, ({ one }) => ({
  resume: one(resumes, {
    fields: [languages.resumeId],
    references: [resumes.id],
  }),
}));
// export types

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertResume = typeof resumes.$inferInsert;
export type SelectResume = typeof resumes.$inferSelect;

export type InsertCvProfile = typeof cvProfile.$inferInsert;
export type SelectCvProfile = typeof cvProfile.$inferSelect;

export type InsertEducations = typeof educations.$inferInsert;
export type SelectEducations = typeof educations.$inferSelect;

export type InsertExperineces = typeof experiences.$inferInsert;
export type SelectExperineces = typeof experiences.$inferSelect;

export type InsertCertficate = typeof certificates.$inferInsert;
export type SelectCertficate = typeof certificates.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;

export type InsertTraining = typeof trainings.$inferInsert;
export type SelectTraining = typeof trainings.$inferSelect;

export type InsertSkills = typeof skills.$inferInsert;
export type SelectSkills = typeof skills.$inferSelect;

export type InsertLanguage = typeof languages.$inferInsert;
export type SelectLanguage = typeof languages.$inferSelect;
