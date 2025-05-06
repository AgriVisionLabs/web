import React, { useContext, useEffect, useRef, useState } from 'react';
import { AllContext } from '../../Context/All.context';

import { MapPin,Sprout,Ruler,Users, SquarePen,SquareKanban, Trash2, ArrowBigLeft, ArrowLeft, ChevronLeft } from 'lucide-react';
import AddNewField from '../../Components/AddNewField/AddNewField';
import Irrigation from '../../Components/Irrigation/Irrigation';
import Sensors from '../../Components/Sensors/Sensors';
import ReviewField from '../../Components/ReviewField/ReviewField';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { Line } from 'rc-progress';
import Loading from '../Loading/Loading';
const Fields = (children) => {
    let {SetOpenFarmsOrFieled,addField,setAddField}=useContext(AllContext);
    let {token}=useContext(userContext)
    let [farmData,setFarmData]=useState(null)
    let [fieldsData,setFieldsData]=useState(null)
    let [membersData,setMembersData]=useState(null)
    let members=useRef()
    var types=["Sandy","Clay","Loamy"];
    let [fieldDataSend,setfieldDataSend]=useState({
        name:"",
        area:"",
        location:"",
        soilType:"",
        // invitations:[{
        //     recipient:"",
        //     roleName:""}
        // ]
        
    });
    function toggleMember(){
        ["border-[1px]","px-[10px]","py-[15px]","border-[rgba(13,18,28,0.25)]","w-[300px]","min-h-[120px]"].forEach(cls =>
            members.current.classList.toggle(cls)
            )
    }      
    
    SetOpenFarmsOrFieled(2)
    console.log(children.farmId)
    async function getFarm(){
        try {
            const options={
                url:`https://agrivision.tryasp.net/Farms/${children.farmId}`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            setFarmData(data)
            getFields()
        }catch(error){
            // toast.error("Incorrect email or password "+error);
            console.log(error)
        }
    }
   
    async function getFields(){
        
        try {
            const options={
                url:`https://agrivision.tryasp.net/farms/${children.farmId}/Fields`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            console.log(data)
            setFieldsData(data)
        }catch(error){
            // toast.error("Incorrect email or password "+error);
            console.log(error)
        }
    }
    async function getmembers(){
        try {
            const options={
                url:`https://agrivision.tryasp.net/farms/${children.farmId}/members`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            console.log(data)
            setMembersData(data)
        }catch(error){
            // toast.error("Incorrect email or password "+error);
            console.log(error)
        }
    }
    useEffect(()=>{
        getFarm()
        getmembers()
    },[])
    // async function createFarm(){
    //     try {
    //     const options={
    //         url:`https://agrivision.tryasp.net/Farms` ,
    //         method:"POST",
    //         headers:{
    //     Authorization:`Bearer ${token}`,
    //         },
    //         data:{
    //             name:children.farmData.name ,
    //             area:children.farmData.area,
    //             location:children.farmData.location ,
    //             soilType:children.farmData.soilType,
    //         },
    //     }
    //     let {data}=await axios(options);
    //         if(data){ console.log("data createFarm ",data)
    //             // children.setFarmId(data.farmId)
            
    //             sendInvitation(data.farmId)}
    //     // console.log("farmIdValue createFarm  ",children.farmId)
    //         }catch(error){
    //     toast.error("Incorrect email or password "+error);
    //     console.log("error createFarm",error)
    //     }finally{
    //     toast.dismiss("Incorrect");
    
    //     }
    //     }
    return (
        <>
                {farmData?<div className=" mt-12 h-full   order-7 overflow-hidden   transition-all duration-500">
                    <header className="flex justify-between  items-center ">
                        <div className=" flex space-x-[15px] items-center">
                            
                            <p className=" text-[25px]  md:text-[28px] font-medium text-mainColor ">{farmData.name}</p>  
                        </div>
                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                <p className="font-[500] text-[12px] md:text-[14px] ">{farmData.roleName}</p>
                        </div>
                    </header>
                    <div className="grid gap-4 md:grid-cols-2 my-5">
                        <div className="   flex gap-9 text-[#616161] text-[14px] md:text-[14px]  lg:text-[20px] ">
                            <div className="flex items-center gap-2">
                                <MapPin size={20}/>
                                <p className="">{farmData.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sprout size={20}/>
                                <p className="">{types[farmData.soilType]}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Ruler size={20}/>
                                <p className="">{farmData.area} acres</p>
                            </div>
                            
                        </div>
                        <div className="flex md:mt-5 md:ms-auto gap-5 relative ">
                            <Users strokeWidth={3} className=' transition-all duration-200 hover:text-[#1f54b6] ' onClick={()=>{toggleMember()}}/>
                            <SquarePen className=' transition-all duration-200 hover:text-mainColor'/>
                            <SquareKanban className=' transition-all duration-200 hover:text-[#e42ad2] '/>
                            <Trash2 className=' transition-all duration-200 hover:text-[#f02929] '/>
                            <div className=" absolute right-[158px] top-[3px]  space-y-[10px]  rounded-b-[12px] rounded-l-[12px] overflow-hidden transition-all duration-700 ease-in-out w-0 h-0  bg-[#FFFFFF]  " ref={members}>
                                {membersData?membersData.map((member,index)=>{
                                    return <div key={index} className="flex justify-between items-center  rounded-[5px] py-[10px] px-[4px] hover:bg-[#dbdbdb9a]  cursor-pointer">
                                    <p className=" font-[500] text-[16px] capitalize">{member.userName}</p>
                                    <div className=" px-3 border-[1px] rounded-2xl border-[#0d121c21] text-[15px] flex justify-center items-center">{member.roleName}</div>
                                </div>
                                }):""}
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex justify-between my-10 items-center">
                        <p className="text-[20px] md:text-[25px] font-medium">Fields</p>
                        <button className="btn self-end py-4 w-auto px-2 md:px-4 bg-mainColor text-[13px] md:text-[15px]  text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-medium z-30 "onClick={()=>{
                            setAddField(1);
                        }}><i className="fa-solid fa-plus pe-2"></i> add Field </button>
                    </div>
                    
                    {fieldsData?<div className=" grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 md:px-4 py-2 ">
                        
                        {fieldsData.map((field,index)=>{
                                    return <motion.div
                                    key={index}
                                    initial={{ x: 0, y: -50, opacity: 0 }}
                                    animate={{ x: 0, y: 0, opacity: 1 }}
                                    transition={{
                                        delay: index * 0.35,
                                        duration: 0.8,
                                        type: "spring",
                                        bounce: 0.4,
                                    }}
                                        className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]"
                                    >
                                        <div className=" shadow-md px-3 py-2 rounded-xl border-[1px]  border-[#0d121c00] ">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-mainColor font-[500] text-[19px] capitalize">{field.name}</p>
                                                    <div className=" h-[30px] px-3 border-[1px] rounded-2xl border-[#0d121c21] text-[15px] flex justify-center items-center">{field.isActive?<span>Active</span>:<span>InActive</span>}</div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="font-[600] text-[19px] my-2">Corn</p>
                                                    <Line percent={65} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] text-mainColor w-full rounded-lg"/>
                                                    <p className="pt-2 pb-2 font-[400] ">progress: {65}%</p>
                                                
                                            </div>
                                        </div>
                                    </motion.div>
                                })
                            }
                    </div>:
                        <div className="h-[60%] flex justify-center items-center text-[#808080] text-[22px]">you don’t have any fields yet</div>}
                    <div className=" fixed bottom-2 text-[#585858] hover:text-[#070707] transition-all duration-150 ">
                    <ChevronLeft size={40} onClick={()=>{SetOpenFarmsOrFieled(1)}}/>
                    </div>
                </div>:""}
                    {   addField==1?<div className=' fixed z-50 inset-0  '><AddNewField/></div>:
                        addField==2?<div className=' fixed z-50 inset-0  '><Irrigation/></div>:
                        addField==3?<div className=' fixed z-50 inset-0  '><Sensors/></div>:
                        addField==4?<div className=' fixed z-50 inset-0  '><ReviewField/></div>:""
                    }
        </>
    );
}

export default Fields;
