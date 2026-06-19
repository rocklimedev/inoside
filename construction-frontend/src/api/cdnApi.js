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
          headers: {
            "x-cdn-secret": process.env.NEXT_PUBLIC_CDN_TOKEN,
          },
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = cdnApi;
