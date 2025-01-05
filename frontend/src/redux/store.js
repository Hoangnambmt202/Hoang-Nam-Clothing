import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slides/counterSlides";
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
