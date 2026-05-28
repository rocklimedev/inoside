import { API_URL } from "@/lib";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // ← Only set JSON for non-file endpoints
    if (!endpoint?.includes("upload")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

// 🔥 WRAPPER TO HANDLE 401/403 ERRORS
const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401/403 Unauthorized
  if (result.error?.status === 401 || result.error?.status === 403) {
    // Clear auth tokens
    localStorage.removeItem("access_token");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redirect to login via window location (bypass router issues)
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithAuth,

  tagTypes: [
    "Users",
    "User",
    "Clients",
    "Projects",
    "Boq",
    "Sites",
    "Vendors",
    "Project",
    "Roles",
    "Permissions",
    "Auth",
    "BoqCategory",
    "VendorsTypes",
    "Pitches",
    "Inventory",
    "Dispatch",
    "InventoryMaster",
    "Reki",
    "Projects",
    "Project",
    "Briefs",
    "Pitches",
    "PitchComments",
    "PitchReferences",
    "Reki",
    "Scope",
    "CostEstimates",
    "Drawings",
    "ApprovalLogs",
  ],

  endpoints: () => ({}),
});
