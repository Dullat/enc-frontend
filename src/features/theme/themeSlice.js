import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { accent: "#FF6200" },
  reducers: {
    setAccent: (state, action) => {
      state.accent = action.payload;
    },
    resetAccent: (state, action) => {
      state.accent = "#FF6200";
    },
  },
});

export const { setAccent, resetAccent } = themeSlice.actions;
export default themeSlice.reducer;
export const selectAccent = (state) => state.theme.accent;
