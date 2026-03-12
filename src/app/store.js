import { configureStore } from "@reduxjs/toolkit";
import themeslice from "../features/theme/themeSlice.js";

export const store = configureStore({
  reducer: {
    theme: themeslice,
  },
  devtools: true,
});
