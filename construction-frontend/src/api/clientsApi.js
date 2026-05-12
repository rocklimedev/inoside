import { baseApi } from "./baseApi";

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE =================
    createClient: builder.mutation({
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients"],
    }),

    // ================= GET ALL =================
    getClients: builder.query({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),

    // ================= GET ONE =================
    getClientById: builder.query({
      query: (id) => `/clients/${id}`,
      providesTags: ["Clients"],
    }),

    // ================= UPDATE =================
    updateClient: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Clients"],
    }),

    // ================= DELETE =================
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateClientMutation,
  useGetClientsQuery,
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
