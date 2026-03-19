const InfoRow = ({ label, value, color }) => {
  return (
    <div
      className={`flex justify-between flex-start py-[.5rem] border-0 border-b-[1px] border-solid border-[#111118] gap-[1rem]`}
      style={{
        borderBottom: "1px solid #111118",
        gap: "1rem",
      }}
    >
      <span
        className="font-family-mono text-[.52rem]"
        style={{
          letterSpacing: "0.2em",
          color: "#44445A",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        className="font-family-mono text-[.58rem]"
        style={{
          letterSpacing: "0.08em",
          color: color || "#C4C4D4",
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
};

export default InfoRow;
