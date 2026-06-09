// store/api/activityLogApi.js

import { baseApi } from "./baseApi";

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // GET ALL LOGS
    // ==========================================
    getActivityLogs: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/activity-logs",
        params: { page, limit },
      }),
      providesTags: ["ActivityLogs"],
    }),

    // ==========================================
    // GET SINGLE LOG
    // ==========================================
    getActivityLogById: builder.query({
      query: (activityLogId) => `/activity-logs/${activityLogId}`,
      providesTags: (result, error, id) => [{ type: "ActivityLogs", id }],
    }),

    // ==========================================
    // SEARCH LOGS
    // ==========================================
    searchActivityLogs: builder.query({
      query: (params) => ({
        url: "/activity-logs/search",
        params,
      }),
      providesTags: ["ActivityLogs"],
    }),

    // ==========================================
    // USER LOGS
    // ==========================================
    getUserActivityLogs: builder.query({
      query: ({ userId, page = 1, limit = 20 }) => ({
        url: `/activity-logs/user/${userId}`,
        params: { page, limit },
      }),
      providesTags: ["ActivityLogs"],
    }),

    // ==========================================
    // MODULE LOGS
    // ==========================================
    getModuleActivityLogs: builder.query({
      query: ({ moduleName, page = 1, limit = 20 }) => ({
        url: `/activity-logs/module/${moduleName}`,
        params: { page, limit },
      }),
      providesTags: ["ActivityLogs"],
    }),

    // ==========================================
    // SEVERITY LOGS
    // ==========================================
    getSeverityLogs: builder.query({
      query: ({ severity, page = 1, limit = 20 }) => ({
        url: `/activity-logs/severity/${severity}`,
        params: { page, limit },
      }),
      providesTags: ["ActivityLogs"],
    }),

    // ==========================================
    // RECENT LOGS
    // ==========================================
    getRecentActivityLogs: builder.query({
      query: (limit = 50) => ({
        url: "/activity-logs/recent",
        params: { limit },
      }),
      providesTags: ["ActivityLogs"],
    }),

    // ==========================================
    // STATS
    // ==========================================
    getActivityLogStats: builder.query({
      query: () => "/activity-logs/stats",
      providesTags: ["ActivityLogs"],
    }),

    // ==========================================
    // DELETE
    // ==========================================
    deleteActivityLog: builder.mutation({
      query: (activityLogId) => ({
        url: `/activity-logs/${activityLogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ActivityLogs"],
    }),
  }),
});

export const {
  useGetActivityLogsQuery,
  useGetActivityLogByIdQuery,
  useSearchActivityLogsQuery,
  useGetUserActivityLogsQuery,
  useGetModuleActivityLogsQuery,
  useGetSeverityLogsQuery,
  useGetRecentActivityLogsQuery,
  useGetActivityLogStatsQuery,
  useDeleteActivityLogMutation,
} = activityLogApi;
