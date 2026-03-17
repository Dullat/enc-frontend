import DedsecBackgroundPc from "./DedsecBackgroundPc.jsx";
import DedsecBackgroundMobile from "./DedsecBackgroundMobile.jsx";
import useIsMobile from "../hooks/useIsMobile.jsx";
const DedsecBg = ({ children, color }) => {
  const isMobile = useIsMobile();
  return isMobile ? (
    <DedsecBackgroundMobile children={children} color={color} />
  ) : (
    <DedsecBackgroundPc children={children} color={color} />
  );
};

export default DedsecBg;
