import { baseApi } from "./baseApi";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE NOTIFICATION =================
    createNotification: builder.mutation({
      query: (body) => ({
        url: "/notifications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ================= GET ALL NOTIFICATIONS =================
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),

    // ================= UNREAD COUNT =================
    getUnreadCount: builder.query({
      query: () => "/notifications/unread-count",
      providesTags: ["Notifications"],
    }),

    // ================= MARK SINGLE AS READ =================
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ================= MARK ALL AS READ =================
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ================= DELETE NOTIFICATION =================
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
