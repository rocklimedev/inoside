// src/store/api/clientsApi.ts

import { baseApi } from "./baseApi";

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients"],
    }),

    getClients: builder.query({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),

    getClientById: builder.query({
      query: (id) => `/clients/${id}`,
      providesTags: ["Clients"],
    }),

    updateClient: builder.mutation({
      query: ({ id, body }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Clients"],
    }),

    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

export const {
  useCreateClientMutation,
  useGetClientsQuery,
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
