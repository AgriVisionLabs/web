import { useContext, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { X } from 'lucide-react';
import MenuElement from '../MenuElement/MenuElement';

const FilteIrrigationAutomationRules = () => {
    let {setControlIrrigationPage}=useContext(AllContext);
    let [onListAddNewSensorStep1,setOnListAddNewSensorStep1] =useState(null)
    return (
        <section className='h-[100vh]  flex justify-center items-center bg-black bg-opacity-70  font-manrope  absolute z-50 w-[100%]' onClick={(e)=>{if(e.target==e.currentTarget){setControlIrrigationPage(null)}}}>
            <div className="w-[650px] px-[40px] h-[600px]   border-2 rounded-2xl bg-white p-[20px]">
                <X size={33} className='  ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setControlIrrigationPage(null)}}/>
                <div className="text-center mt-[16px] space-y-[15px]">
                    <h1 className="text-[24px] text-mainColor font-medium capitalize">filter irrigation units and automation rules</h1>
                </div>
                <form action="" className="w-[100%] my-[30px] flex flex-col justify-between  text-[20px]  flex-grow">
                        <div className="flex flex-col gap-3 my-5">
                            
                            <div className="">
                                <label htmlFor="" className='ms-1 '>Filter by Field</label>
                                <MenuElement Items={[1,2,3,4]} onList={onListAddNewSensorStep1} className={"my-2"} width={100+"%"} name={"all fields"} setOnList={setOnListAddNewSensorStep1} Pformat={"text-[#616161] py-[6px] "}/>

                            </div>
                            <div className="">
                                <label htmlFor="" className='ms-1 '>Filter by Rule Type</label>
                                <MenuElement Items={[1,2,3,4]} onList={onListAddNewSensorStep1} className={"my-2"} width={100+"%"} name={"all types"} setOnList={setOnListAddNewSensorStep1} Pformat={"text-[#616161]  py-[6px] "}/>

                            </div>
                            <div className="">
                                <label htmlFor="" className='ms-1 '>Filter by Rule Status</label>
                                <MenuElement Items={[1,2,3,4]} onList={onListAddNewSensorStep1} className={"my-2"} width={100+"%"} name={"all statuses"} setOnList={setOnListAddNewSensorStep1} Pformat={"text-[#616161]   py-[6px] "}/>

                            </div>
                            
                            
                            
                        </div>
                        
                </form>
                <div className="flex justify-end items-center space-x-[16px] ">
                    <button type='button' className="py-[8px] px-[40px] border-[1px] border-[#616161] rounded-[12px]  text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setControlIrrigationPage(null)}}>
                        <div className="flex justify-center items-center space-x-[11px]">
                            <p className="">Cancel</p>
                        </div>
                    </button>
                    <button type='button'  className="py-[8px] px-[20px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium">
                        <div className="flex justify-center items-center space-x-[11px]">
                            <p className="">Apply Filter</p>
                        </div>
                    </button>
                </div>
            </div>
            
                
                
            
            
        </section>
    );
}

export default FilteIrrigationAutomationRules;
