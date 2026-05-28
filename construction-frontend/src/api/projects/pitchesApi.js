import { baseApi } from "../baseApi";

export const pitchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================================================
    // 🎨 PROJECT PITCH
    // =================================================

    createPitch: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["Pitches"],
    }),

    getPitch: builder.query({
      query: (projectId) => `/projects/${projectId}/pitch`,

      providesTags: ["Pitches"],
    }),

    updatePitch: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Pitches"],
    }),

    deleteProjectPitch: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/pitch`,
        method: "DELETE",
      }),

      invalidatesTags: ["Pitches"],
    }),

    // =================================================
    // 📊 GLOBAL PITCHES
    // =================================================

    getAllPitches: builder.query({
      query: () => `/projects/pitches/all`,

      providesTags: ["Pitches"],
    }),

    getPitchById: builder.query({
      query: (pitchId) => `/projects/pitches/${pitchId}`,

      providesTags: ["Pitches"],
    }),

    deletePitch: builder.mutation({
      query: (pitchId) => ({
        url: `/projects/pitches/${pitchId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Pitches"],
    }),

    approvePitch: builder.mutation({
      query: (pitchId) => ({
        url: `/projects/pitches/${pitchId}/approve`,
        method: "PATCH",
      }),

      invalidatesTags: ["Pitches"],
    }),

    rejectPitch: builder.mutation({
      query: (pitchId) => ({
        url: `/projects/pitches/${pitchId}/reject`,
        method: "PATCH",
      }),

      invalidatesTags: ["Pitches"],
    }),

    replacePitchFile: builder.mutation({
      query: ({ pitchId, ...body }) => ({
        url: `/projects/pitches/${pitchId}/files`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Pitches"],
    }),

    uploadPitchFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();

        formData.append("file", file);

        return {
          url: "/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreatePitchMutation,
  useGetPitchQuery,
  useUpdatePitchMutation,
  useDeleteProjectPitchMutation,

  useGetAllPitchesQuery,
  useGetPitchByIdQuery,
  useDeletePitchMutation,
  useApprovePitchMutation,
  useRejectPitchMutation,
  useReplacePitchFileMutation,
  useUploadPitchFileMutation,
} = pitchesApi;
