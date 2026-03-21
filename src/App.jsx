import { useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import RequireAuth from "./hooks/useRequireAuth.jsx";

import RootLayout from "./layouts/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DrivePage from "./pages/DrivePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EncryptionPage from "./pages/EncryptionPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import RequestEmailVerificationPage from "./pages/RequestEmailVerificationPage.jsx";
import EncryptDataPage from "./pages/EncryptDataPage.jsx";
import DecryptDataPage from "./pages/DecryptDataPage.jsx";
import CompressionPage from "./pages/CompressionPage.jsx";

import Ticker from "./theme/Ticker.jsx";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="drive" element={<DrivePage />} />
            <Route path="encryption" element={<EncryptionPage />} />
            <Route path="encryption/encrypt" element={<EncryptDataPage />} />
            <Route path="encryption/decrypt" element={<DecryptDataPage />} />
            <Route path="compression" element={<CompressionPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
          {/* ======================= */}

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/req-email" element={<RequestEmailVerificationPage />} />
      </>,
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
