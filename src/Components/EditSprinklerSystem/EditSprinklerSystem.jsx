import { Calendar, Cpu, Hash, MapPin, User, Wifi, Wrench, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import MenuElement from '../MenuElement/MenuElement';
import { AllContext } from '../../Context/All.context';
import DateDisplay from '../DateDisplay/DateDisplay';
import TimeOnly from '../TimeOnly/TimeOnly';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { userContext } from '../../Context/User.context';
import { number, object, string } from 'yup';

const EditSprinklerSystem = (children) => {
    let {baseUrl}=useContext(AllContext)
    let {token}=useContext(userContext);
    let [onList,setOnList]=useState(null);
    let [onList1,setOnList1]=useState(null);
    let irrigationUnit=children.ShowIrr ;
    let irrigationMember=children.ShowIrrMember;
    let status=["Active","Idle","Maintenance"];
    let allFields=children.Fields.map((Field)=>{return Field.name})
    let allFieldsID=children.Fields.map((Field)=>{return Field.id})
    console.log("updateIrrigationUnit")
    let [statusIndex,setStatusIndex]=useState(irrigationUnit.status);
    let [fieldIndex,setFieldIndex]=useState(null);
    const validationSchema=object({
        name:string().required("Name is required").min(3,"Farm Location must be at least 3 characters").max(100,"Farm Location can not be than 100 characters"),
        status:number().required("status is required"),
        newFieldId:string().required("Name is required")
    });
    async function updateIrrigationUnit(values){
        console.log("updateIrrigationUnit")
        try {
            const options={
                url:`${baseUrl}/farms/${irrigationUnit.farmId}/fields/${irrigationUnit.fieldId}/irrigationunits`,
                method:"PUT",
                data:values,
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            children.setIrrigationUnit(null)
            toast.success("Irrigation unit updated successfully");
            console.log("updateIrrigationUnit",data);
        }catch(error){
            toast.error("Failed to update irrigation unit: " + (error.response?.data?.message || error.message));
            console.log(error)
        }
    }
const formik=useFormik({
    initialValues:{
        name:"",
        status:null,
        newFieldId:""
    },
    validationSchema,
    onSubmit:updateIrrigationUnit,
});
useEffect(()=>{
    setStatusIndex(irrigationUnit.status)
    
    // Find the correct field index (0-based) only if Fields array is available
    if (children.Fields && children.Fields.length > 0) {
        const fieldIdx = children.Fields.findIndex(field => field.id === irrigationUnit.fieldId);
        setFieldIndex(fieldIdx >= 0 ? fieldIdx : 0);
    }
    
    // Set initial form values
    formik.setFieldValue('name', irrigationUnit.name);
    formik.setFieldValue('status', irrigationUnit.status);
    formik.setFieldValue('newFieldId', irrigationUnit.fieldId);
},[])

useEffect(()=>{
    formik.setFieldValue('status', statusIndex);
},[statusIndex])

useEffect(()=>{
    if(fieldIndex >= 0 && allFieldsID && allFieldsID[fieldIndex]) {
        formik.setFieldValue('newFieldId', allFieldsID[fieldIndex]);
    }
},[fieldIndex])

    return (
        children.ShowIrr?<section className='h-[100vh]  flex justify-center items-center bg-black bg-opacity-70  font-manrope  absolute z-50 w-[100%]' onClick={(e)=>{if(e.target==e.currentTarget){children.setIrrigationUnit(null)}}}>
            <div className="w-[800px] px-[40px] h-[820px]   border-2 rounded-2xl bg-white py-[10px]   text-[#0D121C] font-manrope">
                <div className="">
                    <form action="" className="" onSubmit={formik.handleSubmit}>
                        <div className="flex justify-between items-center  mb-[15px]">
                            <div className="flex items-center space-x-[11px] ">
                                <Cpu size={28}/>
                                    <input htmlFor="" className='formControl w-[300px] h-[40px] rounded-[8px] capitalize text-[15px]' placeholder={irrigationUnit.name} name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    <p className="">{formik.errors.name||formik.errors.newFieldId||formik.errors.status}</p>
                                    
                            </div>
                            <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{children.setIrrigationUnit(null)}}/>
                        </div>
                        <div className="flex justify-between items-center text-[19px] font-medium text-[#616161] capitalize  cursor-pointer ">
                            <h4 className="">sensor details</h4>
                            <div className="flex items-center space-x-[11px] py-[5px] px-[12px]text-[17px]">
                                
                                <div className="flex justify-end items-center space-x-[16px] ">
                                <button type='button' className="py-[5px] px-[20px] border-[1px] border-[#616161] rounded-[12px]  text-[15px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{children.setIrrigationUnit("step1")}}>
                                    <div className="flex justify-center items-center space-x-[11px]">
                                        <p className="">Cancel</p>
                                    </div>
                                </button>
                                <button type='submit'  className="py-[5px] px-[10px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium">
                                    <div className="flex justify-center items-center space-x-[11px]">
                                        <p className="">Save Change</p>
                                    </div>
                                </button>
                            </div>
                            </div>
                        </div>
                    </form>
                    <div className="mt-[12px] text-[18px] font-medium  flex justify-between items-center">
                        <div className="flex items-center space-x-[12px] text-[#0D121C]  ">
                            <p className="">Status: </p>
                            <MenuElement Items={status} nameChange={status[statusIndex]}  setIndex={setStatusIndex}  onList={onList} width={218+"px"}  setOnList={setOnList} Pformat={"text-[#0D121C] font-[400]"}/>
                        </div>
                        <p className=" capitalize font-semibold">type : <span className="text-[#616161] font-medium">sprinkler</span></p>
                        
                    </div>
                    <div className="grid grid-cols-2 text-[16px] mt-[20px] space-y-[8px] font-medium capitalize">
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold">field & location</h5>
                            <div className="flex flex-col items-start space-x-[8px]">
                                <div className="flex items-center space-x-[8px]">
                                    <MapPin  className='text-[#616161] '/>
                                    <MenuElement Items={allFields} nameChange={allFields[fieldIndex]} setIndex={setFieldIndex}  onList={onList1} width={218+"px"}  setOnList={setOnList1} Pformat={"text-[#0D121C] font-[400]"}/>
                                    
                                </div>
                                <p className="text-[#616161] ps-[24px]">fully coverage</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">serial number</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Hash  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.serialNumber}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">installation date</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Calendar  className='text-[#616161] '/>
                                <DateDisplay dateStr={irrigationUnit.installationDate}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">firmware version</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Cpu  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.firmWareVersion}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">iP address</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wifi  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.ipAddress}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">MAC address</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wifi  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.macAddress}</p>
                            </div>
                        </div>
                        
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">last maintenance</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wrench className='text-[#616161] '/>
                                <DateDisplay dateStr={irrigationUnit.lastMaintenance}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">next maintenance</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Calendar  className='text-[#616161] '/>
                                <DateDisplay dateStr={irrigationUnit.nextMaintenance}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">added by</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <User  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.addedBy} farm ({irrigationMember.roleName}) </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="border-t-[1px] border-[#9F9F9F] mt-[7px]">
                    <p className="text-[#616161] text-[18px] font-medium capitalize my-[15px] text-center">last reading</p>
                    <div className="h-[120px] bg-[#9f9f9f27] rounded-[15px] py-[15px] space-y-[10px] flex flex-col justify-center">
                        <p className="text-[18px] text-center font-semibold"><DateDisplay dateStr={irrigationUnit.installationDate}/></p>
                        <p className="text-[16px] text-[#616161] text-center font-semibold  ">Last updated: <DateDisplay dateStr={irrigationUnit.installationDate}/> at <TimeOnly dateStr={irrigationUnit.installationDate}/></p>
                    </div>
                </div>
                    
            </div>
            
                
                
            
            
        </section>:null
    );
}

export default EditSprinklerSystem;
