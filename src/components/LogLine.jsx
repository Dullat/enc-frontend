const LogLine = ({ ts, msg, type }) => {
  const colorClass =
    type === "ok"
      ? "text-green"
      : type === "err"
        ? "text-magenta"
        : type === "acc"
          ? "text-orange"
          : "text-muted";

  return (
    <div className="flex gap-4 animate-[ds-fadeup_0.2s_ease_both]">
      <span className="font-mono text-[0.5rem] text-line-hi shrink-0 mt-[1px]">
        {ts}
      </span>
      <span
        className={`font-mono text-[0.54rem] tracking-[0.08em] ${colorClass}`}
      >
        {msg}
      </span>
    </div>
  );
};

export default LogLine;
