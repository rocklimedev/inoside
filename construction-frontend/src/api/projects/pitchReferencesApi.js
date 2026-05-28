import { baseApi } from "../baseApi";

export const pitchReferencesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPitchReference: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch-references`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["PitchReferences"],
    }),

    getPitchReferences: builder.query({
      query: (projectId) => `/projects/${projectId}/pitch-references`,

      providesTags: ["PitchReferences"],
    }),

    deletePitchReference: builder.mutation({
      query: (refId) => ({
        url: `/projects/pitch-references/${refId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["PitchReferences"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useAddPitchReferenceMutation,
  useGetPitchReferencesQuery,
  useDeletePitchReferenceMutation,
} = pitchReferencesApi;
