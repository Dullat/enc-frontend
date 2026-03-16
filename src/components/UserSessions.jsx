import { useGetSessionsQuery } from "../features/user/userApi.js";
import { UAParser } from "ua-parser-js";

const UserSessions = ({ ACCENT }) => {
  const { data, isLoading, isError, error, isSuccess } = useGetSessionsQuery();

  let sessions;
  if (isSuccess) {
    console.log(data);
    sessions = data.sessions.map((session) => {
      const parser = new UAParser(session.userAgent);
      const result = parser.getResult();

      return {
        ip: session.ip,
        browser: result.browser.name,
        os: result.os.name,
        device: result.device.model || "Desktop",
        createdAt: session.createdAt,
      };
    });
  }
  return (
    <div className=" relative backdrop-blur-sm border border-[#18181f] ds-backdrop px-6 py-6 flex-1">
      <div className="overflow-hidden">
        <p className="text-label">04 // DEVICES YOU LOGGED_IN</p>
        <p className="text-display-sm mb-4" style={{ color: ACCENT }}>
          USER SESSIONS
        </p>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="w-full flex items-center justify-between">
          <p className="text-label" style={{ color: ACCENT }}>
            IP
          </p>
          <p className="text-label" style={{ color: ACCENT }}>
            Browser/os
          </p>
          <p className="text-label" style={{ color: ACCENT }}>
            created_at
          </p>
        </div>
        {isLoading ? (
          <p className="text-label">Loading....</p>
        ) : isError ? (
          <p className="text-label text-red-700">
            Error occured: {error.data.message}
          </p>
        ) : (
          isSuccess &&
          sessions.map((session) => (
            <div className="w-full flex items-center justify-between">
              <p className="text-label">{session.ip}</p>
              <p className="text-label">
                {session.browser}
                {"/"}
                {session.os}
              </p>
              <p className="text-label">
                {new Date(session.createdAt).toISOString().split("T")[0]}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSessions;
