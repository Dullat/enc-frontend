const Dot = ({ ok = true, pulse = true }) => {
  return (
    <span
      className={`inline-block w-[5px] h-[5px] flex-1 ${pulse && "ds-pulse"}`}
      style={{
        background: ok ? "#00E87A" : "#FF0066",
      }}
    />
  );
};

export default Dot;
