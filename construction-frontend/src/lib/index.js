export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://inoside.onrender.com/api"
    : "http://localhost:5000/api";
