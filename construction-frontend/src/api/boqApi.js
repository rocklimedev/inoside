import { baseApi } from "./baseApi";

export const boqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // BOQ CATEGORIES
    // =====================================================

    getBoqCategories: builder.query({
      query: () => "/boq/categories",
      providesTags: ["BoqCategory"],
    }),

    createBoqCategory: builder.mutation({
      query: (body) => ({
        url: "/boq/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BoqCategory"],
    }),

    // =====================================================
    // BOQ
    // =====================================================

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

    // ✅ DELETE BOQ
    deleteBoq: builder.mutation({
      query: (id) => ({
        url: `/boq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boq"],
    }),
    updateBoq: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/boq/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),
    calculateBoqTotal: builder.mutation({
      query: (id) => ({
        url: `/boq/${id}/calculate`,
        method: "POST",
      }),
      invalidatesTags: ["Boq"],
    }),

    // =====================================================
    // BOQ SECTIONS
    // =====================================================

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

    // =====================================================
    // BOQ SUBHEADINGS
    // =====================================================

    createSubHeading: builder.mutation({
      query: (body) => ({
        url: "/boq/subheadings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    getSubHeadingsBySection: builder.query({
      query: (sectionId) => `/boq/sections/${sectionId}/subheadings`,
      providesTags: ["Boq"],
    }),

    // =====================================================
    // BOQ ITEMS
    // =====================================================

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

    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/boq/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boq"],
    }),
  }),

  overrideExisting: true,
});

export const {
  // =====================================================
  // CATEGORY
  // =====================================================

  useGetBoqCategoriesQuery,
  useCreateBoqCategoryMutation,

  // =====================================================
  // BOQ
  // =====================================================

  useCreateBoqMutation,
  useGetBoqsQuery,
  useGetBoqByIdQuery,
  useCalculateBoqTotalMutation,
  useDeleteBoqMutation, // ✅ ADDED
  useUpdateBoqMutation,
  // =====================================================
  // SECTIONS
  // =====================================================

  useCreateSectionMutation,
  useGetSectionsByBoqQuery,

  // =====================================================
  // SUBHEADINGS
  // =====================================================

  useCreateSubHeadingMutation,
  useGetSubHeadingsBySectionQuery,

  // =====================================================
  // ITEMS
  // =====================================================

  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = boqApi;
