// src/store/api/projectsApi.ts

import { baseApi } from "./baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),

    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Projects"],
    }),

    updateProject: builder.mutation({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProjectProgress: builder.mutation({
      query: ({ id, body }) => ({
        url: `/projects/${id}/progress`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useUpdateProjectProgressMutation,
  useDeleteProjectMutation,
} = projectsApi;
