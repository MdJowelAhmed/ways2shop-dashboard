import { api } from "../api/baseApi";

const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRevenue: builder.query({
      query: ({ yearFilter }) => ({
        url: "/analytics/total-revenue",
        method: "GET",
        params: yearFilter ? { yearFilter } : {},
      }),
      transformResponse: ({ data }) => data,
      providesTags: ["Home"],
    }),

    getStatistics: builder.query({
      query: ({range}) => {
        return {
            url: `/analytics/overview?range=${range}`,
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
      providesTags: ["Home"],
    }),

    recentActivities: builder.query({
      query: () => {
        return {
          url: "/recent-activities",
          method: "GET",
        };
      },
      providesTags: ["Home"],
    }),

    orderManagement: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: "/admin/dashboard/orders",
          method: "GET",
          params,
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
      providesTags: ["Home"],
    }),
  }),
});

export const {
  useGetRevenueQuery,
  useGetStatisticsQuery,
  useRecentActivitiesQuery,
  useOrderManagementQuery,
} = analyticsApi;
