import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";



const Layout = () => {
    return (
    <>
        {/* <Navbar/> */}
        {/* <Sidebar/> */}
        <Outlet/>
    </>
    );
}

export default Layout;
