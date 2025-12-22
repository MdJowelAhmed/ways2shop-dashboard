import { api } from "../api/baseApi";



const subscriptionPackageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllSubscriptionPackage: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args && args.length > 0) {
                    args.forEach((arg) => {
                        params.append(arg.name, arg.value);
                    });
                }
                return {
                    url: "/admin/packages",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["Package"],
        }),
        createSubscriptionPackage: builder.mutation({
            query: ({ data }) => {
                return {
                    url: `/packages`,
                    method: "POST",
                    body: { data: JSON.stringify(data) },
                };
            },
            invalidatesTags: ["Package"],
        }),

        // Update user status (active/blocked)
        updateSubscriptionPackage: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/packages/${id}`,
                    method: "PATCH",
                    body: { data: JSON.stringify(data) },
                };
            },
            invalidatesTags: ["Package"],
        }),


    }),
});

export const {
    useGetAllSubscriptionPackageQuery,
    useCreateSubscriptionPackageMutation,
    useUpdateSubscriptionPackageMutation,
} = subscriptionPackageApi;
