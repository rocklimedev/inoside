import { baseApi } from "./baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================================================
    // 🧱 PROJECT CORE
    // =================================================

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
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProjectProgress: builder.mutation({
      query: ({ id, progress }) => ({
        url: `/projects/${id}/progress`,
        method: "PATCH",
        body: { progress },
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

    // =================================================
    // 📄 PROJECT BRIEF
    // =================================================

    createBrief: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/brief`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getBrief: builder.query({
      query: (projectId) => `/projects/${projectId}/brief`,
    }),

    updateBrief: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/brief`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProjectBrief: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/brief`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
    // =================================================
    // 🎨 PROJECT PITCH
    // =================================================

    createPitch: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getPitch: builder.query({
      query: (projectId) => `/projects/${projectId}/pitch`,
    }),

    updatePitch: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    // =================================================
    // 🧩 PITCH REFERENCES
    // =================================================

    addPitchReference: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch-references`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getPitchReferences: builder.query({
      query: (projectId) => `/projects/${projectId}/pitch-references`,
    }),

    deletePitchReference: builder.mutation({
      query: (refId) => ({
        url: `/projects/pitch-references/${refId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    // =================================================
    // 🏗️ REKI
    // =================================================

    createReki: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getReki: builder.query({
      query: (projectId) => `/projects/${projectId}/reki`,
    }),

    updateReki: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    // =================================================
    // 📸 REKI PHOTOS
    // =================================================

    addRekiPhoto: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki/photos`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getRekiPhotos: builder.query({
      query: (rekiId) => `/projects/reki/${rekiId}/photos`,
    }),

    deleteRekiPhoto: builder.mutation({
      query: (photoId) => ({
        url: `/projects/reki/photos/${photoId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    // =================================================
    // 📐 SCOPE OF WORK
    // =================================================

    createScope: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/scope`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getScope: builder.query({
      query: (projectId) => `/projects/${projectId}/scope`,
    }),

    updateScope: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/scope`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    // =================================================
    // 💰 COST ESTIMATES
    // =================================================

    addCostEstimate: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/cost-estimates`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getCostEstimates: builder.query({
      query: (projectId) => `/projects/${projectId}/cost-estimates`,
    }),

    updateCostEstimate: builder.mutation({
      query: ({ estimateId, ...body }) => ({
        url: `/projects/cost-estimates/${estimateId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
    sendBrief: builder.mutation({
      query: (briefId) => ({
        url: `/briefs/${briefId}/send`,
        method: "POST",
      }),
      invalidatesTags: ["Projects"],
    }),
    // =================================================
    // 🧾 DRAWINGS
    // =================================================

    uploadDrawing: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/drawings`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getDrawings: builder.query({
      query: (projectId) => `/projects/${projectId}/drawings`,
    }),

    approveDrawing: builder.mutation({
      query: ({ drawingId, user_id }) => ({
        url: `/projects/drawings/${drawingId}/approve`,
        method: "PATCH",
        body: { user_id },
      }),
      invalidatesTags: ["Projects"],
    }),

    // =================================================
    // 📊 APPROVAL LOGS
    // =================================================

    addApprovalLog: builder.mutation({
      query: ({ drawingId, ...body }) => ({
        url: `/projects/drawings/${drawingId}/logs`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    getApprovalLogs: builder.query({
      query: (drawingId) => `/projects/drawings/${drawingId}/logs`,
    }),
    // Inside endpoints
    approveBrief: builder.mutation({
      query: (briefId) => ({
        url: `/briefs/${briefId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Projects"],
    }),

    requestBriefChanges: builder.mutation({
      query: ({ briefId, note }) => ({
        url: `/briefs/${briefId}/request-changes`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["Projects"],
    }),

    addBriefComment: builder.mutation({
      query: ({ briefId, content }) => ({
        url: `/briefs/${briefId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Projects"],
    }),
  }),

  overrideExisting: false,
});

export const {
  // core
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useUpdateProjectProgressMutation,
  useDeleteProjectMutation,
  useApproveBriefMutation,
  useRequestBriefChangesMutation,
  useAddBriefCommentMutation,
  // brief
  useCreateBriefMutation,
  useGetBriefQuery,
  useUpdateBriefMutation,

  // pitch
  useCreatePitchMutation,
  useGetPitchQuery,
  useUpdatePitchMutation,

  // pitch refs
  useAddPitchReferenceMutation,
  useGetPitchReferencesQuery,
  useDeletePitchReferenceMutation,
  useSendBriefMutation,
  // reki
  useCreateRekiMutation,
  useGetRekiQuery,
  useUpdateRekiMutation,

  // reki photos
  useAddRekiPhotoMutation,
  useGetRekiPhotosQuery,
  useDeleteRekiPhotoMutation,

  // scope
  useCreateScopeMutation,
  useGetScopeQuery,
  useUpdateScopeMutation,

  // cost
  useAddCostEstimateMutation,
  useGetCostEstimatesQuery,
  useUpdateCostEstimateMutation,

  // drawings
  useUploadDrawingMutation,
  useGetDrawingsQuery,
  useApproveDrawingMutation,
  useDeleteProjectBriefMutation,
  // logs
  useAddApprovalLogMutation,
  useGetApprovalLogsQuery,
} = projectsApi;
