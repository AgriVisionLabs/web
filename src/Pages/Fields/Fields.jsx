import  { useContext, useEffect, useRef, useState } from 'react';
import { AllContext } from '../../Context/All.context';

import { MapPin,Sprout,Ruler,Users, SquarePen,SquareKanban, Trash2, ChevronLeft } from 'lucide-react';
import AddNewField from '../../Components/AddField/AddNewField/AddNewField';
import Irrigation from '../../Components/AddField/Irrigation/Irrigation';
import Sensors from '../../Components/AddField/Sensors/Sensors';
import ReviewField from '../../Components/AddField/ReviewField/ReviewField';
import { userContext } from '../../Context/User.context';
import axios from "@axiosInstance";
import { motion } from "framer-motion";
import { Line } from 'rc-progress';
import toast from 'react-hot-toast';
import FieldOverview from '../../Components/FieldOverview/FieldOverview';
import EditBasicInfo from '../../Components/FieldEdit/EditBasicInfo';
import EditIrrigation from '../../Components/FieldEdit/EditIrrigation';
import EditSensors from '../../Components/FieldEdit/EditSensors';
import EditReview from '../../Components/FieldEdit/EditReview';
const Fields = (children) => {
    let {SetOpenFarmsOrFieled,addField,setAddField,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    let [farmData,setFarmData]=useState(null)
    let [fieldsData,setFieldsData]=useState([])
    let [farmId,setFarmId]=useState(null)
    let [fieldId,setFieldId]=useState(null)
    let [sensorsId,setsensorsId]=useState([])
    let [membersData,setMembersData]=useState(null)
    let [cropType,setCropType]=useState(null)
    let [fieldOverview,setFieldOverview]=useState(null);
    let [editfield,setEditField]=useState(null)
    let [review,setReview]=useState(null)
    //let [cropType,setCropType]=useState(null)
    let [data,setData]=useState(null)
    let members=useRef()
    var types=["Sandy","Clay","Loamy"];
    let [FieldData,setFieldData]=useState({
        FieldName:"",
        FieldSize:"",
        CropType:"",
        IrrigationUnit:null,
        SensorUnit:null,
    })      
    function toggleMember(){
        ["border-[1px]","px-[5px]","py-[5px]","border-[rgba(13,18,28,0.25)]","w-[300px]","min-h-[50px]"].forEach(cls =>
            members.current.classList.toggle(cls)
            )
    }
    useEffect(()=>{SetOpenFarmsOrFieled(2)},[])
    async function getFarm(){
        try {
            const options={
                url:`${baseUrl}/Farms/${children.farmId}`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            setFarmData(data)
            
        }catch(error){
        if(error.response.data){
            if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
            else{toast.error("Insufficient data");}}
        else{console.log(error)}
        }
    }
    async function getFields(){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/Fields`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            if(data){setFieldsData(data)}
            console.log("data",data)
        }catch(error){
            if(error.response.data){
                if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                else{toast.error("There is an error");}
            }else{console.log(error)}
        }
    }
    async function getmembers(){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/members`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            console.log("getmembers",data)
            setMembersData(data)
        }catch(error){
            if(error.response.data){
                if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                else{toast.error("There is an error");}
            }else{console.log(error)}
        }
    }
    useEffect(()=>{
        getFarm()
        getFields()}
    ,[])
    useEffect(()=>{
        if(farmData){
        getmembers()}
    },[farmData])
    return (
        <section className=' relative'>
                {farmData?
                <div className="  h-full   order-7 overflow-hidden   transition-all duration-500">
                    <header className="flex justify-between  items-center ">
                        <div className=" flex space-x-[15px] items-center ">
                            <div className="flex items-center  text-[#585858] hover:text-[#070707] transition-all duration-150 ">
                                <ChevronLeft size={35} onClick={()=>{SetOpenFarmsOrFieled(1)}}/>
                            </div>
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
                            <div className=" absolute right-[158px] top-[3px]  space-y-[10px]  rounded-b-[12px] rounded-l-[12px] overflow-hidden  w-0 h-0  bg-[#FFFFFF]  " ref={members}>
                                {membersData?membersData.map((member,index)=>{
                                    return <div key={index} className="flex justify-between items-center  rounded-[5px] py-[5px] px-[6px] hover:bg-[#dbdbdb9a]  cursor-pointer">
                                    <p className=" font-[500] text-[16px] capitalize">{member.userName}</p>
                                    <div className=" px-3 border-[1px] rounded-2xl border-[#0d121c21] text-[15px] flex justify-center items-center">{member.roleName}</div>
                                </div>
                                }):""}
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex justify-between my-10 items-center">
                        <p className="text-[20px] md:text-[25px] font-medium">Fields</p>
                        <button className={`btn self-end py-4 w-auto px-2 md:px-4  text-[13px] md:text-[15px]  text-white  border-2 capitalize ${farmData.roleName=="Owner"?"bg-mainColor  hover:text-mainColor hover:border-mainColor  hover:bg-transparent":" bg-mainColor/40 cursor-default hover:bg-mainColor/40 "}  font-medium z-30 `} onClick={()=>{
                            if(farmData.roleName=="Owner"){
                            setAddField(1);}
                        }}><i className="fa-solid fa-plus pe-2"></i> add Field </button>
                    </div>
                    
                    {fieldsData.length!=0?<div className=" grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4   gap-6 md:px-4 py-2 ">
                        
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
                                        className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)] "
                                    >
                                        <div className=" shadow-md px-3 py-2 rounded-xl border-[1px]  border-[#0d121c00] h-[135px] " onClick={()=>{
                                            setFarmId(field.farmId)
                                            setFieldId(field.id)
                                            setFieldOverview(true)
                                            }}>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-mainColor font-[500] text-[19px] capitalize">{field.name}</p>
                                                    <div className=" h-[30px] px-3 border-[1px] rounded-2xl border-[#0d121c21] text-[14px] font-medium flex justify-center items-center">{field.isActive?<span>Active</span>:<span>InActive</span>}</div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="font-[600] text-[17px] my-2">{field.cropName}</p>
                                                    <Line percent={65} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] text-mainColor w-full rounded-lg"/>
                                                    <p className="pt-2 pb-2 font-[400] ">progress: {65}%</p>
                                                
                                                </div>
                                        </div>
                                    </motion.div>
                                })
                            }
                    </div>:
                        <div className="h-[70%]  overflow-y-auto flex justify-center items-center text-[#808080] text-[18px] ">you don’t have any fields yet</div>}
                    
                </div>:null}
                    {   addField==1?<div className=' fixed z-50 inset-0  '><AddNewField setFieldData={setFieldData}  setCropType={setCropType}/></div>:
                        addField==2?<div className=' fixed z-50 inset-0  '><Irrigation setFieldData={setFieldData} FieldData={FieldData}/></div>:
                        addField==3?<div className=' fixed z-50 inset-0  '><Sensors setFieldData={setFieldData} FieldData={FieldData}/></div>:
                        addField==4?<div className=' fixed z-50 inset-0  '><ReviewField FieldData={FieldData} setAddField={setAddField}  getFields={getFields} farmId={children.farmId} cropType={cropType}/></div>:""
                    }
                    {
                        fieldOverview?<div className=' fixed z-50 inset-0  '><FieldOverview farmId={farmId} fieldId={fieldId} setEditField={setEditField} setReview={setReview} setFieldOverview={setFieldOverview} setData={setData} data={data} getFields={getFields}/></div>:
                        editfield==1?<div className=' fixed z-50 inset-0  '><EditBasicInfo setFieldData={setFieldData} setEditField={setEditField} setFieldOverview={setFieldOverview} data={data}   setCropType={setCropType}/></div>:
                        editfield==2?<div className=' fixed z-50 inset-0  '><EditIrrigation farmId={farmId} fieldId={fieldId} setFieldData={setFieldData} setEditField={setEditField}  FieldData={FieldData} data={data}/></div>:
                        editfield==3?<div className=' fixed z-50 inset-0  '><EditSensors farmId={farmId} sensorsId={sensorsId} setFieldData={setFieldData} setsensorsId={setsensorsId} setEditField={setEditField}  FieldData={FieldData} data={data}/></div>:
                        editfield==4?<div className=' fixed z-50 inset-0  '><EditReview FieldData={FieldData} review={review} fieldId={fieldId} sensorsId={sensorsId} setEditField={setEditField}   setFieldOverview={setFieldOverview}  data={data} getFields={children.getFields} farmId={children.farmId} cropType={cropType}/></div>:null
                    }
                    
        </section>
    );
}

export default Fields;
