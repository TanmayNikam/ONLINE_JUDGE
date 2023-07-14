import { createSlice } from "@reduxjs/toolkit";

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    problems: [],
    currentProblem: null,
  },
  reducers: {
    SetProblemsList: (state, action) => {
      state.problems = action.payload;
    },
    SetCurrentProblem: (state, action) => {
      state.currentProblem = action.payload;
    },
  },
});

export const { SetProblemsList, SetCurrentProblem } = problemsSlice.actions;

export default problemsSlice.reducer;
