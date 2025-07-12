import { LogOut, Shield } from 'lucide-react';
import  { useContext } from 'react';
import { AllContext } from '../../Context/All.context';

const Security = () => {
    let {toggleButton}=useContext(AllContext)
    return (
        <section className='mb-[30px]'>
            <div className=" border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]  p-[20px] ">
                <div className="">
                    <div className="flex space-x-2 items-center text-[#0D121C]  mb-[10px]">
                        <Shield size={25} strokeWidth={1.8}/>
                        <h2 className="text-[19px] font-medium ">Security Settings</h2>
                    </div>
                    <p className="text-[#9F9F9F] text-[16px] font-medium">Manage your account security and authentication methods.</p>
                </div>
                <div className="flex space-x-2 items-center justify-between mt-[25px]">
                    <div className=" text-[#0D121C] ">
                        <h3 className="text-[17px] font-medium  mb-[10px]">Two-Factor Authentication</h3>
                        <p className="text-[#9F9F9F] text-[15px] font-medium">Add an extra layer of security to your account</p>
                    </div>
                    <div className=' w-[50px] h-[28px] rounded-2xl  flex items-center px-1 transition-all duration-300 bg-[#5e5e5f21]  cursor-pointer'onClick={(e)=>{
                                        toggleButton(e)
                                    }} >
                        <div className="h-[23px] w-[23px] bg-white rounded-full  transition-all duration-700  "></div>
                    </div>
                </div>
                <div className="mt-[20px]">
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                            <h3 className="mb-[10px] text-[17px] font-semibold">Password</h3>
                            <div className="flex justify-between items-center ">
                                <div className="flex space-x-1">
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                    <div className="rounded-full h-[5px] w-[5px] bg-black"></div>
                                </div>
                                <button type='button' className="py-[4px] px-[20px] border-[1px] border-[#616161] rounded-[12px]  text-[15px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{}}>
                                    <div className="flex justify-center items-center space-x-[11px]">
                                        <p className="">Change Password</p>
                                    </div>
                                </button>
                            </div>
                    </div>
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                            <h3 className="mb-[10px] text-[17px] font-semibold">Last Login</h3>
                            <p className="text-[15px]">April 18, 2025, 2:45 PM</p>
                    </div>
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                        <button type='button' className="py-[12px] px-[20px] w-full border-[1px] border-[#616161] rounded-[12px]  text-[18px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{}}>
                            <div className="flex justify-center items-center space-x-[11px]">
                                <LogOut/>
                                <p className="">Logout from all devices</p>
                            </div>
                        </button>
                    </div>
                </div>
                
            </div>
            
        </section>
    );
}

export default Security;
