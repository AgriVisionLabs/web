import { Calendar, CreditCard, X } from 'lucide-react';
import visaImage from "../../assets/images/visa-desktop.png"
import { useState } from 'react';
import AddBankCard from '../AddBankCard/AddBankCard';

const Subscription = () => {
    let [upgrade,setUpgrade]=useState(false)
    let [bankCard,setBankCard]=useState();
    return (<>
        
        {upgrade?
        <section >
            <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]  px-[20px] pt-[20px] pb-[50px]">
                <div className="flex justify-between items-center mb-[40px]">
                <p className="font-semibold text-[18px]">Available Subscriptions</p>
                <X size={30} className='hover:text-red-600 transition-all duration-300' onClick={()=>{setUpgrade(false)}}/>
                </div>
                <div className="grid grid-cols-12 gap-5 ">
                        <div className="w-full flex flex-col justify-between  rounded-[15px] border-[1px] border-[#9F9F9F] px-4 py-7 space-y-3 col-span-4">
                            <div className="">
                                    <div className="font-manrope my-1 ">
                                    <header className="font-manrope text-[17px] flex justify-between items-center mb-3">
                                        <h3 className="font-semibold ">Basic</h3>
                                        <p className="font-medium text-mainColor text-[16px]">Free</p>
                                    </header>
                                    <div className="flex items-baseline space-x-1 pb-2 ">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">1 farm</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Up to 3 Fields</p>
                                    </div>
                                </div>
                                <div className="font-manrope">
                                    <header className="font-manrope text-[17px]  mb-3">
                                        <h3 className="font-semibold ">Features:</h3>
                                    </header>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Access to the dashboard for farm and field management.</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Basic soil health and weather insights.</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">AI-powered disease detection for limited usage</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2">
                            <button className="w-full rounded-2xl   btn bg-[#898989] text-white hover:bg-zinc-600 text-[16px] font-medium">Selected</button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-between rounded-[15px] border-[1px] border-[#9F9F9F] px-4 py-7 space-y-3 col-span-4">
                            <div className="">
                                <div className="font-manrope my-1 ">
                                <header className="font-manrope text-[17px] flex justify-between items-center mb-3">
                                    <h3 className="font-semibold ">Advanced</h3>
                                    <p className="font-medium text-mainColor text-[16px]">499.99 L.E / month</p>
                                </header>
                                <div className="flex items-baseline space-x-1 pb-2 ">
                                <i className="fa-solid fa-check text-mainColor"></i>
                                <p className="font-medium text-[16px] capitalize">Up to 3 farms</p>
                                </div>
                                <div className="flex items-baseline space-x-1 pb-2">
                                <i className="fa-solid fa-check text-mainColor"></i>
                                <p className="font-medium text-[16px] capitalize">5 fields per farm</p>
                                </div>
                                </div>
                                <div className="font-manrope ">
                                    <header className="font-manrope text-[17px]  mb-3">
                                        <h3 className="font-semibold">Features:</h3>
                                    </header>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">All Free Plan features.</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Advanced analytics and predictive insights.</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Unlimited AI-powered disease detection.</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Customizable automation rules for irrigation and sensor integration.</p>
                                    </div>
                                </div>
                                </div>
                                <div className="px-2">
                                <button className="w-full rounded-2xl   btn bg-mainColor text-white hover:bg-green-900 text-[16px] font-medium" onClick={()=>{setBankCard(true)}}>Change</button>
                                </div>
                        </div>
                        <div className="w-full flex flex-col justify-between rounded-[15px] border-[1px] border-[#9F9F9F] px-4 py-7 space-y-3 col-span-4">
                            <div className="">
                                    <div className="font-manrope my-1 ">
                                    <header className="font-manrope text-[17px] flex justify-between items-center mb-3">
                                        <h3 className="font-semibold ">Enterprise</h3>
                                        <p className="font-medium text-mainColor text-[16px]">Custom</p>
                                    </header>
                                    <div className="flex items-baseline space-x-1 pb-2 ">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Unlimited farms</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Unlimited fields per farm</p>
                                    </div>
                                </div>
                                <div className="font-manrope">
                                    <header className="font-manrope text-[17px]  mb-3">
                                        <h3 className="font-semibold">Features:</h3>
                                    </header>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">All Advanced Plan features.</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Dedicated account manager for personalized support.</p>
                                    </div>
                                    <div className="flex items-baseline space-x-1 pb-2">
                                    <i className="fa-solid fa-check text-mainColor"></i>
                                    <p className="font-medium text-[16px] capitalize">Dedicated account manager for personalized support.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2">
                            <button className="w-full rounded-2xl   btn bg-mainColor text-white hover:bg-green-900 text-[16px] font-medium" onClick={()=>{setBankCard(true)}}>Change</button>
                            </div>
                        </div>
                </div>
            </div>
            
            {bankCard?<div className=" inset-0 absolute">
                <AddBankCard setBankCard={setBankCard}/>
            </div>:null}
        </section>:
        <section className='mb-[30px]'>
            <div className=" border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]  px-[20px] pt-[20px] pb-[50px]">
                <div className="">
                    <div className="flex space-x-2 items-center text-[#0D121C]  mb-[10px]">
                        <CreditCard size={25} strokeWidth={1.8}/>
                        <h2 className="text-[19px] font-medium ">Subscription Management</h2>
                    </div>
                    <p className="text-[#9F9F9F] text-[16px] font-medium">Manage your account security and authentication methods.</p>
                </div>
                <div className="mt-[20px] border-b-[1px] border-[#0d121c3c] py-[15px]">
                    <div className=" bg-[#F4F4F4] rounded-[15px] p-[15px]">
                        <div className="flex justify-between items-center font-medium">
                            <p className="">Current Plan</p>
                            <div className="border-[1px] border-[#0d121c3c] rounded-full bg-[#FFFFFF] px-[10px]">
                                <p className="">Active</p>
                            </div>
                        </div>
                        <div className="my-[20px]">
                            <h3 className="text-[21px] font-semibold mb-[12px]">Basic</h3>
                            <p className="text-[#616161] font-medium">free</p>
                        </div>
                        <div className="flex  items-center space-x-2 hidden">
                            <Calendar size={20}/>
                            <p className="font-medium text-[16px]">Renewal Date: 15 May, 2026</p>
                            
                        </div>
                        <div className="flex justify-end">
                            <button className="px-[20px] text-[15px] py-[5px] bg-[#FFFFFF] border-[1px] border-[#C9C9C9] rounded-[15px] font-medium hover:bg-mainColor hover:text-white transition-all duration-300" onClick={()=>{setUpgrade(true)}}>Upgrade Plan</button>
                        </div>
                        <div className="mt-[20px] flex justify-end items-center space-x-[10px] hidden">
                            <button className="px-[15px] py-[5px] bg-[#FFFFFF] border-[1px] border-[#C9C9C9] rounded-[15px] font-medium hover:bg-mainColor hover:text-white transition-all duration-300">Change Plan</button>
                            <button className="px-[15px] py-[5px] bg-[#FFFFFF] text-[#E13939] border-[1px] border-[#E13939] rounded-[15px] font-medium hover:bg-[#E13939] hover:text-white transition-all duration-300">Cancel Subscription</button>
                        </div>
                    </div>
                </div>
                <div className="border-b-[1px] border-[#0d121c3c] py-[15px]">
                    <div className=" bg-[#F4F4F4] rounded-[15px] p-[15px]">
                        <div className="flex justify-between items-center">
                            <div className=" flex items-center space-x-4">
                                <div className="rounded-[10px] overflow-hidden w-[70px] ">
                                    <img src={visaImage} alt=""/>
                                </div>
                                <div className="">
                                    <p className="font-medium mb-[5px]">Visa ending in 4242</p>
                                    <p className="text-[#616161] text-[15px] font-[400]">Expires 09/26</p>
                                </div>
                            </div>
                            <button className="px-[15px] py-[5px] bg-[#FFFFFF] border-[1px] border-[#C9C9C9] rounded-[5px] font-medium hover:bg-mainColor hover:text-white transition-all duration-150">Replace Card</button>
                        </div>
                    </div>
                </div>
                <div className="mt-[20px]">
                    <p className="font-bold text-[17px] mb-[20px]">Billing History</p>
                    <div className="border-[1px] border-[#0d121c37] rounded-[15px] overflow-hidden">
                        <table className='w-full '>
                            <thead className='border-b-[1px] border-[#0d121c37] bg-[#F4F4F4]  '>
                                <tr >
                                    <th className='text-start p-[15px] ' >invoice ID</th>
                                    <th className='text-start p-[15px]'>Date</th>
                                    <th className='text-start p-[15px]'>Plan</th>
                                    <th className='text-start p-[15px]'>Amount</th>
                                    <th className='text-start p-[15px]'>Payment Method</th>
                                </tr>
                            </thead>
                            <tbody className='font-medium text-[15px]'>
                                <tr>
                                    <td className='p-[15px]'>#INV-20250615</td>
                                    <td className='p-[15px]'>Jun 15, 2025</td>
                                    <td className='p-[15px]'>Advanced</td>
                                    <td className='p-[15px]'>499.99 L.E</td>
                                    <td className='p-[15px]'>Visa ending in 4242</td>
                                </tr>
                                <tr>
                                    <td className='p-[15px]'>#INV-20250615</td>
                                    <td className='p-[15px]'>Jun 15, 2025</td>
                                    <td className='p-[15px]'>Advanced</td>
                                    <td className='p-[15px]'>499.99 L.E</td>
                                    <td className='p-[15px]'>Visa ending in 4242</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
        </section>}
        </>
    );
}

export default Subscription;
