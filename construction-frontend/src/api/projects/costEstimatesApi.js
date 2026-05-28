import { baseApi } from "../baseApi";

export const costEstimatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCostEstimate: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/cost-estimates`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["CostEstimates"],
    }),

    getCostEstimates: builder.query({
      query: (projectId) => `/projects/${projectId}/cost-estimates`,

      providesTags: ["CostEstimates"],
    }),

    updateCostEstimate: builder.mutation({
      query: ({ estimateId, ...body }) => ({
        url: `/projects/cost-estimates/${estimateId}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["CostEstimates"],
    }),

    deleteCostEstimate: builder.mutation({
      query: (estimateId) => ({
        url: `/projects/cost-estimates/${estimateId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["CostEstimates"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useAddCostEstimateMutation,
  useGetCostEstimatesQuery,
  useUpdateCostEstimateMutation,
  useDeleteCostEstimateMutation,
} = costEstimatesApi;
