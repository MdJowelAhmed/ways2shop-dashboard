import { api } from "../api/baseApi";

const serviceCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createServiceCategory: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/categories",
          body: data,
        };
      },
      invalidatesTags: ["ServiceCategory"],
    }),

    getServiceCategory: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: "/admin/categories",
          method: "GET",
          params,
        };
      },
      providesTags: ["ServiceCategory"],
    }),

    updateServiceCategory: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/categories/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["ServiceCategory"],
    }),

    deleteServiceCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ServiceCategory"],
    }),
  }),
});

export const {
  useCreateServiceCategoryMutation,
  useGetServiceCategoryQuery,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} = serviceCategoryApi;