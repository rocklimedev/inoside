// src/api/cdnApi.js
import { baseApi } from "./baseApi";

export const cdnApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/cdn/upload",
          method: "POST",
          body: formData,
          // Remove headers from here - we'll handle it in baseApi
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = cdnApi;
