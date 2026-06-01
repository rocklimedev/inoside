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
      query: ({ projectId, clientId } = {}) => ({
        url: "/boq",
        params: {
          ...(projectId ? { projectId } : {}),
          ...(clientId ? { clientId } : {}),
        },
      }),
      providesTags: ["Boq"],
    }),

    getBoqsByClient: builder.query({
      query: (clientId) => `/boq/client/${clientId}`,
      providesTags: ["Boq"],
    }),

    getBoqById: builder.query({
      query: (id) => `/boq/${id}`,
      providesTags: ["Boq"],
    }),
    // =====================================================
    // STATUS
    // =====================================================

    updateBoqStatus: builder.mutation({
      query: ({ id, status, approved_by }) => ({
        url: `/boq/${id}/status`,
        method: "PATCH",
        body: {
          status,
          approved_by,
        },
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

    deleteBoq: builder.mutation({
      query: (id) => ({
        url: `/boq/${id}`,
        method: "DELETE",
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
    // SECTIONS
    // =====================================================

    createSection: builder.mutation({
      query: (body) => ({
        url: "/boq/sections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    updateSection: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/boq/sections/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    deleteSection: builder.mutation({
      query: (id) => ({
        url: `/boq/sections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boq"],
    }),

    getSectionsByBoq: builder.query({
      query: (boqId) => `/boq/${boqId}/sections`,
      providesTags: ["Boq"],
    }),

    // =====================================================
    // SUBHEADINGS
    // =====================================================

    createSubHeading: builder.mutation({
      query: (body) => ({
        url: "/boq/subheadings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    updateSubHeading: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/boq/subheadings/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Boq"],
    }),

    deleteSubHeading: builder.mutation({
      query: (id) => ({
        url: `/boq/subheadings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boq"],
    }),

    getSubHeadingsBySection: builder.query({
      query: (sectionId) => `/boq/sections/${sectionId}/subheadings`,
      providesTags: ["Boq"],
    }),

    // =====================================================
    // ITEMS
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
  // Categories
  useGetBoqCategoriesQuery,
  useCreateBoqCategoryMutation,

  // BOQ
  useCreateBoqMutation,
  useGetBoqsQuery,
  useGetBoqsByClientQuery,
  useGetBoqByIdQuery,
  useUpdateBoqMutation,
  useUpdateBoqStatusMutation,
  useDeleteBoqMutation,
  useCalculateBoqTotalMutation,

  // Sections
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useGetSectionsByBoqQuery,

  // Subheadings
  useCreateSubHeadingMutation,
  useUpdateSubHeadingMutation,
  useDeleteSubHeadingMutation,
  useGetSubHeadingsBySectionQuery,

  // Items
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = boqApi;
