import {

  InsertCertficate,
  InsertCvProfile,
  InsertEducations,
  InsertExperineces,
  InsertLanguage,
  InsertProject,
  InsertResume,
  InsertSkills,
  InsertTraining,

} from "../db/schema";

export type CvProfileType = InsertResume & {
  ProfileInfo: InsertCvProfile;
  education?: InsertEducations[];
  experience?: InsertExperineces[];
  certificate?: InsertCertficate[];
  project?: InsertProject[];
  training?: InsertTraining[];
  skills?: InsertSkills[];
  languages?:InsertLanguage[]
};
