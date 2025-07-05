import { useContext, useEffect, useState } from 'react';
import MenuElement from '../MenuElement/MenuElement';
import { X } from 'lucide-react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddIrrigationStep1IrrigationPage = (children) => {
    //let {baseUrl}=useContext(AllContext)
    let fields=children.fields.map((field)=>{return field.name})
    let {onListAddNewSensorStep1,setOnListAddNewSensorStep1,setControlIrrigationPage }=useContext(AllContext);
    // let {token}=useContext(userContext)
    // async function getFields(){
    //         try {
    //             const options={
    //                 url:`${baseUrl}/farms/${children.farmfarmId}/Fields`,
    //                 method:"GET",
    //                 headers:{
    //                     Authorization:`Bearer ${token}`,
    //                 }
    //             }
    //             let {data}=await axios(options);
    //             setFields(data.name);
    //         }catch(error){
    //             toast.error("Incorrect email or password "+error);
    //             console.log(error)
    //         }
    //     }
    //     useEffect(()=>{getFields()},[]);
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
                            }} className="w-[650px] h-[400px]   border-2 rounded-2xl bg-white p-[20px]">
                <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setControlIrrigationPage(null)}}/>
                <div className="text-center mt-[16px] space-y-[20px]">
                    <h1 className="text-[24px] text-mainColor font-medium capitalize">add new irrigation unit</h1>
                    <p className="text-[22px] text-[#616161] font-medium ">Add a new irrigation unit to a field</p>
                </div>
                <div className="px-3 mt-[35px] ">
                    <h4 className="text-[20px] font-medium mb-[16px]">Field</h4>
                    <MenuElement Items={fields} nameChange={fields[children.indexIRRS1]} setIndex={children.setIndexIRRS1} index={children.indexIRRS1} onList={onListAddNewSensorStep1} width={100+"%"} name={"Check Fields"} setOnList={setOnListAddNewSensorStep1} Pformat={"text-[#616161]"}/>
                </div>
                <div className="flex justify-end items-center space-x-[16px] mt-[50px]">
                    <button type='button' className="py-[8px] px-[30px] border-[1px] border-[#616161] rounded-[12px]  text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setControlIrrigationPage(null)}}>
                        <div className="flex justify-center items-center space-x-[11px]">
                            <p className="">Cancel</p>
                        </div>
                    </button>
                    <button type='button'  className="py-[8px] px-[40px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setControlIrrigationPage("Step2Irrigation")}}>
                        <div className="flex justify-center items-center space-x-[11px]">
                            <p className="">Next</p>
                        </div>
                    </button>
                </div>
            </motion.div>
            
                
                
            
            
        </section>
    );
}

export default AddIrrigationStep1IrrigationPage;
