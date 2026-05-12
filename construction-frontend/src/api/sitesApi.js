import { baseApi } from "./baseApi";

export const sitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE =================
    createSite: builder.mutation({
      query: (body) => ({
        url: "/sites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sites"],
    }),

    // ================= GET ALL =================
    getSites: builder.query({
      query: () => "/sites",
      providesTags: ["Sites"],
    }),

    // ================= GET ONE =================
    getSiteById: builder.query({
      query: (id) => `/sites/${id}`,
      providesTags: ["Sites"],
    }),

    // ================= UPDATE =================
    updateSite: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sites/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sites"],
    }),

    // ================= DELETE =================
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
  useGetSiteByIdQuery,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
} = sitesApi;
