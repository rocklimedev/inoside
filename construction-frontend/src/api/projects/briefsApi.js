import { baseApi } from "../baseApi";

export const briefsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBrief: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/brief`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Briefs"],
    }),

    getBrief: builder.query({
      query: (projectId) => `/projects/${projectId}/brief`,
      providesTags: ["Briefs"],
    }),

    updateBrief: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/brief`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Briefs"],
    }),

    getAllBriefs: builder.query({
      query: () => "/projects/briefs/all",
      providesTags: ["Briefs"],
    }),
    unapproveBrief: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/unapprove`,
        method: "PATCH",
      }),
      invalidatesTags: ["Briefs"],
    }),

    requestBriefChanges: builder.mutation({
      query: ({ briefId, ...body }) => ({
        url: `/projects/briefs/${briefId}/request-changes`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Briefs"],
    }),

    sendBriefToClient: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/send-to-client`,
        method: "PATCH",
      }),
      invalidatesTags: ["Briefs"],
    }),

    markBriefAsDraft: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/mark-draft`,
        method: "PATCH",
      }),
      invalidatesTags: ["Briefs"],
    }),
    approveBrief: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Briefs"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateBriefMutation,
  useGetBriefQuery,
  useUpdateBriefMutation,
  useGetAllBriefsQuery,
  useApproveBriefMutation,
  useUnapproveBriefMutation,
  useRequestBriefChangesMutation,
  useSendBriefToClientMutation,
  useMarkBriefAsDraftMutation,
} = briefsApi;
