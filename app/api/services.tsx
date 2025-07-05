import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const url =
  process.env.PUBLIC_NEXT_NODE_ENV === "production"
    ? "https://estatesync-uhkn.onrender.com/api"
    : "http://localhost:3001/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers) => {
      let token = Cookies.get("token")?.trim(); // Trim whitespace
      if (token) {
        // Remove surrounding quotes if present
        token = token.replace(/^"|"$/g, "");
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.warn("No token found in cookies");
      }
      headers.set("Content-Type", "application/json"); // Ensure Content-Type
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ['issues', 'Applications'],
});