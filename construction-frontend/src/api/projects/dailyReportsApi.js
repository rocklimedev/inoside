import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const dailyReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ======================================================
    // GET ALL REPORTS
    // ======================================================
    getDailyReports: builder.query({
      query: () => "/daily-progress-reports",
      providesTags: ["DailyReport"],
    }),

    // ======================================================
    // GET SINGLE REPORT
    // ======================================================
    getDailyReportById: builder.query({
      query: (id) => `/daily-progress-reports/${id}`,
      providesTags: (result, error, id) => [{ type: "DailyReport", id }],
    }),

    // ======================================================
    // CREATE REPORT
    // ======================================================
    createDailyReport: builder.mutation({
      query: (body) => ({
        url: "/daily-progress-reports",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DailyReport"],
    }),

    // ======================================================
    // UPDATE REPORT
    // ======================================================
    updateDailyReport: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/daily-progress-reports/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DailyReport", id },
        "DailyReport",
      ],
    }),

    // ======================================================
    // DELETE REPORT
    // ======================================================
    deleteDailyReport: builder.mutation({
      query: (id) => ({
        url: `/daily-progress-reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DailyReport"],
    }),
  }),
});

// ======================================================
// EXPORT HOOKS
// ======================================================
export const {
  useGetDailyReportsQuery,
  useGetDailyReportByIdQuery,
  useCreateDailyReportMutation,
  useUpdateDailyReportMutation,
  useDeleteDailyReportMutation,
} = dailyReportsApi;
