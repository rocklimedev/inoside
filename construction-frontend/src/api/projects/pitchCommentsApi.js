import { baseApi } from "../baseApi";

export const pitchCommentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPitchComments: builder.query({
      query: (pitchId) => `/projects/pitches/${pitchId}/comments`,

      providesTags: ["PitchComments"],
    }),

    addPitchComment: builder.mutation({
      query: ({ pitchId, content }) => ({
        url: `/projects/pitches/${pitchId}/comments`,
        method: "POST",
        body: { content },
      }),

      invalidatesTags: ["PitchComments"],
    }),

    updatePitchComment: builder.mutation({
      query: ({ commentId, ...body }) => ({
        url: `/projects/pitches/comments/${commentId}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["PitchComments"],
    }),

    deletePitchComment: builder.mutation({
      query: (commentId) => ({
        url: `/projects/pitches/comments/${commentId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["PitchComments"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetPitchCommentsQuery,
  useAddPitchCommentMutation,
  useUpdatePitchCommentMutation,
  useDeletePitchCommentMutation,
} = pitchCommentsApi;
