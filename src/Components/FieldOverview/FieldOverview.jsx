import axios from 'axios';
import {Activity, AlertCircle, Calendar, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { Line } from 'rc-progress';
import React, { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import toast from 'react-hot-toast';
import DateDisplay from '../DateDisplay/DateDisplay';

const FieldOverview = (children) => {
    let {baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    // let [fieldData,setFieldData]=useState(null)
    //let [editfield,setEditField]=useState(null)
    //let [cropType,setCropType]=useState(null)
    // let [data,setData]=useState(null)
    // let [fieldData,setFieldData]=useState({
    //     FieldName:"",
    //     FieldSize:"",
    //     CropType:"",
    //     IrrigationUnit:null,
    //     SensorUnit:null,
    // })   
    async function getField(){
            try {
                const options={
                    url:`${baseUrl}/farms/${children.farmId}/Fields/${children.fieldId}`,
                    method:"GET",
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
                let {data}=await axios(options);
                children.setData(data)
                console.log("data",data)
            }catch(error){
                if(error.response.data){
                    if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                    else{toast.error("There is an error");}
                }else{console.log(error)}
            }
    }
    async function deleteField(){
            try {
                const options={
                    url:`${baseUrl}/farms/${children.farmId}/Fields/${children.fieldId}`,
                    method:"DELETE",
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
                let {data}=await axios(options);
                children.getFields()
                children.setFieldOverview(null)
            }catch(error){
                if(error.response.data){
                    if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                    else{toast.error("There is an error");}
                }else{console.log(error)}
            }
    }
    useEffect(()=>{children.setReview(getField)})
    useEffect(()=>{getField()},[children.farmId,children.fieldId])
    return (
        children.data?<section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={()=>{children.setFieldOverview(null)}}>
                <div className=" w-[660px] pb-[15px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                    <div className=" py-[16px] w-full px-4  border-b border-[#9f9f9f81] flex justify-between ">
                        <div className="flex items-center space-x-3">
                            <ChevronLeft size={30} className='text-[#0d121cb9] hover:text-black transition-all duration-300' onClick={()=>{children.setFieldOverview(null)}}/>
                            <p className="text-mainColor text-[22px] font-medium">{children.data.name}</p>
                        </div>
                        <div className=" px-3 flex justify-center items-center border-2 rounded-2xl border-[#0d121c21] ">
                            <p className="">{children.data.isActive?"Active":"Idel"}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 px-4 w-full gap-[30px] my-[20px]">
                        <div className="bg-[#F5F5F5] rounded-[15px] py-[8px] px-[10px] w-full h-fit">
                            <div className="flex space-x-3 items-center">
                                <AlertCircle className="text-mainColor" size={22}/>
                                <h3 className="text-[19px] font-medium">Field Information</h3>
                            </div>
                            <div className="mx-[10px] my-[15px] flex flex-col space-y-[15px] ">
                                <div className="text-[17px] font-medium flex flex-col space-y-[5px] ">
                                    <h4 className="text-[#6A6C76]">Area</h4>
                                    <p className="">{children.data.area} acres</p>
                                </div>
                                <div className="text-[17px] font-medium flex flex-col space-y-[5px] ">
                                    <h4 className="text-[#6A6C76]">Crop Name</h4>
                                    <p className="">{children.data.cropName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#F5F5F5] rounded-[15px] py-[8px] px-[10px] w-full h-fit">
                            <div className="flex space-x-3 items-center">
                                <Activity className="text-mainColor" size={22}/>
                                <h3 className="text-[19px] font-medium">Progress & Status</h3>
                            </div>
                            <div className="mx-[10px] my-[15px] flex flex-col space-y-[15px] ">
                                <div className="">
                                    <h4 className="text-[#6A6C76] font-medium text-[17px]">Growth Progress</h4>
                                    <p className="pt-2 pb-2 font-[400] ">{children.data.progress}%</p>
                                    <Line percent={children.data.progress} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] text-mainColor w-full rounded-lg"/>
                                    
                                </div>
                                <div className="text-[17px] font-medium flex flex-col space-y-[5px] ">
                                    <h4 className="text-[#6A6C76]">Days Until Harvest</h4>
                                    <p className="text-mainColor">65 days</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#F5F5F5] rounded-[15px] py-[8px] px-[10px] w-full h-fit">
                            <div className="flex space-x-3 items-center">
                                <Calendar className="text-mainColor" size={22}/>
                                <h3 className="text-[19px] font-medium">Timeline</h3>
                            </div>
                            <div className="mx-[10px] my-[15px] flex flex-col space-y-[15px] ">
                                <div className="text-[17px] font-medium flex flex-col space-y-[5px] ">
                                    <h4 className="text-[#6A6C76]">Planting Date</h4>
                                    <p className=""><DateDisplay dateStr={children.data.plantingDate}/></p>
                                </div>
                                <div className="text-[17px] font-medium flex flex-col space-y-[5px] ">
                                    <h4 className="text-[#6A6C76]">Expected Harvest Date</h4>
                                    <p className=""><DateDisplay dateStr={children.data.expectedHarvestDate}/></p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#F5F5F5] rounded-[15px] py-[8px] px-[10px] w-full h-fit">
                            <div className="flex space-x-3 items-center">
                                <Calendar className="text-mainColor" size={22}/>
                                <h3 className="text-[19px] font-medium">Description</h3>
                            </div>
                            <div className="mx-[10px] my-[15px] flex flex-col space-y-[15px] ">
                                <p className="text-[17px] text-[#6A6C76]">{children.data.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full items-center px-4">
                        <button className="flex space-x-2 items-center px-[30px] py-[5px] bg-[#FFFFFF] text-[#E13939] border-[1px] border-[#E13939] rounded-[12px] font-medium hover:bg-[#E13939] hover:text-white transition-all duration-300" onClick={()=>{deleteField()}}>
                            <Trash2/>
                            <p className="">Delete Field</p>
                        </button>
                        <button type="button" className="flex space-x-2 items-center px-[20px] py-[5px]  border-[1px] border-[#C9C9C9]  rounded-[12px] font-medium bg-mainColor hover:bg-transparent hover:border-mainColor text-white hover:text-mainColor transition-all duration-300" onClick={()=>{
                            children.setFieldOverview(null)
                            children.setEditField(1)
                            }}>
                            <Edit/>
                            <p className="">Edit</p>
                        </button>
                    </div>
                </div>
                
        </section>:null
    );
}

export default FieldOverview;
