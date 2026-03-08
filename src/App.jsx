import { useState } from "react";

import DedsecBackground from "./theme/DedsecBackground.jsx";
import Ticker from "./theme/Ticker.jsx";

function App() {
  const [count, setCount] = useState(0);
  const TICKER_ITEMS = [
    { label: "SYS.AUTH", value: "CREDENTIAL MODULE ACTIVE", highlight: true },
    { label: "ENCRYPTION", value: "AES-256-GCM ENGAGED", highlight: false },
    { label: "NETWORK", value: "ALL PACKETS SECURED", highlight: false },
    { label: "DEDSEC", value: "WATCHING THE WATCHERS", highlight: true },
    { label: "UPLINK", value: "STABLE 0.3ms LATENCY", highlight: false },
    { label: "TOKEN", value: "EXPIRES IN 14:58", highlight: true },
  ];

  return <div className={`h-dvh w-full bg-black`}>jakd</div>;
}

export default App;
