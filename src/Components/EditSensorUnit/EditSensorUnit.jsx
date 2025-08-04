import { Calendar, Cpu, Droplet, Hash, MapPin, Thermometer, User, Wifi, Wind, Wrench, X, Zap } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
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
    let [isSubmitting, setIsSubmitting] = useState(false);
    let sensorUnit=children.ShowIrr ;
    let sensorMember=children.ShowIrrMember;
    let status=["Active","Idle","Maintenance"];
    let allFields=children.Fields.map((Field)=>{return Field.name})
    let allFieldsID=children.Fields.map((Field)=>{return Field.id})
    console.log("EditSensorUnit loaded")
    let [statusIndex,setStatusIndex]=useState(sensorUnit.status);
    console.log("statusIndex ",statusIndex)
    let [fieldIndex,setFieldIndex]=useState(0);
    
    const validationSchema=object({
        name:string().required("Name is required").min(3,"Name must be at least 3 characters").max(50,"Name cannot be more than 50 characters"),
        status:number().required("Status is required").min(0,"Invalid status").max(2,"Invalid status"),
        newFieldId:string().required("Field is required").uuid("Invalid field ID")
    });
    
    async function updateSensorUnit(values){
        console.log("updateSensorUnit called with values:", values)
        setIsSubmitting(true);
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
            console.log("updateSensorUnit success:",data);
            
            // Try to refresh the parent component data (don't let this fail the whole operation)
            try {
                if (children.getSensorUnit) {
                    await children.getSensorUnit();
                }
            } catch (refreshError) {
                console.warn("Failed to refresh sensor data:", refreshError);
                // Don't show error toast for refresh failures
            }
            
            toast.success("Sensor unit updated successfully!");
            setSchedule("ShowSensorUnit");

        }catch(error){
            console.error("updateSensorUnit error:", error);
            if(error?.response?.data?.errors?.length > 0){
                toast.error(error.response.data.errors[0].description);
            } else if(error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to update sensor unit. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const formik=useFormik({
        initialValues:{
            name:sensorUnit.name || "",
            status:sensorUnit.status,
            newFieldId:sensorUnit.fieldId || ""
        },
        validationSchema,
        onSubmit:updateSensorUnit,
    });
    
    // Initialize field index
    useEffect(()=>{
        console.log("Initializing field index");
        setStatusIndex(sensorUnit.status);
        
        // Find the correct field index (0-based)
        const foundIndex = children.Fields.findIndex(field => field.id === sensorUnit.fieldId);
        if (foundIndex !== -1) {
            setFieldIndex(foundIndex);
        }
    },[sensorUnit, children.Fields]);
    
    // Update formik values when dropdowns change
    useEffect(()=>{
        if (statusIndex !== null) {
            formik.setFieldValue('status', statusIndex);
        }
        if (fieldIndex !== null && allFieldsID[fieldIndex]) {
            formik.setFieldValue('newFieldId', allFieldsID[fieldIndex]);
        }
    },[statusIndex, fieldIndex]);
    
    return (
        children.ShowIrr?<section className='h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute z-50 w-[100%] p-4 sm:p-6' onClick={(e)=>{if(e.target==e.currentTarget){setSchedule(null)}}}>
            <div className="w-full sm:w-[90%] md:w-[700px] lg:w-[800px] max-w-[800px] px-[16px] sm:px-[24px] lg:px-[40px] h-[90vh] sm:h-[85vh] lg:h-[780px] max-h-[90vh] overflow-y-auto border-2 rounded-xl sm:rounded-2xl bg-white py-[8px] sm:py-[10px] text-[#0D121C] font-manrope">
                <form onSubmit={formik.handleSubmit} className="h-full">
                    <div className="flex justify-between items-center mb-[15px]">
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-[11px]">
                                <Cpu size={28}/>
                                <input 
                                    className={`formControl w-[300px] h-[40px] rounded-[8px] capitalize text-[15px] border-[1px] px-[10px] ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder='Sensor unit name' 
                                    name='name' 
                                    value={formik.values.name} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-[13px] mt-[5px] ml-[39px]">{formik.errors.name}</p>
                            )}
                        </div>
                        <X size={33} className='ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setSchedule(null)}}/>
                    </div>
                    
                    <div className="flex justify-between items-center text-[19px] font-medium text-[#616161] capitalize cursor-pointer">
                        <h4>sensor details</h4>
                        <div className="flex justify-end items-center space-x-[16px]">
                            <button 
                                type='button' 
                                className="py-[5px] px-[20px] border-[1px] border-[#616161] rounded-[12px] text-[15px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" 
                                onClick={()=>{setSchedule("ShowSensorUnit")}}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button 
                                type='submit'  
                                className={`py-[5px] px-[10px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-[12px] text-[18px] font-medium flex justify-between items-center">
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-[12px] text-[#0D121C]">
                                <p>Status: </p>
                                <MenuElement 
                                    Items={status} 
                                    nameChange={status[statusIndex]}  
                                    setIndex={setStatusIndex}  
                                    onList={onList} 
                                    width={218+"px"}  
                                    setOnList={setOnList} 
                                    Pformat={"text-[#0D121C] font-[400]"}
                                />
                            </div>
                            {formik.touched.status && formik.errors.status && (
                                <p className="text-red-500 text-[13px] mt-[5px]">{formik.errors.status}</p>
                            )}
                        </div>
                        <p className="capitalize font-semibold">type : <span className="text-[#616161] font-medium">sensor</span></p>
                    </div>
                    
                    <div className="grid grid-cols-2 text-[16px] mt-[20px] gap-y-[15px] font-medium capitalize">
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">field & location</h5>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-[8px]">
                                    <MapPin className='text-[#616161]'/>
                                    <MenuElement 
                                        Items={allFields} 
                                        nameChange={allFields[fieldIndex]} 
                                        setIndex={setFieldIndex}  
                                        onList={onList1} 
                                        width={218+"px"}  
                                        setOnList={setOnList1} 
                                        Pformat={"text-[#0D121C] font-[400]"}
                                    />
                                </div>
                                {formik.touched.newFieldId && formik.errors.newFieldId && (
                                    <p className="text-red-500 text-[13px] mt-[5px] ml-[28px]">{formik.errors.newFieldId}</p>
                                )}
                                <p className="text-[#616161] ml-[28px] mt-[5px]">full coverage</p>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">serial number</h5>
                            <div className="flex items-center space-x-[8px]">
                                <Hash className='text-[#616161]'/>
                                <p>{sensorUnit.serialNumber}</p>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">installation date</h5>
                            <div className="flex items-center space-x-[8px]">
                                <Calendar className='text-[#616161]'/>
                                <DateDisplay dateStr={sensorUnit.installationDate}/>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">firmware version</h5>
                            <div className="flex items-center space-x-[8px]">
                                <Cpu className='text-[#616161]'/>
                                <p>{sensorUnit.firmWareVersion}</p>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">IP address</h5>
                            <div className="flex items-center space-x-[8px]">
                                <Wifi className='text-[#616161]'/>
                                <p>{sensorUnit.ipAddress}</p>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">MAC address</h5>
                            <div className="flex items-center space-x-[8px]">
                                <Wifi className='text-[#616161]'/>
                                <p>{sensorUnit.macAddress}</p>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">last maintenance</h5>
                            <div className="flex items-center space-x-[8px]">
                                <Wrench className='text-[#616161]'/>
                                <DateDisplay dateStr={sensorUnit.lastMaintenance}/>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">next maintenance</h5>
                            <div className="flex items-center space-x-[8px]">
                                <Calendar className='text-[#616161]'/>
                                <DateDisplay dateStr={sensorUnit.nextMaintenance}/>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-mainColor mb-[5px] font-semibold">added by</h5>
                            <div className="flex items-center space-x-[8px]">
                                <User className='text-[#616161]'/>
                                <p>{sensorUnit.addedBy} ({sensorMember?.roleName || 'Unknown'})</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t-[1px] border-[#9F9F9F] mt-[20px] pt-[15px]">
                        <p className="text-[#616161] text-[18px] font-medium capitalize mb-[10px] text-center">last reading</p>
                        <div className="h-[135px] bg-[#9f9f9f27] rounded-[15px] py-[15px]">
                            <div className="grid grid-cols-3 mb-[15px]">
                                <div className="flex flex-col items-center">
                                    <Droplet className="text-[#089FFC]"/>
                                    <p className="text-[14px] font-semibold">{String(sensorUnit.moisture).split(".")[0]}%</p>
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
                            <p className="text-[16px] text-[#616161] text-center font-semibold">
                                Last updated: <DateDisplay dateStr={sensorUnit.lastUpdated || sensorUnit.installationDate}/> at <TimeOnly dateStr={sensorUnit.lastUpdated || sensorUnit.installationDate}/>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </section>:null
    );
}

export default EditSensorUnit;
