import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./rootReducer";

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type { RootState } from "./rootReducer";
