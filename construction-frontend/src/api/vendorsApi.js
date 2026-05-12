// services/vendorsApi.js

import { baseApi } from "./baseApi";

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= MASTER VENDORS =================

    createVendor: builder.mutation({
      query: (body) => ({
        url: "/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendors", "VendorTypes"],
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
      query: ({ id, ...body }) => ({
        url: `/vendors/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Vendors"],
    }),

    deleteVendor: builder.mutation({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vendors"],
    }),

    // ================= VENDOR TYPES =================

    createVendorType: builder.mutation({
      query: (body) => ({
        url: "/vendors/types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["VendorTypes"],
    }),

    getVendorTypes: builder.query({
      query: () => "/vendors/types/all",
      providesTags: ["VendorTypes"],
    }),

    // ================= PROJECT VENDORS =================

    assignVendorToProject: builder.mutation({
      query: (body) => ({
        url: "/vendors/assign",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendors", "Projects"],
    }),

    getVendorsByProject: builder.query({
      query: (projectId) => `/vendors/project/${projectId}`,
      providesTags: ["Vendors", "Projects"],
    }),

    updateProjectVendor: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/vendors/project-assignment/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Vendors", "Projects"],
    }),

    removeVendorFromProject: builder.mutation({
      query: (id) => ({
        url: `/vendors/project-assignment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vendors", "Projects"],
    }),
  }),

  overrideExisting: false,
});

export const {
  // Vendors
  useCreateVendorMutation,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useUpdateVendorMutation,
  useDeleteVendorMutation,

  // Vendor Types
  useCreateVendorTypeMutation,
  useGetVendorTypesQuery,

  // Project Vendors
  useAssignVendorToProjectMutation,
  useGetVendorsByProjectQuery,
  useUpdateProjectVendorMutation,
  useRemoveVendorFromProjectMutation,
} = vendorsApi;
