import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { jobsReducer } from "./slices/jobsSlice";
import { uiReducer } from "./slices/uiSlice";

const rootReducer = combineReducers({
  jobs: jobsReducer,
  ui: uiReducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

export const store = makeStore();
