import { configureStore } from "@reduxjs/toolkit";
import themeslice from "../features/theme/themeSlice.js";
import { userApiBase } from "../services/api.js";

export const store = configureStore({
  reducer: {
    theme: themeslice,
    [userApiBase.reducerPath]: userApiBase.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiBase.middleware),
  devtools: true,
});
