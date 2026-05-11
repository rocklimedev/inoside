// src/store/api/boqApi.ts

import { baseApi } from "./baseApi";

export const boqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBoq: builder.mutation({
      query: (body) => ({
        url: "/boq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    getBoqs: builder.query({
      query: () => "/boq",
      providesTags: ["Boq"],
    }),

    getBoqById: builder.query({
      query: (id) => `/boq/${id}`,
      providesTags: ["Boq"],
    }),

    createSection: builder.mutation({
      query: (body) => ({
        url: "/boq/sections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    getSections: builder.query({
      query: (boqId) => `/boq/${boqId}/sections`,
      providesTags: ["Boq"],
    }),

    createItem: builder.mutation({
      query: (body) => ({
        url: "/boq/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    updateItem: builder.mutation({
      query: ({ id, body }) => ({
        url: `/boq/items/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    calculateBoq: builder.mutation({
      query: (id) => ({
        url: `/boq/${id}/calculate`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateBoqMutation,
  useGetBoqsQuery,
  useGetBoqByIdQuery,
  useCreateSectionMutation,
  useGetSectionsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useCalculateBoqMutation,
} = boqApi;
