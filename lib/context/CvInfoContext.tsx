"use client";
import { createContext, useContext, useReducer, Dispatch } from "react";
import {
  InsertCvProfile,
  InsertEducations,
  InsertCertficate,
  InsertExperineces,
  InsertProject,
  InsertTraining,
  InsertSkills,
  InsertLanguage,
} from "../db/schema";
import { CvProfileType } from "../types/types";
import { sortByDate } from "../utils/utils";

type CvState = {
  allCvInfo: CvProfileType;
};

type CvAction =
  | { type: "SET_ALL_CV_INFO"; payload: Partial<CvProfileType> }
  | { type: "SET_CV_PROFILE"; payload: Partial<InsertCvProfile> }
  | { type: "SET_CV_EDUCATION"; payload: InsertEducations[] }
  | { type: "SET_CV_EXPERIENCE"; payload: InsertExperineces[] }
  | { type: "SET_CV_CERTIFICATE"; payload: InsertCertficate[] }
  | { type: "ADD_CERTIFICATE"; payload: InsertCertficate }
  | { type: "UPDATE_CERTIFICATES"; payload: InsertCertficate }
  | { type: "DELETE_CERTIFICATES"; payload: InsertCertficate }
  | { type: "SET_CV_PROJECT"; payload: InsertProject[] }
  | { type: "ADD_PROJECT"; payload: InsertProject }
  | { type: "UPDATE_PROJECT"; payload: InsertProject }
  | { type: "DELETE_PROJECT"; payload: InsertProject }
  | { type: "SET_CV_TRAINING"; payload: InsertTraining[] }
  | { type: "ADD_TRAINING"; payload: InsertTraining }
  | { type: "UPDATE_TRAINING"; payload: InsertTraining }
  | { type: "DELETE_TRAINING"; payload: InsertTraining }
  | { type: "SET_CV_SKILLS"; payload: InsertSkills[] }
  | { type: "ADD_SKILL"; payload: InsertSkills }
  | { type: "UPDATE_SKILL"; payload: InsertSkills }
  | { type: "DELETE_SKILL"; payload: InsertSkills }
  | { type: "SET_CV_Language"; payload: InsertLanguage[] }
  | { type: "ADD_Language"; payload: InsertLanguage }
  | { type: "UPDATE_Language"; payload: InsertLanguage }
  | { type: "DELETE_Language"; payload: InsertLanguage }

  | { type: "SET_IS_NEW"; payload: boolean };

const initialState: CvState = {
  allCvInfo: {
    id: "",
    userId: "",
    ProfileInfo: {
      id: "",
      resumeId: "",
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      country: "",
      jobTitle: "",
      linkdenUrl: null,
      personalWeb: null,
      state: "",
      city: "",
      summary: "",
    },
  },
};

