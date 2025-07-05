import { AlertCircle, X } from 'lucide-react';
import React from 'react';

const AddBankCard = (children) => {
    return (
        <div className=' fixed inset-0  flex justify-center items-center z-[100] bg-[#FFFFFF]'>
            <div className="border-[1px] border-[#0d121c3c] rounded-[15px] py-[20px] px-[15px] w-[600px]">
                <div className="flex justify-between items-center mb-[20px]">
                    <p className="text-[18px] text-mainColor font-medium capitalize">Add a Bank Card</p>
                    <X size={25} className='hover:text-red-600 transition-all duration-300' onClick={()=>{children.setBankCard(false)}}/>
                </div>
                <div className="bg-[#F0F2F5] px-[13px] py-[15px] rounded-[15px]">
                    <form action="" className="flex flex-col space-y-[20px]">
                        <div className=" flex flex-col space-y-3 ">
                            <label htmlFor="" className='font-medium text-[15px]'>Card Number</label>
                            <input type="text"  className=' text-[#616161] w-full p-[10px] border-[2px] border-[#C9C9C9] rounded-[15px]' placeholder='Enter card number'/>
                        </div>
                        <div className=" flex flex-col space-y-3 ">
                            <label htmlFor="" className='font-medium text-[15px]'>Name</label>
                            <input type="text"  className=' text-[#616161] w-full p-[10px] border-[2px] border-[#C9C9C9] rounded-[15px]' placeholder='Enter name on the card'/>
                        </div>
                        <div className="grid grid-cols-2 gap-x-5 w-[100%]">
                            <div className=" flex flex-col space-y-3  ">
                                <label htmlFor="" className='font-medium text-[15px]'>Expire Date</label>
                                <input type="text"  className=' text-[#616161]   p-[10px] border-[2px] border-[#C9C9C9] rounded-[15px]' placeholder='Month/Year'/>
                            </div>
                            <div className=" flex flex-col space-y-3 ">
                                <label htmlFor="" className='font-medium text-[15px]'>CVV</label>
                                <input type="text"  className=' text-[#616161]  p-[10px] border-[2px] border-[#C9C9C9] rounded-[15px]' placeholder='123'/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex space-x-4 items-start mt-[20px] border-[1px] border-[#0d121c3c] rounded-[15px] py-[10px] px-[15px]">
                    <AlertCircle size={25}/> 
                    <p className="font-[400]">The subscription fee will be automatically deducted from your bank card every month.</p>
                </div>
                <div className="flex justify-center my-[30px]">
                    <button className="px-[80px] text-[15px] py-[10px]  border-[1px] border-mainColor bg-mainColor rounded-full font-medium hover:bg-[#FFFFFF] text-white hover:text-mainColor transition-all duration-300" onClick={()=>{}}>Add card</button>
                </div>
            </div>
        </div>
    );
}

export default AddBankCard;
