import { API_URL } from "@/lib";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}`, // change to your backend URL

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Users",
    "User",
    "Clients",
    "Projects",
    "Boq",
    "Sites",
    "Vendors",
    "Roles",
    "Permissions",
    "Auth",
    "BoqCategory",
  ],
  endpoints: () => ({}),
});
