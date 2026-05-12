import { baseApi } from "./baseApi";

export const rbacApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= ROLES =================

    createRole: builder.mutation({
      query: (body) => ({
        url: "/rbac/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles", "Permissions"],
    }),

    getRoles: builder.query({
      query: () => "/rbac/roles",
      providesTags: ["Roles"],
    }),

    getRoleById: builder.query({
      query: (id) => `/rbac/roles/${id}`,
      providesTags: ["Roles"],
    }),

    getRoleWithPermissions: builder.query({
      query: (id) => `/rbac/roles/${id}/permissions`,
      providesTags: ["Roles", "Permissions"],
    }),

    // ================= DELETE ROLE =================
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/rbac/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles", "Permissions"],
    }),

    // ================= PERMISSIONS =================

    createPermission: builder.mutation({
      query: (body) => ({
        url: "/rbac/permissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Permissions"],
    }),

    getPermissions: builder.query({
      query: () => "/rbac/permissions",
      providesTags: ["Permissions"],
    }),

    // ================= ASSIGN PERMISSIONS =================

    assignPermissionsToRole: builder.mutation({
      query: ({ roleId, permissions }) => ({
        url: `/rbac/roles/${roleId}/permissions`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: ["Roles", "Permissions"],
    }),

    // ================= ME =================

    getMyPermissions: builder.query({
      query: () => "/rbac/me/permissions",
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useGetRoleWithPermissionsQuery,
  useDeleteRoleMutation, // ← Added

  useCreatePermissionMutation,
  useGetPermissionsQuery,

  useAssignPermissionsToRoleMutation,

  useGetMyPermissionsQuery,
} = rbacApi;
