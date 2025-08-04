import {
  Camera,
  ChevronLeft,
  CircleCheckBig,
  Leaf,
  Search,
  User,
  Image,
  Eye,
  CircleAlert,
} from "lucide-react";
import { Line } from "rc-progress";
import { useContext, useState, useEffect } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { motion } from "framer-motion";
import axios from "axios";
import NewDetection from "../NewDetection/NewDetection";
import AfterDetection from "../AfterDetection/AfterDetection";
import FieldOverview from "../FieldOverview/FieldOverview";

const DiseaseDetectionOverview = () => {
  const {
    setDetectionPage,
    selectedField,
    detection,
    setDetection,
    getPart,
    baseUrl,
  } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [partsDetectionOverview, setPartsDetectionOverview] = useState("All");
  const [detections, setDetections] = useState([]);
  const [filteredDetections, setFilteredDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Imagecheck, setImagecheck] = useState("");
  const [DataAfterDetection, setDataAfterDetection] = useState();
  const [showFieldOverview, setShowFieldOverview] = useState(false);
  const [farmData, setFarmData] = useState(null);
  const [fieldStats, setFieldStats] = useState({
    cropHealth: 0,
    totalDetections: 0,
    lastInspection: null,
    inspector: null,
    status: "unknown",
  });

  async function fetchFieldDetections() {
    if (!selectedField || !token) {
      console.error("No selected field or token available");
      return;
    }

    setLoading(true);
    try {
      const options = {
        url: `${baseUrl}/farms/${selectedField.farmId}/fields/${selectedField.id}/diseasedetections`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setDetections(data);

      // Calculate field statistics
      if (data && data.length > 0) {
        const healthyCount = data.filter((d) => d.healthStatus === 0).length;
        const healthPercentage = Math.round((healthyCount / data.length) * 100);
        const mostRecentDetection = data[0]; // Assuming data is sorted by date desc

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

        setFieldStats({
          cropHealth: healthPercentage,
          totalDetections: data.length,
          lastInspection: mostRecentDetection.createdOn,
          inspector: mostRecentDetection.createdBy,
          status: getHealthStatusText(mostRecentDetection.healthStatus),
        });
      } else {
        setFieldStats({
          cropHealth: 0,
          totalDetections: 0,
          lastInspection: null,
          inspector: null,
          status: "unknown",
        });
      }

      console.log("Field detections fetched:", data);
    } catch (error) {
      console.error("Error fetching field detections:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFarmData() {
    if (!selectedField || !token) {
      console.error("No selected field or token available");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/Farms/${selectedField.farmId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFarmData(data);
      console.log("Farm data fetched:", data);
    } catch (error) {
      console.error("Error fetching farm data:", error);
    }
  }

  // Function to refresh detections after a new detection is added
  const refreshDetections = () => {
    if (selectedField) {
      fetchFieldDetections();
    }
  };

  // Function to close detection popup and refresh
  const closeDetectionPopup = () => {
    setDetection(null);
    refreshDetections();
  };

  useEffect(() => {
    if (selectedField) {
      // Validate that the selected field has a planted crop
      if (!selectedField.cropName || selectedField.cropName.trim() === "") {
        console.warn(
          `Field ${selectedField.name} has no planted crop. Redirecting to main disease detection page.`
        );
        setDetectionPage("DiseaseDetectionpage");
        return;
      }
      fetchFieldDetections();
      fetchFarmData(); // Fetch farm data when field is selected
    }
  }, [selectedField]);

  // Filter detections based on selected filter
  useEffect(() => {
    if (!detections || detections.length === 0) {
      setFilteredDetections([]);
      return;
    }

    let filtered = detections;

    switch (partsDetectionOverview) {
      case "Healthy":
        filtered = detections.filter((d) => d.healthStatus === 0);
        break;
      case "At Risk":
        filtered = detections.filter((d) => d.healthStatus === 1);
        break;
      case "Infected":
        filtered = detections.filter((d) => d.healthStatus === 2);
        break;
      default: // "All"
        filtered = detections;
        break;
    }

    setFilteredDetections(filtered);
  }, [detections, partsDetectionOverview]);

  if (!selectedField) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CircleAlert size={48} className="text-yellow-500 mb-4 mx-auto" />
          <p className="text-gray-500">No field selected</p>
        </div>
      </div>
    );
  }

  return (
    <section className="font-manrope">
      <div className="flex space-x-[35px] items-center">
        <ChevronLeft
          size={36}
          className="text-[#616161] cursor-pointer hover:text-black transition-all duration-150"
          onClick={() => {
            setDetectionPage("DiseaseDetectionpage");
          }}
        />
        <div>
          <h1 className="text-[22px] font-medium capitalize">
            {selectedField.name}
          </h1>
          <div className="flex items-center space-x-[10px]">
            <Leaf size={20} className="text-mainColor" />
            <h2 className="text-[#616161] text-[18px] font-medium capitalize">
              {selectedField.cropName}
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-[35px] mb-[30px]">
        <div className="grid lg:grid-cols-3 gap-[30px]">
          <div className="col-span-2 min-h-[240px] border-[1px] border-[#9F9F9F] rounded-[16px] p-[20px]">
            <h3 className="text-[#0D121C] text-[20px] font-medium capitalize">
              field Overview
            </h3>
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
              </div>
            )}
            <div className="mt-[25px]">
              <div className="flex justify-between items-center text-[17px] text-[#0D121C] font-medium my-[12px]">
                <p className="capitalize">crop health</p>
                <p>{fieldStats.cropHealth}%</p>
              </div>
              <Line
                percent={fieldStats.cropHealth}
                strokeLinecap="round"
                strokeColor="#1E6930"
                className="h-[6px] text-mainColor w-full rounded-lg"
              />
            </div>
            <div className="mt-[25px] text-[16px] text-[#616161] font-medium">
              <div className="flex items-center space-x-[10px]">
                <Search
                  className="rotate-[100deg]"
                  strokeWidth={1.8}
                  size={20}
                />
                <p className="capitalize">
                  total detection: {fieldStats.totalDetections}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 min-h-[240px] border-[1px] border-[#9F9F9F] rounded-[16px] p-[20px]">
            <h3 className="text-[#0D121C] text-[20px] font-medium capitalize">
              Actions
            </h3>
            <div className="mt-[30px] space-y-[25px]">
              <button
                type="button"
                className="py-[12px] px-[20px] border-[1px] w-full border-transparent rounded-[30px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                onClick={() => {
                  setDetection("NewDetection");
                }}
              >
                <div className="flex justify-center items-center space-x-[10px] w-full">
                  <Camera size={20} />
                  <p className="capitalize">new detection</p>
                </div>
              </button>
              <button
                type="button"
                className="py-[12px] px-[20px] border-[1px] w-full rounded-[30px] text-mainColor text-[16px] border-mainColor hover:bg-mainColor hover:text-[#FFFFFF] transition-all duration-300 font-medium"
                onClick={() => {
                  setShowFieldOverview(true);
                }}
              >
                <div className="flex justify-center items-center space-x-[10px] w-full">
                  <Leaf size={20} />
                  <p className="capitalize">manage field</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <h4 className="text-[20px] text-[#0D121C] font-medium capitalize">
            detection history
          </h4>
          <div className="flex items-center space-x-[15px]">
            {/* <h4 className="text-[17px] text-[#616161] font-medium capitalize">
              filter:
            </h4> */}
            <div
              className="flex items-center w-fit h-[55px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[15px] px-[10px] text-[14px] sm:text-[15px] font-medium"
              id="parts"
              onClick={(e) => {
                getPart(e.target);
              }}
            >
              <p
                className="py-[10px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("All");
                }}
              >
                All
              </p>
              <p
                className="py-[10px] px-[12px] rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("Healthy");
                }}
              >
                Healthy
              </p>
              <p
                className="py-[10px] px-[12px] rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("At Risk");
                }}
              >
                At Risk
              </p>
              <p
                className="py-[10px] px-[12px] rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("Infected");
                }}
              >
                Infected
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-[25px] mt-[35px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor mx-auto mb-4"></div>
                <p className="text-gray-500">Loading detection history...</p>
              </div>
            </div>
          ) : filteredDetections.length > 0 ? (
            filteredDetections.map((detection, index) => {
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
                    return { bg: "bg-[#25C462]", icon: "text-[#25C462]" };
                  case 1:
                    return { bg: "bg-yellow-500", icon: "text-yellow-500" };
                  case 2:
                    return { bg: "bg-red-500", icon: "text-red-500" };
                  default:
                    return { bg: "bg-gray-500", icon: "text-gray-500" };
                }
              };

              const healthStatusText = getHealthStatusText(
                detection.healthStatus
              );
              const statusColors = getStatusColor(detection.healthStatus);

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
                  <div className="flex items-center md:h-[80px] p-3 w-full rounded-[15px] border-[1px] border-[#9F9F9F] text-[16px] text-[#616161] font-medium hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row w-full md:justify-between md:items-center space-y-3 md:space-y-0 md:px-[25px]">
                      <div className="flex items-center space-x-[10px]">
                        <CircleCheckBig
                          strokeWidth={1.8}
                          size={22}
                          className={statusColors.icon}
                        />
                        <div className="capitalize flex flex-row md:flex-col items-center md:items-start space-x-3 md:space-x-0">
                          <p className="text-[#0D121C] text-[16px]">
                            {healthStatusText}
                          </p>
                          <p className="text-[14px]">{detectionDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-[10px]">
                        <User strokeWidth={1.8} size={20} />
                        <p className="capitalize text-[15px]">
                          {detection.createdBy || "unknown"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-[10px]">
                        <Image strokeWidth={1.8} size={20} />
                        <p className="capitalize text-[15px]">
                          one image available
                        </p>
                      </div>
                      <div className="flex items-center space-x-[25px]">
                        <h3
                          className={`${statusColors.bg} rounded-[12px] px-[12px] py-[3px] text-[14px] text-[#FFFFFF] capitalize`}
                        >
                          {healthStatusText}
                        </h3>
                        <Eye
                          strokeWidth={1.8}
                          size={22}
                          className="cursor-pointer hover:text-mainColor transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDataAfterDetection(detection);
                            setDetection("afterDetection");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <CircleAlert size={64} className="text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {detections.length === 0
                  ? "No Detection History"
                  : `No ${
                      partsDetectionOverview === "All"
                        ? "All"
                        : partsDetectionOverview
                    } Detections`}
              </h3>
              <p className="text-gray-500 max-w-md">
                {detections.length === 0
                  ? "No disease detections have been recorded for this field yet. Start by taking a new detection."
                  : `No ${
                      partsDetectionOverview === "All"
                        ? "all"
                        : partsDetectionOverview.toLowerCase()
                    } detections found for this field. Try selecting a different filter.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {detection == "NewDetection" ? (
        <div className=" fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 ">
          <NewDetection
            farmId={selectedField.farmId}
            fieldId={selectedField.id}
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
          <AfterDetection
            DataAfterDetection={DataAfterDetection}
            closeDetectionPopup={closeDetectionPopup}
          />
        </div>
      ) : (
        ""
      )}
      {showFieldOverview && selectedField && (
        <FieldOverview
          farmId={selectedField.farmId}
          fieldId={selectedField.id}
          setShowField={setShowFieldOverview}
          userRole={farmData?.roleName?.toLowerCase()}
        />
      )}
    </section>
  );
};

export default DiseaseDetectionOverview;
