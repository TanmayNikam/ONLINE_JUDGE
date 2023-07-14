import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import userReducer from "./userSlice";
import problemsSlice from "./problemsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    loader: loaderReducer,
    problems: problemsSlice,
  },
});

export default store;
