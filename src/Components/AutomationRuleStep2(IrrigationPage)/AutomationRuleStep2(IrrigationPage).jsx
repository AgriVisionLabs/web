import { Check, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import MenuElement from '../MenuElement/MenuElement';
import { userContext } from '../../Context/User.context';
import { number, object, string } from 'yup';
import { isInteger, useFormik } from 'formik';
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
motion
const AutomationRuleStep2IrrigationPage = (children) => {
    let {setControlIrrigationPage,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext)
    let [onListAddNewSensorStep1,setOnListAddNewSensorStep1] =useState(null)
    let [onList,setOnList]=useState();
    let type=["Threshold","Schedule"];
    let [typeId,setTypeId]=useState(0)
    
    // let [dataAuto,setDataAuto]=useState({
    //     name:"",
    //     type:"",
    //     minThresholdValue:null,
    //     maxThresholdValue:null,
    //     targetSensorType:null,
    //     startTime:null,
    //     endTime:null,
    //     activeDays:null,
    // });
    function format() {
        if (typeId === 1) {
            return {
                startTime: null,
                endTime: null,
                activeDays: null,targetSensorType: null
            };
            } else {
            return {
                minThresholdValue: null,
                maxThresholdValue: null,
                targetSensorType: 0
            };
            }
        }
    let [Days,setDays]=useState({
        Mon:0,
        Tue:0,
        Wed:0,
        Thu:0,
        Fri:0,
        Sat:0,
        Sun:0,
    })
    function sumDaysValue(){
        return Object.values(Days).reduce((acc, curr) => acc + (curr || 0), 0);
    }
    
    const validationSchema=object({
                name:string().required("Name is required").min(3,"Farm Location must be at least 3 characters").max(100,"Farm Location can not be than 100 characters"),
                type:number().required("Type is required"),
            });
            async function sendAutomationRule(values){
                try {
                    const options={
                        url:`${baseUrl}/farms/${children.farm.farmId}/fields/${children.field.id}/AutomationRules`,
                        method:"POST",
                        data:values,
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                    let {data}=await axios(options);
                    console.log("sendIrrigationUnit",data);
                    setControlIrrigationPage(null)
                    children.getAutomation()
                }catch(error){
                    // toast.error("Incorrect email or password "+error);
                    console.log(error)
                }
            }
        const formik=useFormik({
            initialValues:{
            type:"",
            name:"",
            ...format()
            },
            validationSchema,
            onSubmit:sendAutomationRule,
        });
    useEffect(()=>{
        if(typeId===1){formik.values.activeDays=sumDaysValue()}
    },[Days])
    useEffect(()=>{
        formik.values.type=typeId;
        if(typeId==1){
            formik.values.targetSensorType=null
        }
        // if(typeId==0){
        //     formik.values.startTime="";
        //     formik.values.endTime="";
        //     formik.values.activeDays=null;
        // }else{
        //     formik.values.maxThresholdValue=null;
        //     formik.values.maxThresholdValue=null;
        //     formik.values.targetSensorType=null
        // }
    },[typeId])
    return (
        <section className='h-[100vh]  flex justify-center items-center bg-black bg-opacity-70  font-manrope  absolute z-50 w-[100%]' onClick={(e)=>{if(e.target==e.currentTarget){setControlIrrigationPage(null)}}}>
            <motion.div
                        initial={{ x: 0, y: 500, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{
                            delay:  0.2,
                            duration: 2,
                            type: "spring",
                            bounce: 0.4,
                            }} className="w-[650px] px-[40px] min-h-[500px]   border-2 rounded-2xl bg-white p-[20px]">
                <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setControlIrrigationPage(null)}}/>
                <div className="text-center  space-y-[15px]">
                    <h1 className="text-[23px] text-mainColor font-medium capitalize">add new Automation rule</h1>
                    <p className="text-[21px] text-[#616161] font-medium ">Add or edit an automation rule</p>
                </div>
                <form action="" className="w-[100%] mt-[20px] flex flex-col justify-between  pe-[10px] text-[18px] font-s flex-grow" onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col gap-3 ">
                            <div className="">
                                <label htmlFor="" className='ms-1'>Rule Name</label>
                                <input type="text" placeholder='Enter a name for the rule ' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                            </div>
                            <div className="">
                                <label htmlFor="" className='ms-1 '>Rule Type</label>
                                <MenuElement Items={type} nameChange={type[typeId]} className={"mt-[10px]"} index={typeId} setIndex={setTypeId} onList={onList} width={100+"%"} name={"Check Fields"} setOnList={setOnList} Pformat={"text-[#616161]"}/>
                            </div>
                            {typeId==1?<div className="">
                                <div className="">
                                    <label htmlFor="" className='ms-1'>Start Time</label>
                                    <input type='time' placeholder='00:00' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name='startTime' value={String(formik.values.startTime)} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </div>
                                <div className="">
                                    <label htmlFor="" className='ms-1'>End Time</label>
                                    <input type='time' placeholder='00:00' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name='endTime' value={formik.values.endTime} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </div>
                                <div className="">
                                    <label htmlFor="" className='ms-1'>Days</label>
                                    <div className="my-[10px] flex justify-between px-[15px] text-[18px] font-semibold">
                                        <div className="w-[40px] h-[40px] rounded-full bg-[#c2c2c23f] flex justify-center items-center  relative cursor-pointer " onClick={(e)=>{
                                            if(Days.Mon==0){setDays(prev=>({...prev,Mon:1}))}
                                            else{setDays(prev=>({...prev,Mon:0}))}
                                            e.target.children[0].classList.toggle("hidden")}}>
                                            <Check size={17} className=' text-mainColor absolute -top-2  -right-2 hidden'/>
                                            M</div>
                                        <div className="w-[40px] h-[40px] rounded-full bg-mainColor flex justify-center items-center text-white relative cursor-pointer " onClick={(e)=>{
                                            if(Days.Tue==0){setDays(prev=>({...prev,Tue:2}))}
                                            else{setDays(prev=>({...prev,Tue:0}))}
                                            e.target.children[0].classList.toggle("hidden")}}>
                                            <Check size={17} className=' text-mainColor absolute -top-2 -right-2 hidden'/>
                                            T</div>
                                        <div className="w-[40px] h-[40px] rounded-full bg-mainColor flex justify-center items-center text-white relative cursor-pointer " onClick={(e)=>{
                                            if(Days.Wed==0){setDays(prev=>({...prev,Wed:4}))}
                                            else{setDays(prev=>({...prev,Wed:0}))}
                                            e.target.children[0].classList.toggle("hidden")    
                                            }}>
                                            <Check size={17} className=' text-mainColor absolute -top-2 -right-2 hidden'/>
                                            W</div>
                                        <div className="w-[40px] h-[40px] rounded-full bg-[#c2c2c23f] flex justify-center items-center relative cursor-pointer " onClick={(e)=>{
                                            if(Days.Thu==0){setDays(prev=>({...prev,Thu:8}))}
                                            else{setDays(prev=>({...prev,Thu:0}))}
                                            e.target.children[0].classList.toggle("hidden")    
                                            }}>
                                            <Check size={17} className=' text-mainColor absolute -top-2 -right-2 hidden'/>
                                            T</div>
                                        <div className="w-[40px] h-[40px] rounded-full bg-[#c2c2c23f] flex justify-center items-center relative cursor-pointer " onClick={(e)=>{
                                            if(Days.Fri==0){setDays(prev=>({...prev,Fri:16}))}
                                            else{setDays(prev=>({...prev,Fri:0}))}
                                            e.target.children[0].classList.toggle("hidden")    
                                            }}>
                                            <Check size={17} className=' text-mainColor absolute -top-2 -right-2 hidden'/>
                                            F</div>
                                        <div className="w-[40px] h-[40px] rounded-full bg-mainColor flex justify-center items-center text-white relative cursor-pointer " onClick={(e)=>{
                                            if(Days.Sat==0){setDays(prev=>({...prev,Sat:32}))}
                                            else{setDays(prev=>({...prev,Sat:0}))}
                                            e.target.children[0].classList.toggle("hidden")    
                                            }}>
                                            <Check size={17} className=' text-mainColor absolute -top-2 -right-2 hidden'/>
                                            S</div>
                                        <div className="w-[40px] h-[40px] rounded-full bg-[#c2c2c23f] flex justify-center items-center relative cursor-pointer " onClick={(e)=>{
                                            if(Days.Sun==0){setDays(prev=>({...prev,Sun:64}))}
                                            else{setDays(prev=>({...prev,Sun:0}))}
                                            e.target.children[0].classList.toggle("hidden")    
                                            }}>
                                            <Check size={17} className=' text-mainColor absolute -top-2 -right-2 hidden'/>
                                            S</div>
                                    </div>
                                </div>
                            </div>:<div className="">
                                <div className="">
                                    <label htmlFor="" className='ms-1'>Start irrigation threshold</label>
                                    <input type="number" placeholder='50' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name='minThresholdValue' value={formik.values.minThresholdValue} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </div>
                                <div className="">
                                    <label htmlFor="" className='ms-1'>Stop irrigation threshold</label>
                                    <input type="number" placeholder='80' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name='maxThresholdValue' value={formik.values.maxThresholdValue} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                </div>
                                {/* <div className="">
                                    <label htmlFor="" className='ms-1'>Unit</label>
                                    <input type="text" placeholder='%' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] '/>
                                </div> */}
                            </div>}
                            
                            
                            
                            
                            
                        </div>
                        
                        <div className="flex justify-end items-center space-x-[16px] mt-[20px]">
                            <button type='button' className="py-[8px] px-[40px] border-[1px] border-[#616161] rounded-[12px]  text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setControlIrrigationPage("Step1AutomationRule")}}>
                                <div className="flex justify-center items-center space-x-[11px]">
                                    <p className="">Back</p>
                                </div>
                            </button>
                            <button type='submit'  className="py-[8px] px-[40px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium">
                                <div className="flex justify-center items-center space-x-[11px]">
                                    <p className="">Add</p>
                                </div>
                            </button>
                        </div>
                </form>
                
            </motion.div>
            
                
                
            
            
        </section>
    );
}

export default AutomationRuleStep2IrrigationPage;
