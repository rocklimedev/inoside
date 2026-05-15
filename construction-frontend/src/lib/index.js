export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://buildcon-api.rippotaiarchitecture.com/api"
    : "http://localhost:5000/api";
