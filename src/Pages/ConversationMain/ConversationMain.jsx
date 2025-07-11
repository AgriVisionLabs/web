// import { useContext, useState } from 'react';
import { Plus, Search, Send, X } from "lucide-react";
import Logo from "../../assets/logo/AgrivisionLogo.svg"
import { useContext, useEffect, useState } from 'react';
import ConversationHub from "../../Components/ConversationHub/ConversationHub";
import toast from "react-hot-toast";
import { userContext } from "../../Context/User.context";
import { AllContext } from "../../Context/All.context";
import axios from "axios";
import NewConversation from "../../Components/NewConversation/NewConversation";
import Avatar from "react-avatar";
import ConversationActive from "../../Components/ConversationActive/ConversationActive";


const ConversationMain = (children) => {
    const [conversationActiveId,setConversationActiveId]=useState(false)
    const [conversations, setConversations] = useState([]);
    const [allconversations, setAllConversations] = useState([]);
    const [connection, setConnection] = useState(null);
    let [search, setSearch] = useState("");
    let {token} =useContext(userContext);
    let [userId]=useState(localStorage.getItem("userId"))
    let {baseUrl}=useContext(AllContext)
    const [Newconversations, setNewConversations] = useState();
    const [tags, setTags] = useState([]);
    
    async function getConversations() {
        const loadingId = toast.loading("Waiting...");
        try {
            const options = {
                url: `${baseUrl}/Conversations`,
                method: "Get",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            const { data } = await axios(options);
            if(data){
            setAllConversations(data)}
            console.log(data);
        } catch (error) {
            toast.error("Error sending data");
            console.error(error);
        } finally {
            toast.dismiss(loadingId);
        }
    }
    useEffect(()=>{
        getConversations()
    },[userId])
    function selectElement(e){
        let list = document.querySelectorAll("div.listItems div");
        for(let element of list){
            if(e==element ){element.classList.add("bg-[#F0FDF4]")}
            else{element.classList.remove("bg-[#F0FDF4]")}}
        }
        
    return (
        allconversations.length!=0&&userId?<section className='  max-h-screen fixed inset-0  bg-[#F7F7F7] '>
            <div className="grid grid-cols-12 h-full  ">
                <div className=" col-span-2 border-e border-[#E5E7EB]  h-lvh relative
                ">
                    <div className="h-[7%] flex justify-center items-center ">
                        <img src={Logo} alt="" className="h-[35px]" />
                    </div>
                    <div className="flex h-[6%] mt-[15px] mb-[2px] px-[10px] mx-[5px]  space-x-3 items-center bg-[#FFFFFF] rounded-[14px]">
                        <Search size={20}/>
                        <input type="text" className="  flex items-center  border-0 border-[#D1D5DB]  text-[15px] placeholder:text-[14px] outline-none" placeholder={`Search conversations...`} onChange={(e)=>{setSearch(e.target.value)}}/>
                    </div>
                    <div className="flex-grow h-[87%]  py-[10px]">
                        <div className="listItems flex justify-between items-center  text-black py-[5px] ">
                            <ConversationHub conversations={conversations}  setConversations={setConversations} connection={connection} setConnection={setConnection} />
                            {userId&&allconversations?allconversations.filter((conversation) => conversation.membersList.find(m => m.id !== userId).userName.toLowerCase().includes(search.toLowerCase())).map((conversation ,index)=>{
                                const member = conversation?.membersList?.find(m => m.id !== userId)|| {};
                        return <div key={index} className="h-[50px] py-[4px] px-[5px] hover:bg-[#F0FDF4] transition-all duration-200 rounded-[8px]  flex  items-center space-x-3 cursor-pointer" onClick={(e)=>{
                            selectElement(e.currentTarget)
                            console.log(e.currentTarget)
                            setConversationActiveId(conversation.id)
                        }}>
                            <Avatar
                                name={conversation.isGroup?conversation.name:member?.userName}
                                size="40"
                                round={true}
                                className="shadow-md"
                            />
                            <div className="">
                                <p className="text-[16px] font-semibold text-black">{
                                    conversation.isGroup?conversation.name:member?.userName|| "Unknown"}</p>
                                    <p className=" line-clamp-1 text-[12px]">I’m doing great, thanks for asking! How about you?</p>
                            </div>
                            
                        </div> 
                    }):null}
                        </div>
                    </div>
                    <div className="fixed left-2 bottom-2 bg-mainColor w-[35px] h-[35px] rounded-[50%] text-white flex justify-center items-center" onClick={()=>{setNewConversations("Newconversations")}}>
                        <Plus size={20}/>
                    </div>
                </div>

                <div className=" col-span-10 h-lvh relative flex flex-col">
                    {conversationActiveId?<ConversationActive setChat={children.setChat} conversationActiveId={conversationActiveId}/>:
                            <div className="flex-grow  ">
                                <X size={30} className=" hover:text-red-500 transition-all duration-300 absolute right-4 top-6" onClick={()=>{children.setChat(null)}}/>
                                <div className="flex justify-center items-center h-full ">
                                <p className="text-[18px] font-medium text-[#A1A1AA]">Select a conversation or start a new one</p>
                                </div>
                            </div> }
                </div>
            </div>
            {Newconversations=="Newconversations"?<div className=" absolute inset-0 z-20 " ><NewConversation setNewConversations={setNewConversations} tags={tags} setTags={setTags}/></div> :null}
        </section>:null
    );
}

export default ConversationMain;
