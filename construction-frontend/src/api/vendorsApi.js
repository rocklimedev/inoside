// src/store/api/vendorsApi.ts

import { baseApi } from "./baseApi";

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVendor: builder.mutation({
      query: (body) => ({
        url: "/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendors"],
    }),

    getVendors: builder.query({
      query: () => "/vendors",
      providesTags: ["Vendors"],
    }),

    getVendorById: builder.query({
      query: (id) => `/vendors/${id}`,
      providesTags: ["Vendors"],
    }),

    updateVendor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/vendors/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Vendors"],
    }),

    assignVendor: builder.mutation({
      query: (body) => ({
        url: "/vendors/assign",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendors"],
    }),

    getProjectVendors: builder.query({
      query: (projectId) => `/vendors/project/${projectId}`,
      providesTags: ["Vendors"],
    }),
  }),
});

export const {
  useCreateVendorMutation,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useUpdateVendorMutation,
  useAssignVendorMutation,
  useGetProjectVendorsQuery,
} = vendorsApi;
