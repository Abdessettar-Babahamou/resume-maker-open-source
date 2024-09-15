"use client";
import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
} from "react";

type State = {
  activeStep: number;
  isLoading: boolean;
  isSaved: boolean;
  steps: string[];
};

type Action =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET_STEPS" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SAVED"; payload: boolean };

const initialState: State = {
  activeStep: 0,
  isLoading: false,
  isSaved: false,
  steps: [
    "Profile",
    "Education",
    "Experience",
    "Certification",
    "Project",
    "Training",
    "Skills",
    "Languages",
    "Done",
  ],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        activeStep: Math.min(state.activeStep + 1, state.steps.length - 1),
      };
    case "PREV_STEP":
      return { ...state, activeStep: Math.max(state.activeStep - 1, 0) };
    case "RESET_STEPS":
      return { ...state, activeStep: 0 };
    case "SET_STEP":
      return { ...state, activeStep: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SAVED":
      return { ...state, isSaved: action.payload };
    default:
      return state;
  }
};

const stepperContex = createContext<
  | {
      state: State;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);
export const StepperProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <stepperContex.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </stepperContex.Provider>
  );
};

export const useStepper = () => {
  const context = useContext(stepperContex);
  if (context === undefined) {
    throw new Error('useStepper must be used within a CvInfoProvider');
  }
  return context;
};
