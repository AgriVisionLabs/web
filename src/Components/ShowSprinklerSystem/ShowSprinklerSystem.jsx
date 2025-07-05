import {Calendar, Cpu,Hash, MapPin, SquarePen, User, Wifi, Wrench, X } from 'lucide-react';
import{ useContext, useEffect, useState } from 'react';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import DateDisplay from '../DateDisplay/DateDisplay'
import TimeOnly from '../TimeOnly/TimeOnly';
import { AllContext } from '../../Context/All.context';

const ShowSprinklerSystem = (children) => {
    let {baseUrl}=useContext(AllContext)
    let {token}=useContext(userContext);
    let [irrigationUnit,setIrrigationUnit]=useState();
    let [memberRole,setMemberRole]=useState();
    let status=["Active","Idle","Maintenance"]
    //roleName
    async function getIrrigationUnit(){
            try {
                const options={
                    url:`${baseUrl}/farms/${children.farmID}/fields/${children.fieldID}/IrrigationUnits`,
                    method:"GET",
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
                let {data}=await axios(options);
                setIrrigationUnit(data)
                getMember(data.addedById)
                children.setShowIrr(data)
            }catch(error){
                // toast.error("Incorrect email or password "+error);
                console.log(error)
            }
    }
    async function getMember(memberId){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmID}/members/${memberId}`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            setMemberRole(data)
            children.setShowIrrMember(data)
            console.log("getMember: ",data)
        }catch(error){
            // toast.error("Incorrect email or password "+error);
            console.log("getMember: ",error)
        }
    }
    useEffect(()=>{getIrrigationUnit()
        
    },[])
    // useEffect(()=>{

    //     if(irrigationUnit){getMember()}},[memberRole])
    return (
        irrigationUnit?<section className='h-[100vh]  flex justify-center items-center bg-black bg-opacity-70  font-manrope  absolute z-50 w-[100%]' onClick={(e)=>{if(e.target==e.currentTarget){children.setIrrigationUnit(null)}}}>
            <div className="w-[800px] px-[40px] h-[800px]   border-2 rounded-2xl bg-white p-[20px] text-[#0D121C] font-manrope">
                <div className="">
                    <div className="flex justify-between items-center  mb-[20px]">
                        <div className="flex items-center space-x-[11px] ">
                            <Cpu size={28}/>
                            <h3 className="text-[24px] text-[#1E6930] capitalize font-semibold">{irrigationUnit.name}</h3>
                        </div>
                        <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{children.setIrrigationUnit(null)}}/>
                    </div>
                    <div className="flex justify-between items-center text-[19px] font-medium text-[#616161] capitalize  cursor-pointer ">
                        <h4 className="">sensor details</h4>
                        <div className="flex items-center space-x-[11px] py-[5px] px-[12px] border-[1px] border-[#9F9F9F] rounded-[5px] text-[17px]" onClick={()=>{children.setIrrigationUnit("step2")}}>
                            <SquarePen size={23} />
                            <p className="">edit</p>
                        </div>
                    </div>
                    <div className="mt-[12px] text-[18px] font-medium  flex justify-between items-center">
                        <div className="flex  space-x-[12px] text-[#0D121C]  ">
                            <p className="">Status: </p>
                            <h5 className="bg-[#25C462] rounded-[15px] px-[10px]  flex justify-center items-center text-[14px] font-semibold text-[#FFFFFF] capitalize">{status[irrigationUnit.status]}</h5>
                        </div>
                        <p className=" capitalize font-semibold">type : <span className="text-[#616161] font-medium">sprinkler</span></p>
                        
                    </div>
                    <div className="grid grid-cols-2 text-[18px] mt-[20px] space-y-[15px] font-medium capitalize">
                        <div className=" space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold">field & location</h5>
                            <div className="flex flex-col items-start space-x-[8px]">
                                <div className="flex items-center space-x-[8px]">
                                    <MapPin  className='text-[#616161] '/>
                                    <p className="">north field</p>
                                    
                                </div>
                                <p className="text-[#616161] ps-[24px]">fully coverage</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">serial number</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Hash  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.serialNumber}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">installation date</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Calendar  className='text-[#616161] '/>
                                <DateDisplay dateStr={irrigationUnit.installationDate}/>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">firmware version</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Cpu  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.firmWareVersion}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">iP address</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wifi  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.ipAddress}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">MAC address</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wifi  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.macAddress}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">last maintenance</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wrench className='text-[#616161] '/>
                                <DateDisplay dateStr={irrigationUnit.lastMaintenance}/>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">next maintenance</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Calendar  className='text-[#616161] '/>
                                <DateDisplay dateStr={irrigationUnit.nextMaintenance}/>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">added by</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <User  className='text-[#616161] '/>
                                <p className="">{irrigationUnit.addedBy}  </p>
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
        </section>:""
    );
}

export default ShowSprinklerSystem;
