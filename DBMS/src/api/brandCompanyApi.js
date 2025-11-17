// src/api/brandCompanyApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandCompanyApi = createApi({
  reducerPath: "brandCompanyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/brand-companies",
    credentials: "include", // if using sessions/cookies
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token; // adjust based on your auth slice
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["BrandCompany"],
  endpoints: (builder) => ({
    // GET all brand companies
    getBrandCompanies: builder.query({
      query: () => "/",
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: "BrandCompany", id })),
        { type: "BrandCompany", id: "LIST" },
      ],
    }),

    // GET single brand company by ID
    getBrandCompanyById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "BrandCompany", id }],
    }),

    // CREATE new brand company
    createBrandCompany: builder.mutation({
      query: (newBrand) => ({
        url: "/",
        method: "POST",
        body: newBrand,
      }),
      invalidatesTags: [{ type: "BrandCompany", id: "LIST" }],
    }),

    // UPDATE brand company
    updateBrandCompany: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "BrandCompany", id },
        { type: "BrandCompany", id: "LIST" },
      ],
    }),

    // DELETE brand company
    deleteBrandCompany: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "BrandCompany", id },
        { type: "BrandCompany", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks (auto-generated)
export const {
  useGetBrandCompaniesQuery,
  useGetBrandCompanyByIdQuery,
  useCreateBrandCompanyMutation,
  useUpdateBrandCompanyMutation,
  useDeleteBrandCompanyMutation,
} = brandCompanyApi;
