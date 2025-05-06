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
    let {setAddNewSensor}=useContext(AllContext);
    let {token}=useContext(userContext);
    const [result, setResult] = useState('');
    const validationSchema=object({
                serialNumber:string().required("serialNumber is required"),
                name:string().required("Name is required").min(3,"Farm Location must be at least 3 characters").max(100,"Farm Location can not be than 100 characters"),
            });
            async function sendSensorUnit(values){
                console.log("sendSensorUnit",children.farmId)
                try {
                    const options={
                        url:`https://agrivision.tryasp.net/farms/${children.farmId}/fields/${children.field.id}/SensorUnits`,
                        method:"POST",
                        data:values,
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                    let {data}=await axios(options);
                    console.log("sendSensorUnit",data);
                    children.getSensorUnits()
                }catch(error){
                    toast.error("Incorrect email or password "+error);
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
        <section className='h-[100vh]  flex justify-center items-center bg-black bg-opacity-70  font-manrope  absolute z-50 w-[100%]' onClick={(e)=>{if(e.target==e.currentTarget){setAddNewSensor(null)}}}>
            <div className="w-[650px] px-[40px] h-[480px]   border-2 rounded-2xl bg-white p-[20px]">
                <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setAddNewSensor(null)}}/>
                <div className="text-center mt-[16px] space-y-[20px]">
                    <h1 className="text-[24px] text-mainColor font-medium capitalize">add new sensor</h1>
                </div>
                <form action="" className="w-[100%] my-[40px] flex flex-col justify-between  text-[20px]  flex-grow" onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col gap-3 my-5">
                            <div className="">
                                <label htmlFor="" className='ms-1'>Sensor unit name</label>
                                <input type="text" placeholder='Enter Sensor unit name ' className='formControl mx-0 rounded-xl text-[18px] py-5 w-[100%] border-[#0d121c21] ' name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                            </div>
                            
                            <div className="">
                                <label htmlFor="" className='ms-1'>Serial Number</label>
                                <div className="flex justify-center items-center gap-3">
                                    <input type="text" placeholder='Enter Serial Number' className='formControl mx-0 rounded-xl text-[18px] py-5  border-[#0d121c21] ' name='serialNumber' value={formik.values.serialNumber||(formik.values.serialNumber=result)} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    <div className="flex justify-center items-center mx-0 rounded-xl text-[16px] p-[6px] w-20  border-[1px] border-[#0d121c21]">
                                        <QRFromImage setResult={setResult}/>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="flex justify-end items-center space-x-[16px] ">
                    <button type='button' className="py-[8px] px-[30px] border-[1px] border-[#616161] rounded-[12px]  text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setAddNewSensor("Step1")}}>
                        <div className="flex justify-center items-center space-x-[11px]">
                            <p className="">Back</p>
                        </div>
                    </button>
                    <button type='submit'  className="py-[8px] px-[30px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium">
                        <div className="flex justify-center items-center space-x-[11px]">
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
