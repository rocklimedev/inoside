import { baseApi } from "../baseApi";

export const rekiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReki: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reki"],
    }),

    getReki: builder.query({
      query: (projectId) => `/projects/${projectId}/reki`,
      providesTags: ["Reki"],
    }),

    getRekiById: builder.query({
      query: (id) => `/projects/reki/${id}`,
      providesTags: ["Reki"],
    }),

    getAllRekiReports: builder.query({
      query: () => `/projects/reki/all`,
      providesTags: ["Reki"],
    }),

    updateReki: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Reki"],
    }),

    deleteReki: builder.mutation({
      query: (id) => ({
        url: `/projects/reki/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reki"],
    }),

    markRekiAsDone: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/reki/done`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reki"],
    }),

    markRekiAsPending: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/reki/pending`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reki"],
    }),

    uploadRekiPhoto: builder.mutation({
      query: ({ projectId, file }) => {
        const formData = new FormData();

        formData.append("file", file);

        return {
          url: `/projects/${projectId}/reki/photos`,
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Reki"],
    }),

    deleteRekiPhoto: builder.mutation({
      query: (photoId) => ({
        url: `/projects/reki/photos/${photoId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Reki"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateRekiMutation,
  useGetRekiQuery,
  useGetRekiByIdQuery,
  useGetAllRekiReportsQuery,
  useUpdateRekiMutation,
  useDeleteRekiMutation,
  useMarkRekiAsDoneMutation,
  useMarkRekiAsPendingMutation,
  useUploadRekiPhotoMutation,
  useDeleteRekiPhotoMutation,
} = rekiApi;
