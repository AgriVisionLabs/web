import  { useContext } from 'react';
import MenuElement from '../MenuElement/MenuElement';
import { AllContext } from '../../Context/All.context';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const AddNewIrrigationUnitStep1 = (children) => {
    // var forms =[1,2,3,4,5];
    let fields=children.fields.map((field)=>{return field.name})
    let {onListAddNewSensorStep1,setOnListAddNewSensorStep1,setAddNewIrrigationUnit}=useContext(AllContext)
    return (
        <section className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-sm z-50 p-4 sm:p-6' onClick={(e)=>{if(e.target==e.currentTarget){setAddNewIrrigationUnit(null)}}}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                }}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-2xl border-2 font-manrope">
                
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg sm:rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold text-mainColor capitalize">Add New Irrigation Unit</h1>
                            <p className="text-sm sm:text-base text-[#616161] font-medium mt-1">Select a field</p>
                        </div>
                        <button
                            onClick={() => setAddNewIrrigationUnit(null)}
                            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                        >
                            <X size={24} className="text-gray-600 hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 py-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-base sm:text-lg font-medium mb-3 sm:mb-4">Field</label>
                            <MenuElement 
                                Items={fields} 
                                nameChange={fields[children.indexIRRSDS1]} 
                                setIndex={children.setIndexIRRSDS1} 
                                onList={onListAddNewSensorStep1} 
                                width="100%" 
                                name="Select Field" 
                                setOnList={setOnListAddNewSensorStep1} 
                                Pformat="text-[#616161]"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer - Sticky */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-lg sm:rounded-b-2xl">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button 
                            type='button' 
                            className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 hover:border-mainColor hover:text-mainColor transition-all duration-300 font-medium" 
                            onClick={() => setAddNewIrrigationUnit(null)}
                        >
                            Cancel
                        </button>
                        <button 
                            type='button'  
                            className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-transparent rounded-lg bg-mainColor text-sm sm:text-base text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium" 
                            onClick={() => setAddNewIrrigationUnit("Step2")}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export default AddNewIrrigationUnitStep1;
