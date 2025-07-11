import { useContext, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
// import Menu from "../../Components/Menu/Menu";
// import { useState } from "react";
// import { useEffect } from "react";
const EditReview = (children) => {
    let {outClick,setReview,setTeam,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    let [invitations,setInvitations]=useState([]);
    // let [farmId, setFarmId] = useState("");
    let soilTypes=["Sandy","Clay","Loamy"];
    // var types2=["Owner","Manager","Expert","Worker"]; 
    // function openList(){
    //     let element=document.querySelector("form div.forms  i").classList;
    //     let element2=document.querySelector("form div.forms div.list").classList;
    //     if(onList){
    //         setOnList(false);
    //         element.remove("fa-angle-down");
    //         element.add("fa-angle-up");
    //         element2.remove("hidden");
    //         element2.remove("border-transparent");
    //         element2.remove("h-0");
    //         element2.add("h-36");
    //         element2.add("border-2");
    //         element2.add("border-[#0d121c21]")
            
    //     }else{
    //         setOnList(true);
    //         element.remove("fa-angle-up");
    //         element.add("fa-angle-down");
    //         element2.add("hidden");
    //         element2.remove("h-36");
    //         element2.add("border-transparent");
    //         element2.add("h-0");
    //         element2.remove("border-2");
    //         element2.remove("border-[#0d121c21]")
    //     }
    // }
    // useEffect(()=>{
    //     openList()
    // },[]);
    // var forms=[1,2,3,4,5];
    // async function getReviewFarmDetails(){
    //     console.log(children.teamMemberList)
    //             try {
    //                 const options={
    //                     url:`${baseUrl}/Farms/${children.farmId}` ,
    //                     method:"GET",
    //                     headers:{
    //                         Authorization:`Bearer ${token}`,
    //                     },
    //                 }
    //                 let {data}=await axios(options);
    //                 setFarm(data);
    //             }catch(error){
    //                 toast.error("Incorrect email or password "+error);
    //             }finally{
    //                 toast.dismiss("Incorrect");
                    
    //             }
    //         }
    //         useEffect(()=>{
    //             getReviewFarmDetails()
    //         },[children.farmId])
    //farmData,setFarmData
    // async function sendInvitations(value){
        //             try {
        //                 const options={
        //                     url:`${baseUrl}/farms/${children.farmId}/Invitations` ,
        //                     method:"POST",
        //                     headers:{
        //                         Authorization:`Bearer ${token}`,
        //                     },
        //                     data:value,
        //                 }
        //                 let {data}=await axios(options);
        //                 getInvitations()
        //             }catch(error){
        //                 toast.error("Incorrect email or password "+error);
        //             }finally{
        //                 toast.dismiss("Incorrect");
                        
        //             }
        //         }
    async function getInvitations(){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/Invitations/pending` ,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            }
            let {data}=await axios(options);
            console.log("getUsers")
            console.log(data)
            setInvitations(data)
            children.setTeamMemberList(data)
        }catch(error){
            toast.error("Incorrect email or password "+error);
            console.log(error)
        }finally{
            toast.dismiss("Incorrect");
        }
    }
    function deleteAllInvitations(){
        invitations.map((invitation)=>{
            deleteInvitations(invitation.farmId,invitation.invitationId)
        })
    }
    async function deleteInvitations(farmId,invitationId){
    try {
        const options={
            url:`${baseUrl}/farms/${farmId}/Invitations/${invitationId}` ,
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        }
        let {data}=await axios(options);
        getInvitations()
    }catch(error){
        toast.error("Incorrect email or password "+error);
    }finally{
        toast.dismiss("Incorrect");
        getInvitations()
        
    }
    }
    async function EditFarm(){
            try {
            const options={
                url:`${baseUrl}/Farms` ,
                method:"POST",
                headers:{
            Authorization:`Bearer ${token}`,
                },
                data:{
                    name:children.farmData.name ,
                    area:children.farmData.area,
                    location:children.farmData.location ,
                    soilType:children.farmData.soilType,
                },
            }
            let {data}=await axios(options);
                if(data){ 
                    // children.setFarmId(data.farmId)
            
                    if(children.farmData.invitations.length>0){EditInvitation(data.farmId)}
                    else{children.display()
                        setReview(false)}
                    }
                }catch(error){
                    if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                    else{toast.error("error create farm");}
            }finally{
            toast.dismiss("Incorrect");
        
            }
    }
    function EditInvitation(farmId){
                console.log("sendInvitation farmId " ,farmId)
                children.farmData.invitations.map((item)=>{
                    EditInvitationToUser(item.recipient,item.roleName,farmId)
                })
    }
    async function EditInvitationToUser(recipient,roleName,farmId){
        try {
        const options={
            url:`${baseUrl}/farms/${farmId}/Invitations` ,
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`,
            },
            data:{
                recipient:recipient,
                roleName:roleName
            },
        }
        let {data}=await axios(options);
        children.display()
        setReview(false)
        // console.log("data roleName",roleName)
        console.log("data sendInvitationsToUser",data)
        }catch(error){
        toast.error("Incorrect email or password "+error);
        // console.log("data farmId",children.farmId)
        // console.log("data recipient",recipient)
        // console.log("data roleName",roleName)
        console.log("error sendInvitationsToUser",error)
        }finally{
        toast.dismiss("Incorrect");
        console.log("----------------------------------------------/n")
        }
            }
    
    
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()
                }}}>
                <motion.div
                        initial={{ x: 0, y: 500, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{
                            delay:  0.2,
                            duration: 2,
                            type: "spring",
                            bounce: 0.4,
                            }} className=" w-[600px] h-[680px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                        setReview(false);
                    }} ></i>
                </div>
                <div className="flex flex-col justify-center items-center mt-8 mb-5">
                <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">Edit Farm</div>
                <div className="w-[100%] rounded-xl flex gap-4  items-center">
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full"><p className="">1</p>
                    </div>
                    <p className="mt-2">Basic Info</p>
                    </div>
                    <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor "></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">2</p>
                    </div>
                    <p className="mt-2   ">Team</p>
                    </div>
                    <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor "></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full"><p className="">3</p>
                    </div>
                    <p className="mt-2">Review</p>
                    </div>
                </div>
                </div>
                <form action="" className="w-[85%] my-3 flex-grow  flex flex-col justify-between  text-[18px]">
                    <div className="flex flex-col  ">
                        <p className="text-[20px] font-semibold capitalize text-[#0b0b0bd8] mb-2 ">farm Details </p>
                        <div className="  grid grid-cols-2 mx-3 ">
                            <div className="mb-2 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">farm name</p>
                                <p className="text-[17px]">{children.farmData.name}</p>
                            </div>
                            <div className="mb-2 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">farm size</p>
                                <p className="text-[17px]">{children.farmData.area} acres</p>
                            </div>
                            <div className="mb-2 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">location</p>
                                <p className="text-[17px]">{children.farmData.location}</p>
                            </div>
                            <div className="mb-2 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">soil type</p>
                                <p className="text-[17px]">{soilTypes[children.farmData.soilType]}</p>
                            </div>

                        </div>
                    </div>
                    <div className=" flex-grow  h-[200px] ">
                        <p className="text-[20px] text-[#0b0b0bd8] font-semibold my-3">Team Members</p>
                        
                        <div className="h-[70%] overflow-y-auto">
                        {children.farmData.invitations.map((item,index)=>{return item.recipient?<div key={index} className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg">
                            <p className="">{item.recipient}</p>
                            <div className="flex items-baseline space-x-4">
                                <p className="  ">{item.roleName}</p>
                            </div>
                        </div>:null})}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <i className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px] " onClick={()=>{
                            setReview(false)
                            setTeam(true)
                        }} ></i>
                        <button type="button" className="btn w-fit px-[20px]  self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "onClick={()=>{EditFarm()}}>Create Farm</button>
                    </div>
                    
                </form>
                </motion.div>
                
            </section>)
}
export default EditReview;
