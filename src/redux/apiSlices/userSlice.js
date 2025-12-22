import { api } from "../api/baseApi";



const userManagementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: "/admin/users",
          method: "GET",
          params,
        };
      },
      providesTags: ["User"],
    }),

    // Update user status (active/blocked)
    updateUserStatus: builder.mutation({
      query: ({ userId, isActive }) => {
        return {
          url: `/admin/users/${userId}/status`,
          method: "PATCH",
          body: { isActive },
        };
      },
      invalidatesTags: ["User"],
    }),


  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} = userManagementApi;
