import { userApiBase } from "../../services/api.js";

const userApi = userApiBase.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["user"],
    }),
    register: builder.mutation({
      query: ({
        username,
        email,
        password,
        keyIv,
        keySalt,
        publicKey,
        encryptedPrivateKey,
      }) => ({
        url: "auth/register",
        method: "POST",
        body: {
          username,
          email,
          password,
          keySalt,
          keyIv,
          publicKey,
          encryptedPrivateKey,
        },
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "auth/getme",
      }),
      providesTags: ["user"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userApiBase.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    updateUsername: builder.mutation({
      query: (username) => ({
        url: "auth/updateusername",
        method: "PATCH",
        body: { username },
      }),
      invalidatesTags: ["user"],
    }),
    forgetPass: builder.mutation({
      query: (email) => ({
        url: "auth/forget-password",
        method: "POST",
        body: { email },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApiBase.endpoints.logout.initiate()).unwrap();
        } catch (err) {
          console.log(err);
        }
      },
    }),
    getSessions: builder.query({
      query: () => ({
        url: "auth/get-sessions",
        method: "GET",
      }),
    }),
    requestEmailVerification: builder.mutation({
      query: (email) => ({
        url: "auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "auth/get-all-users",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getChatHistory: builder.query({
      query: (userId) => ({
        url: `chat/history/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
  useUpdateUsernameMutation,
  useForgetPassMutation,
  useGetSessionsQuery,
  useRequestEmailVerificationMutation,
  useGetAllUsersQuery,
  useGetChatHistoryQuery,
} = userApi;
export default userApi;
