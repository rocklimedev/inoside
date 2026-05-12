import { baseApi } from "./baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE USER =================
    createUser: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // ================= GET ALL USERS =================
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // ================= GET ONE USER =================
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    // ================= UPDATE USER =================
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // ================= DELETE USER =================
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // ================= TOGGLE ACTIVE =================
    toggleUserActive: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserActiveMutation,
} = usersApi;
