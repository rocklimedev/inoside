// src/store/api/sitesApi.ts

import { baseApi } from "./baseApi";

export const sitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSite: builder.mutation({
      query: (body) => ({
        url: "/sites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sites"],
    }),

    getSites: builder.query({
      query: () => "/sites",
      providesTags: ["Sites"],
    }),

    getSiteById: builder.query({
      query: (id) => `/sites/${id}`,
      providesTags: ["Sites"],
    }),

    updateSite: builder.mutation({
      query: ({ id, body }) => ({
        url: `/sites/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sites"],
    }),

    deleteSite: builder.mutation({
      query: (id) => ({
        url: `/sites/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sites"],
    }),
  }),
});

export const {
  useCreateSiteMutation,
  useGetSitesQuery,
  useGetSiteByIdQuery,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
} = sitesApi;
