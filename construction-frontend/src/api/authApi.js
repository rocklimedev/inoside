// src/store/api/authApi.ts

import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    profile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["Auth"],
    }),

    adminOnly: builder.query({
      query: () => "/auth/admin-only",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useProfileQuery,
  useAdminOnlyQuery,
} = authApi;
