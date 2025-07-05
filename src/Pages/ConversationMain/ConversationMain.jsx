// import { useContext, useState } from 'react';
import { Search, Send, X } from "lucide-react";
import Logo from "../../assets/logo/AgrivisionLogo.svg"
// import { CirclePlus, LogOut} from 'lucide-react';
// import CustomAvatar from '../../Components/CustomAvatar/CustomAvatar';
// import ConversationActive from '../../Components/ConversationActive/ConversationActive';
import ConversationActive from '../../Components/ConversationActive/ConversationActive';
import SidebarChat from '../../Components/SidebarChat/SidebarChat';
import { userContext } from '../../Context/User.context';
import { useState } from 'react';
// import AcceptOrIgnoreConversation from '../../Components/AcceptOrIgnoreConversation/AcceptOrIgnoreConversation';
// import Profile from '../../Components/Profile/Profile';
// import EditProfile from '../../Components/EditProfile/EditProfile';
// import ChangePassword from '../../Components/ChangePassword/ChangePassword';


const ConversationMain = () => {
    const [conversationActiveId,setConversationActiveId]=useState(false)
    

    return (
        <section className='  max-h-screen fixed inset-0  bg-[#F7F7F7] '>
            <div className="grid grid-cols-12 h-full  ">
                <div className=" col-span-2 border-e border-[#E5E7EB]  h-lvh relative
                ">
                    <div className="h-[7%] flex justify-center items-center ">
                        <img src={Logo} alt="" className="h-[35px]" />
                    </div>
                    <div className="flex h-[6%] my-[10px] px-[5px] mt-[5px] space-x-3 items-center bg-[#FFFFFF] rounded-[14px]">
                        <Search size={20}/>
                        <input type="text" className="  flex items-center  border-0 border-[#D1D5DB]  text-[15px] placeholder:text-[14px] outline-none" placeholder={`Search conversations...`}/>
                    </div>
                    <div className="flex-grow h-[87%]  py-[10px]">
                        <div className=" flex justify-between items-center bg-[#F0FDF4] px-[10px] py-[5px] ">
                            <div className="flex w-full space-x-[8px] items-center  ">
                                <div className="h-[30px] w-[30px] rounded-full bg-mainColor flex justify-center items-center">
                                    <p className="w-fit text-white font-medium">J</p>
                                </div>
                                <div className="">
                                    <div className="flex justify-between items-center">
                                            <p className="text-[14px]">John Doe</p>
                                            <p className="text-[12px] text-[#6B7280]">1h</p>
                                    </div>
                                    <p className="text-[12px] text-[#4B5563]">I’m doing great, thanks for as...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" col-span-10 h-lvh  flex flex-col">
                    <div className="h-[7%]  border-b border-[#E5E7EB]">
                        <div className=" h-full flex justify-between items-center px-[20px]">
                            <div className="flex  space-x-[8px] items-center  ">
                                <div className="h-[30px] w-[30px] rounded-full bg-mainColor flex justify-center items-center">
                                    <p className="w-fit text-white font-medium">J</p>
                                </div>
                                <p className="">John Doe</p>
                            </div>
                            <X/>
                        </div>
                    </div>
                    <div className="h-[84%]  px-[20px] py-[30px]  flex flex-col  overflow-y-auto sc ">
                        <div className="  justify-items-start space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-black font-[400px] bg-[#F3F4F6] rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px] font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className=" justify-items-end space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px]  font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className="  justify-items-start space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px] font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className=" justify-items-end space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px]  font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className="  justify-items-start space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px] font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className=" justify-items-end space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px]  font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className="  justify-items-start space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px] font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className=" justify-items-end space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px]  font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className="  justify-items-start space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px] font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className=" justify-items-end space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px]  font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className="  justify-items-start space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px] font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className=" justify-items-end space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px]  font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className="  justify-items-start space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px] font-manrope text-[#616161] ">05:45</p>
                        </div>
                        <div className=" justify-items-end space-y-[5px]">
                            <div className="h-[25px] w-fit  text-[14px] text-white bg-mainColor rounded-[8px] px-[10px]">
                                <p className="">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            <p className="text-[14px]  font-manrope text-[#616161] ">05:45</p>
                        </div>

                        
                    </div>
                    <div className="h-[8%]   pt-[5px]">
                        <form action="" className="h-full">
                            <div className=" flex justify-between items-center px-[20px]">
                                <input type="text" className="bg-[#FFFFFF] w-[95%] h-[40px] flex items-center px-[6px] border border-[#D1D5DB] rounded-[10px] text-[15px] placeholder:text-[14px]" placeholder="Type a message..."/>
                                <div className="bg-mainColor w-[40px] h-[40px] rounded-[50%] text-white flex justify-center items-center">
                                    <Send size={20} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ConversationMain;
