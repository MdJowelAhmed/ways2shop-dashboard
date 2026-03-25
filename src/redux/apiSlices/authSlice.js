import { api } from "../api/baseApi";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/verify-email",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: (response) => {
        console.log("Error response:", response);
      
        if (response?.data?.message) {
          return response.data.message;
        }
      
        if (response?.error) {
          return response.error;
        }
      
        return "Unknown error occurred";
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forgot-password",
          body: data,
        };
      },
    }),
    resendOtp: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/resend-otp",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (data) => {
        const resetToken = localStorage.getItem("verifyToken");
        return {
          method: "POST",
          url: "/auth/reset-password",
          headers: {
            "Content-Type": "application/json",
            Authorization: resetToken || undefined,
          },
          body: data,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
          // headers: {
          //   Authorization: `Bearer ${JSON.parse(
          //     localStorage.getItem("token")
          //   )}`,
          // },
        };
      },
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/user",
          body: data,
          // headers: {
          //   Authorization: `Bearer ${JSON.parse(
          //     localStorage.getItem("token")
          //   )}`,
          // },
        };
      },
      invalidatesTags: ["Auth"],
    }),

    profile: builder.query({
      query: () => ({
        method: "GET",
        url: "/user/profile",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authSlice;
