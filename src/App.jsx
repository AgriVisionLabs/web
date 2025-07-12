import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import AllProvider from "./Context/All.context";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Fields from "./Pages/Fields/Fields";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Layout from "./Components/Layout/Layout";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import UserProvider from "./Context/User.context";
import { Toaster } from "react-hot-toast";
import Landing from "./Pages/Landing/Landing";
import Features from "./Pages/Features/Features";
import Pricing from "./Pages/Pricing/Pricing";
import About from "./Pages/About/About";
import Chat from "./Pages/Chat/Chat";
// import EmailVerified from './Pages/EmailVerified/EmailVerified';
// import VerificationFailed from './Pages/VerificationFailed/VerificationFailed';
import EmailConfirmation from "./Pages/EmailConfirmation/EmailConfirmation";
import AcceptInvitation from "./Pages/InviteAccept/AcceptInvitation";
import FarmsAndFields from "./Pages/FarmsAndFields/FarmsAndFields";
import Farms from "./Pages/Farms/Farms";
import HomeDiseaseDetection from "./Pages/HomeDiseaseDetection/HomeDiseaseDetection";

import SensorsDevices from "./Pages/Sensors&Devices/Sensors&Devices";
import Irrigation from "./Pages/IrrigationControl/Irrigation";
import Tasks from "./Pages/Tasks/Tasks";
import Analytics from "./Pages/Analytics/Analytics";
import Settings from "./Pages/Settings/Settings";
import Inventory from "./Pages/Inventory/Inventory";
import AuthLayout from "./Components/AuthLayout/AuthLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
//Inventory
function App() {
  const router = createBrowserRouter([
    { index: true, element: <Landing /> },
    { path: "/features", element: <Features /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/about", element: <About /> },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        // {path:"home",element:<Home/>,children:[
        { path: "/dashboard", element: <Dashboard /> },
        { path: "tasks", element: <Tasks /> },
        { path: "inventory", element: <Inventory /> },
        { path: "irrigation", element: <Irrigation /> },
        {
          path: "farms&fields",
          element: <FarmsAndFields />,
          children: [
            { path: "farms", element: <Farms /> },
            { path: "fields", element: <Fields /> },
          ],
        },

        { path: "sensors&devices", element: <SensorsDevices /> },
        { path: "analytics", element: <Analytics /> },
        { path: "disease_detection", element: <HomeDiseaseDetection /> },
        { path: "settings", element: <Settings /> },
        //Settings
        // ]
        // },
      ],
    },
    { path: "/chat", element: <Chat /> },

    {
      path: "/login",
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      ),
    },
    {
      path: "/signUp",
      element: (
        <AuthLayout>
          <SignUp />
        </AuthLayout>
      ),
    },
    { path: "/emailConfirmation", element: <EmailConfirmation /> },
    { path: "/invite/accept", element: <AcceptInvitation /> },
  ]);
  const myClient = new QueryClient();
  return (
    <>
      <GoogleOAuthProvider
        clientId={
          import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"
        }
      >
        <QueryClientProvider client={myClient}>
          <UserProvider>
            <AllProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" reverseOrder={false} />
            </AllProvider>
          </UserProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
