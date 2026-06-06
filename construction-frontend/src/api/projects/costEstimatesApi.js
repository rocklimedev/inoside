import { baseApi } from "../baseApi";

export const costEstimatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCostEstimate: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/cost-estimates/project/${projectId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CostEstimates"],
    }),

    getAllCostEstimates: builder.query({
      query: () => "/cost-estimates",
      providesTags: ["CostEstimates"],
    }),
    getCostEstimateById: builder.query({
      query: (id) => `/cost-estimates/${id}`,
    }),
    getCostEstimates: builder.query({
      query: (projectId) => `/cost-estimates/project/${projectId}`,
      providesTags: ["CostEstimates"],
    }),

    updateCostEstimate: builder.mutation({
      query: ({ estimateId, ...body }) => ({
        url: `/cost-estimates/${estimateId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CostEstimates"],
    }),

    deleteCostEstimate: builder.mutation({
      query: (estimateId) => ({
        url: `/cost-estimates/${estimateId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CostEstimates"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useAddCostEstimateMutation,
  useGetAllCostEstimatesQuery,
  useGetCostEstimateByIdQuery,
  useGetCostEstimatesQuery,
  useUpdateCostEstimateMutation,
  useDeleteCostEstimateMutation,
} = costEstimatesApi;
