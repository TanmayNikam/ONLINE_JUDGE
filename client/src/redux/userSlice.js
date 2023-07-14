import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
    Logout: (state, action) => {
      state.user = null;
    },
  },
});

export const { SetUser, Logout } = userSlice.actions;

export default userSlice.reducer;
