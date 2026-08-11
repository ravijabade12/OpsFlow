import { combineReducers } from "@reduxjs/toolkit";

import { agentsReducer } from "./slices/agents/agentsSlice";
import { customersReducer } from "./slices/customers/customersSlice";
import { jobsReducer } from "./slices/jobs/jobsSlice";
import { uiReducer } from "./slices/ui/uiSlice";

export const rootReducer = combineReducers({
  jobs: jobsReducer,
  agents: agentsReducer,
  customers: customersReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
