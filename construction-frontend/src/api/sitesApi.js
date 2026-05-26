import { baseApi } from "./baseApi";

export const sitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ======================================================
    // CREATE SITE
    // ======================================================

    createSite: builder.mutation({
      query: (body) => ({
        url: "/sites",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Sites"],
    }),

    // ======================================================
    // GET ALL SITES
    // ======================================================

    getSites: builder.query({
      query: () => "/sites",

      providesTags: ["Sites"],
    }),

    // ======================================================
    // GET SITES BY CLIENT
    // ======================================================

    getSitesByClient: builder.query({
      query: (clientId) => `/sites/client/${clientId}`,

      providesTags: ["Sites"],
    }),

    // ======================================================
    // GET SINGLE SITE
    // ======================================================

    getSiteById: builder.query({
      query: (id) => `/sites/${id}`,

      providesTags: ["Sites"],
    }),

    // ======================================================
    // UPDATE SITE
    // ======================================================

    updateSite: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sites/${id}`,

        method: "PATCH",

        body,
      }),

      invalidatesTags: ["Sites"],
    }),

    // ======================================================
    // DELETE SITE
    // ======================================================

    deleteSite: builder.mutation({
      query: (id) => ({
        url: `/sites/${id}`,

        method: "DELETE",
      }),

      invalidatesTags: ["Sites"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateSiteMutation,

  useGetSitesQuery,

  useGetSitesByClientQuery,

  useGetSiteByIdQuery,

  useUpdateSiteMutation,

  useDeleteSiteMutation,
} = sitesApi;
