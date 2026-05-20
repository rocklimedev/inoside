import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= REGISTER =================
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // ================= LOGIN =================
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // Invalidate profile cache on login
      async onQueryStarted(_, { dispatch }) {
        // Clear any stale profile data
        dispatch(authApi.util.resetApiState());
      },
    }),

    // ================= PROFILE (protected) =================
    // CRITICAL: This is re-fetched on every route change
    // Backend validates token and returns fresh user data
    getProfile: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ================= LOGOUT =================
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Invalidate all auth-related tags
      async onQueryStarted(_, { dispatch }) {
        dispatch(authApi.util.resetApiState());
      },
    }),

    // ================= ADMIN ONLY =================
    getAdminContent: builder.query({
      query: () => "/auth/admin-only",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useGetAdminContentQuery,
} = authApi;
