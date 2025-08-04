import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import "react-slidy/lib/styles.css";
import Slider from "../../Components/Slider/Slider";
import { motion } from "framer-motion";
import MenuElement from "../../Components/MenuElement/MenuElement";
import FieldOverview from "../../Components/FieldOverview/FieldOverview";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import { AllContext } from "../../Context/All.context";
import { TriangleAlert, Droplet, TrendingUp, Package, Zap, MoveUpRight, MoveDownRight } from "lucide-react";
import { Helmet } from "react-helmet";
import useNotificationHub from "../../hooks/useNotificationHub";

const Dashboard = () => {
  const { baseUrl, SetOpenFarmsOrFieled } = useContext(AllContext);
  const navigate = useNavigate();
  const { token } = useContext(userContext);
  const [fields, setFields] = useState([]);
  const [index, setIndex] = useState(0);
  const [Farms, setFarms] = useState([]);
  const [allFarms, setAllFarms] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [showField, setShowField] = useState(false);
  const [fieldId, setFieldId] = useState("");
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  
  // Card metrics state for 7-day data
  const [cardMetrics, setCardMetrics] = useState({
    automationUsage: { value: 72, change: 8, isIncrease: true },
    cropHealthIndex: { value: 87, change: 2.1, isIncrease: false },
    irrigationActivity: { value: 12.4, unit: 'hrs', change: 12.5, isIncrease: false }
  });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  
  // State for inventory metrics
  const [inventoryMetrics, setInventoryMetrics] = useState({
    totalItems: 0,
    lowStockItems: 0,
    stockHealthPercent: 0
  });
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  
  // Use notification hook
  const { notifications } = useNotificationHub();

  async function getFarms() {
    if (!token) return;

    setIsLoadingFarms(true);
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
    } finally {
      setIsLoadingFarms(false);
    }
  }

  async function getFields() {
    if (!token || !Farms[index]?.farmId) return;

    setIsLoadingFields(true);
    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[index].farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log({ data });

      setFields(data || []);
    } catch (error) {
      console.error("Error fetching fields:", error);
      setFields([]);
    } finally {
      setIsLoadingFields(false);
    }
  }

  // Handle field selection to show popup
  const handleFieldClick = (field) => {
    setFieldId(field.id);
    setSelectedFarmId(Farms[index]?.farmId);
    setShowField(true);
    console.log({ field });
  };

  async function fetchWeather(locationStr) {
    if (!locationStr) return;
    try {
      setIsLoadingWeather(true);
      // Step 1: Geocoding to get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          locationStr
        )}&count=1&language=en&format=json`
      );
      const geoJson = await geoRes.json();
      if (!geoJson.results || geoJson.results.length === 0) {
        setWeatherData([]);
        return;
      }
      const { latitude, longitude } = geoJson.results[0];

      // Step 2: Fetch forecast using coordinates
      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const forecastJson = await forecastRes.json();

      if (
        !forecastJson.daily ||
        !forecastJson.daily.time ||
        forecastJson.daily.time.length === 0
      ) {
        setWeatherData([]);
        return;
      }

      const parsed = forecastJson.daily.time.map((dateStr, idx) => {
        const dateObj = new Date(dateStr);
        const dayName = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
        });
        return {
          day: dayName,
          max: forecastJson.daily.temperature_2m_max[idx],
          min: forecastJson.daily.temperature_2m_min[idx],
        };
      });

      setWeatherData(parsed);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData([]);
    } finally {
      setIsLoadingWeather(false);
    }
  }

  // Fetch analytics card metrics for the last 7 days
  const fetchCardMetrics = async () => {
    if (!token || !baseUrl || !Farms[index]?.farmId) return;
    
    setIsLoadingMetrics(true);
    try {
      const timePeriodDays = 7; // Fixed to 7 days for dashboard
      const farmId = Farms[index].farmId;
      
      // Fetch automation usage data from irrigation events
      const automationUsageData = await fetchAutomationUsageData(farmId, timePeriodDays);
      
      // Fetch irrigation data for irrigation activity
      const irrigationActivityData = await fetchIrrigationTimeData(farmId, timePeriodDays);
      
      // Fetch disease detection data for crop health
      const cropHealthData = await fetchCropHealthData(farmId, timePeriodDays);
      
      setCardMetrics({
        automationUsage: automationUsageData,
        cropHealthIndex: cropHealthData,
        irrigationActivity: irrigationActivityData
      });
      
    } catch (error) {
      console.error("Error fetching dashboard card metrics:", error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Fetch automation usage data from irrigation events
  const fetchAutomationUsageData = async (farmId, timePeriodDays) => {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/IrrigationEvents`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data: events } = await axios(options);
      
      if (!events || events.length === 0) {
        return { value: 0, change: 0, isIncrease: false };
      }

      const now = new Date();
      const currentPeriodStart = new Date(now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000);
      const previousPeriodStart = new Date(now.getTime() - timePeriodDays * 2 * 24 * 60 * 60 * 1000);

      // Filter events for current and previous periods
      const currentPeriodEvents = events.filter(e => {
        const eventDate = new Date(e.startTime);
        return eventDate >= currentPeriodStart;
      });

      const previousPeriodEvents = events.filter(e => {
        const eventDate = new Date(e.startTime);
        return eventDate >= previousPeriodStart && eventDate < currentPeriodStart;
      });

      // Calculate automation percentages
      const calculateAutomationPercentage = (eventsList) => {
        if (eventsList.length === 0) return 0;
        const automatedEvents = eventsList.filter(e => e.triggerMethod === 1 || e.triggerMethod === 2);
        return Math.round((automatedEvents.length / eventsList.length) * 100);
      };

      const currentAutomationPercentage = calculateAutomationPercentage(currentPeriodEvents);
      const previousAutomationPercentage = calculateAutomationPercentage(previousPeriodEvents);
      
      const changePercent = previousAutomationPercentage > 0 
        ? Math.abs(((currentAutomationPercentage - previousAutomationPercentage) / previousAutomationPercentage) * 100)
        : 0;
      
      const isIncrease = currentAutomationPercentage > previousAutomationPercentage;

      return {
        value: currentAutomationPercentage,
        change: Math.round(changePercent * 10) / 10,
        isIncrease
      };
    } catch (error) {
      console.error("Error fetching automation usage data:", error);
      return { value: 0, change: 0, isIncrease: false };
    }
  };

  // Fetch irrigation time data from irrigation events
  const fetchIrrigationTimeData = async (farmId, timePeriodDays) => {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/IrrigationEvents`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data: events } = await axios(options);
      
      if (!events || events.length === 0) {
        return { value: 0, unit: 'hrs', change: 0, isIncrease: false };
      }

      const now = new Date();
      const currentPeriodStart = new Date(now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000);
      const previousPeriodStart = new Date(now.getTime() - timePeriodDays * 2 * 24 * 60 * 60 * 1000);

      // Filter events for current and previous periods
      const currentPeriodEvents = events.filter(e => {
        const eventDate = new Date(e.startTime);
        return eventDate >= currentPeriodStart;
      });

      const previousPeriodEvents = events.filter(e => {
        const eventDate = new Date(e.startTime);
        return eventDate >= previousPeriodStart && eventDate < currentPeriodStart;
      });

      // Calculate total irrigation hours
      const currentHours = currentPeriodEvents.reduce((sum, e) => {
        const duration = (new Date(e.endTime) - new Date(e.startTime)) / (1000 * 60 * 60);
        return sum + Math.max(duration, 0);
      }, 0);

      const previousHours = previousPeriodEvents.reduce((sum, e) => {
        const duration = (new Date(e.endTime) - new Date(e.startTime)) / (1000 * 60 * 60);
        return sum + Math.max(duration, 0);
      }, 0);
      
      const changePercent = previousHours > 0 
        ? Math.abs(((currentHours - previousHours) / previousHours) * 100)
        : 0;
      
      const isIncrease = currentHours > previousHours;

      return {
        value: Math.round(currentHours * 10) / 10,
        unit: 'hrs',
        change: Math.round(changePercent * 10) / 10,
        isIncrease
      };
    } catch (error) {
      console.error("Error fetching irrigation time data:", error);
      return { value: 0, unit: 'hrs', change: 0, isIncrease: false };
    }
  };

  // Fetch crop health data from disease detections
  const fetchCropHealthData = async (farmId, timePeriodDays) => {
    try {
      // Get all fields for the farm
      const fieldsOptions = {
        url: `${baseUrl}/farms/${farmId}/Fields`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data: fieldsData } = await axios(fieldsOptions);
      
      if (!fieldsData || fieldsData.length === 0) {
        return { value: 100, change: 0, isIncrease: true };
      }

      const now = new Date();
      const currentPeriodStart = new Date(now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000);
      const previousPeriodStart = new Date(now.getTime() - timePeriodDays * 2 * 24 * 60 * 60 * 1000);

      let allCurrentDetections = [];
      let allPreviousDetections = [];

      // Fetch detections for all fields
      for (const field of fieldsData) {
        try {
          const detectionsOptions = {
            url: `${baseUrl}/farms/${farmId}/fields/${field.id}/diseasedetections`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          };
          const { data: detectionsData } = await axios(detectionsOptions);
          
          if (detectionsData && detectionsData.length > 0) {
            // Filter by current period
            const currentDetections = detectionsData.filter(d => {
              const detectionDate = new Date(d.createdOn);
              return detectionDate >= currentPeriodStart;
            });
            
            // Filter by previous period
            const previousDetections = detectionsData.filter(d => {
              const detectionDate = new Date(d.createdOn);
              return detectionDate >= previousPeriodStart && detectionDate < currentPeriodStart;
            });

            allCurrentDetections = [...allCurrentDetections, ...currentDetections];
            allPreviousDetections = [...allPreviousDetections, ...previousDetections];
          }
        } catch (error) {
          console.error(`Error fetching detections for field ${field.id}:`, error);
        }
      }

      // Calculate health index for current period
      const currentHealthIndex = calculateHealthIndex(allCurrentDetections);
      const previousHealthIndex = calculateHealthIndex(allPreviousDetections);
      
      // Calculate percentage point change
      const percentagePointChange = Math.abs(currentHealthIndex - previousHealthIndex);
      const isIncrease = currentHealthIndex > previousHealthIndex;

      return {
        value: currentHealthIndex,
        change: Math.round(percentagePointChange * 10) / 10,
        isIncrease,
        currentDetections: allCurrentDetections.length,
        previousDetections: allPreviousDetections.length
      };
    } catch (error) {
      console.error("Error fetching crop health data:", error);
      return { value: 100, change: 0, isIncrease: true };
    }
  };

  // Calculate health index from detections (0-100 scale)
  const calculateHealthIndex = (detections) => {
    if (!detections || detections.length === 0) {
      return 100; // No detections means perfectly healthy
    }

    // Count healthy detections
    const healthyDetections = detections.filter(d => 
      d.healthStatus === 0 || d.isHealthy === true
    );
    
    const healthyPercentage = (healthyDetections.length / detections.length) * 100;
    return Math.round(healthyPercentage);
  };

  // Fetch inventory metrics
  const fetchInventoryMetrics = async () => {
    if (!token || !baseUrl || !Farms[index]?.farmId) return;
    
    setIsLoadingInventory(true);
    try {
      const farmId = Farms[index].farmId;
      const options = {
        url: `${baseUrl}/farms/${farmId}/InventoryItems`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const { data: inventoryItems } = await axios(options);
      
      if (inventoryItems && Array.isArray(inventoryItems)) {
        const totalItems = inventoryItems.length;
        const lowStockItems = inventoryItems.filter(item => 
          item.stockLevel === "Low" || item.stockLevel === "low"
        ).length;
        
        // Calculate stock health percentage (items that are not low stock)
        const healthyStockItems = totalItems - lowStockItems;
        const stockHealthPercent = totalItems > 0 ? Math.round((healthyStockItems / totalItems) * 100) : 0;
        
        setInventoryMetrics({
          totalItems,
          lowStockItems,
          stockHealthPercent
        });
      } else {
        setInventoryMetrics({
          totalItems: 0,
          lowStockItems: 0,
          stockHealthPercent: 0
        });
      }
    } catch (error) {
      console.error('Error fetching inventory metrics:', error);
      setInventoryMetrics({
        totalItems: 0,
        lowStockItems: 0,
        stockHealthPercent: 0
      });
    } finally {
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (token) {
      getFarms();
    } else {
      setIsLoadingFarms(false);
    }
  }, [token]);

  useEffect(() => {
    if (Farms.length > 0) {
      setFields([]); // Clear previous fields when changing farm
      getFields();
      // Fetch weather for selected farm location
      const selectedLocation = Farms[index]?.location;
      if (selectedLocation) {
        fetchWeather(selectedLocation);
      }
      // Fetch card metrics for dashboard
      fetchCardMetrics();
      fetchInventoryMetrics();
    }
  }, [index, Farms]);

  // Show loading or empty state when no farms exist
  if (isLoadingFarms) {
    return (
      <div className="transition-all duration-500 space-y-10">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 mx-3 mt-20 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
          <p className="text-[#808080]">Loading farms...</p>
        </div>
      </div>
    );
  }

  if (Farms.length === 0 && !isLoadingFarms) {
    return (
      <div className="transition-all duration-500 space-y-10">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
          <TriangleAlert size={48} className="text-yellow-500 mb-2" />
          <p className="text-[#808080]">No Farms Available</p>
          <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
            No farms found in your account. Create your first farm to get started with AgriVision.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-all duration-500 space-y-10">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="formGroup flex justify-between items-baseline transition-all duration-500">
        <MenuElement
          Items={allFarms}
          nameChange={allFarms[index]}
          setIndex={setIndex}
          index={index}
          width={218 + "px"}
          Pformat={"text-[#0D121C] font-[400]"}
        />

        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3 h-min">
          <p className="font-[500] text-[14px]">Owner</p>
        </div>
      </div>

      {isLoadingFields ? (
        <div className="h-[150px] rounded-md text-[16px] font-medium space-y-2 mx-3 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
          <p className="text-[#808080]">Loading fields...</p>
        </div>
      ) : fields.length > 0 ? (
        <div>
          <p className="font-[500] text-[20px] mb-5">Farm Fields</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fields.map((field, fieldIndex) => {
            return (
              <motion.div
                key={fieldIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: fieldIndex * 0.05,
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)] cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleFieldClick(field)}
              >
                <div className="shadow-md px-4 py-3 rounded-xl border-[1px] border-[#0d121c00]">
                  <div className="flex justify-between items-center">
                    <p className="text-mainColor font-[500] text-[16px]">
                      {field.name}
                    </p>
                    <div className="h-[24px] px-2 border-2 rounded-2xl border-[#0d121c21] text-[12px] font-medium flex justify-center items-center">
                      {field.isActive ? "Active" : "Idle"}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="font-[600] text-[21px] my-2">
                      {field.cropName || "No Crop Planted"}
                    </p>
                    <Line
                      percent={field.progress ?? 0}
                      strokeLinecap="round"
                      strokeColor="#1E6930"
                      className="h-[6.5px] text-mainColor w-full rounded-lg"
                    />
                    <p className="pt-2 pb-2 font-[400]">
                      progress: {field.progress ?? 0}%
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      ) : (
        <div className="h-[150px] rounded-md text-[16px] font-medium space-y-2 border-2 border-dashed border-[#0d121c21] mx-3 flex flex-col justify-center items-center">
          <TriangleAlert size={36} className="text-yellow-500 mb-1" />
          <p className="text-[#808080]">No Fields in Selected Farm</p>
          <p className="text-[#1f1f1f96] text-[14px] text-center px-4">
            This farm has no fields yet. Add fields to start monitoring crops.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shadow-md px-5 py-5 rounded-xl border-2 border-[#0d121c21]">
          <p className="font-[500] text-[20px] mb-5">Latest Notifications</p>
          {notifications.slice(0, 3).length > 0 ? (
            notifications.slice(0, 3).map((notification, index) => (
              <div key={notification.id} className="mt-2 flex space-x-3 items-baseline text-gray-700">
                <i className={`fa-solid fa-triangle-exclamation ${
                  index === 0 ? "text-[#ff0000a6]" : 
                  index === 1 ? "text-[#ffad33d0]" : 
                  "text-[#0000ffa1]"
                }`}></i>
                <p className="font-[400] text-sm">
                  {notification.content || notification.message || "New notification"}
                </p>
              </div>
            ))
          ) : (
            <div className="mt-2 flex space-x-3 items-center text-gray-500">
              <i className="fa-solid fa-bell-slash"></i>
              <p className="font-[400] text-sm">No recent notifications</p>
            </div>
          )}
        </div>
        <div className="shadow-md px-5 py-5 rounded-xl border-2 border-[#0d121c21] min-h-[200px]">
          <p className="font-[500] text-[20px] mb-5">Weather Forecast</p>
          <div className="gap-5 text-[16px] font-semibold">
            {isLoadingWeather ? (
              <div className="flex justify-center items-center h-[100px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
              </div>
            ) : (
              <Slider forecast={weatherData} />
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="font-[500] text-[20px] mb-5">
          Last 7 Days Performance
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 1. Crop Health Index */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)] shadow-md">
            <div className="font-manrope px-[18px] pb-[16px]">
              <div className="pt-[12px] mb-[8px] flex justify-between items-center">
                <h3 className="text-[16px] font-semibold capitalize">
                  crop health index
                </h3>
                <TrendingUp size={18} />
              </div>
              <div className="space-y-[6px] mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-[14px] min-h-[32px] flex items-end">Last 7 days</p>
                <p className="text-[15px]">
                  {isLoadingMetrics ? 'Loading...' : `${cardMetrics.cropHealthIndex.value}%`}
                </p>
              </div>
              <div className="mt-1 text-[14px] font-manrope">
                <div className="space-y-[6px]">
                  <Line
                    percent={cardMetrics.cropHealthIndex.value || 0}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[#616161] text-[13px] font-semibold">
                    Healthy crop detections
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 2. Automation Usage */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)] shadow-md">
            <div className="font-manrope px-[18px] pb-[16px]">
              <div className="pt-[12px] mb-[8px] flex justify-between items-center">
                <h3 className="text-[16px] font-semibold capitalize">
                  automation usage
                </h3>
                <Zap size={18} />
              </div>
              <div className="space-y-[6px] mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-[14px] min-h-[32px] flex items-end">Last 7 days</p>
                <p className="text-[15px]">
                  {isLoadingMetrics ? 'Loading...' : `${cardMetrics.automationUsage.value}% automated`}
                </p>
              </div>
              <div className="mt-1 text-[14px] font-manrope">
                <div className="space-y-[6px]">
                  <Line
                    percent={cardMetrics.automationUsage.value || 0}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[13px] font-semibold">
                    Manual vs. automated triggers
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 3. Irrigation Activity */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)] shadow-md">
            <div className="font-manrope px-[18px] pb-[16px]">
              <div className="pt-[12px] mb-[8px] flex justify-between items-center">
                <h3 className="text-[16px] font-semibold capitalize">
                  irrigation activity
                </h3>
                <Droplet size={18} />
              </div>
              <div className="space-y-[6px] mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-[14px] min-h-[32px] flex items-end">Last 7 days</p>
                <p className="text-[15px]">
                  {isLoadingMetrics ? 'Loading...' : `${cardMetrics.irrigationActivity.value} ${cardMetrics.irrigationActivity.unit}`}
                </p>
              </div>
              <div className="mt-1 text-[14px] font-manrope">
                <div className="space-y-[6px]">
                  <Line
                    percent={cardMetrics.irrigationActivity.value || 0}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[#616161] text-[13px] font-semibold">
                    Total irrigation time
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 4. Inventory Status */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)] shadow-md">
            <div className="font-manrope px-[18px] pb-[16px]">
              <div className="pt-[12px] mb-[8px] flex justify-between items-center">
                <h3 className="text-[16px] font-semibold capitalize">
                  inventory status
                </h3>
                <Package size={18} />
              </div>
              <div className="space-y-[6px] mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-[14px] min-h-[32px] flex items-end">Stock levels overview</p>
                <p className="text-[15px]">
                  {isLoadingInventory ? 'Loading...' : `${inventoryMetrics.totalItems} items`}
                </p>
              </div>
              <div className="mt-1 text-[14px] font-manrope">
                <div className="space-y-[6px]">
                  <Line
                    percent={inventoryMetrics.stockHealthPercent || 0}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[#616161] text-[13px] font-semibold">
                    {isLoadingInventory ? 'Loading...' : `${inventoryMetrics.lowStockItems} items low stock`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {showField && fieldId && (
        <FieldOverview
          farmId={selectedFarmId}
          fieldId={fieldId}
          setShowField={setShowField}
          userRole={Farms[index]?.roleName?.toLowerCase()}
        />
      )}
    </div>
  );
};

export default Dashboard;
