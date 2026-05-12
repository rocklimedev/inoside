import { baseApi } from "./baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= CREATE =================
    createProject: builder.mutation({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    // ================= GET ALL =================
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),

    // ================= GET ONE =================
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Projects"],
    }),

    // ================= UPDATE =================
    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    // ================= UPDATE PROGRESS =================
    updateProjectProgress: builder.mutation({
      query: ({ id, progress }) => ({
        url: `/projects/${id}/progress`,
        method: "PATCH",
        body: { progress },
      }),
      invalidatesTags: ["Projects"],
    }),

    // ================= DELETE =================
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useUpdateProjectProgressMutation,
  useDeleteProjectMutation,
} = projectsApi;
