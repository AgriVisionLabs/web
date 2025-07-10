import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { MessageCircle } from "lucide-react";
import ConversationMain from "../../Pages/ConversationMain/ConversationMain";
import { useState } from "react";

const Layout = () => {
  let [chat,setChat]=useState(null)
  return (
    !chat?<div className="flex h-screen space-x-1 lg:space-x-4 bg-[#F7F7F7]  fixed inset-0 p-2 lg:p-4">
      <Sidebar />
      <div className="flex flex-col flex-1 space-y-4 lg:space-y-4">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-2 py-4 lg:p-6 bg-white rounded-xl shadow-lg">
          <Outlet />
        </main>
        <div className="w-[50px] h-[50px] text-white flex justify-center right-3 bottom-3 fixed z-50 items-center rounded-full bg-mainColor" onClick={()=>{setChat(true)}}>
          <MessageCircle size={25}/>
        </div>
      </div>
      
    </div>:
    <div className="h-fit w-fit">
      <ConversationMain setChat={setChat}/>
    </div>
  );
};

export default Layout;
