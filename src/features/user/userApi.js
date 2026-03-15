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
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useUpdateUsernameMutation,
} = userApi;
export default userApi;
