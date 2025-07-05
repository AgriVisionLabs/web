import { Battery, Calendar, Cpu, Droplet, Hash, MapPin, Thermometer, User, Wifi, Wind, Wrench, X, Zap } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { Line } from 'rc-progress';
import MenuElement from '../MenuElement/MenuElement';
import { userContext } from '../../Context/User.context';
import { number, object, string } from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import DateDisplay from '../DateDisplay/DateDisplay';
import TimeOnly from '../TimeOnly/TimeOnly';
const EditSensorUnit = (children) => {
    let {setSchedule,baseUrl}=useContext(AllContext);
        let {token}=useContext(userContext);
        let [onList,setOnList]=useState(null);
        let [onList1,setOnList1]=useState(null);
        let sensorUnit=children.ShowIrr ;
        let sensorMember=children.ShowIrrMember;
        let status=["Active","Idle","Maintenance"];
        let allFields=children.Fields.map((Field)=>{return Field.name})
        let allFieldsID=children.Fields.map((Field)=>{return Field.id})
        console.log("updateIrrigationUnit")
        let [statusIndex,setStatusIndex]=useState(sensorUnit.status);
        console.log("statusIndex ",statusIndex)
        let [fieldIndex,setFieldIndex]=useState(null);
        const validationSchema=object({
            name:string().required("Name is required").min(3,"Farm Location must be at least 3 characters").max(100,"Farm Location can not be than 100 characters"),
            status:number().required("status is required"),
            newFieldId:string().required("Name is required")
        });
        async function updateSensorUnit(values){
            console.log("updateIrrigationUnit")
            try {
                const options={
                    url:`${baseUrl}/farms/${sensorUnit.farmId}/fields/${sensorUnit.fieldId}/SensorUnits/${children.sensorUnitId}`,
                    method:"PUT",
                    data:values,
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
                let {data}=await axios(options);
                console.log("updateIrrigationUnit",data);
                children.getSensorUnit()
                setSchedule(null)

            }catch(error){
                toast.error("Incorrect email or password "+error);
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
        onSubmit:updateSensorUnit,
    });
    useEffect(()=>{
        let count=0;
        
        setStatusIndex(sensorUnit.status)
        for(let item of children.Fields){
            count=count+1;
            if(item.id==sensorUnit.fieldId){
                setFieldIndex(count)
            }
        }
    },[])
    useEffect(()=>{
        formik.values.status=statusIndex
        formik.values.newFieldId=allFieldsID[fieldIndex]
    },[statusIndex,fieldIndex])
    useEffect(()=>{
        formik.values.name=sensorUnit.name
    },[])
    return (
        children.ShowIrr?<section className='h-[100vh]  flex justify-center items-center bg-black bg-opacity-70  font-manrope  absolute z-50 w-[100%]' onClick={(e)=>{if(e.target==e.currentTarget){setSchedule(null)}}}>
            <div className="w-[800px] px-[40px] h-[780px]   border-2 rounded-2xl bg-white py-[10px]   text-[#0D121C] font-manrope">
                <div className="">
                <form action="" className="" onSubmit={formik.handleSubmit}>
                    <div className="flex justify-between items-center  mb-[15px]">
                        <div className="flex items-center space-x-[11px] ">
                            <Cpu size={28}/>
                                <input htmlFor="" className='formControl w-[300px] h-[40px] rounded-[8px] capitalize text-[15px]' placeholder='sensor unit a1' name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                <p className="">{formik.errors.name||formik.errors.newFieldId||formik.errors.status}</p>
                        </div>
                        <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setSchedule(null)}}/>
                    </div>
                    <div className="flex justify-between items-center text-[19px] font-medium text-[#616161] capitalize  cursor-pointer ">
                        <h4 className="">sensor details</h4>
                        <div className="flex items-center space-x-[11px] py-[5px] px-[12px]text-[17px]">
                            
                            <div className="flex justify-end items-center space-x-[16px] ">
                            <button type='button' className="py-[5px] px-[20px] border-[1px] border-[#616161] rounded-[12px]  text-[15px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setSchedule("ShowSensorUnit")}}>
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
                                <p className="">{sensorUnit.serialNumber}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">installation date</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Calendar  className='text-[#616161] '/>
                                <DateDisplay dateStr={sensorUnit.installationDate}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">firmware version</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Cpu  className='text-[#616161] '/>
                                <p className="">{sensorUnit.firmWareVersion}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">iP address</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wifi  className='text-[#616161] '/>
                                <p className="">{sensorUnit.ipAddress}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">MAC address</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wifi  className='text-[#616161] '/>
                                <p className="">{sensorUnit.macAddress}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">last maintenance</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Wrench className='text-[#616161] '/>
                                <DateDisplay dateStr={sensorUnit.lastMaintenance}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">next maintenance</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <Calendar  className='text-[#616161] '/>
                                <DateDisplay dateStr={sensorUnit.nextMaintenance}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">battery level</h5>
                            <div className="flex  items-center space-x-[8px]  font-medium my-[12px] ">
                                <Battery className='text-[#616161] '/>
                                <Line percent={sensorUnit.batteryLevel} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] w-[80px] text-mainColor  rounded-lg" />
                                <p>{sensorUnit.batteryLevel}%</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[5px] font-semibold ">added by</h5>
                            <div className="flex items-center  space-x-[8px]">
                                <User  className='text-[#616161] '/>
                                <p className="">{sensorUnit.addedBy} (farm {sensorMember.roleName})</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="border-t-[1px] border-[#9F9F9F] mt-[7px]">
                    <p className="text-[#616161] text-[18px] font-medium capitalize my-[10px] text-center">last reading</p>
                    <div className="h-[135px] bg-[#9f9f9f27] rounded-[15px] py-[15px]">
                        <div className="grid grid-cols-3 mb-[15px]">
                            <div className="flex flex-col items-center">
                                <Droplet className="text-[#089FFC]"/>
                                <p className="text-[14px] font-semibold">{sensorUnit.moisture}%</p>
                                <p className="text-[#757575] text-[14px] font-medium capitalize">moisture</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Thermometer className="text-[#D12A00]"/>
                                <p className="text-[14px] font-semibold">{sensorUnit.temperature}°C</p>
                                <p className="text-[#757575] text-[14px] font-medium capitalize">temp</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Wind className="text-[#25C462]"/>
                                <p className="text-[14px] font-semibold">{sensorUnit.humidity}%</p>
                                <p className="text-[#757575] text-[14px] font-medium capitalize">humidity</p>
                            </div>
                        </div>
                        <p className="text-[16px] text-[#616161] text-center font-semibold  ">Last updated: <DateDisplay dateStr={sensorUnit.installationDate}/> at <TimeOnly dateStr={sensorUnit.installationDate}/></p>
                    </div>
                </div>
                    
            </div>
            
                
                
            
            
        </section>:null
    );
}

export default EditSensorUnit;
