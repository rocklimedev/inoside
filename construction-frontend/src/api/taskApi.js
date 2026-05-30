import { baseApi } from "./baseApi";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Tasks (Team View)
    getAllTasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),

    // Get Tasks by Project
    getProjectTasks: builder.query({
      query: (projectId) => `/tasks?projectId=${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: "Task", id: projectId },
      ],
    }),

    getTask: builder.query({
      query: ({ taskId, projectId }) => ({
        url: `/tasks/${taskId}${projectId ? `?projectId=${projectId}` : ""}`,
      }),
      providesTags: (result, error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation({
      query: ({ taskId, ...data }) => ({
        url: `/tasks/${taskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetProjectTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
