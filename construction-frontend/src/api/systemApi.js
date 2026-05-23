// src/store/api/systemApi.ts

import { baseApi } from "./baseApi";

export const systemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================================================
    // ROOT OVERVIEW
    // =================================================

    getSystemOverview: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),

      providesTags: ["System"],
    }),

    // =================================================
    // HEALTH CHECK
    // =================================================

    getHealth: builder.query({
      query: () => ({
        url: "/health",
        method: "GET",
      }),

      providesTags: ["System"],
    }),

    // =================================================
    // PING
    // =================================================

    pingServer: builder.query({
      query: () => ({
        url: "/ping",
        method: "GET",
      }),

      providesTags: ["System"],
    }),

    // =================================================
    // VERSION
    // =================================================

    getVersion: builder.query({
      query: () => ({
        url: "/version",
        method: "GET",
      }),

      providesTags: ["System"],
    }),

    // =================================================
    // CDN STATUS
    // =================================================

    getCdnStatus: builder.query({
      query: () => ({
        url: "/cdn-status",
        method: "GET",
      }),

      providesTags: ["System"],
    }),

    // =================================================
    // READY CHECK
    // =================================================

    getReadyStatus: builder.query({
      query: () => ({
        url: "/ready",
        method: "GET",
      }),

      providesTags: ["System"],
    }),

    // =================================================
    // LIVE CHECK
    // =================================================

    getLiveStatus: builder.query({
      query: () => ({
        url: "/live",
        method: "GET",
      }),

      providesTags: ["System"],
    }),
  }),
});

export const {
  useGetSystemOverviewQuery,
  useGetHealthQuery,
  usePingServerQuery,
  useGetVersionQuery,
  useGetCdnStatusQuery,
  useGetReadyStatusQuery,
  useGetLiveStatusQuery,
} = systemApi;