function cvReducer(state: CvState, action: CvAction): CvState {
  switch (action.type) {
    case "SET_ALL_CV_INFO":
      return { ...state, allCvInfo: { ...state.allCvInfo, ...action.payload } };
    case "SET_CV_PROFILE":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          ProfileInfo: { ...state.allCvInfo.ProfileInfo, ...action.payload },
        },
      };
    case "SET_CV_EDUCATION":
      return {
        ...state,
        allCvInfo: { ...state.allCvInfo, education: action.payload },
      };
    case "SET_CV_EXPERIENCE":
      return {
        ...state,
        allCvInfo: { ...state.allCvInfo, experience: action.payload },
      };
    case "SET_CV_CERTIFICATE":
      return {
        ...state,
        allCvInfo: { ...state.allCvInfo, certificate: action.payload },
      };
    case "ADD_CERTIFICATE":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          certificate: sortByDate([
            ...(state.allCvInfo.certificate || []),
            action.payload,
          ]),
        },
      };

    case "UPDATE_CERTIFICATES":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          certificate: sortByDate(
            state.allCvInfo.certificate?.map((item) =>
              item.id === action.payload.id ? action.payload : item
            ) || []
          ),
        },
      };
      case "DELETE_CERTIFICATES":
        return {
          ...state,
          allCvInfo: {
            ...state.allCvInfo,
            certificate: sortByDate(
              state.allCvInfo.certificate?.filter((item) =>
                item.id != action.payload.id 
              ) || []
            ),
          },
        };
    case "SET_CV_PROJECT":
      return {
        ...state,
        allCvInfo: { ...state.allCvInfo, project: action.payload },
      };
      case "ADD_PROJECT":
        return {
          ...state,
          allCvInfo: {
            ...state.allCvInfo,
            project: sortByDate([
              ...(state.allCvInfo.project || []),
              action.payload,
            ]),
          },
        };
        case "UPDATE_PROJECT":
          return {
            ...state,
            allCvInfo: {
              ...state.allCvInfo,
              project: sortByDate(
                state.allCvInfo.project?.map((item) =>
                  item.id === action.payload.id ? action.payload : item
                ) || []
              ),
            },
          };
          case "DELETE_PROJECT":
            return {
              ...state,
              allCvInfo: {
                ...state.allCvInfo,
                project: sortByDate(
                  state.allCvInfo.project?.filter((item) =>
                    item.id != action.payload.id 
                  ) || []
                ),
              },
            };
    case "SET_CV_TRAINING":
      return {
        ...state,
        allCvInfo: { ...state.allCvInfo, training: action.payload },
      };
    case "ADD_TRAINING":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          training: sortByDate([
            ...(state.allCvInfo.training || []),
            action.payload,
          ]),
        },
      };
    case "UPDATE_TRAINING":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          training: sortByDate(
            state.allCvInfo.training?.map((item) =>
              item.id === action.payload.id ? action.payload : item
            ) || []
          ),
        },
      };
    case "DELETE_TRAINING":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          training: sortByDate(
            state.allCvInfo.training?.filter((item) =>
              item.id !== action.payload.id
            ) || []
          ),
        },
      };
    case "SET_CV_SKILLS":
      return {
        ...state,
        allCvInfo: { ...state.allCvInfo, skills: action.payload },
      };
    case "ADD_SKILL":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          skills: [...(state.allCvInfo.skills || []), action.payload],
        },
      };
    case "UPDATE_SKILL":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          skills: state.allCvInfo.skills?.map((item) =>
            item.id === action.payload.id ? action.payload : item
          ) || [],
        },
      };
    case "DELETE_SKILL":
      return {
        ...state,
        allCvInfo: {
          ...state.allCvInfo,
          skills: state.allCvInfo.skills?.filter((item) =>
            item.id !== action.payload.id
          ) || [],
        },
      };

      case "SET_CV_Language":
        return {
          ...state,
          allCvInfo: { ...state.allCvInfo, languages: action.payload },
        };
      case "ADD_Language":
        return {
          ...state,
          allCvInfo: {
            ...state.allCvInfo,
            languages: [...(state.allCvInfo.languages || []), action.payload],
          },
        };
      case "UPDATE_Language":
        return {
          ...state,
          allCvInfo: {
            ...state.allCvInfo,
            languages: state.allCvInfo.languages?.map((item) =>
              item.id === action.payload.id ? action.payload : item
            ) || [],
          },
        };
      case "DELETE_Language":
        return {
          ...state,
          allCvInfo: { 
            ...state.allCvInfo,
            languages: state.allCvInfo.languages?.filter((item) =>
              item.id !== action.payload.id
            ) || [],
          },
        };
    default:
      return state;
  }
}

const CvInfoContext = createContext<
  | {
      state: CvState;
      dispatch: Dispatch<CvAction>;
    }
  | undefined
>(undefined);

export const CvInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cvReducer, initialState);

  return (
    <CvInfoContext.Provider value={{ state, dispatch }}>
      {children}
    </CvInfoContext.Provider>
  );
};

export const useCvInfo = () => {
  const context = useContext(CvInfoContext);
  if (context === undefined) {
    throw new Error("useCvInfo must be used within a CvInfoProvider");
  }
  return context;
};
