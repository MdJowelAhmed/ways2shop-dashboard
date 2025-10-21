import { api } from "../api/baseApi";

const reportAnalysisApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReportAnalysis: builder.query({
      query: (params) => ({
        url: `/analytics/monthly-revenue-users`,
        method: "GET",
        params: params, // Pass startYear, startMonth, endYear, endMonth, type
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetReportAnalysisQuery } = reportAnalysisApi;