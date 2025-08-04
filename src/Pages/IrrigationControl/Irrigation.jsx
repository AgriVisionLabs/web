import { useContext, useEffect, useState } from "react";
import {
  CircleAlert,
  CircleGauge,
  Hash,
  MapPin,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { AllContext } from "../../Context/All.context";
import AddIrrigationStep1IrrigationPage from "../../Components/AddIrrigationStep1(IrrigationPage)/AddIrrigationStep1(IrrigationPage)";
import AddIrrigationStep2IrrigationPage from "../../Components/AddIrrigationStep2(IrrigationPage)/AddIrrigationStep2(IrrigationPage)";
import MenuElement from "../../Components/MenuElement/MenuElement";
import AutomationRuleStep1IrrigationPage from "../../Components/AutomationRuleStep1(IrrigationPage)/AutomationRuleStep1(IrrigationPage)";
import AutomationRuleStep2IrrigationPage from "../../Components/AutomationRuleStep2(IrrigationPage)/AutomationRuleStep2(IrrigationPage)";
import FilteIrrigationAutomationRules from "../../Components/FilteIrrigation&AutomationRules/FilteIrrigation&AutomationRules";
import EditIrrigationUnit from "../../Components/EditIrrigationUnit/EditIrrigationUnit";

import { userContext } from "../../Context/User.context";
import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";

const Irrigation = () => {
  let {
    controlIrrigationPage,
    setControlIrrigationPage,
    irrigationUnit,
    setIrrigationUnit,
    baseUrl,
  } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [indexIRR, setIndexIRR] = useState(0);
  let [indexAuto, setIndexAuto] = useState(0);
  let [indexIRRS1, setIndexIRRS1] = useState(0);
  let [fields, setFields] = useState([]);
  let [IrrigationUnits, setIrrigationUnits] = useState([]);
  let [Automation, setAutomation] = useState([]);
  let [Farms, setFarms] = useState([]);
  let [allFarms, setAllFarms] = useState([]);
  let [editingIrrigationUnit, setEditingIrrigationUnit] = useState(null);
  let [showEditPopup, setShowEditPopup] = useState(false);
  
  // Filtered data states
  const [filteredIrrigationUnits, setFilteredIrrigationUnits] = useState([]);
  const [filteredAutomationRules, setFilteredAutomationRules] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  let status = ["Active", "Idle", "Maintenance"];

  // Handle filter results
  const handleFilterApply = (filterResults) => {
    setFilteredIrrigationUnits(filterResults.irrigationUnits);
    setFilteredAutomationRules(filterResults.automationRules);
    setIsFiltered(true);
  };

  // Reset filters
  const clearFilters = () => {
    setFilteredIrrigationUnits([]);
    setFilteredAutomationRules([]);
    setIsFiltered(false);
  };

  // Get data to display (filtered or original)
  const displayIrrigationUnits = isFiltered ? filteredIrrigationUnits : IrrigationUnits;
  const displayAutomationRules = isFiltered ? filteredAutomationRules : Automation;

  async function getFarms() {
    if (!token) return;

    try {
      const options = {
        url: `${baseUrl}/Farms`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      if (data) {
        setAllFarms(
          data.map((farm) => {
            return farm.name;
          })
        );
        setFarms(data);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  }

  async function getFields() {
    if (!token || !Farms[indexIRR]?.farmId) return;

    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[indexIRR].farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFields(data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  }

  async function getIrrigationUnits() {
    if (!token || !Farms[indexIRR]?.farmId) return;

    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[indexIRR].farmId}/IrrigationUnits`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setIrrigationUnits(data);
    } catch (error) {
      console.error("Error fetching irrigation units:", error);
    }
  }

  async function toggleIrrigationUnits(farmId, fieldId, unitId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/IrrigationUnits/toggle`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios(options);
      
      // Update the local state with the new toggle state
      setIrrigationUnits(prevUnits => 
        prevUnits.map(unit => 
          unit.id === unitId 
            ? { ...unit, isOn: data.isOn }
            : unit
        )
      );
      
      console.log("Toggle response:", data);
    } catch (error) {
      console.error("Error toggling irrigation unit:", error);
      
      let errorMessage = "Failed to toggle irrigation unit. Please try again.";
      
      if (error.response) {
        const { status, data } = error.response;
        
        // Handle new error format with errors array
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorCode = data.errors[0].code;
          const errorDescription = data.errors[0].description;
          
          switch (errorCode) {
            case "IrrigationUnit.DeviceOffline":
              errorMessage = "Cannot toggle irrigation: The device is currently offline. Please check the device connection and try again.";
              break;
            case "IrrigationUnit.NoUnitAssigned":
              errorMessage = "No irrigation unit is assigned to this field.";
              break;
            case "IrrigationUnit.FailedToSendCommand":
              errorMessage = "Failed to send toggle command to the irrigation device. Please try again later.";
              break;
            case "IrrigationDeviceUnit.NotFound":
              errorMessage = "The irrigation device unit was not found.";
              break;
            case "IrrigationUnit.DeviceUnreachable":
              errorMessage = "Cannot toggle: The irrigation device is unreachable. Please check the device connection.";
              break;
            default:
              errorMessage = errorDescription || "Failed to toggle irrigation unit. Please try again.";
          }
        } else {
          // Handle old error format
          const errorCode = data.title || data.error || data.message;
          
          switch (errorCode) {
            case "IrrigationUnit.NoUnitAssigned":
              errorMessage = "No irrigation unit is assigned to this field.";
              break;
            case "IrrigationUnit.DeviceOffline":
              errorMessage = "Cannot toggle: The irrigation device is currently offline.";
              break;
            case "IrrigationUnit.FailedToSendCommand":
              errorMessage = "Failed to send toggle command to the irrigation device. Please try again later.";
              break;
            case "IrrigationDeviceUnit.NotFound":
              errorMessage = "The irrigation device unit was not found.";
              break;
            case "IrrigationUnit.DeviceUnreachable":
              errorMessage = "Cannot toggle: The irrigation device is unreachable. Please check the device connection.";
              break;
            default:
              // Handle by status code if no specific error code matches
              switch (status) {
                case 404:
                  errorMessage = "The irrigation unit was not found.";
                  break;
                case 503:
                  errorMessage = "The irrigation service is temporarily unavailable. Please try again later.";
                  break;
                default:
                  errorMessage = "Failed to toggle irrigation unit. Please try again.";
              }
          }
        }
      }
      
      toast.error(errorMessage);
    }
  }

  async function DeleteIrrigationUnits(farmId, fieldId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/IrrigationUnits`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      toast.success("Irrigation unit deleted successfully!");
      getIrrigationUnits();
    } catch (error) {
      console.error("Error deleting irrigation unit:", error);
      
      let errorMessage = "Failed to delete irrigation unit. Please try again.";
      
      if (error.response) {
        const { status, data } = error.response;
        const errorCode = data.title || data.error || data.message;
        
        // Handle new error format with errors array
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorCode = data.errors[0].code;
          const errorDescription = data.errors[0].description;
          
          switch (errorCode) {
            case "IrrigationUnit.DeviceOffline":
              errorMessage = "Cannot delete irrigation unit: The device is currently offline. Please check the device connection and try again.";
              break;
            case "IrrigationUnit.NoUnitAssigned":
              errorMessage = "No irrigation unit is assigned to this field.";
              break;
            case "IrrigationUnit.FailedToSendCommand":
              errorMessage = "Failed to send delete command to the irrigation device. Please try again later.";
              break;
            case "IrrigationDeviceUnit.NotFound":
              errorMessage = "The irrigation device unit was not found.";
              break;
            case "IrrigationUnit.DeviceUnreachable":
              errorMessage = "Cannot delete: The irrigation device is unreachable. Please check the device connection.";
              break;
            default:
              errorMessage = errorDescription || "Failed to delete irrigation unit. Please try again.";
          }
        } else {
          // Handle old error format
          const errorCode = data.title || data.error || data.message;
          
          switch (errorCode) {
            case "IrrigationUnit.NoUnitAssigned":
              errorMessage = "No irrigation unit is assigned to this field.";
              break;
            case "IrrigationUnit.DeviceOffline":
              errorMessage = "Cannot delete: The irrigation device is currently offline.";
              break;
            case "IrrigationUnit.FailedToSendCommand":
              errorMessage = "Failed to send delete command to the irrigation device. Please try again later.";
              break;
            case "IrrigationDeviceUnit.NotFound":
              errorMessage = "The irrigation device unit was not found.";
              break;
            case "IrrigationUnit.DeviceUnreachable":
              errorMessage = "Cannot delete: The irrigation device is unreachable. Please check the device connection.";
              break;
            default:
              // Handle by status code if no specific error code matches
              switch (status) {
                case 404:
                  errorMessage = "The irrigation unit was not found.";
                  break;
                case 503:
                  errorMessage = "The irrigation service is temporarily unavailable. Please try again later.";
                  break;
                default:
                  errorMessage = "Failed to delete irrigation unit. Please try again.";
              }
          }
        }
      }
      
      toast.error(errorMessage);
    }
  }

  async function toggleAutomationRule(farmId, fieldId, ruleId) {
    try {
      // First, find the current rule to get its current enabled state
      const currentRule = Automation.find(rule => rule.id === ruleId);
      if (!currentRule) {
        toast.error("Automation rule not found");
        return;
      }

      const newEnabledState = !currentRule.isEnabled;
      
      // Prepare the complete request body according to UpdateAutomationRuleRequest
      const requestBody = {
        name: currentRule.name,
        isEnabled: newEnabledState,
        type: currentRule.type,
        minThresholdValue: currentRule.minThresholdValue,
        maxThresholdValue: currentRule.maxThresholdValue,
        targetSensorType: currentRule.targetSensorType,
        startTime: currentRule.startTime,
        endTime: currentRule.endTime,
        activeDays: currentRule.activeDays
      };
      
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/AutomationRules/${ruleId}`,
        method: "PUT",
        data: requestBody,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };
      await axios(options);
      
      // Refresh the automation rules since the API returns 204 No Content
      getAutomation();
      
      toast.success(`Automation rule ${newEnabledState ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error("Error toggling automation rule:", error);
      
      let errorMessage = "Failed to toggle automation rule. Please try again.";
      
      if (error.response) {
        const { status, data } = error.response;
        
        // Handle new error format with errors array
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorCode = data.errors[0].code;
          const errorDescription = data.errors[0].description;
          
          switch (errorCode) {
            case "IrrigationUnit.DeviceOffline":
              errorMessage = "Cannot toggle automation rule: The device is currently offline. Please check the device connection and try again.";
              break;
            case "AutomationRule.NotFound":
              errorMessage = "The automation rule was not found.";
              break;
            case "AutomationRule.DeviceOffline":
              errorMessage = "Cannot toggle automation rule: The device is currently offline. Please check the device connection and try again.";
              break;
            case "AutomationRule.FailedToSendCommand":
              errorMessage = "Failed to send toggle command to the automation device. Please try again later.";
              break;
            case "AutomationRule.DeviceUnreachable":
              errorMessage = "Cannot toggle: The automation device is unreachable. Please check the device connection.";
              break;
            default:
              errorMessage = errorDescription || "Failed to toggle automation rule. Please try again.";
          }
        } else {
          // Handle old error format
          const errorCode = data.title || data.error || data.message;
          
          switch (errorCode) {
            case "AutomationRule.NotFound":
              errorMessage = "The automation rule was not found.";
              break;
            case "AutomationRule.DeviceOffline":
              errorMessage = "Cannot toggle: The automation device is currently offline.";
              break;
            case "AutomationRule.FailedToSendCommand":
              errorMessage = "Failed to send toggle command to the automation device. Please try again later.";
              break;
            case "AutomationRule.DeviceUnreachable":
              errorMessage = "Cannot toggle: The automation device is unreachable. Please check the device connection.";
              break;
            default:
              // Handle by status code if no specific error code matches
              switch (status) {
                case 404:
                  errorMessage = "The automation rule was not found.";
                  break;
                case 503:
                  errorMessage = "The automation service is temporarily unavailable. Please try again later.";
                  break;
                default:
                  errorMessage = "Failed to toggle automation rule. Please try again.";
              }
          }
        }
      }
      
      toast.error(errorMessage);
    }
  }

  async function getAutomation() {
    if (!token || !Farms[indexIRR]?.farmId) return;

    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[indexIRR].farmId}/AutomationRules`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setAutomation(data);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
    }
  }

  async function DeleteAutomation(farmId, fieldId, automationRuleId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/AutomationRules/${automationRuleId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      toast.success("Automation rule deleted successfully!");
      getAutomation();
    } catch (error) {
      console.error("Error deleting automation rule:", error);
      
      let errorMessage = "Failed to delete automation rule. Please try again.";
      
      if (error.response) {
        const { status, data } = error.response;
        
        // Handle new error format with errors array
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorCode = data.errors[0].code;
          const errorDescription = data.errors[0].description;
          
          switch (errorCode) {
            case "IrrigationUnit.DeviceOffline":
              errorMessage = "Cannot delete automation rule: The device is currently offline. Please check the device connection and try again.";
              break;
            case "AutomationRule.NotFound":
              errorMessage = "The automation rule was not found.";
              break;
            case "AutomationRule.DeviceOffline":
              errorMessage = "Cannot delete automation rule: The device is currently offline. Please check the device connection and try again.";
              break;
            case "AutomationRule.FailedToSendCommand":
              errorMessage = "Failed to send delete command to the automation device. Please try again later.";
              break;
            case "AutomationRule.DeviceUnreachable":
              errorMessage = "Cannot delete: The automation device is unreachable. Please check the device connection.";
              break;
            default:
              errorMessage = errorDescription || "Failed to delete automation rule. Please try again.";
          }
        } else {
          // Handle old error format
          const errorCode = data.title || data.error || data.message;
          
          switch (errorCode) {
            case "AutomationRule.NotFound":
              errorMessage = "The automation rule was not found.";
              break;
            case "AutomationRule.DeviceOffline":
              errorMessage = "Cannot delete: The automation device is currently offline.";
              break;
            case "AutomationRule.FailedToSendCommand":
              errorMessage = "Failed to send delete command to the automation device. Please try again later.";
              break;
            case "AutomationRule.DeviceUnreachable":
              errorMessage = "Cannot delete: The automation device is unreachable. Please check the device connection.";
              break;
            default:
              // Handle by status code if no specific error code matches
              switch (status) {
                case 404:
                  errorMessage = "The automation rule was not found.";
                  break;
                case 503:
                  errorMessage = "The automation service is temporarily unavailable. Please try again later.";
                  break;
                default:
                  errorMessage = "Failed to delete automation rule. Please try again.";
              }
          }
        }
      }
      
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    getFarms();
  }, [token]);

  useEffect(() => {
    if (Farms.length > 0) {
      // Clear filters when changing farms or refreshing data
      clearFilters();
      getIrrigationUnits();
      getFields();
      getAutomation();
    }
  }, [indexIRR, Farms]);

  return (
    <>
      <Helmet>
        <title>Irrigation</title>
      </Helmet>
      <section className="transition-all duration-500 space-y-10">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-start md:justify-between md:items-center px-3">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between md:items-center md:gap-x-12">
            <p className="text-[23px] capitalize font-medium">
              Irrigation Control
            </p>
            <MenuElement
              Items={allFarms}
              nameChange={allFarms[indexIRR]}
              setIndex={setIndexIRR}
              onList={irrigationUnit}
              width={200 + "px"}
              className={"py-[6px]"}
              setOnList={setIrrigationUnit}
              Pformat={"text-[#0D121C] font-[400]"}
            />
          </div>
          <div className="flex items-center space-x-2">
            {isFiltered && (
              <button
                className="flex font-medium items-center rounded-lg space-x-2 py-[7px] px-2 text-[14px] bg-orange-100 text-orange-600 border-2 border-orange-200 capitalize hover:bg-orange-200 transition-all duration-300"
                onClick={clearFilters}
              >
                <X size={16} /> <p>Clear Filters</p>
              </button>
            )}
            <button
              className={`flex font-medium items-center rounded-lg space-x-2 md:self-end py-[7px] px-2 text-[16px] md:text-[16px] border-2 capitalize transition-all duration-300 ${
                isFiltered 
                  ? 'border-mainColor text-mainColor bg-green-50' 
                  : 'border-[#0d121c21] hover:border-mainColor hover:text-mainColor'
              }`}
              onClick={() => {
                setControlIrrigationPage("Filter");
              }}
            >
              <SlidersHorizontal size={19} /> <p>Filter</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:justify-between md:items-center px-3">
          <div className="flex items-center space-x-3">
            <p className="text-[20px] capitalize font-medium text-[#333333d4]">
              Irrigation Units
            </p>
            {isFiltered && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {displayIrrigationUnits.length} of {IrrigationUnits.length} shown
              </span>
            )}
          </div>
          {/* Only show Add Irrigation Unit button for owners and managers */}
          {["owner", "manager"].includes(Farms[indexIRR]?.roleName?.toLowerCase()) && (
            <button
              className="btn md:self-end py-[12px] w-auto px-2 md:px-[20px] bg-mainColor text-[15px] text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-[500]"
              onClick={() => {
                setControlIrrigationPage("Step1Irrigation");
              }}
            >
              <i className="fa-solid fa-plus pe-2 font-[200]"></i> Add Irrigation
              Unit
            </button>
          )}
        </div>
        {displayIrrigationUnits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4">
            {displayIrrigationUnits.map((IrrigationUnit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div className="shadow-md py-2 rounded-xl border-2 border-[#0d121c21]">
                  <div className="flex justify-between items-center px-3">
                    <p className="text-mainColor font-semibold text-[17px]">
                      {IrrigationUnit.name}
                    </p>
                    <div className="py-[2px] px-3 border-2 text-[14px] font-[500] rounded-2xl border-[#0d121c21]">
                      {status[IrrigationUnit.status]}
                    </div>
                  </div>
                  <div className="mt-2 px-3 text-[#1f1f1f96]">
                    <p className="font-[400] text-[16px] my-2 flex items-center gap-2">
                      <MapPin strokeWidth={1.75} size={20} />
                      {IrrigationUnit.fieldName}
                    </p>
                    <p className="font-[400] text-[17px] my-2 flex items-center gap-2">
                      <Hash strokeWidth={1.75} size={20} />
                      {IrrigationUnit.serialNumber}
                    </p>
                  </div>
                  <div className="border-t-2 border-[#0d121c21]">
                    <div className="px-3 pt-2 flex justify-between">
                      <div className="flex space-x-3">
                        {/* Only show edit and delete icons for owners and managers */}
                        {["owner", "manager"].includes(Farms[indexIRR]?.roleName?.toLowerCase()) && (
                          <>
                            <SquarePen
                              strokeWidth={1.75}
                              size={22}
                              className="hover:text-mainColor transition-all duration-300 cursor-pointer"
                              onClick={() => {
                                setEditingIrrigationUnit(IrrigationUnit);
                                setShowEditPopup(true);
                              }}
                            />
                            <Trash2
                              strokeWidth={1.75}
                              size={22}
                              className="hover:text-red-700 transition-all duration-300 cursor-pointer"
                              onClick={() => {
                                DeleteIrrigationUnits(
                                  IrrigationUnit.farmId,
                                  IrrigationUnit.fieldId
                                );
                              }}
                            />
                          </>
                        )}
                      </div>
                      {/* Only show toggle for owners and managers */}
                      {["owner", "manager"].includes(Farms[indexIRR]?.roleName?.toLowerCase()) ? (
                        <div
                          className={`w-[47px] h-[25px] rounded-2xl flex items-center px-1 transition-all duration-300 cursor-pointer ${
                            IrrigationUnit.isOn ? 'bg-mainColor' : 'bg-[#5e5e5f21]'
                          }`}
                          onClick={() => {
                            toggleIrrigationUnits(
                              IrrigationUnit.farmId,
                              IrrigationUnit.fieldId,
                              IrrigationUnit.id
                            );
                          }}
                        >
                          <div 
                            className={`h-[20px] w-[20px] bg-white rounded-full transition-all duration-300 ${
                              IrrigationUnit.isOn ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          ></div>
                        </div>
                      ) : (
                        <div className={`w-[47px] h-[25px] rounded-2xl flex items-center px-1 transition-all duration-300 cursor-not-allowed ${
                          IrrigationUnit.isOn ? 'bg-gray-400' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-[20px] w-[20px] bg-gray-400 rounded-full transition-all duration-300 ${
                              IrrigationUnit.isOn ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
            <TriangleAlert size={48} className="text-yellow-500 mb-2" />
            <p className="text-[#808080]">
              {isFiltered ? "No Irrigation Units Match Your Filters" : "No Irrigation Units Found"}
            </p>
            <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
              {isFiltered 
                ? "Try adjusting your filters to see more results, or clear all filters to view all irrigation units."
                : "Add irrigation units to monitor and control your irrigation system."
              }
            </p>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="mt-2 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:justify-between md:items-center px-3">
          <div className="flex items-center space-x-3">
            <p className="text-[20px] capitalize font-medium text-[#333333d4]">
              Automation Rules
            </p>
            {isFiltered && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {displayAutomationRules.length} of {Automation.length} shown
              </span>
            )}
          </div>
          {/* Only show Add New Rule button for owners and managers */}
          {["owner", "manager"].includes(Farms[indexIRR]?.roleName?.toLowerCase()) && (
            <button
              className="btn md:self-end py-[12px] w-auto px-2 md:px-[20px] bg-mainColor text-[15px] font-medium text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor"
              onClick={() => {
                setControlIrrigationPage("Step1AutomationRule");
              }}
            >
              <i className="fa-solid fa-plus pe-2 font-[200]"></i> Add New Rule
            </button>
          )}
        </div>

        {displayAutomationRules && displayAutomationRules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4 py-2">
            {displayAutomationRules.map((automation, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                  <div className="shadow-md py-2 rounded-xl border-2 border-[#0d121c21]">
                    <div className="px-3">
                      <p className="text-mainColor font-semibold text-[16px]">
                        {automation.name}
                      </p>
                    </div>
                    {automation.activeDays !== null ? (
                      <div className="mt-2 px-3 text-[#1f1f1f96]">
                        <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                          <CircleAlert strokeWidth={1.75} size={20} />
                          Type: Schedule
                        </p>
                        <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                          <MapPin strokeWidth={1.75} size={20} />
                          Field: {automation.fieldName}
                        </p>
                        <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                          <CircleGauge strokeWidth={1.75} size={20} />
                          Schedule: from {automation.startTime} to{" "}
                          {automation.endTime}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 px-3 text-[#1f1f1f96]">
                        <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                          <CircleAlert strokeWidth={1.75} size={20} />
                          Type: Threshold
                        </p>
                        <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                          <MapPin strokeWidth={1.75} size={20} />
                          Field: {automation.fieldName}
                        </p>
                        <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                          <CircleGauge strokeWidth={1.75} size={20} />
                          Threshold: {automation.minThresholdValue}-
                          {automation.maxThresholdValue}%
                        </p>
                      </div>
                    )}
                    <div className="border-t-2 border-[#0d121c21]">
                      <div className="px-3 pt-2 flex justify-between">
                        <div className="flex space-x-3">
                          {/* Only show delete icon for owners and managers */}
                          {["owner", "manager"].includes(Farms[indexIRR]?.roleName?.toLowerCase()) && (
                            <>
                              <Trash2
                                strokeWidth={1.75}
                                size={22}
                                className="hover:text-red-700 transition-all duration-300 cursor-pointer"
                                onClick={() => {
                                  DeleteAutomation(
                                    automation.farmId,
                                    automation.fieldId,
                                    automation.id
                                  );
                                }}
                              />
                            </>
                          )}
                        </div>
                        {/* Only show toggle for owners and managers */}
                        {["owner", "manager"].includes(Farms[indexIRR]?.roleName?.toLowerCase()) ? (
                          <div
                            className={`w-[47px] h-[25px] rounded-2xl flex items-center px-1 transition-all duration-300 cursor-pointer ${
                              automation.isEnabled ? 'bg-mainColor' : 'bg-[#5e5e5f21]'
                            }`}
                            onClick={() => {
                              toggleAutomationRule(automation.farmId, automation.fieldId, automation.id);
                            }}
                          >
                            <div 
                              className={`h-[20px] w-[20px] bg-white rounded-full transition-all duration-300 ${
                                automation.isEnabled ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            ></div>
                          </div>
                        ) : (
                          <div className={`w-[47px] h-[25px] rounded-2xl flex items-center px-1 transition-all duration-300 cursor-not-allowed ${
                            automation.isEnabled ? 'bg-gray-400' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-[20px] w-[20px] bg-gray-400 rounded-full transition-all duration-300 ${
                                automation.isEnabled ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
            <TriangleAlert size={48} className="text-yellow-500 mb-2" />
            <p className="text-[#808080]">
              {isFiltered ? "No Automation Rules Match Your Filters" : "No Automation Rules Found"}
            </p>
            <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
              {isFiltered 
                ? "Try adjusting your filters to see more results, or clear all filters to view all automation rules."
                : "No automation rules found. Try adding a new rule."
              }
            </p>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="mt-2 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      {controlIrrigationPage === "Step1Irrigation" && (
        <AddIrrigationStep1IrrigationPage
          fields={fields}
          indexIRRS1={indexIRRS1}
          setIndexIRRS1={setIndexIRRS1}
        />
      )}
      {controlIrrigationPage === "Step2Irrigation" && (
        <AddIrrigationStep2IrrigationPage
          getIrrigationUnits={getIrrigationUnits}
          farmId={Farms[indexIRR]?.farmId}
          field={fields[indexIRRS1]}
        />
      )}
      {controlIrrigationPage === "Step1AutomationRule" && (
        <AutomationRuleStep1IrrigationPage
          fields={fields}
          indexAuto={indexAuto}
          farmId={Farms[indexIRR]?.farmId}
          setIndexAuto={setIndexAuto}
        />
      )}
      {controlIrrigationPage === "Step2AutomationRule" && (
        <AutomationRuleStep2IrrigationPage
          getAutomation={getAutomation}
          farmId={Farms[indexIRR]?.farmId}
          field={fields[indexAuto]}
        />
      )}
      {controlIrrigationPage === "Filter" && (
        <FilteIrrigationAutomationRules 
          fields={fields}
          irrigationUnits={IrrigationUnits}
          automationRules={Automation}
          onApplyFilter={handleFilterApply}
        />
      )}
      {showEditPopup && editingIrrigationUnit && (
        <EditIrrigationUnit
          irrigationUnit={editingIrrigationUnit}
          fields={fields}
          onClose={() => {
            setShowEditPopup(false);
            setEditingIrrigationUnit(null);
          }}
          onUpdate={() => {
            getIrrigationUnits();
          }}
        />
      )}

    </>
  );
};

export default Irrigation;
