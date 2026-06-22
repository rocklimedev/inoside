import { API_URL } from "@/lib";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ======================================================
// BASE QUERY
// ======================================================
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers) => {
    // ===================== AUTH TOKEN =====================
    // Safe browser check
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // ===================== CDN TOKEN =====================
    const cdnToken = process.env.NEXT_PUBLIC_CDN_TOKEN;

    if (cdnToken) {
      headers.set("x-cdn-secret", cdnToken);
    }

    // ===================== CONTENT TYPE =====================
    // Only set JSON if not already set (important for FormData uploads)
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

// ======================================================
// AUTH ERROR HANDLER
// ======================================================
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401 || result.error?.status === 403) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      window.location.href = "/login";
    }
  }

  return result;
};

// ======================================================
// BASE API
// ======================================================
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
    "ActivityLogs",
    "System",
    "Project",
    "Brand",
    "Roles",
    "Task",
    "Permissions",
    "Auth",
    "BoqCategory",
    "VendorTypes",
    "Pitches",
    "Inventory",
    "Materials",
    "Material",
    "Dispatch",
    "InventoryMaster",
    "InventoryDispatches",
    "Reki",
    "Briefs",
    "PitchComments",
    "PitchReferences",
    "ExecutionStages",
    "ExecutionActivities",
    "Scope",
    "CostEstimates",
    "Notifications",
    "Drawings",
    "ApprovalLogs",
    "InventoryRequest",
    "InventoryDispatch",
  ],

  endpoints: () => ({}),
});
