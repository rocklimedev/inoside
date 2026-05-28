import { baseApi } from "../baseApi";

export const drawingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadDrawing: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/drawings`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["Drawings"],
    }),

    getDrawings: builder.query({
      query: (projectId) => `/projects/${projectId}/drawings`,

      providesTags: ["Drawings"],
    }),

    approveDrawing: builder.mutation({
      query: ({ drawingId, user_id }) => ({
        url: `/projects/drawings/${drawingId}/approve`,
        method: "PATCH",
        body: { user_id },
      }),

      invalidatesTags: ["Drawings"],
    }),

    deleteDrawing: builder.mutation({
      query: (drawingId) => ({
        url: `/projects/drawings/${drawingId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Drawings"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useUploadDrawingMutation,
  useGetDrawingsQuery,
  useApproveDrawingMutation,
  useDeleteDrawingMutation,
} = drawingsApi;
