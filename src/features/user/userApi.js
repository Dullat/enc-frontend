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
      query: ({ username, email, password }) => ({
        url: "auth/register",
        method: "POST",
        body: { username, email, password },
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
} = userApi;
export default userApi;
