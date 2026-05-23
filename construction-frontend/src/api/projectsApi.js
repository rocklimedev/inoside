import { baseApi } from "./baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =================================================
    // 🧱 CORE PROJECT
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

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProjectProgress: builder.mutation({
      query: ({ id, progress }) => ({
        url: `/projects/${id}/progress`,
        method: "PATCH",
        body: { progress },
      }),
      invalidatesTags: ["Projects", "Project"],
    }),

    // =================================================
    // 📄 BRIEFS
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
    // 🎨 PROJECT PITCH
    // =================================================

    createPitch: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects", "Pitches"],
    }),

    getPitch: builder.query({
      query: (projectId) => `/projects/pitches/${projectId}`,
      providesTags: ["Pitches"],
    }),

    updatePitch: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/pitch`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects", "Pitches"],
    }),

    deleteProjectPitch: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/pitch`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Pitches"],
    }),
    sendBrief: builder.mutation({
      query: (briefId) => ({
        url: `/projects/briefs/${briefId}/send-to-client`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects"],
    }),
    // =================================================
    // 📊 GLOBAL PITCH MANAGEMENT
    // =================================================

    getAllPitches: builder.query({
      query: () => "/projects/pitches/all",
      providesTags: ["Pitches"],
    }),

    getPitchById: builder.query({
      query: (pitchId) => `/projects/pitches/${pitchId}`,
      providesTags: ["Pitches"],
    }),

    deletePitch: builder.mutation({
      query: (pitchId) => ({
        url: `/projects/pitches/${pitchId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pitches"],
    }),

    approvePitch: builder.mutation({
      query: (pitchId) => ({
        url: `/projects/pitches/${pitchId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Pitches"],
    }),

    rejectPitch: builder.mutation({
      query: (pitchId) => ({
        url: `/projects/pitches/${pitchId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Pitches"],
    }),

    replacePitchFile: builder.mutation({
      query: ({ pitchId, ...body }) => ({
        url: `/projects/pitches/${pitchId}/files`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Pitches"],
    }),

    uploadPitchFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/upload",
          method: "POST",
          body: formData,
        };
      },
    }),

    // =================================================
    // 💬 PITCH COMMENTS
    // =================================================

    getPitchComments: builder.query({
      query: (pitchId) => `/projects/pitches/${pitchId}/comments`,
      providesTags: ["Pitches"],
    }),

    addPitchComment: builder.mutation({
      query: ({ pitchId, content }) => ({
        url: `/projects/pitches/${pitchId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Pitches"],
    }),

    updatePitchComment: builder.mutation({
      query: ({ commentId, ...body }) => ({
        url: `/projects/pitches/comments/${commentId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Pitches"],
    }),

    deletePitchComment: builder.mutation({
      query: (commentId) => ({
        url: `/projects/pitches/comments/${commentId}`,
        method: "DELETE",
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

    // projectsApi.ts

    // =================================================
    // 🏗️ REKI
    // =================================================

    createReki: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects", "Reki"],
    }),

    getReki: builder.query({
      query: (projectId) => `/projects/${projectId}/reki`,
      providesTags: ["Reki"],
    }),

    updateReki: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects", "Reki"],
    }),

    // =================================================
    // 📸 REKI PHOTOS
    // =================================================

    uploadRekiPhoto: builder.mutation({
      query: ({ projectId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/projects/${projectId}/reki/photos`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Reki"],
    }),

    deleteRekiPhoto: builder.mutation({
      query: (photoId) => ({
        url: `/projects/reki/photos/${photoId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reki"],
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
      invalidatesTags: ["Projects", "Reki"],
    }),

    getReki: builder.query({
      query: (projectId) => `/projects/${projectId}/reki`,
      providesTags: ["Reki"],
    }),

    getRekiById: builder.query({
      query: (id) => `/projects/reki/${id}`,
      providesTags: ["Reki"],
    }),

    getAllRekiReports: builder.query({
      query: () => `/projects/reki/all`,
      providesTags: ["Reki"],
    }),

    updateReki: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/reki`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects", "Reki"],
    }),

    deleteReki: builder.mutation({
      query: (id) => ({
        url: `/projects/reki/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Reki"],
    }),

    markRekiAsDone: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/reki/done`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects", "Reki"],
    }),

    markRekiAsPending: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}/reki/pending`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects", "Reki"],
    }),
    // =================================================
    // 📐 SCOPE
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

    deleteCostEstimate: builder.mutation({
      query: (estimateId) => ({
        url: `/projects/cost-estimates/${estimateId}`,
        method: "DELETE",
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
      query: (drawingId) => ({
        url: `/projects/drawings/${drawingId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteDrawing: builder.mutation({
      query: (drawingId) => ({
        url: `/projects/drawings/${drawingId}`,
        method: "DELETE",
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
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectProgressMutation,

  useCreateBriefMutation,
  useGetBriefQuery,
  useUpdateBriefMutation,
  useGetAllBriefsQuery,
  useApproveBriefMutation,
  useUnapproveBriefMutation,
  useRequestBriefChangesMutation,
  useSendBriefToClientMutation,
  useMarkBriefAsDraftMutation,
  useSendBriefMutation,
  useCreatePitchMutation,
  useGetPitchQuery,
  useUpdatePitchMutation,
  useDeleteProjectPitchMutation,

  useGetAllPitchesQuery,
  useGetPitchByIdQuery,
  useDeletePitchMutation,
  useApprovePitchMutation,
  useRejectPitchMutation,
  useReplacePitchFileMutation,

  useGetPitchCommentsQuery,
  useAddPitchCommentMutation,
  useUpdatePitchCommentMutation,
  useDeletePitchCommentMutation,

  useAddPitchReferenceMutation,
  useGetPitchReferencesQuery,
  useDeletePitchReferenceMutation,

  useCreateRekiMutation,
  useGetRekiQuery,
  useUpdateRekiMutation,
  // =================================================
  // EXPORTS
  // =================================================

  useGetRekiByIdQuery,
  useGetAllRekiReportsQuery,

  useDeleteRekiMutation,
  useMarkRekiAsDoneMutation,
  useMarkRekiAsPendingMutation,
  useAddRekiPhotoMutation,
  useDeleteRekiPhotoMutation,

  useCreateScopeMutation,
  useGetScopeQuery,
  useUpdateScopeMutation,

  useAddCostEstimateMutation,
  useGetCostEstimatesQuery,
  useUpdateCostEstimateMutation,
  useDeleteCostEstimateMutation,

  useUploadDrawingMutation,
  useGetDrawingsQuery,
  useApproveDrawingMutation,
  useDeleteDrawingMutation,

  useAddApprovalLogMutation,
  useGetApprovalLogsQuery,

  useUploadPitchFileMutation,
} = projectsApi;
