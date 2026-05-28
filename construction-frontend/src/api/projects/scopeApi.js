import { baseApi } from "../baseApi";

export const scopeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================================================
    // CREATE SCOPE
    // =================================================

    createScope: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/scope`,
        method: "POST",
        body: {
          ...body,
          project_id: projectId,
        },
      }),

      invalidatesTags: ["Scope"],
    }),

    // =================================================
    // GET SCOPE BY PROJECT
    // =================================================

    getScope: builder.query({
      query: (projectId) => ({
        url: `/projects/${projectId}/scope`,
      }),

      providesTags: ["Scope"],
    }),

    // =================================================
    // UPDATE SCOPE
    // =================================================

    updateScope: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/scope`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Scope"],
    }),

    // =================================================
    // GET ALL SCOPES
    // =================================================

    getAllScopes: builder.query({
      query: () => ({
        url: `/projects/scopes/all`,
      }),

      providesTags: ["Scope"],
    }),

    // =================================================
    // GET SCOPE BY ID
    // =================================================

    getScopeById: builder.query({
      query: (scopeId) => ({
        url: `/projects/scopes/${scopeId}`,
      }),

      providesTags: ["Scope"],
    }),

    // =================================================
    // DELETE SCOPE
    // =================================================

    deleteScope: builder.mutation({
      query: (scopeId) => ({
        url: `/projects/scopes/${scopeId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Scope"],
    }),

    // =================================================
    // APPROVE SCOPE
    // =================================================

    approveScope: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/scope/approve`,
        method: "PATCH",
      }),

      invalidatesTags: ["Scope", "Projects"],
    }),

    // =================================================
    // REJECT SCOPE
    // =================================================

    rejectScope: builder.mutation({
      query: ({ projectId, reason }) => ({
        url: `/projects/${projectId}/scope/reject`,
        method: "PATCH",
        body: { reason },
      }),

      invalidatesTags: ["Scope", "Projects"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateScopeMutation,
  useGetScopeQuery,
  useUpdateScopeMutation,

  useGetAllScopesQuery,
  useGetScopeByIdQuery,

  useDeleteScopeMutation,

  useApproveScopeMutation,
  useRejectScopeMutation,
} = scopeApi;
