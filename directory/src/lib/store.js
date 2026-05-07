// lib/store.js
import { configureStore } from "@reduxjs/toolkit";

import { personApi } from "../api/personApi";
import { addressApi } from "../api/addressApi";
import { userApi } from "../api/userApi";
import { authApi } from "../api/authApi";
import { brandCompanyApi } from "../api/brandCompanyApi";
import { inventoryApi } from "../api/inventoryApi";
import { projectApi } from "../api/projectApi";

import authReducer from "../api/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [personApi.reducerPath]: personApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [brandCompanyApi.reducerPath]: brandCompanyApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      personApi.middleware,
      addressApi.middleware,
      userApi.middleware,
      authApi.middleware,
      brandCompanyApi.middleware,
      inventoryApi.middleware,
      projectApi.middleware,
    ),
});
