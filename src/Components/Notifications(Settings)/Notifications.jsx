import { Bell} from 'lucide-react';
import { AllContext } from '../../Context/All.context';
import { useContext } from 'react';
const Notifications = () => {
    let {toggleButton}=useContext(AllContext)
    return (
        <section className='mb-[30px]'>
            <div className=" border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]  px-[20px] pt-[20px] pb-[20px]">
                <div className="">
                    <div className="flex space-x-2 items-center text-[#0D121C]  mb-[10px]">
                        <Bell size={25} strokeWidth={1.8}/>
                        <h2 className="text-[19px] font-medium ">Notifications</h2>
                    </div>
                    <p className="text-[#9F9F9F] text-[16px] font-medium">Control what notifications you receive and how they are delivered.</p>
                </div>
                <div className="flex space-x-2 items-center justify-between mt-[10px] border-b-[1px] border-[#0d121c3c] py-[15px]">
                    <div className=" text-[#0D121C] ">
                        <h3 className="text-[17px] font-medium  mb-[8px]">System Alerts</h3>
                        <p className="text-[#9F9F9F] text-[14px] font-medium">Receive notifications about invites, irrigation failures, and system status</p>
                    </div>
                    <div className=' w-[50px] h-[28px] rounded-2xl  flex items-center px-1 transition-all duration-300 bg-[#5e5e5f21]  cursor-pointer'onClick={(e)=>{ toggleButton(e)}} >
                        <div className="h-[23px] w-[23px] bg-white rounded-full  transition-all duration-700  "></div>
                    </div>
                </div>
                <div className="flex space-x-2 items-center justify-between mt-[10px] border-b-[1px] border-[#0d121c3c] py-[15px]">
                    <div className=" text-[#0D121C] ">
                        <h3 className="text-[17px] font-medium  mb-[8px]">Updates & Announcements</h3>
                        <p className="text-[#9F9F9F] text-[14px] font-medium">Stay informed about new features, improvements, and important announcements</p>
                    </div>
                    <div className=' w-[50px] h-[28px] rounded-2xl  flex items-center px-1 transition-all duration-300 bg-[#5e5e5f21]  cursor-pointer'onClick={(e)=>{ toggleButton(e)}} >
                        <div className="h-[23px] w-[23px] bg-white rounded-full  transition-all duration-700  "></div>
                    </div>
                </div>
                <div className="flex space-x-2 items-center justify-between mt-[10px] border-b-[1px] border-[#0d121c3c] py-[15px]">
                    <div className=" text-[#0D121C] ">
                        <h3 className="text-[17px] font-medium  mb-[8px]">Tips & Best Practices</h3>
                        <p className="text-[#9F9F9F] text-[14px] font-medium">Receive helpful tips and best practices to get the most out of the platform</p>
                    </div>
                    <div className=' w-[50px] h-[28px] rounded-2xl  flex items-center px-1 transition-all duration-300 bg-[#5e5e5f21]  cursor-pointer'onClick={(e)=>{ toggleButton(e)}} >
                        <div className="h-[23px] w-[23px] bg-white rounded-full  transition-all duration-700  "></div>
                    </div>
                </div>
                <div className="flex space-x-2 items-center justify-between mt-[10px] py-[15px]">
                    <button type='button' className="py-[12px] px-[20px] w-full border-[1px] border-[#616161] rounded-[12px]  text-[18px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{}}>
                            <p className="">Disable All Notifications</p>
                        </button>
                </div>
            </div>
            
        </section>
    );
}

export default Notifications;
