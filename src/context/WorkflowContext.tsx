// src/context/workflow/WorkflowContext.tsx
import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { workflowReducer } from "./workflow/WorkflowReducer";
import type {  WorkflowState, WorkflowAction } from "./workflow/WorkflowTypes";
import  { initialState} from "./workflow/WorkflowTypes";

export const WorkflowContext = createContext<
  | {
      state: WorkflowState;
      dispatch: React.Dispatch<WorkflowAction>;
    }
  | undefined
>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  useEffect(() => {
    dispatch({ type: "LOAD_WORKFLOWS" });
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context)
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  return context;
}
