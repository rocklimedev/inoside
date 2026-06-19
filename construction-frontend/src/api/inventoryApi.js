import { baseApi } from "./baseApi";

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // 📦 INVENTORY REQUESTS
    // =========================
    getInventoryRequests: builder.query({
      query: () => `/inventory/requests`,
      providesTags: ["InventoryRequest"],
    }),

    getInventoryRequestById: builder.query({
      query: (id) => `/inventory/requests/${id}`,
      providesTags: ["InventoryRequest"],
    }),

    createInventoryRequest: builder.mutation({
      query: (body) => ({
        url: "/inventory/requests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InventoryRequest"],
    }),

    updateInventoryRequest: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventory/requests/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["InventoryRequest"],
    }),

    deleteInventoryRequest: builder.mutation({
      query: (id) => ({
        url: `/inventory/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InventoryRequest"],
    }),

    // =========================
    // 🚚 DISPATCHES
    // =========================
    getDispatches: builder.query({
      query: () => `/inventory/dispatches`,
      providesTags: ["InventoryDispatch"],
    }),

    getDispatchById: builder.query({
      query: (id) => `/inventory/dispatches/${id}`,
      providesTags: ["InventoryDispatch"],
    }),

    createDispatch: builder.mutation({
      query: (body) => ({
        url: "/inventory/dispatches",
        method: "POST",
        body, // ✅ FIXED
      }),
      invalidatesTags: ["InventoryDispatch", "InventoryRequest"],
    }),

    updateDispatch: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventory/dispatches/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["InventoryDispatch"],
    }),

    deleteDispatch: builder.mutation({
      query: (id) => ({
        url: `/inventory/dispatches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InventoryDispatch"],
    }),

    // =========================
    // 📦 INVENTORY MASTER
    // =========================
    getInventoryMaster: builder.query({
      query: (params) => {
        const search = params?.search || "";
        return `/inventory/master?search=${search}`;
      },
      providesTags: ["InventoryMaster"],
    }),

    createInventoryMaster: builder.mutation({
      query: (body) => ({
        url: "/inventory/master",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InventoryMaster"],
    }),

    updateInventoryMaster: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventory/master/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["InventoryMaster"],
    }),

    deleteInventoryMaster: builder.mutation({
      query: (id) => ({
        url: `/inventory/master/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InventoryMaster"],
    }),

    // =========================
    // 🧱 UNITS
    // =========================
    getUnits: builder.query({
      query: () => `/inventory/units`,
      providesTags: ["Unit"],
    }),

    getUnitById: builder.query({
      query: (id) => `/inventory/units/${id}`,
      providesTags: ["Unit"],
    }),

    createUnit: builder.mutation({
      query: (body) => ({
        url: "/inventory/units",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Unit"],
    }),

    updateUnit: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventory/units/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Unit"],
    }),

    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `/inventory/units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),

    // =========================
    // 🏷️ BRANDS
    // =========================
    getBrands: builder.query({
      query: () => `/inventory/brands`,
      providesTags: ["Brand"],
    }),

    createBrand: builder.mutation({
      query: (body) => ({
        url: `/inventory/brands`,
        method: "POST",
        body, // { name: string }
      }),
      invalidatesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/inventory/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),

    // =========================
    // 🧱 MATERIALS
    // =========================
    getMaterials: builder.query({
      query: () => `/inventory/materials`,
      providesTags: ["Material"],
    }),
    getProjectMaterials: builder.query({
      query: (projectId) => `/inventory/projects/${projectId}/materials`,
      providesTags: ["Material"],
    }),

    getProjectMaterialById: builder.query({
      query: (id) => `/inventory/materials/${id}`,
      providesTags: ["Material"],
    }),

    getProjectMaterialSummary: builder.query({
      query: (projectId) =>
        `/inventory/projects/${projectId}/materials/summary`,
      providesTags: ["Material"],
    }),
    createProjectMaterial: builder.mutation({
      query: (body) => ({
        url: "/inventory/projects/materials",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Material"],
    }),
    updateProjectMaterial: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventory/projects/materials/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Material"],
    }),
    deleteProjectMaterial: builder.mutation({
      query: (id) => ({
        url: `/inventory/projects/materials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Material"],
    }),
    getProjectMaterialStatus: builder.query({
      query: (projectId) => `/inventory/projects/${projectId}/materials/status`,
      providesTags: ["Material"],
    }),

    getProjectMaterialConsumption: builder.query({
      query: (projectId) =>
        `/inventory/projects/${projectId}/materials/consumption`,
      providesTags: ["Material"],
    }),

    getProjectInventoryValue: builder.query({
      query: (projectId) => `/inventory/projects/${projectId}/materials/value`,
      providesTags: ["Material"],
    }),

    getPendingMaterials: builder.query({
      query: () => `/inventory/materials/pending`,
      providesTags: ["Material"],
    }),

    getProjectPendingMaterials: builder.query({
      query: (projectId) => `/inventory/project/${projectId}/materials/pending`,
      providesTags: ["Material"],
    }),
    getProjectRequests: builder.query({
      query: (projectId) => `/inventory/project/${projectId}/requests`,
      providesTags: ["InventoryRequest"],
    }),

    getPendingRequests: builder.query({
      query: () => `/inventory/requests/pending`,
      providesTags: ["InventoryRequest"],
    }),
    getProjectDispatches: builder.query({
      query: (projectId) => `/inventory/projects/${projectId}/dispatches`,
      providesTags: ["InventoryDispatch"],
    }),
    searchInventory: builder.query({
      query: (search) =>
        `/inventory/master/search/${encodeURIComponent(search)}`,
      providesTags: ["InventoryMaster"],
    }),

    getInventoryByCategory: builder.query({
      query: (categoryId) => `/inventory/master/category/${categoryId}`,
      providesTags: ["InventoryMaster"],
    }),

    getInventoryByBrand: builder.query({
      query: (brandId) => `/inventory/master/brand/${brandId}`,
      providesTags: ["InventoryMaster"],
    }),
    getInventoryDashboard: builder.query({
      query: () => `/inventory/dashboard`,
      providesTags: [
        "InventoryMaster",
        "InventoryRequest",
        "InventoryDispatch",
        "Material",
      ],
    }),

    getProjectInventoryDashboard: builder.query({
      query: (projectId) => `/inventory/dashboard/project/${projectId}`,
      providesTags: [
        "InventoryMaster",
        "InventoryRequest",
        "InventoryDispatch",
        "Material",
      ],
    }),
    getInventoryHealth: builder.query({
      query: () => `/inventory/health`,
    }),
  }),
});

export const {
  useGetInventoryRequestsQuery,
  useGetInventoryRequestByIdQuery,
  useCreateInventoryRequestMutation,
  useUpdateInventoryRequestMutation,
  useDeleteInventoryRequestMutation,

  useGetDispatchesQuery,
  useGetDispatchByIdQuery,
  useCreateDispatchMutation,
  useUpdateDispatchMutation,
  useDeleteDispatchMutation,

  useGetInventoryMasterQuery,
  useCreateInventoryMasterMutation,
  useUpdateInventoryMasterMutation,
  useDeleteInventoryMasterMutation,

  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,

  useGetBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,

  useGetMaterialsQuery,
  useGetProjectMaterialsQuery,
  useGetProjectMaterialByIdQuery,
  useGetProjectMaterialSummaryQuery,
  useGetProjectMaterialStatusQuery,
  useCreateProjectMaterialMutation,
  useUpdateProjectMaterialMutation,
  useDeleteProjectMaterialMutation,
  useGetProjectMaterialConsumptionQuery,
  useGetProjectInventoryValueQuery,
  useGetPendingMaterialsQuery,
  useGetProjectPendingMaterialsQuery,

  useGetProjectRequestsQuery,
  useGetPendingRequestsQuery,

  useGetProjectDispatchesQuery,

  useSearchInventoryQuery,
  useGetInventoryByCategoryQuery,
  useGetInventoryByBrandQuery,

  useGetInventoryDashboardQuery,
  useGetProjectInventoryDashboardQuery,

  useGetInventoryHealthQuery,
} = inventoryApi;
