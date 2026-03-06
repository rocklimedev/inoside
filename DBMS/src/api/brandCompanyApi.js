// src/api/brandCompanyApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandCompanyApi = createApi({
  reducerPath: "brandCompanyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/brand-companies",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["BrandCompany"],
  endpoints: (builder) => ({
    getBrandCompanies: builder.query({
      query: () => "/",
      transformResponse: (response) => {
        console.log("Brand companies API response:", response);
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data))
          return response.data;
        return [];
      },
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: "BrandCompany", id })),
        { type: "BrandCompany", id: "LIST" },
      ],
    }),

    getBrandCompanyById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response,
      providesTags: (result, error, id) => [{ type: "BrandCompany", id }],
    }),

    createBrandCompany: builder.mutation({
      query: (newBrand) => ({
        url: "/",
        method: "POST",
        body: newBrand,
      }),
      invalidatesTags: [{ type: "BrandCompany", id: "LIST" }],
    }),

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

export const {
  useGetBrandCompaniesQuery,
  useGetBrandCompanyByIdQuery,
  useCreateBrandCompanyMutation,
  useUpdateBrandCompanyMutation,
  useDeleteBrandCompanyMutation,
} = brandCompanyApi;
