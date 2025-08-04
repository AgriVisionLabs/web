import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
import MenuElement from '../MenuElement/MenuElement';
import { X } from 'lucide-react';

const AddNewSensorStep1 = (children) => {
    let fields=children.fields.map((field)=>{return field.name})
    let {onListAddNewSensorStep1,setOnListAddNewSensorStep1,setAddNewSensor}=useContext(AllContext)
    return (
        <section className='h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute z-50 w-[100%] p-4 sm:p-6' onClick={(e)=>{if(e.target==e.currentTarget){setAddNewSensor(null)}}}>
            <div className="w-full sm:w-[90%] md:w-[600px] lg:w-[650px] max-w-[650px] px-[16px] sm:px-[24px] lg:px-[40px] h-auto min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] border-2 rounded-xl sm:rounded-2xl bg-white p-[16px] sm:p-[20px]">
                <X size={24} className='sm:w-[28px] sm:h-[28px] lg:w-[33px] lg:h-[33px] ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setAddNewSensor(null)}}/>
                <div className="text-center mt-[12px] sm:mt-[16px] space-y-[16px] sm:space-y-[20px]">
                    <h1 className="text-[20px] sm:text-[22px] lg:text-[24px] text-mainColor font-medium capitalize">add new sensor</h1>
                    <p className="text-[18px] sm:text-[20px] lg:text-[22px] text-[#616161] font-medium">select a field</p>
                </div>
                <div className="px-2 sm:px-3 mt-[24px] sm:mt-[30px] lg:mt-[35px]">
                    <h4 className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium mb-[12px] sm:mb-[16px]">Field</h4>
                    <MenuElement Items={fields} nameChange={fields[children.indexIRRSDS1]} setIndex={children.setIndexIRRSDS1} onList={onListAddNewSensorStep1} width={100+"%"} name={"Check Fields"} setOnList={setOnListAddNewSensorStep1} Pformat={"text-[#616161]"}/>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-[16px] mt-[32px] sm:mt-[40px] lg:mt-[50px]">
                    <button type='button' className="py-[6px] sm:py-[8px] px-[24px] sm:px-[30px] border-[1px] border-[#616161] rounded-[12px] text-[14px] sm:text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium w-full sm:w-auto" onClick={()=>{setAddNewSensor(null)}}>
                        <div className="flex justify-center items-center space-x-[8px] sm:space-x-[11px]">
                            <p className="">Cancel</p>
                        </div>
                    </button>
                    <button type='button'  className="py-[6px] sm:py-[8px] px-[24px] sm:px-[30px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[14px] sm:text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium w-full sm:w-auto" onClick={()=>{setAddNewSensor("Step2")}}>
                        <div className="flex justify-center items-center space-x-[8px] sm:space-x-[11px]">
                            <p className="">Next</p>
                        </div>
                    </button>
                </div>
            </div>
            
                
                
            
            
        </section>
    );
}

export default AddNewSensorStep1;
