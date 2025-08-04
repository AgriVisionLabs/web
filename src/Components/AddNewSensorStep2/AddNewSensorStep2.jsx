import { QrCode, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import { object, string } from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import QRFromImage from '../QRFromImage/QRFromImage';

const AddNewSensorStep2 = (children) => {
    let {setAddNewSensor,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    const [result, setResult] = useState('');
    const validationSchema=object({
                serialNumber:string().required("Serial Number is required").min(10,"Serial Number must be at least 10 characters").max(25,"Serial Number cannot be more than 25 characters"),
                name:string().required("Name is required").min(3,"Name must be at least 3 characters").max(100,"Name cannot be more than 100 characters"),
            });
            async function sendSensorUnit(values){
                console.log("sendSensorUnit",children.farmId)
                try {
                    const options={
                        url:`${baseUrl}/farms/${children.farmId}/fields/${children.field.id}/SensorUnits`,
                        method:"POST",
                        data:values,
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                    let {data}=await axios(options);
                    console.log("sendSensorUnit",data);
                    children.getSensorUnits();
                    setAddNewSensor(null);
                    toast.success("Sensor unit added successfully");
                }catch(error){
                    toast.error("Failed to add sensor unit: " + (error.response?.data?.message || error.message));
                    console.log(error)
                }
            }
        const formik=useFormik({
            initialValues:{
                serialNumber:"",
                name:"",
            },
            validationSchema,
            onSubmit:sendSensorUnit,
        });
    return (
        <section className='h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute z-50 w-[100%] p-4 sm:p-6' onClick={(e)=>{if(e.target==e.currentTarget){setAddNewSensor(null)}}}>
            <div className="w-full sm:w-[90%] md:w-[600px] lg:w-[650px] max-w-[650px] px-[16px] sm:px-[24px] lg:px-[40px] h-auto min-h-[380px] sm:min-h-[430px] lg:min-h-[480px] max-h-[90vh] overflow-y-auto border-2 rounded-xl sm:rounded-2xl bg-white p-[16px] sm:p-[20px]">
                <X size={24} className='sm:w-[28px] sm:h-[28px] lg:w-[33px] lg:h-[33px] ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setAddNewSensor(null)}}/>
                <div className="text-center mt-[12px] sm:mt-[16px] space-y-[16px] sm:space-y-[20px]">
                    <h1 className="text-[20px] sm:text-[22px] lg:text-[24px] text-mainColor font-medium capitalize">add new sensor</h1>
                </div>
                <form action="" className="w-[100%] my-[24px] sm:my-[32px] lg:my-[40px] flex flex-col justify-between text-[16px] sm:text-[18px] lg:text-[20px] flex-grow" onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col gap-4 sm:gap-5 my-4 sm:my-5">
                            <div className="">
                                <label htmlFor="" className='ms-1 text-[14px] sm:text-[15px] lg:text-[16px] font-medium'>Sensor unit name</label>
                                <input type="text" placeholder='Enter Sensor unit name' className={`formControl mx-0 rounded-xl text-[14px] sm:text-[16px] lg:text-[18px] py-3 sm:py-4 lg:py-5 w-[100%] ${formik.touched.name && formik.errors.name ? 'border-red-500 text-red-500' : 'border-[#0d121c21]'}`} name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                            </div>
                            
                            <div className="">
                                <label htmlFor="" className='ms-1 text-[14px] sm:text-[15px] lg:text-[16px] font-medium'>Serial Number</label>
                                <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2 sm:gap-3">
                                    <input type="text" placeholder='Enter Serial Number' className={`formControl mx-0 rounded-xl text-[14px] sm:text-[16px] lg:text-[18px] py-3 sm:py-4 lg:py-5 flex-1 ${formik.touched.serialNumber && formik.errors.serialNumber ? 'border-red-500 text-red-500' : 'border-[#0d121c21]'}`} name='serialNumber' value={formik.values.serialNumber||(formik.values.serialNumber=result)} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    <div className="flex justify-center items-center mx-0 rounded-xl text-[14px] sm:text-[16px] p-[8px] sm:p-[6px] w-full sm:w-16 lg:w-20 h-[45px] sm:h-auto border-[1px] border-[#0d121c21]">
                                        <QRFromImage setResult={setResult}/>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-[16px] mt-4 sm:mt-0">
                    <button type='button' className="py-[6px] sm:py-[8px] px-[24px] sm:px-[30px] border-[1px] border-[#616161] rounded-[12px] text-[14px] sm:text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium w-full sm:w-auto" onClick={()=>{setAddNewSensor("Step1")}}>
                        <div className="flex justify-center items-center space-x-[8px] sm:space-x-[11px]">
                            <p className="">Back</p>
                        </div>
                    </button>
                    <button type='submit'  className="py-[6px] sm:py-[8px] px-[24px] sm:px-[30px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[14px] sm:text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium w-full sm:w-auto">
                        <div className="flex justify-center items-center space-x-[8px] sm:space-x-[11px]">
                            <p className="">save</p>
                        </div>
                    </button>
                </div>
                </form>
                
            </div>
            
                
                
            
            
        </section>
    );
}

export default AddNewSensorStep2;
