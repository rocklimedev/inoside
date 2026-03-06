import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
  }),

  tagTypes: ["Project"],

  endpoints: (builder) => ({
    // CREATE PROJECT + INVENTORY
    uploadInventoryExcel: builder.mutation({
      query: (data) => ({
        url: "/project/upload-excel",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),

    // GET ALL PROJECTS
    getAllProjects: builder.query({
      query: () => ({
        url: "/project",
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    // GET PROJECT BY ID
    getProjectById: builder.query({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
    // CREATE INVENTORY RECORDS IN EXISTING PROJECT
    createInventoryRecordInProject: builder.mutation({
      query: ({ projectId, inventory }) => ({
        url: `/project/${projectId}/inventory`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { inventory },
      }),
      invalidatesTags: ["Project"],
    }),
    // UPDATE PROJECT
    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),

    // DELETE PROJECT
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useUploadInventoryExcelMutation,
  useGetAllProjectsQuery,
  useCreateInventoryRecordInProjectMutation,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
