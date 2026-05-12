export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://inventory.cmtradingco.com/api"
    : "http://localhost:5000/api";
