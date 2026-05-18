import { baseApi } from "./baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================================================
    // 🧱 CORE PROJECT
    // =================================================
    createProject: builder.mutation({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Projects"],
    }),

    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),

    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Project"],
    }),

    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects", "Project"],
    }),

    updateProjectProgress: builder.mutation({
      query: ({ id, progress }) => ({
        url: `/projects/${id}/progress`,
        method: "PATCH",
        body: { progress },
      }),
      invalidatesTags: ["Projects", "Project"],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
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

    getAllBriefs: builder.query({
      query: () => "/projects/briefs/all",
      providesTags: ["Projects"],
    }),

    getBriefById: builder.query({
      query: (briefId) => `/projects/briefs/${briefId}`,
    }),

    // Brief Workflow
    approveBrief: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects"],
    }),

    unapproveBrief: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/unapprove`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects"],
    }),

    requestBriefChanges: builder.mutation({
      query: ({ briefId, ...body }) => ({
        url: `/projects/briefs/${briefId}/request-changes`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
    sendBrief: builder.mutation({
      query: (id) => ({
        url: `/brief/${id}/send`,
        method: "POST",
      }),
    }),
    sendBriefToClient: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/send-to-client`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects"],
    }),

    markBriefAsDraft: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/draft`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects"],
    }),

    // =================================================
    // 🎨 PROJECT PITCH (Added)
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
    // 📊 GLOBAL PITCH MANAGEMENT (New)
    // =================================================
    getAllPitches: builder.query({
      query: () => "/pitches",
      providesTags: ["Pitches"],
    }),

    deletePitch: builder.mutation({
      query: (id) => ({
        url: `/pitches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pitches"],
    }),

    createPitchGlobal: builder.mutation({
      query: (body) => ({
        url: "/pitches",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pitches"],
    }),

    addPitchComment: builder.mutation({
      query: ({ pitchId, content }) => ({
        url: `/pitches/${pitchId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Pitches"],
    }),

    replacePitchFile: builder.mutation({
      query: ({ pitchId, ...body }) => ({
        url: `/pitches/${pitchId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Pitches"],
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
    // 🏗️ REKI REPORT
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
  }),

  overrideExisting: true,
});

export const {
  // Core Project
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useUpdateProjectProgressMutation,
  useDeleteProjectMutation,

  // Brief
  useCreateBriefMutation,
  useGetBriefQuery,
  useUpdateBriefMutation,
  useGetAllBriefsQuery,
  useGetBriefByIdQuery,
  useApproveBriefMutation,
  useUnapproveBriefMutation,
  useRequestBriefChangesMutation,
  useSendBriefToClientMutation,
  useMarkBriefAsDraftMutation,
  useSendBriefMutation,
  // Pitch
  useCreatePitchMutation,
  useGetPitchQuery,
  useUpdatePitchMutation,
  useGetAllPitchesQuery,
  useDeletePitchMutation,
  useCreatePitchGlobalMutation,
  useAddPitchCommentMutation,
  useReplacePitchFileMutation,
  // Pitch References
  useAddPitchReferenceMutation,
  useGetPitchReferencesQuery,
  useDeletePitchReferenceMutation,

  // Reki
  useCreateRekiMutation,
  useGetRekiQuery,
  useUpdateRekiMutation,

  // Reki Photos
  useAddRekiPhotoMutation,
  useGetRekiPhotosQuery,
  useDeleteRekiPhotoMutation,

  // Scope
  useCreateScopeMutation,
  useGetScopeQuery,
  useUpdateScopeMutation,

  // Cost Estimates
  useAddCostEstimateMutation,
  useGetCostEstimatesQuery,
  useUpdateCostEstimateMutation,

  // Drawings
  useUploadDrawingMutation,
  useGetDrawingsQuery,
  useApproveDrawingMutation,

  // Approval Logs
  useAddApprovalLogMutation,
  useGetApprovalLogsQuery,
} = projectsApi;
