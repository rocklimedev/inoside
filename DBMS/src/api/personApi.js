// src/features/api/personApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../config";
export const personApi = createApi({
  reducerPath: "personApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/persons`, // fixed typo + base for both resources
  }),
  tagTypes: ["Person", "PersonType"], // <-- added PersonType tag
  endpoints: (builder) => ({
    /* ------------------------------------------------------------------ *
     *  PERSON ENDPOINTS (unchanged)
     * ------------------------------------------------------------------ */
    getPersons: builder.query({
      query: () => "/",
      providesTags: ["Person"],
    }),
    getPersonById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Person", id }],
    }),
    createPerson: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Person"],
    }),
    updatePerson: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Person", id }],
    }),
    deletePerson: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Person"],
    }),

    /* ------------------------------------------------------------------ *
     *  PERSONTYPE ENDPOINTS (NEW)
     * ------------------------------------------------------------------ */
    getPersonTypes: builder.query({
      query: () => "/person-types",
      providesTags: ["PersonType"],
    }),

    getPersonTypeById: builder.query({
      query: (id) => `/person-types/${id}`,
      providesTags: (result, error, id) => [{ type: "PersonType", id }],
    }),

    createPersonType: builder.mutation({
      query: (data) => ({
        url: "/person-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PersonType"],
    }),

    updatePersonType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/person-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PersonType", id }],
    }),

    deletePersonType: builder.mutation({
      query: (id) => ({
        url: `/person-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        "PersonType",
        { type: "PersonType", id },
      ],
    }),
  }),
});

/* ------------------------------------------------------------------ *
 *  EXPORT ALL HOOKS
 * ------------------------------------------------------------------ */
export const {
  // Person hooks
  useGetPersonsQuery,
  useGetPersonByIdQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,

  // PersonType hooks (NEW)
  useGetPersonTypesQuery,
  useGetPersonTypeByIdQuery,
  useCreatePersonTypeMutation,
  useUpdatePersonTypeMutation,
  useDeletePersonTypeMutation,
} = personApi;
