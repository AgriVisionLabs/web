import { useContext, useState, useEffect } from 'react';
import { AllContext } from '../../Context/All.context';
import { X } from 'lucide-react';
import MenuElement from '../MenuElement/MenuElement';

// Custom menu element for filter popup with higher z-index and smaller text
const FilterMenuElement = ({
  Items = [],
  width = "100%",
  nameChange,
  setIndex = () => {},
  selectedIndex,
}) => {
  const [open, setOpen] = useState(false);

  const toggleList = () => setOpen((prev) => !prev);

  const handleSelect = (i) => {
    setIndex(i);
    setOpen(false);
  };

  return (
    <div className="forms relative cursor-pointer" style={{ width }}>
      <div
        className="icon flex justify-between items-center rounded-lg border px-4 py-2 border-[#0d121c21] transition-colors hover:border-mainColor"
        onClick={toggleList}
      >
        <p className="text-[14px] font-[400] capitalize text-[#616161]">
          {nameChange || "Select option"}
        </p>
        <i
          className={`fa-solid cursor-pointer transition-transform duration-300 text-[14px] ${
            open ? "fa-angle-up" : "fa-angle-down"
          }`}
        ></i>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 rounded-lg bg-white z-[70] border border-[#0d121c21] shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="max-h-[160px] overflow-y-auto bg-white rounded-lg">
            {Items?.map((item, i) => (
              <div
                key={i}
                className={`px-4 py-2 text-[14px] cursor-pointer transition-colors hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                  selectedIndex === i ? 'bg-blue-50 text-mainColor font-medium' : 'text-gray-700'
                }`}
                onClick={() => handleSelect(i)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FilteIrrigationAutomationRules = ({ 
    fields, 
    irrigationUnits, 
    automationRules, 
    onApplyFilter 
}) => {
    let {setControlIrrigationPage}=useContext(AllContext);
    
    // Filter states
    const [selectedField, setSelectedField] = useState(null);
    const [selectedRuleType, setSelectedRuleType] = useState(null);
    const [selectedRuleStatus, setSelectedRuleStatus] = useState(null);
    
    // Options for dropdowns
    const fieldOptions = ['All Fields', ...(fields?.map(field => field.name) || [])];
    const ruleTypeOptions = ['All Types', 'Schedule', 'Threshold'];
    const ruleStatusOptions = ['All Statuses', 'Active', 'Idle', 'Maintenance'];
    
    // Debug log
    useEffect(() => {
        console.log('Filter options:', {
            fieldOptions,
            ruleTypeOptions,
            ruleStatusOptions,
            fieldsData: fields,
            irrigationUnitsData: irrigationUnits,
            automationRulesData: automationRules
        });
    }, [fields, irrigationUnits, automationRules]);
    
    // Set initial values
    useEffect(() => {
        if (selectedField === null) setSelectedField(0); // All Fields
        if (selectedRuleType === null) setSelectedRuleType(0); // All Types  
        if (selectedRuleStatus === null) setSelectedRuleStatus(0); // All Statuses
    }, [selectedField, selectedRuleType, selectedRuleStatus]);

    // Apply filter function
    const applyFilters = () => {
        let filteredIrrigationUnits = [...(irrigationUnits || [])];
        let filteredAutomationRules = [...(automationRules || [])];

        console.log('Applying filters:', {
            selectedField,
            selectedRuleType,
            selectedRuleStatus,
            fieldOptions,
            ruleTypeOptions,
            ruleStatusOptions
        });

        // Filter by field
        if (selectedField > 0) { // 0 is "All Fields"
            const selectedFieldName = fieldOptions[selectedField];
            console.log('Filtering by field:', selectedFieldName);
            
            filteredIrrigationUnits = filteredIrrigationUnits.filter(unit => 
                unit.fieldName === selectedFieldName
            );
            
            filteredAutomationRules = filteredAutomationRules.filter(rule => 
                rule.fieldName === selectedFieldName
            );
        }

        // Filter by rule type (only applies to automation rules)
        if (selectedRuleType > 0) { // 0 is "All Types"
            const selectedType = ruleTypeOptions[selectedRuleType];
            console.log('Filtering by rule type:', selectedType);
            
            if (selectedType === 'Schedule') {
                filteredAutomationRules = filteredAutomationRules.filter(rule => {
                    const isSchedule = rule.activeDays !== null && rule.activeDays !== undefined;
                    console.log('Rule:', rule.name, 'activeDays:', rule.activeDays, 'isSchedule:', isSchedule);
                    return isSchedule;
                });
            } else if (selectedType === 'Threshold') {
                filteredAutomationRules = filteredAutomationRules.filter(rule => {
                    const isThreshold = rule.activeDays === null || rule.activeDays === undefined;
                    console.log('Rule:', rule.name, 'activeDays:', rule.activeDays, 'isThreshold:', isThreshold);
                    return isThreshold;
                });
            }
        }

        // Filter by status
        if (selectedRuleStatus > 0) { // 0 is "All Statuses"
            const selectedStatus = ruleStatusOptions[selectedRuleStatus];
            console.log('Filtering by status:', selectedStatus);
            
            if (selectedStatus === 'Active') {
                // For irrigation units: status 0 = Active
                filteredIrrigationUnits = filteredIrrigationUnits.filter(unit => 
                    unit.status === 0
                );
                // For automation rules: isEnabled = true
                filteredAutomationRules = filteredAutomationRules.filter(rule => 
                    rule.isEnabled === true
                );
            } else if (selectedStatus === 'Idle') {
                // For irrigation units: status 1 = Idle
                filteredIrrigationUnits = filteredIrrigationUnits.filter(unit => 
                    unit.status === 1
                );
                // For automation rules: isEnabled = false
                filteredAutomationRules = filteredAutomationRules.filter(rule => 
                    rule.isEnabled === false
                );
            } else if (selectedStatus === 'Maintenance') {
                // For irrigation units: status 2 = Maintenance
                filteredIrrigationUnits = filteredIrrigationUnits.filter(unit => 
                    unit.status === 2
                );
                // Automation rules don't have maintenance status, so show none
                filteredAutomationRules = [];
            }
        }

        console.log('Filtered results:', {
            irrigationUnits: filteredIrrigationUnits,
            automationRules: filteredAutomationRules
        });

        // Call the callback with filtered data
        onApplyFilter({
            irrigationUnits: filteredIrrigationUnits,
            automationRules: filteredAutomationRules
        });

        // Close the filter popup
        setControlIrrigationPage(null);
    };

    // Reset filters function
    const resetFilters = () => {
        console.log('Resetting filters');
        setSelectedField(0);
        setSelectedRuleType(0);
        setSelectedRuleStatus(0);
        
        // Apply with no filters (show all data)
        onApplyFilter({
            irrigationUnits: [...(irrigationUnits || [])],
            automationRules: [...(automationRules || [])]
        });
        
        setControlIrrigationPage(null);
    };
    return (
        <section className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope z-50' onClick={(e)=>{if(e.target==e.currentTarget){setControlIrrigationPage(null)}}}>
            <div className="w-[480px] max-w-[90vw] px-[30px] py-[20px] max-h-[90vh] overflow-visible border-2 rounded-2xl bg-white shadow-2xl">
                <X size={28} className='ms-auto cursor-pointer hover:text-red-500 transition-all duration-150' onClick={()=>{setControlIrrigationPage(null)}}/>
                <div className="text-center mt-[12px] mb-[20px]">
                    <h1 className="text-[22px] text-mainColor font-medium capitalize">Filter Options</h1>
                </div>
                <form action="" className="w-[100%] flex flex-col text-[16px]">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="" className='block text-[15px] font-medium text-gray-700 mb-2'>Filter by Field</label>
                                <FilterMenuElement 
                                    Items={fieldOptions} 
                                    selectedIndex={selectedField} 
                                    width={100+"%"} 
                                    nameChange={selectedField !== null && fieldOptions[selectedField] ? fieldOptions[selectedField] : "All Fields"}
                                    setIndex={setSelectedField} 
                                />
                            </div>
                            <div>
                                <label htmlFor="" className='block text-[15px] font-medium text-gray-700 mb-2'>Filter by Rule Type</label>
                                <FilterMenuElement 
                                    Items={ruleTypeOptions} 
                                    selectedIndex={selectedRuleType} 
                                    width={100+"%"} 
                                    nameChange={selectedRuleType !== null && ruleTypeOptions[selectedRuleType] ? ruleTypeOptions[selectedRuleType] : "All Types"}
                                    setIndex={setSelectedRuleType} 
                                />
                            </div>
                            <div>
                                <label htmlFor="" className='block text-[15px] font-medium text-gray-700 mb-2'>Filter by Status</label>
                                <FilterMenuElement 
                                    Items={ruleStatusOptions} 
                                    selectedIndex={selectedRuleStatus} 
                                    width={100+"%"} 
                                    nameChange={selectedRuleStatus !== null && ruleStatusOptions[selectedRuleStatus] ? ruleStatusOptions[selectedRuleStatus] : "All Statuses"}
                                    setIndex={setSelectedRuleStatus}
                                />
                            </div>
                        </div>
                </form>
                <div className="flex justify-between items-center mt-[24px] pt-[20px] border-t border-gray-200">
                    <button 
                        type='button' 
                        className="py-[8px] px-[24px] border-[1px] border-orange-500 rounded-[10px] text-[15px] text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-medium" 
                        onClick={resetFilters}
                    >
                        Reset
                    </button>
                    <div className="flex space-x-[12px]">
                        <button 
                            type='button' 
                            className="py-[8px] px-[24px] border-[1px] border-[#616161] rounded-[10px] text-[15px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" 
                            onClick={() => {setControlIrrigationPage(null)}}
                        >
                            Cancel
                        </button>
                        <button 
                            type='button' 
                            className="py-[8px] px-[20px] border-[1px] border-transparent rounded-[10px] bg-mainColor text-[15px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                            onClick={applyFilters}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
            
                
                
            
            
        </section>
    );
}

export default FilteIrrigationAutomationRules;
