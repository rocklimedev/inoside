import { baseApi } from "./baseApi";

export const boqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= BOQ =================

    createBoq: builder.mutation({
      query: (body) => ({
        url: "/boq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    getBoqs: builder.query({
      query: (projectId) => ({
        url: "/boq",
        params: projectId ? { projectId } : undefined,
      }),
      providesTags: ["Boq"],
    }),

    getBoqById: builder.query({
      query: (id) => `/boq/${id}`,
      providesTags: ["Boq"],
    }),

    // ================= SECTIONS =================

    createSection: builder.mutation({
      query: (body) => ({
        url: "/boq/sections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    getSectionsByBoq: builder.query({
      query: (boqId) => `/boq/${boqId}/sections`,
      providesTags: ["Boq"],
    }),

    // ================= ITEMS =================

    createItem: builder.mutation({
      query: (body) => ({
        url: "/boq/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    updateItem: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/boq/items/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    // ================= CALCULATIONS =================

    calculateBoqTotal: builder.mutation({
      query: (id) => ({
        url: `/boq/${id}/calculate`,
        method: "POST",
      }),
      invalidatesTags: ["Boq"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateBoqMutation,
  useGetBoqsQuery,
  useGetBoqByIdQuery,

  useCreateSectionMutation,
  useGetSectionsByBoqQuery,

  useCreateItemMutation,
  useUpdateItemMutation,

  useCalculateBoqTotalMutation,
} = boqApi;
