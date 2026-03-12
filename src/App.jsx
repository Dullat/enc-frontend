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
import DrivePage from "./pages/DrivePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EncryptionPage from "./pages/EncryptionPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
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
        <Route path="/drive" element={<DrivePage />} />
        <Route path="/encrypt" element={<EncryptionPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />
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
