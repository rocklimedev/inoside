import { API_URL } from "@/lib";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers, { endpoint }) => {
    // ====================== AUTH TOKEN ======================
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // ====================== CDN TOKEN ======================
    const cdnToken = process.env.NEXT_PUBLIC_CDN_TOKEN;
    if (cdnToken) {
      headers.set("x-cdn-secret", cdnToken); // ← Main one (matches your cdnApi)
      // headers.set("x-cdn-token", cdnToken);      // Try this if above fails
    } else {
      console.warn(
        "⚠️ NEXT_PUBLIC_CDN_TOKEN is missing in environment variables",
      );
    }

    // ====================== CONTENT TYPE ======================
    // Only set JSON for non-upload endpoints
    if (!endpoint?.toLowerCase().includes("upload")) {
      headers.set("Content-Type", "application/json");
    }
    // Do NOT set Content-Type for file uploads (FormData)

    return headers;
  },
});

// ====================== AUTH ERROR HANDLER ======================
const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401 || result.error?.status === 403) {
    localStorage.removeItem("access_token");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

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
    "ActivityLogs",
    "System",
    "Project",
    "Brand",
    "Roles",
    "Task",
    "Permissions",
    "Auth",
    "BoqCategory",
    "VendorsTypes",
    "Pitches",
    "Inventory",
    "Materials",
    "Material",
    "Dispatch",
    "InventoryMaster",
    "InventoryDispatches",
    "Reki",
    "Projects",
    "Project",
    "Briefs",
    "Pitches",
    "PitchComments",
    "PitchReferences",
    "ExecutionStages",
    "ExecutionActivities",
    "Reki",
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
