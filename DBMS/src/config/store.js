// store.js
import { configureStore } from "@reduxjs/toolkit";
import { personApi } from "../api/personApi";
import { addressApi } from "../api/addressApi";
import { userApi } from "../api/userApi";
import { authApi } from "../api/authApi";
import authReducer from "../api/authSlice"; // or name it clearly
import { brandCompanyApi } from "../api/brandCompanyApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [personApi.reducerPath]: personApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [brandCompanyApi.reducerPath]: brandCompanyApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      personApi.middleware,
      addressApi.middleware,
      userApi.middleware,
      authApi.middleware,
      brandCompanyApi.middleware
    ),
});
