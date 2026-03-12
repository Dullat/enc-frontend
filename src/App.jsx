import { useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

import RootLayout from "./layouts/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Drive from "./pages/Drive.jsx";
import NotFound from "./pages/NotFound.jsx";

import DedsecBackground from "./theme/DedsecBackground.jsx";
import Ticker from "./theme/Ticker.jsx";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/drive" element={<Drive />} />
        <Route path="/*" element={<NotFound />} />
      </Route>,
    ),
  );

  return (
    <Provider store={store}>
      <div className={`min-h-dvh w-full bg-black`}>
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

export default App;
