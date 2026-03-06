import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/inventory",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({
    createInventory: builder.mutation({
      query: (data) => ({
        url: "/", // FIX
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    getInventories: builder.query({
      query: () => "/", // FIX
      providesTags: ["Inventory"],
    }),

    getInventoryById: builder.query({
      query: (id) => `/${id}`, // FIX
      providesTags: ["Inventory"],
    }),

    getInventoryByProject: builder.query({
      query: (projectId) => `/project/${projectId}`,
      providesTags: ["Inventory"],
    }),

    updateInventory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`, // FIX
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `/${id}`, // FIX
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useCreateInventoryMutation,
  useGetInventoriesQuery,
  useGetInventoryByIdQuery,
  useGetInventoryByProjectQuery,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = inventoryApi;
