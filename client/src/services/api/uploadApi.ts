import { baseApi } from './baseApi'

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      uploadImage: builder.mutation({
        query: (body) => ({
          url: '/upload',
          method: 'POST',
          body,
          formData: true
        })
      })
    }
  }
})

export const { useUploadImageMutation } = uploadApi
