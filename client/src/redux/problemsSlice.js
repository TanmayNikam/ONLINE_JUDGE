import { createSlice } from "@reduxjs/toolkit";

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    problems: [],
  },
  reducers: {
    SetProblemsList: (state, action) => {
      state.problems = action.payload;
    },
  },
});

export const { SetProblemsList} = problemsSlice.actions;

export default problemsSlice.reducer;
