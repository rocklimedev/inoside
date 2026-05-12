import { baseApi } from "./baseApi";
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // REGISTER
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // assuming backend returns { accessToken }
          localStorage.setItem("token", data.accessToken);
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),

    // PROFILE (protected)
    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    // ADMIN ONLY
    getAdminContent: builder.query({
      query: () => "/auth/admin-only",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useGetAdminContentQuery,
} = authApi;
