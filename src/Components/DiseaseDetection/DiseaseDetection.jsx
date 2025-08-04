import {
  Calendar,
  Camera,
  CircleAlert,
  CircleCheckBig,
  Eye,
  Leaf,
  TriangleAlert,
  User,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import MenuElement from "../MenuElement/MenuElement";
import { AllContext } from "../../Context/All.context";
import { Line } from "rc-progress";
import { motion } from "framer-motion";
import NewDetection from "../NewDetection/NewDetection";
import AfterDetection from "../AfterDetection/AfterDetection";
import axios from "axios";
import { userContext } from "../../Context/User.context";

const DiseaseDetection = () => {
  const {
    detection,
    setDetection,
    setDetectionPage,
    setSelectedField,
    baseUrl,
  } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [displayFields, setDisplayFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [index, setIndex] = useState(0);
  const [Farms, setFarms] = useState([]);
  const [allFarms, setAllFarms] = useState([]);
  const [farmCheck, setFarmCheck] = useState(0);
  const [fieldCheck, setFieldCheck] = useState(0);
  const [Imagecheck, setImagecheck] = useState("");
  const [DataAfterDetection, setDataAfterDetection] = useState();
  const [fieldDetections, setFieldDetections] = useState({});
  const [loadingDetections, setLoadingDetections] = useState(false);
  const [loadingCrops, setLoadingCrops] = useState(false);

  // const [health, setHealth] = useState([]);
  // const [risk, setRisk] = useState([]);
  // const [infected, setInfected] = useState([]);

  async function getCrops() {
    if (!token) {
      console.error("No token available for getCrops");
      return;
    }
    setLoadingCrops(true);
    try {
      const options = {
        url: `${baseUrl}/crops`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setCrops(data);
      console.log("Crops fetched:", data);
    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoadingCrops(false);
    }
  }

  async function getFarms() {
    if (!token) {
      console.error("No token available for getFarms");
      return;
    }
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
        getFields();
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  }

  async function getFields() {
    if (!token && Farms.length === 0) {
      console.error("No token or farm data available");
      return;
    }

    console.log(Farms[index]);

    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[index].farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFields(data);
      console.log("All fields:", data);

      // Filter fields to only include those with crops that support disease detection
      filterFieldsByCropSupport(data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  }

  function filterFieldsByCropSupport(fieldsData) {
    if (!crops || crops.length === 0) {
      console.log("No crops data available for filtering");
      // Filter fields to only include those with planted crops even without crop support data
      const fieldsWithCrops = fieldsData.filter(
        (field) => field.cropName && field.cropName.trim() !== ""
      );
      setFilteredFields(fieldsWithCrops);
      // Fetch disease detections for fields with crops if no crops data
      if (fieldsWithCrops && fieldsWithCrops.length > 0) {
        fetchDetectionsForAllFields(fieldsWithCrops);
      }
      return;
    }

    const supportedFields = fieldsData.filter((field) => {
      // First check if field has a planted crop
      if (!field.cropName || field.cropName.trim() === "") {
        console.log(
          `Field: ${field.name} - No crop planted, excluding from disease detection`
        );
        return false;
      }

      // Then check if the crop supports disease detection
      const crop = crops.find(
        (c) => c.name.toLowerCase() === field.cropName.toLowerCase()
      );
      const supportsDetection = crop?.supportsDiseaseDetection === true;

      console.log(
        `Field: ${field.name}, Crop: ${field.cropName}, Supports Detection: ${supportsDetection}`
      );

      return supportsDetection;
    });

    console.log(
      "Filtered fields with planted crops and disease detection support:",
      supportedFields
    );
    setFilteredFields(supportedFields);

    // Fetch disease detections for filtered fields
    if (supportedFields && supportedFields.length > 0) {
      fetchDetectionsForAllFields(supportedFields);
    }
  }

  async function fetchDetectionsForField(farmId, fieldId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/diseasedetections`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      return data;
    } catch (error) {
      console.error(`Error fetching detections for field ${fieldId}:`, error);
      return [];
    }
  }

  async function fetchDetectionsForAllFields(fieldsData) {
    setLoadingDetections(true);
    const detectionsMap = {};

    for (const field of fieldsData) {
      const detections = await fetchDetectionsForField(field.farmId, field.id);
      detectionsMap[field.id] = detections;
    }

    setFieldDetections(detectionsMap);
    setLoadingDetections(false);
  }

  // Function to refresh detections after a new detection is added
  const refreshDetections = () => {
    if (filteredFields.length > 0) {
      fetchDetectionsForAllFields(filteredFields);
    }
  };

  useEffect(() => {
    getCrops();
    getFarms();
  }, []);

  useEffect(() => {
    if (Farms.length) {
      getFields();
    }
  }, [Farms, index]);

  useEffect(() => {
    // Re-filter fields when crops data is loaded
    if (crops.length > 0 && fields.length > 0) {
      filterFieldsByCropSupport(fields);
    }
  }, [crops]);

  // Set display fields to show all filtered fields (no additional filtering needed)
  useEffect(() => {
    setDisplayFields(filteredFields || []);
  }, [filteredFields, fieldDetections]);

  return (
    <>
      <div>
        <div className="mb-[25px] flex items-center space-x-[12px]">
          <p className="text-[20px] text-[#0D121C] font-medium font-manrope ">
            Disease Detection
          </p>
          <div className="relative group">
            <CircleAlert
              strokeWidth={2.5}
              size={20}
              className="cursor-help text-gray-500"
            />
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Only fields with crops that support disease detection will be
              shown here
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-[16px] mb-[30px]">
          <MenuElement
            Items={allFarms}
            nameChange={allFarms[index]}
            setIndex={setIndex}
            index={index}
            width={180 + "px"}
            Pformat={"text-[#0D121C] font-[400] text-[14px]"}
          />
          <form action="" className="">
            <input
              type="text"
              placeholder="Search Fields or crops ..."
              className="text-[14px] text-[#616161] font-[400] font-manrope h-[40px] py-[6px] px-[16px] rounded-[8px] border-[1px] border-[#D9D9D9] w-[200px] sm:w-[280px] md:w-[350px] focus:outline-mainColor"
            />
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[30px] font-manrope">
          {loadingCrops ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor mx-auto mb-4"></div>
                <p className="text-gray-500">
                  Loading fields with disease detection support...
                </p>
              </div>
            </div>
          ) : displayFields.length > 0 ? (
            displayFields.map((item, index) => {
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
                  className="rounded-[20px] border-[1px] border-[rgba(13,18,28,0.25)] cursor-pointer h-full hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className="p-[28px] cursor-pointer"
                    onClick={() => {
                      // Validate that field has a planted crop before navigation
                      if (!item.cropName || item.cropName.trim() === "") {
                        console.warn(
                          `Cannot navigate to disease detection for field ${item.name}: No crop planted`
                        );
                        return;
                      }
                      setSelectedField(item);
                      setDetectionPage("DiseaseDetectionOverviewpage");
                    }}
                  >
                    <div className="mb-[20px] flex justify-between items-center">
                      <h3 className="text-[18px] font-semibold capitalize">
                        {item.name}
                      </h3>
                      {(() => {
                        const recentDetection =
                          fieldDetections[item.id] &&
                          fieldDetections[item.id].length > 0
                            ? fieldDetections[item.id][0]
                            : null;

                        const getHealthStatusText = (healthStatus) => {
                          switch (healthStatus) {
                            case 0:
                              return "healthy";
                            case 1:
                              return "at risk";
                            case 2:
                              return "infected";
                            default:
                              return "unknown";
                          }
                        };

                        const getStatusColor = (healthStatus) => {
                          switch (healthStatus) {
                            case 0:
                              return "bg-[#25C462]";
                            case 1:
                              return "bg-yellow-500";
                            case 2:
                              return "bg-red-500";
                            default:
                              return "bg-gray-500";
                          }
                        };

                        const healthStatus = recentDetection?.healthStatus;
                        const statusText = getHealthStatusText(healthStatus);
                        const statusColor = getStatusColor(healthStatus);

                        return (
                          <h3
                            className={`${statusColor} rounded-[15px] px-[12px] py-[4px] text-[14px] font-medium text-[#FFFFFF] capitalize`}
                          >
                            {statusText}
                          </h3>
                        );
                      })()}
                    </div>
                    <div className="flex items-center space-x-[8px] mb-[20px]">
                      <Leaf size={20} className="text-mainColor" />
                      <p className="text-[16px] text-[#9F9F9F] font-medium">
                        {item.cropName}
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-[15px] font-medium my-[12px]">
                        <p className="capitalize">crop health</p>
                        <p>
                          {(() => {
                            const detections = fieldDetections[item.id] || [];
                            if (detections.length === 0) return "0";

                            const healthyCount = detections.filter(
                              (d) => d.healthStatus === 0
                            ).length;
                            const healthPercentage = Math.round(
                              (healthyCount / detections.length) * 100
                            );
                            return healthPercentage;
                          })()}
                          %
                        </p>
                      </div>
                      <Line
                        percent={(() => {
                          const detections = fieldDetections[item.id] || [];
                          if (detections.length === 0) return 0;

                          const healthyCount = detections.filter(
                            (d) => d.healthStatus === 0
                          ).length;
                          return Math.round(
                            (healthyCount / detections.length) * 100
                          );
                        })()}
                        strokeLinecap="round"
                        strokeColor="#1E6930"
                        className="h-[6px] text-mainColor w-full rounded-lg"
                      />
                    </div>
                    <div className="text-[15px] font-medium my-[20px] border-b-[1px] border-[#9F9F9F]">
                      <h3 className="capitalize mb-[12px]">
                        recent detections
                      </h3>
                      <div className="mt-[12px] pb-[20px] space-y-[10px] h-[140px] overflow-y-auto">
                        {loadingDetections ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
                          </div>
                        ) : fieldDetections[item.id] &&
                          fieldDetections[item.id].length > 0 ? (
                          fieldDetections[item.id]
                            .slice(0, 3)
                            .map((detection, i) => {
                              const detectionDate = new Date(
                                detection.createdOn
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });

                              const getHealthStatusText = (healthStatus) => {
                                switch (healthStatus) {
                                  case 0:
                                    return "healthy";
                                  case 1:
                                    return "at risk";
                                  case 2:
                                    return "infected";
                                  default:
                                    return "unknown";
                                }
                              };

                              const getStatusColor = (healthStatus) => {
                                switch (healthStatus) {
                                  case 0:
                                    return {
                                      bg: "bg-[#25C462]",
                                      icon: "text-[#25C462]",
                                    };
                                  case 1:
                                    return {
                                      bg: "bg-yellow-500",
                                      icon: "text-yellow-500",
                                    };
                                  case 2:
                                    return {
                                      bg: "bg-red-500",
                                      icon: "text-red-500",
                                    };
                                  default:
                                    return {
                                      bg: "bg-gray-500",
                                      icon: "text-gray-500",
                                    };
                                }
                              };

                              const healthStatusText = getHealthStatusText(
                                detection.healthStatus
                              );
                              const statusColors = getStatusColor(
                                detection.healthStatus
                              );

                              return (
                                <div
                                  key={i}
                                  className="flex justify-between items-center cursor-pointer hover:bg-gray-50 hover:shadow-sm p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDataAfterDetection(detection);
                                    setDetection("afterDetection");
                                  }}
                                >
                                  <div className="flex items-center space-x-[8px]">
                                    <CircleCheckBig
                                      size={18}
                                      strokeWidth={1.5}
                                      className={statusColors.icon}
                                    />
                                    <p className="text-[14px] capitalize">
                                      {detectionDate}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <h3
                                      className={`${statusColors.bg} rounded-[12px] px-[10px] py-[2px] text-[13px] font-medium text-[#FFFFFF] capitalize`}
                                    >
                                      {healthStatusText}
                                    </h3>
                                    <Eye
                                      size={18}
                                      className="text-gray-500 hover:text-mainColor transition-colors duration-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDataAfterDetection(detection);
                                        setDetection("afterDetection");
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-[#9F9F9F]">
                            <CircleAlert size={26} className="mb-2" />
                            <p className="text-[15px] text-center">
                              No recent detections
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-[#9F9F9F] space-y-[14px]">
                      <div className="flex items-center space-x-[8px]">
                        <Calendar size={18} />
                        <p className="capitalize text-[14px]">
                          last:{" "}
                          {(() => {
                            const recentDetection =
                              fieldDetections[item.id] &&
                              fieldDetections[item.id].length > 0
                                ? fieldDetections[item.id][0]
                                : null;

                            if (recentDetection) {
                              return new Date(
                                recentDetection.createdOn
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                            }
                            return "no detections";
                          })()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-[8px]">
                        <User size={18} />
                        <p className="capitalize text-[14px]">
                          by:{" "}
                          {(() => {
                            const recentDetection =
                              fieldDetections[item.id] &&
                              fieldDetections[item.id].length > 0
                                ? fieldDetections[item.id][0]
                                : null;

                            return recentDetection?.createdBy || "unknown";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t-[1px] border-[#9F9F9F] flex justify-center py-[16px]">
                    <button
                      className="py-[8px] px-[20px] border-[1px] border-transparent rounded-[25px] bg-mainColor text-[15px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Set the farm and field IDs for the new detection
                        setFarmCheck(item.farmId);
                        setFieldCheck(item.id);
                        // Set the selected field context so NewDetection can access field/crop info
                        setSelectedField(item);
                        // Open the new detection modal
                        setDetection("NewDetection");
                      }}
                    >
                      <div className="flex justify-center items-center space-x-[10px]">
                        <Camera size={18} />
                        <p className="">new detection</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="h-[150px] rounded-md text-[16px] font-medium space-y-2 border-2 border-dashed border-[#0d121c21] mx-3 flex flex-col justify-center items-center">
                <TriangleAlert size={36} className="text-yellow-500 mb-1" />
                <p className="text-[#808080]">
                  No Fields with Planted Crops Supporting Disease Detection
                </p>
                <p className="text-[#1f1f1f96] text-[14px] text-center px-4">
                  Make sure your fields have crops planted and that those crops
                  support disease detection capabilities.
                </p>
              </div>
            </div>
          )}
        </div>
        {detection == "NewDetection" ? (
          <div className=" fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 ">
            <NewDetection
              farmId={farmCheck}
              fieldId={fieldCheck}
              Imagecheck={Imagecheck}
              setImagecheck={setImagecheck}
              setDataAfterDetection={setDataAfterDetection}
              refreshDetections={refreshDetections}
            />
          </div>
        ) : (
          ""
        )}
        {detection == "afterDetection" ? (
          <div className=" fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 ">
            <AfterDetection DataAfterDetection={DataAfterDetection} />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default DiseaseDetection;
