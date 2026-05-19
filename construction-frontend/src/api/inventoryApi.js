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

    createDispatch: builder.mutation({
      query: (body) => ({
        url: "/inventory/dispatches",
        method: "POST",
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
    // 🏷️ BRANDS (NEW)
    // =========================

    getBrands: builder.query({
      query: () => `/inventory/brands`,
      providesTags: ["Brand"],
    }),

    createBrand: builder.mutation({
      query: (body) => ({
        url: `/inventory/brands`,
        method: "POST",
        body,
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
  }),
});

export const {
  useGetInventoryRequestsQuery,
  useGetInventoryRequestByIdQuery,
  useCreateInventoryRequestMutation,
  useUpdateInventoryRequestMutation,
  useDeleteInventoryRequestMutation,

  useGetDispatchesQuery,
  useCreateDispatchMutation,
  useUpdateDispatchMutation,

  useGetInventoryMasterQuery,
  useCreateInventoryMasterMutation,
  useUpdateInventoryMasterMutation,
  useDeleteInventoryMasterMutation,

  useGetBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,

  useGetMaterialsQuery,
} = inventoryApi;
