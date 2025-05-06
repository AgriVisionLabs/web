import { Calendar, CircleCheckBig, Wrench, X } from 'lucide-react';
import  { useContext } from 'react';
import { AllContext } from '../../Context/All.context';

const LogMaintenanceSD = () => {
    let {setSchedule}=useContext(AllContext);
    return (
        <section className='h-[100vh]  flex justify-center items-center bg-black bg-opacity-70  font-manrope  absolute z-50 w-[100%]' onClick={(e)=>{if(e.target==e.currentTarget){setSchedule(null)}}}>
            <div className="w-[700px] px-[40px] h-[720px]   border-2 rounded-2xl bg-white p-[20px] text-[#0D121C] font-manrope">
                <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setSchedule(null)}}/>
                <div className=" mt-[16px] space-y-[15px] mb-[45px]">
                    <h1 className="text-[24px]  font-semibold capitalize">Log Maintenance for Sensor Unit A1</h1>
                    <p className="text-[19px] text-[#616161]  font-medium ">Log maintenance that has been performed on this device.</p>
                </div>
                <div className="grid grid-cols-2 gap-x-[24px] mb-[20px]">
                    <button type='button' className="py-[12px] px-[40px]  border-[1px] border-mainColor rounded-[12px] text-mainColor  text-[18px]  hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-semibold" onClick={()=>{setSchedule("ScheduleMaintenan")}}>
                            <div className="flex justify-center items-center space-x-[11px]">
                                <Calendar />
                                <p className="">Schedule</p>
                        </div>
                    </button>
                    <button type='button'  className="py-[12px] px-[40px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[18px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-semibold">
                        <div className="flex justify-center items-center space-x-[11px]">
                            <CircleCheckBig />
                            <p className="">Log Completed</p>
                            
                        </div>
                    </button>
                </div>
                <form action="" className='space-y-[10px]'>
                    <div className=" ">
                        <label htmlFor="" className='text-[20px]  font-semibold '>Completion Date</label>
                        <input type="date" placeholder='06/04/2025' className='formControl text-[18px]  font-light placeholder:text-[#0D121C]   mx-0 h-[50px] rounded-[15px] w-full' />
                    </div>
                    <div className=" ">
                        <label htmlFor="" className='text-[20px]  font-semibold '>Maintenance Plan</label>
                        <textarea name="" id="" placeholder='Describe the maintenance that was performed...' className='formControl min-h-[151px] text-[18px]   placeholder:text-[#9F9F9F]   mx-0  rounded-[15px] w-full'></textarea>
                    </div>
                </form>
                <div className="flex items-center space-x-[11px] text-[18px] text-[#616161] font-medium">
                    <Wrench />
                    <p className="">Last maintenance date: 10/03/2024</p>
                </div>
                <div className="flex justify-end items-center space-x-[16px] my-[40px]">
                    <button type='button' className="py-[10px] px-[40px] border-[1px] border-[#616161] rounded-[12px]  text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setSchedule(null)}}>
                        <div className="flex justify-center items-center space-x-[11px]">
                            <p className="">Cancel</p>
                        </div>
                    </button>
                    <button type='button'  className="py-[10px]  px-[20px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium">
                        <div className="flex justify-center items-center space-x-[11px]">
                            <p className="">Log Maintenance</p>
                        </div>
                    </button>
                </div>
            </div>
            
                
                
            
            
        </section>
    );
}

export default LogMaintenanceSD;
