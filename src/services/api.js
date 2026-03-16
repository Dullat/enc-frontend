import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseApiUrl = import.meta.env.VITE_API_URL;
console.log(baseApiUrl);

const baseQuery = fetchBaseQuery({
  baseUrl: baseApiUrl,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 && args.url !== "/auth/refresh") {
    const refreshedResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshedResult?.data) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const userApiBase = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["user"],
  endpoints: (builder) => ({}),
});
