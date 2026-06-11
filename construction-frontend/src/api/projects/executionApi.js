import { apiSlice } from "./apiSlice";

export const executionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= STAGES =================

    getExecutionStages: builder.query({
      query: (projectId) => `/execution/stages/project/${projectId}`,
      providesTags: ["ExecutionStages"],
    }),

    getExecutionStage: builder.query({
      query: (id) => `/execution/stages/${id}`,
      providesTags: ["ExecutionStages"],
    }),

    createExecutionStage: builder.mutation({
      query: (data) => ({
        url: "/execution/stages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ExecutionStages"],
    }),

    updateExecutionStage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/execution/stages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ExecutionStages"],
    }),

    deleteExecutionStage: builder.mutation({
      query: (id) => ({
        url: `/execution/stages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExecutionStages"],
    }),

    // ================= ACTIVITIES =================

    getExecutionActivities: builder.query({
      query: (projectId) => `/execution/activities/project/${projectId}`,
      providesTags: ["ExecutionActivities"],
    }),

    getExecutionActivity: builder.query({
      query: (id) => `/execution/activities/${id}`,
      providesTags: ["ExecutionActivities"],
    }),

    createExecutionActivity: builder.mutation({
      query: (data) => ({
        url: "/execution/activities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ExecutionActivities", "ExecutionStages"],
    }),

    updateExecutionActivity: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/execution/activities/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ExecutionActivities", "ExecutionStages"],
    }),

    deleteExecutionActivity: builder.mutation({
      query: (id) => ({
        url: `/execution/activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExecutionActivities", "ExecutionStages"],
    }),
  }),
});

export const {
  // ================= STAGES =================

  useGetExecutionStagesQuery,
  useGetExecutionStageQuery,
  useCreateExecutionStageMutation,
  useUpdateExecutionStageMutation,
  useDeleteExecutionStageMutation,

  // ================= ACTIVITIES =================

  useGetExecutionActivitiesQuery,
  useGetExecutionActivityQuery,
  useCreateExecutionActivityMutation,
  useUpdateExecutionActivityMutation,
  useDeleteExecutionActivityMutation,
} = executionApi;
