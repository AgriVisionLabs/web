import toast from 'react-hot-toast';
import icon from "../../assets/images/image 6.png"
import { EllipsisVertical, Mic, Phone, Send, Settings, Video, X } from 'lucide-react';
import { useContext, useMemo, useRef } from 'react';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import ConversationMessage from '../ConversationMessage/ConversationMessage';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import TimeOnly from '../TimeOnly/TimeOnly';
import MessagesFromSignalR from '../MessagesFromSignalR/MessagesFromSignalR';
import { AllContext } from '../../Context/All.context';

const ConversationActive = (children) => {
    const bottomRef = useRef(null);
    let [conversation,setConversation]=useState()
    let [OpenMenuDots,setOpenMenuDots]=useState()
    let [OpenSetting,setOpenSetting]=useState()
    let {baseUrl}=useContext(AllContext)
    let {token}=useContext(userContext)
    let [userId]=useState(localStorage.getItem("userId"))
    // const [messages, setMessages] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    async function getConversation() {
        const loadingId = toast.loading("Waiting...");
        try {
            const options = {
                url: `${baseUrl}/Conversations/${children.conversationActiveId}`,
                method: "Get",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            const { data } = await axios(options);
            setConversation(data)
            if(data){getMessages(data.id)}
            console.log("data getConversation",data);
        } catch (error) {
            toast.error("Error sending data");
            console.error(error);
        } finally {
            toast.dismiss(loadingId);
        }
    }
    async function sendBlock(userId) {
        const loadingId = toast.loading("Waiting...");
        try {
            const options = {
                url: `${baseUrl}/Block/${userId}/toggle`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            const { data } = await axios(options);
            console.log("sendBlock",data);
        } catch (error) {
            toast.error("Error sending data");
            console.error(error);
        } finally {
            toast.dismiss(loadingId);
        }
    }
    const validationSchema = object({
        content:string(),
    });
    async function getMessages(conversationId) {
        const loadingId = toast.loading("Waiting...");
        try {
            const options = {
                url: `${baseUrl}/Conversations/${conversationId}/Messages`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            const { data } = await axios(options);
            console.log("data getMessages",data);
            setAllMessages(data)
        } catch (error) {
            toast.error("Error sending data");
            console.error(error);
        } finally {
            toast.dismiss(loadingId);
        }
    }
    async function sendMessages(values) {
        const loadingId = toast.loading("Waiting...");
        try {
            const options = {
                url: `${baseUrl}/Conversations/${children.conversationActiveId}/Messages`,
                method: "POST",
                data: values,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            const { data} = await axios(options);
        
        } catch (error) {
            toast.error("Error sending data");
            console.error(error);
        } finally {
            toast.dismiss(loadingId);
        }
    }

    const formik = useFormik({
        initialValues: {
            content:"",
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            sendMessages(values); 
            resetForm(); 
        },

    });
    
    useEffect(()=>{if (userId && children.conversationActiveId) {
        getConversation();}
    },[children.conversationActiveId,userId])
    useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);
    const otherMember = conversation?.membersList?.find(m => m.id !== userId)|| {};
    const reversedMessages = useMemo(() => [...allMessages], [allMessages]);
    return (<>
        {conversation&&userId?<div className="flex-grow  relative  " 
        >
                
                <div className=" flex flex-col">
                    <div className="flex justify-between px-[24px]  items-center pt-[10px] pb-[10px] border border-b-[#E5E7EB] ">
                        <p className="text-black text-[18px] font-bold">{
                            conversation.isGroup ? conversation.name : otherMember?.userName || "Unknown"}</p>
                        <div className="flex items-center space-x-1 relative">
                            {/* <Video size={34} className=' text-mainColor2 p-[7px] rounded-full bg-[#344238] cursor-pointer'/>
                            <Phone size={34} className=' text-mainColor2 p-[7px] rounded-full bg-[#344238] cursor-pointer'/> */}
                            {conversation.isGroup?<Settings size={34} className=' text-[#FFFFFF] p-[7px] rounded-full bg-[#27272A] cursor-pointer' onClick={()=>{setOpenSetting(true)}}/>:null}
                            <X className='hover:text-red-600 transition-all duration-300' onClick={()=>{children.setChat(null)}}/>
                            <EllipsisVertical size={34} className=' p-[7px] rounded-full cursor-pointer' onClick={()=>{
                                if(OpenMenuDots){
                                    setOpenMenuDots(false)
                                }else{
                                    setOpenMenuDots(true)
                                }
                            }}/>
                                {OpenMenuDots?<div className=" absolute -bottom-[120px] min-h-[90px] w-[119px] py-[5px]  border-[2px] z-50 bg-white cursor-pointer right-0  rounded-[10px] ">
                                    <p className="hover:bg-[#37de7762] py-[4px] px-[13px] rounded-[5px] capitalize">clear</p>
                                    <p className="hover:bg-[#37de7762] py-[4px] px-[13px] rounded-[5px] capitalize">Delete</p>
                                    <p className="hover:bg-[#37de7762] py-[4px] px-[13px] rounded-[5px] text-[#9D2929] capitalize" onClick={()=>{
                                    
                                    sendBlock(conversation.membersList[0].id)}}>Block</p>
                                </div>:null}
                        </div>
                    </div>

                    {/* <ConversationMessage messages={messages} setMessages={setMessages} conversationId={children.conversationActiveId}/>
                    {console.log("messages",messages)} */}
                    <div className=" h-[80lvh] px-[24px]  overflow-y-auto pt-[10px] pb-[20px]" style={{ scrollbarWidth: "none" }}>
                    {
                        reversedMessages ?reversedMessages .slice().reverse().map((message,index)=>{
                            const isMe = message.senderId === userId;
                            console.log("reversedMessages " ,message.senderId,"reversedMessages ",userId)
                            // if(isMe){
                                
                                return <div key={index} className={` py-[2px] mt-[4px] mb-[30px] relative  transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex   ${isMe?" justify-end":" justify-start"}    items-center space-x-2 `}>
                                    <div className={`flex  w-fit ${isMe?"bg-mainColor":"bg-[#e9eeee]"}  items-center space-x-2 rounded-[14px] px-[10px]`}>
                                        <div className={`px-[10px] py-[3px] bg-mainColor2 text-black  ${isMe?"text-white":"text-black"} `}>
                                            <p className="text-[16px] font-medium ">{message.content}</p>
                                            
                                        </div>
                                        <p className={`flex justify-end text-[10px] font-semibold text-black   absolute -bottom-4 ${isMe?"float-end right-0 ":"float-start left-0"} `}><TimeOnly dateStr={message.sentAt}/></p>
                                    </div>
                                    
                        </div>
                        //     }else if(!isMe){
                        //         return <div key={index} className="h-[50px] my-2  px-[15px]   transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex   items-center space-x-3 ">
                        //         <img src={icon} alt="" className='w-[25px] h-[25px]  rounded-full' />
                        //         <div className="px-[10px] pt-[5px] pb-[3px] bg-mainColor1 text-black rounded-[12px]">
                        //             <p className="text-[16px] font-medium">{message.content}</p>
                        //             <p className="flex justify-end text-[10px] "><TimeOnly dateStr={message.sentAt}/></p>
                        //         </div>
                        // </div>
                        //     }
                        }):null
                    }
                    <MessagesFromSignalR userId={userId} conversationId={children.conversationActiveId}/>
                    <div ref={bottomRef}></div>
                    </div>
                    {/* {
                        messages?messages.map((massage,index)=>{
                            if(messages.senderId==userId&&messages.conversationId==children.conversationActiveId){
                                return <div key={index} className="h-[50px] my-2  px-[15px]  transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex  justify-end   items-center space-x-3 ">
                                <div className="px-[10px] pt-[5px] pb-[3px] bg-mainColor2 text-black rounded-[12px]">
                                    <p className="text-[16px] font-medium">{massage.content}</p>
                                    <p className="flex justify-end text-[10px] "><TimeOnly dateStr={massage.sentAt}/></p>
                                </div>
                                <CustomAvatar size={34} />
                        </div>
                            }else{
                                return <div key={index} className="h-[50px] my-2  px-[15px]   transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex   items-center space-x-3 ">
                                <CustomAvatar size={34} />
                                <div className="px-[10px] pt-[5px] pb-[3px] bg-mainColor1 text-black rounded-[12px]">
                                    <p className="text-[16px] font-medium">{massage.content}</p>
                                    <p className="flex justify-end text-[10px] "><TimeOnly dateStr={massage.sentAt}/></p>
                                </div>
                        </div>
                            }
                        }):null
                    } */}
                    {/* <div className="flex flex-col flex-grow h-[600px]   space-y-[5px]">
                        <div className="h-[50px]  px-[15px]   transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex   items-center space-x-3 ">
                                <CustomAvatar size={34} />
                                <div className="px-[10px] pt-[5px] pb-[3px] bg-mainColor1 text-black rounded-[12px]">
                                    <p className="text-[16px] font-medium">John Doe</p>
                                    <p className="flex justify-end text-[10px] ">12:25</p>
                                </div>
                        </div>
                        <div className="h-[50px]  px-[15px]  transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex  justify-end   items-center space-x-3 ">
                                <div className="px-[10px] pt-[5px] pb-[3px] bg-mainColor2 text-black rounded-[12px]">
                                    <p className="text-[16px] font-medium">John Doe</p>
                                    <p className="flex justify-end text-[10px] ">12:25</p>
                                </div>
                                <CustomAvatar size={34} />
                        </div>
                        
                    </div> */}
                    <div className=" absolute bottom-5 left-5 right-5 flex flex-grow space-x-3 h-[48px]  ">
                        
                        <form action="" className="flex items-center w-full  space-x-3 h-full" onSubmit={formik.handleSubmit}>
                            <input type="text" className=' flex-grow  text-[15px] font-medium px-[14px] py-[12px]   border border-[#D1D5DB] rounded-[16px] bg-[#FFFFFF]' placeholder='Type a message...' name="content" value={formik.values.content} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            <button type='submit' className="h-[45px] w-[45px]  rounded-full bg-mainColor flex justify-center items-center">
                                <Send size={25} className='  text-white  bg-mainColor2 cursor-pointer'/>
                            </button >
                            
                        </form>
                    </div>
                    
                </div>
            </div>:null}
            
            </>
    );
}

export default ConversationActive;
