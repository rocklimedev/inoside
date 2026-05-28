import { baseApi } from "../baseApi";
export const approvalLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addApprovalLog: builder.mutation({
      query: ({ drawingId, ...body }) => ({
        url: `/projects/drawings/${drawingId}/logs`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["ApprovalLogs"],
    }),

    getApprovalLogs: builder.query({
      query: (drawingId) => `/projects/drawings/${drawingId}/logs`,

      providesTags: ["ApprovalLogs"],
    }),
  }),

  overrideExisting: true,
});

export const { useAddApprovalLogMutation, useGetApprovalLogsQuery } =
  approvalLogsApi;
