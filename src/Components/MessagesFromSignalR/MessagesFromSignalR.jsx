import React, { useContext, useEffect, useRef, useState } from 'react';
import ConversationMessage from '../ConversationMessage/ConversationMessage';
import TimeOnly from '../TimeOnly/TimeOnly';
import { userContext } from '../../Context/User.context';

const MessagesFromSignalR = (children) => {
    const bottomRef = useRef(null);
    const [messages, setMessages] = useState([]);
    let [userId]=useState(localStorage.getItem("userId"))
    
    console.log("userId",userId)
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages]);
    return (
        userId?<div>
                <ConversationMessage messages={messages} setMessages={setMessages} conversationId={children.conversationId}/>

                    {}
                    {console.log("messages",messages)}
                    <>{
                        messages?messages.filter((message) => message.conversationId === children.conversationId).map((message,index)=>{
                            {console.log(messages.senderId)}
                            const isMe = message.senderId === userId;
                            return <div key={index} className={` py-[2px] mt-[4px] mb-[30px] relative  transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex   ${isMe?" justify-end":" justify-start"}    items-center space-x-2 `}>
                                    <div className={`flex  w-fit ${isMe?"bg-mainColor":"bg-[#e9eeee]"}  items-center space-x-2 rounded-[14px] px-[10px]`}>
                                        <div className={`px-[10px] py-[3px] bg-mainColor2 text-black  ${isMe?"text-white":"text-black"} `}>
                                            <p className="text-[16px] font-medium ">{message.content}</p>
                                            
                                        </div>
                                        <p className={`flex justify-end text-[10px] font-semibold text-black   absolute -bottom-4 ${isMe?"float-end right-0 ":"float-start left-0"} `}><TimeOnly dateStr={message.sentAt}/></p>
                                    </div>
                                    
                        </div>
                                

                        //     if(message.senderId===userId){return <div key={index} className="h-[50px] my-2  px-[15px]  transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex  justify-end   items-center space-x-3 ">
                        //         <div className="px-[10px] pt-[5px] pb-[3px] bg-mainColor2 text-black rounded-[12px]">
                        //             <p className="text-[16px] font-medium">{message.content}</p>
                        //             <p className="flex justify-end text-[10px] "><TimeOnly dateStr={message.sentAt}/></p>
                        //         </div>
                        //         {/* <CustomAvatar size={34} /> */}
                        // </div>
                        // }
                        // else{return <div key={index} className="h-[50px] my-2  px-[15px]   transition-all duration-200 rounded-[12px] text-[#FFFFFF] flex   items-center space-x-3 ">
                                
                        //         <div className="px-[10px] pt-[5px] pb-[3px] bg-mainColor1 text-black rounded-[12px]">
                        //             <p className="text-[16px] font-medium">{message.content}</p>
                        //             <p className="flex justify-end text-[10px] "><TimeOnly dateStr={message.sentAt}/></p>
                        //         </div>
                        // </div>}
                            
                        }):null
                    }
                    <span ref={bottomRef}></span>
                    </>
        </div>:null
    );
}

export default MessagesFromSignalR;
