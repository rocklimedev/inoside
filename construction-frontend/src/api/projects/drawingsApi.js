import { baseApi } from "../baseApi";
// drawingsApi.ts
export const drawingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadDrawing: builder.mutation({
      query: ({ projectId, body }) => ({
        url: `/drawings/${projectId}`,
        method: "POST",
        body, // FormData
        // Important: Let the browser set the correct Content-Type for FormData
        formData: true, // RTK Query will handle boundary automatically
      }),
      invalidatesTags: ["Drawings"],
    }),

    getDrawings: builder.query({
      query: (projectId) => `/drawings/project/${projectId}`,
      providesTags: ["Drawings"],
    }),

    approveDrawing: builder.mutation({
      query: ({ drawingId, user_id }) => ({
        url: `/drawings/${drawingId}/approve`,
        method: "PATCH",
        body: { user_id },
      }),
      invalidatesTags: ["Drawings"],
    }),
    // NEW: Get all drawings (with optional project filter)
    getAllDrawings: builder.query({
      query: () => "/drawings",
      providesTags: ["Drawings"],
    }),
    deleteDrawing: builder.mutation({
      query: (drawingId) => ({
        url: `/drawings/${drawingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Drawings"],
    }),

    // Get Single Design
    getDesign: builder.query({
      query: (designId) => `/designs/${designId}`,
      providesTags: (result, error, id) => [{ type: "Design", id }],
    }),

    // Add Comment
    addComment: builder.mutation({
      query: ({ designId, content }) => ({
        url: `/designs/${designId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { designId }) => [
        { type: "Design", id: designId },
      ],
    }),

    // Approve / Request Changes
    approveDesign: builder.mutation({
      query: ({ designId, status, remarks }) => ({
        url: `/designs/${designId}/approve`,
        method: "POST",
        body: { status, remarks },
      }),
      invalidatesTags: (result, error, { designId }) => [
        { type: "Design", id: designId },
        "Drawings",
      ],
    }),

    // Revise (Upload new version)
    reviseDesign: builder.mutation({
      query: ({ designId, body }) => ({
        url: `/designs/${designId}/revise`,
        method: "POST",
        body, // FormData
        formData: true,
      }),
      invalidatesTags: (result, error, { designId }) => [
        { type: "Design", id: designId },
        "Drawings",
      ],
    }),
  }),
});

export const {
  useUploadDrawingMutation,
  useGetAllDrawingsQuery,
  useGetDrawingsQuery,
  useApproveDrawingMutation,
  useDeleteDrawingMutation,
  useGetDesignQuery,
  useAddCommentMutation,
  useApproveDesignMutation,
  useReviseDesignMutation,
} = drawingsApi;
