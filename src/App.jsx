import { useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";

import DedsecBackground from "./theme/DedsecBackground.jsx";
import Ticker from "./theme/Ticker.jsx";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
      </Route>,
    ),
  );

  return (
    <div className={`min-h-dvh w-full bg-black`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
