// store.js
import { configureStore } from "@reduxjs/toolkit";
import { personApi } from "../api/personApi";
import { addressApi } from "../api/addressApi";

export const store = configureStore({
  reducer: {
    [personApi.reducerPath]: personApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(personApi.middleware, addressApi.middleware),
});
