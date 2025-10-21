import { api } from "../api/baseApi";

const settingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query({
      query: (type) => ({
        url: `/disclaimers/${type}`,
        method: "GET",
      }),
      providesTags: (result, error, type) => [{ type: "Settings", id: type }],
    }),
    updateSetting: builder.mutation({
      query: (data) => ({
        url: "/disclaimers/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Settings", id: arg.type }
      ],
    }),
  }),
});

export const { useGetSettingQuery, useUpdateSettingMutation } = settingApi;