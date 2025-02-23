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

function App() {
  const router=createBrowserRouter([
    {path:"/",element:<ProtectedRoute><Layout/></ProtectedRoute> ,children:[
      {path:"/Home",element:<Home/>,children:[
        {index:true,element:<Dashboard/>}
      ]},

  ]},
    {path:"/",element:<Layout/>,children:[
      {path:"/Login",element:<Login/>},
    {path:"/SignUp",element:<SignUp/>},]},
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
