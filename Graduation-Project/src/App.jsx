import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import AllProvider from './Context/All.context';
import Dashboard from './Pages/Dashboard/Dashboard';
import Home from "./Pages/Home/Home"
import Fields from './Pages/Fields/Fields';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Layout from './Components/Layout/Layout';
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import UserProvider from './Context/User.context';
import { Toaster } from 'react-hot-toast';
import Landing from './Pages/Landing/Landing';
import EmailVerified from './Pages/EmailVerified/EmailVerified';
import VerificationFailed from './Pages/VerificationFailed/VerificationFailed';
import EmailConfirmation from './Pages/EmailConfirmation/EmailConfirmation';
import FarmsAndFields from './Pages/FarmsAndFields/FarmsAndFields';
import Farms from './Pages/Farms/Farms';
import HomeDiseaseDetection from './Pages/HomeDiseaseDetection/HomeDiseaseDetection';
import Irrigation from './Components/Irrigation/Irrigation';
import SensorsDevices from './Pages/Sensors&Devices/Sensors&Devices';

function App() {
  const router=createBrowserRouter([
    {index:true,element:<Landing/>},
    {path:"/",element:<ProtectedRoute><Layout/></ProtectedRoute> ,children:[
      {path:"home",element:<Home/>,children:[
        {path:"dashboard",element:<Dashboard/>},
        {path:"irrigation",element:<Irrigation/>},
        {path:"sensors-and-devices",element:<SensorsDevices/>},
        {path:"home-disease-detection",element:<HomeDiseaseDetection/>},
        {path:"farms-and-fields",element:<FarmsAndFields/>,children:[
          {path:"farms",element:<Farms/>},
          {path:"fields",element:<Fields/>}]},
      ]},

  ]},
    {path:"/login",element:<Login/>},
    {path:"/signUp",element:<SignUp/>},
    {path:"/emailConfirmation",element:<EmailConfirmation/>}
  ]);
  const myClient=new QueryClient();
  
  return (
    <>
    <QueryClientProvider client={myClient}>
      <UserProvider>
        <AllProvider>
            <RouterProvider router={router}/>
            <Toaster position="top-right" reverseOrder={false}/>
            
        </AllProvider>
      </UserProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
