import { baseApi } from "../baseApi";

export const executionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // STAGES
    // =====================================================

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
      invalidatesTags: ["ExecutionStages", "ExecutionActivities"],
    }),

    reorderExecutionStages: builder.mutation({
      query: ({ projectId, stageIds }) => ({
        url: `/execution/stages/project/${projectId}/reorder`,
        method: "PATCH",
        body: {
          stageIds,
        },
      }),
      invalidatesTags: ["ExecutionStages"],
    }),

    // =====================================================
    // ACTIVITIES
    // =====================================================

    getExecutionActivities: builder.query({
      query: (projectId) => `/execution/activities/project/${projectId}`,
      providesTags: ["ExecutionActivities"],
    }),

    getExecutionActivitiesByStage: builder.query({
      query: (stageId) => `/execution/activities/stage/${stageId}`,
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

    reorderExecutionActivities: builder.mutation({
      query: ({ stageId, activityIds }) => ({
        url: `/execution/activities/stage/${stageId}/reorder`,
        method: "PATCH",
        body: {
          activityIds,
        },
      }),
      invalidatesTags: ["ExecutionActivities", "ExecutionStages"],
    }),
  }),

  overrideExisting: true,
});

export const {
  // STAGES
  useGetExecutionStagesQuery,
  useGetExecutionStageQuery,
  useCreateExecutionStageMutation,
  useUpdateExecutionStageMutation,
  useDeleteExecutionStageMutation,
  useReorderExecutionStagesMutation,

  // ACTIVITIES
  useGetExecutionActivitiesQuery,
  useGetExecutionActivitiesByStageQuery,
  useGetExecutionActivityQuery,
  useCreateExecutionActivityMutation,
  useUpdateExecutionActivityMutation,
  useDeleteExecutionActivityMutation,
  useReorderExecutionActivitiesMutation,
} = executionApi;
