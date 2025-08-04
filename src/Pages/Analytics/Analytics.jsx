import { useState, useEffect, useContext } from "react";
import { userContext } from "../../Context/User.context";
import { AllContext } from "../../Context/All.context";
import axios from "axios";
import toast from "react-hot-toast";
import MenuElement from "../../Components/MenuElement/MenuElement";
import {
  ClipboardCheck,
  Download,
  Droplet,
  Leaf,
  Package,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { Line } from "rc-progress";
import IrrigationPartAnalytics from "../../Components/Irrigation Part (Analytics)/IrrigationPartAnalytics";
import PlantHealth from "../../Components/Plant Health Part (Analytics)/PlantHealth";
import Inventory from "../../Components/Inventory Part (Analytics)/Inventory";
import TasksPart from "../../Components/Tasks Part (Analytics)/TasksPart";
import { Helmet } from "react-helmet";
import AnalyticsExportService from "../../services/analyticsExportService";

const Analytics = () => {
  // Context
  const { token } = useContext(userContext);
  const { baseUrl } = useContext(AllContext);

  // State for farms
  const [farms, setFarms] = useState([]);
  const [farmNames, setFarmNames] = useState([]);
  const [selectedFarmIndex, setSelectedFarmIndex] = useState(0);
  const [isLoadingFarms, setIsLoadingFarms] = useState(false);

  // State for time periods
  const [timePeriods] = useState([
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Last 6 months",
    "Last year",
  ]);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(1); // Default to "Last 30 days"
  const [part, setPart] = useState("irrigation");

  // State for card metrics
  const [cardMetrics, setCardMetrics] = useState({
    automationUsage: { value: 72, change: 8, isIncrease: true },
    cropHealthIndex: { value: 87, change: 2.1, isIncrease: false },
    irrigationActivity: {
      value: 12.4,
      unit: "hrs",
      change: 12.5,
      isIncrease: false,
    },
  });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  // State for inventory metrics
  const [inventoryMetrics, setInventoryMetrics] = useState({
    totalItems: 0,
    lowStockItems: 0,
    stockHealthPercent: 0,
  });
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch farms where user has expert or owner role
  const getFarms = async () => {
    if (!token) {
      console.error("No token available for authentication");
      setIsLoadingFarms(false);
      return;
    }

    setIsLoadingFarms(true);
    try {
      const options = {
        url: `${baseUrl}/Farms`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios(options);
      // console.log("All farms data:", data);

      // Filter farms where user has expert or owner role
      const accessibleFarms = data
        ? data.filter((farm) => {
            const role = farm.roleName?.toLowerCase();
            return role === "expert" || role === "owner";
          })
        : [];

      setFarms(accessibleFarms);
      // console.log("Accessible farms for analytics:", accessibleFarms);

      if (accessibleFarms.length > 0) {
        setFarmNames(accessibleFarms.map((farm) => farm.name));
        // Set default farm index to 0 if farms are available
        setSelectedFarmIndex(0);
      } else {
        setFarmNames([]);
        console.warn("No farms with expert or owner role found");
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
      setFarms([]);
      setFarmNames([]);
      toast.error("Failed to load farms. Please try again.");
    } finally {
      setIsLoadingFarms(false);
    }
  };

  // Load farms on component mount
  useEffect(() => {
    if (token) {
      getFarms();
    } else {
      setIsLoadingFarms(false);
    }
  }, [token]);

  // Fetch card metrics when farm or time period changes
  useEffect(() => {
    if (farms.length > 0 && farms[selectedFarmIndex]?.farmId) {
      fetchCardMetrics();
      fetchInventoryMetrics();
    }
  }, [selectedFarmIndex, selectedPeriodIndex, farms]);

  // Handle farm selection
  const handleFarmChange = (index) => {
    setSelectedFarmIndex(index);
    const selectedFarm = farms[index];
    console.log(
      `Selected farm: ${selectedFarm?.name} (ID: ${selectedFarm?.farmId}, Role: ${selectedFarm?.roleName})`
    );
    // Here you can add logic to fetch analytics data for the selected farm
  };

  // Handle time period selection
  const handleTimePeriodChange = (index) => {
    setSelectedPeriodIndex(index);
    // console.log(`Selected time period: ${timePeriods[index]}`);
  };

  // Convert time period string to days
  const getTimePeriodInDays = () => {
    const selectedPeriod = timePeriods[selectedPeriodIndex];
    switch (selectedPeriod) {
      case "Last 7 days":
        return 7;
      case "Last 30 days":
        return 30;
      case "Last 90 days":
        return 90;
      case "Last 6 months":
        return 180;
      case "Last year":
        return 365;
      default:
        return 30;
    }
  };

  // Fetch analytics card metrics
  const fetchCardMetrics = async () => {
    if (!token || !baseUrl || !farms[selectedFarmIndex]?.farmId) return;

    setIsLoadingMetrics(true);
    try {
      const timePeriodDays = getTimePeriodInDays();
      const farmId = farms[selectedFarmIndex].farmId;

      // Fetch automation usage data from irrigation events
      const automationUsageData = await fetchAutomationUsageData(
        farmId,
        timePeriodDays
      );

      // Fetch irrigation data for irrigation activity
      const irrigationActivityData = await fetchIrrigationTimeData(
        farmId,
        timePeriodDays
      );

      // Fetch disease detection data for crop health
      const cropHealthData = await fetchCropHealthData(farmId, timePeriodDays);

      setCardMetrics({
        automationUsage: automationUsageData,
        cropHealthIndex: cropHealthData,
        irrigationActivity: irrigationActivityData,
      });
    } catch (error) {
      console.error("Error fetching card metrics:", error);
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
      const currentPeriodStart = new Date(
        now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000
      );
      const previousPeriodStart = new Date(
        now.getTime() - timePeriodDays * 2 * 24 * 60 * 60 * 1000
      );

      // Filter events for current and previous periods
      const currentPeriodEvents = events.filter((e) => {
        const eventDate = new Date(e.startTime);
        return eventDate >= currentPeriodStart;
      });

      const previousPeriodEvents = events.filter((e) => {
        const eventDate = new Date(e.startTime);
        return (
          eventDate >= previousPeriodStart && eventDate < currentPeriodStart
        );
      });

      // Calculate automation percentages
      // Threshold = 1, Scheduled = 2 are automated; Manual = 0 is not automated
      const calculateAutomationPercentage = (eventsList) => {
        if (eventsList.length === 0) return 0;
        const automatedEvents = eventsList.filter(
          (e) => e.triggerMethod === 1 || e.triggerMethod === 2
        );
        return Math.round((automatedEvents.length / eventsList.length) * 100);
      };

      const currentAutomationPercentage =
        calculateAutomationPercentage(currentPeriodEvents);
      const previousAutomationPercentage =
        calculateAutomationPercentage(previousPeriodEvents);

      const changePercent =
        previousAutomationPercentage > 0
          ? Math.abs(
              ((currentAutomationPercentage - previousAutomationPercentage) /
                previousAutomationPercentage) *
                100
            )
          : 0;

      const isIncrease =
        currentAutomationPercentage > previousAutomationPercentage;

      return {
        value: currentAutomationPercentage,
        change: Math.round(changePercent * 10) / 10,
        isIncrease,
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
        return { value: 0, unit: "hrs", change: 0, isIncrease: false };
      }

      const now = new Date();
      const currentPeriodStart = new Date(
        now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000
      );
      const previousPeriodStart = new Date(
        now.getTime() - timePeriodDays * 2 * 24 * 60 * 60 * 1000
      );

      // Filter events for current and previous periods
      const currentPeriodEvents = events.filter((e) => {
        const eventDate = new Date(e.startTime);
        return eventDate >= currentPeriodStart;
      });

      const previousPeriodEvents = events.filter((e) => {
        const eventDate = new Date(e.startTime);
        return (
          eventDate >= previousPeriodStart && eventDate < currentPeriodStart
        );
      });

      // Calculate total irrigation hours
      const currentHours = currentPeriodEvents.reduce((sum, e) => {
        const duration =
          (new Date(e.endTime) - new Date(e.startTime)) / (1000 * 60 * 60);
        return sum + Math.max(duration, 0);
      }, 0);

      const previousHours = previousPeriodEvents.reduce((sum, e) => {
        const duration =
          (new Date(e.endTime) - new Date(e.startTime)) / (1000 * 60 * 60);
        return sum + Math.max(duration, 0);
      }, 0);

      const changePercent =
        previousHours > 0
          ? Math.abs(((currentHours - previousHours) / previousHours) * 100)
          : 0;

      const isIncrease = currentHours > previousHours;

      return {
        value: Math.round(currentHours * 10) / 10, // Round to 1 decimal place
        unit: "hrs",
        change: Math.round(changePercent * 10) / 10,
        isIncrease,
      };
    } catch (error) {
      console.error("Error fetching irrigation time data:", error);
      return { value: 0, unit: "hrs", change: 0, isIncrease: false };
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
        return { value: 0, change: 0, isIncrease: true };
      }

      const now = new Date();
      const currentPeriodStart = new Date(
        now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000
      );
      const previousPeriodStart = new Date(
        now.getTime() - timePeriodDays * 2 * 24 * 60 * 60 * 1000
      );

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
            const currentDetections = detectionsData.filter((d) => {
              const detectionDate = new Date(d.createdOn);
              return detectionDate >= currentPeriodStart;
            });

            // Filter by previous period
            const previousDetections = detectionsData.filter((d) => {
              const detectionDate = new Date(d.createdOn);
              return (
                detectionDate >= previousPeriodStart &&
                detectionDate < currentPeriodStart
              );
            });

            allCurrentDetections = [
              ...allCurrentDetections,
              ...currentDetections,
            ];
            allPreviousDetections = [
              ...allPreviousDetections,
              ...previousDetections,
            ];
          }
        } catch (error) {
          console.error(
            `Error fetching detections for field ${field.id}:`,
            error
          );
        }
      }

      // Calculate health index for current period
      const currentHealthIndex = calculateHealthIndex(allCurrentDetections);
      const previousHealthIndex = calculateHealthIndex(allPreviousDetections);

      // console.log(
      //   `Crop Health Debug - Current: ${currentHealthIndex}%, Previous: ${previousHealthIndex}%`
      // );
      // console.log(
      //   `Current detections: ${allCurrentDetections.length}, Previous detections: ${allPreviousDetections.length}`
      // );

      // Calculate percentage point change (not relative change)
      const percentagePointChange = Math.abs(
        currentHealthIndex - previousHealthIndex
      );
      const isIncrease = currentHealthIndex > previousHealthIndex;

      // If we want relative change instead, use this:
      // const relativeChangePercent = previousHealthIndex > 0
      //   ? Math.abs(((currentHealthIndex - previousHealthIndex) / previousHealthIndex) * 100)
      //   : 0;

      return {
        value: currentHealthIndex,
        change: Math.round(percentagePointChange * 10) / 10,
        isIncrease,
        currentDetections: allCurrentDetections.length,
        previousDetections: allPreviousDetections.length,
      };
    } catch (error) {
      console.error("Error fetching crop health data:", error);
      return { value: 100, change: 0, isIncrease: true };
    }
  };

  // Calculate health index from detections (0-100 scale)
  const calculateHealthIndex = (detections) => {
    if (!detections || detections.length === 0) {
      return 0; // No detections means perfectly healthy (no issues found)
    }

    // Count healthy detections (either healthStatus === 0 OR isHealthy === true)
    const healthyDetections = detections.filter(
      (d) => d.healthStatus === 0 || d.isHealthy === true
    );

    const healthyPercentage =
      (healthyDetections.length / detections.length) * 100;

    // console.log(
    //   `Health Index Calculation: ${healthyDetections.length}/${
    //     detections.length
    //   } healthy = ${healthyPercentage.toFixed(1)}%`
    // );

    return Math.round(healthyPercentage);
  };

  // Fetch inventory metrics
  const fetchInventoryMetrics = async () => {
    if (!token || !baseUrl || !farms[selectedFarmIndex]?.farmId) return;

    setIsLoadingInventory(true);
    try {
      const farmId = farms[selectedFarmIndex].farmId;
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
        const lowStockItems = inventoryItems.filter(
          (item) => item.stockLevel === "Low" || item.stockLevel === "low"
        ).length;

        // Calculate stock health percentage (items that are not low stock)
        const healthyStockItems = totalItems - lowStockItems;

        const stockHealthPercent =
          totalItems > 0
            ? Math.round((healthyStockItems / totalItems) * 100)
            : 0;

        setInventoryMetrics({
          totalItems,
          lowStockItems,
          stockHealthPercent,
        });
      } else {
        setInventoryMetrics({
          totalItems: 0,
          lowStockItems: 0,
          stockHealthPercent: 100,
        });
      }
    } catch (error) {
      console.error("Error fetching inventory metrics:", error);
      setInventoryMetrics({
        totalItems: 0,
        lowStockItems: 0,
        stockHealthPercent: 100,
      });
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // Handle export functionality
  const handleExport = async () => {
    if (!farms[selectedFarmIndex] || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const exportService = new AnalyticsExportService(baseUrl, token);
      const selectedFarm = farms[selectedFarmIndex];
      const selectedPeriod = timePeriods[selectedPeriodIndex];

      const result = await exportService.exportReport(
        selectedFarm.farmId,
        selectedFarm.name,
        selectedPeriod
      );

      if (result.success) {
        toast.success("Analytics report exported successfully!");
      } else {
        toast.error(result.message || "Failed to export report");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export analytics report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="text-[#0D121C] transition-all duration-500">
      <Helmet>
        <title>
          {farms[selectedFarmIndex]?.name || "Analytics"} - Analytics
        </title>
      </Helmet>
      <div className="flex gap-y-3 flex-col xl:flex-row justify-between items-start xl:items-center mb-5 xl:mb-7">
        <div className="text-center xl:text-start w-full xl:w-auto">
          <h1 className="text-lg sm:text-xl xl:text-[22px] font-semibold">
            Analytics & Reports
          </h1>
          <p className="text-sm sm:text-base xl:text-[16px] text-[#616161] font-medium">
            {farms[selectedFarmIndex]?.name
              ? `Detailed insights for ${farms[selectedFarmIndex].name}`
              : "Select a farm to view analytics"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 xl:flex-row items-stretch sm:items-center xl:items-center w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <MenuElement
              Items={farmNames}
              nameChange={farms[selectedFarmIndex]?.name}
              setIndex={handleFarmChange}
              index={selectedFarmIndex}
              name={
                isLoadingFarms
                  ? "Loading farms..."
                  : farmNames.length > 0
                  ? "Select Farm"
                  : "No farms available"
              }
              Pformat={
                "text-[#0D121C] font-[400] px-[10px] text-sm whitespace-nowrap"
              }
              className={`min-w-[140px] h-[38px] ${
                isLoadingFarms || farmNames.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              width="auto"
            />
            <MenuElement
              Items={timePeriods}
              nameChange={timePeriods[selectedPeriodIndex]}
              setIndex={handleTimePeriodChange}
              index={selectedPeriodIndex}
              name={"Last 30 days"}
              Pformat={
                "text-[#0D121C] font-[400] px-[10px] text-sm whitespace-nowrap"
              }
              className={"min-w-[130px] h-[38px]"}
              width="auto"
            />
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting || !farms[selectedFarmIndex]}
            className={`border-[1px] border-[#D9D9D9] rounded-[6px] px-3 py-2 sm:px-[12px] sm:py-[7px] w-full sm:w-auto h-[38px] flex items-center justify-center transition-colors duration-200 ${
              isExporting || !farms[selectedFarmIndex]
                ? "opacity-50 cursor-not-allowed bg-gray-50"
                : "hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              ) : (
                <Download strokeWidth={1.7} size={16} />
              )}
              <p className="text-xs sm:text-sm whitespace-nowrap">
                {isExporting ? "Exporting..." : "Export"}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Cards - Only show when farms are loaded and available */}
      {!isLoadingFarms && farmNames.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-[24px]">
          {/* 1. Crop Health Index */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)]">
            <div className="font-manrope px-3 sm:px-4 xl:px-[18px] pb-3 sm:pb-4 xl:pb-[16px]">
              <div className="pt-3 sm:pt-3 xl:pt-[12px] mb-2 sm:mb-[8px] flex justify-between items-center">
                <h3 className="text-sm sm:text-base xl:text-[16px] font-semibold capitalize">
                  crop health index
                </h3>
                <Leaf size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1 sm:space-y-[6px] mb-2 sm:mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-xs sm:text-sm xl:text-[14px] min-h-[32px] flex items-end">
                  {isLoadingMetrics
                    ? "Loading..."
                    : `Based on ${
                        cardMetrics.cropHealthIndex.currentDetections || 0
                      } detections (${timePeriods[selectedPeriodIndex]})`}
                </p>
                <p className="text-sm sm:text-base xl:text-[15px]">
                  {isLoadingMetrics
                    ? "Loading..."
                    : `${cardMetrics.cropHealthIndex.value || 0}%`}
                </p>
              </div>
              <div className="mt-1 text-xs sm:text-sm xl:text-[14px] font-manrope">
                <div className="space-y-1 sm:space-y-[6px]">
                  <Line
                    percent={cardMetrics.cropHealthIndex.value || 0}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[#616161] text-xs sm:text-xs xl:text-[13px] font-semibold">
                    {isLoadingMetrics
                      ? "Loading..."
                      : `Healthy detections: ${
                          cardMetrics.cropHealthIndex.value || 0
                        }% (Target: 85-100%)`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 2. Automation Usage */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)]">
            <div className="font-manrope px-3 sm:px-4 xl:px-[18px] pb-3 sm:pb-4 xl:pb-[16px]">
              <div className="pt-3 sm:pt-3 xl:pt-[12px] mb-2 sm:mb-[8px] flex justify-between items-center">
                <h3 className="text-sm sm:text-base xl:text-[16px] font-semibold capitalize">
                  automation usage
                </h3>
                <Zap size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1 sm:space-y-[6px] mb-2 sm:mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-xs sm:text-sm xl:text-[14px] min-h-[32px] flex items-end">
                  Trigger method analysis
                </p>
                <p className="text-sm sm:text-base xl:text-[15px]">
                  {isLoadingMetrics
                    ? "Loading..."
                    : `${cardMetrics.automationUsage.value}% automated`}
                </p>
              </div>
              <div className="mt-1 text-xs sm:text-sm xl:text-[14px] font-manrope">
                <div className="space-y-1 sm:space-y-[6px]">
                  <Line
                    percent={cardMetrics.automationUsage.value}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[#616161] text-xs sm:text-xs xl:text-[13px] font-semibold">
                    Manual vs. automated triggers
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 3. Irrigation Activity */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)]">
            <div className="font-manrope px-3 sm:px-4 xl:px-[18px] pb-3 sm:pb-4 xl:pb-[16px]">
              <div className="pt-3 sm:pt-3 xl:pt-[12px] mb-2 sm:mb-[8px] flex justify-between items-center">
                <h3 className="text-sm sm:text-base xl:text-[16px] font-semibold capitalize">
                  irrigation activity
                </h3>
                <Droplet size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1 sm:space-y-[6px] mb-2 sm:mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-xs sm:text-sm xl:text-[14px] min-h-[32px] flex items-end">
                  {timePeriods[selectedPeriodIndex]}
                </p>
                <p className="text-sm sm:text-base xl:text-[15px]">
                  {isLoadingMetrics
                    ? "Loading..."
                    : `${cardMetrics.irrigationActivity.value} ${cardMetrics.irrigationActivity.unit}`}
                </p>
              </div>
              <div className="mt-1 text-xs sm:text-sm xl:text-[14px] font-manrope">
                <div className="space-y-1 sm:space-y-[6px]">
                  <Line
                    percent={cardMetrics.irrigationActivity.value}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[#616161] text-xs sm:text-xs xl:text-[13px] font-semibold">
                    Total irrigation time
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 4. Inventory */}
          <div className="rounded-[12px] border-[1px] border-[rgba(13,18,28,0.25)]">
            <div className="font-manrope px-3 sm:px-4 xl:px-[18px] pb-3 sm:pb-4 xl:pb-[16px]">
              <div className="pt-3 sm:pt-3 xl:pt-[12px] mb-2 sm:mb-[8px] flex justify-between items-center">
                <h3 className="text-sm sm:text-base xl:text-[16px] font-semibold capitalize">
                  inventory status
                </h3>
                <Package size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1 sm:space-y-[6px] mb-2 sm:mb-[8px] font-semibold min-h-[44px] flex flex-col justify-between">
                <p className="text-[#616161] text-xs sm:text-sm xl:text-[14px] min-h-[32px] flex items-end">
                  Stock levels overview
                </p>
                <p className="text-sm sm:text-base xl:text-[15px]">
                  {isLoadingInventory
                    ? "Loading..."
                    : `${inventoryMetrics.totalItems} items`}
                </p>
              </div>
              <div className="mt-1 text-xs sm:text-sm xl:text-[14px] font-manrope">
                <div className="space-y-1 sm:space-y-[6px]">
                  <Line
                    percent={inventoryMetrics.stockHealthPercent}
                    strokeLinecap="round"
                    strokeColor="#1E6930"
                    className="h-[5px] text-mainColor w-full rounded-lg"
                  />
                  <p className="text-[#616161] text-xs sm:text-xs xl:text-[13px] font-semibold">
                    {isLoadingInventory
                      ? "Loading..."
                      : `${inventoryMetrics.lowStockItems} items low stock`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation and Analytics Content - Only show when farms are available */}
      {!isLoadingFarms && farmNames.length > 0 && (
        <div className="mt-5 sm:mt-6 xl:mt-[28px]">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-[8px] min-h-[44px] sm:min-h-[50px] xl:min-h-[56px] rounded-[8px] bg-[rgba(217,217,217,0.3)] p-2 sm:p-2 xl:p-[8px] text-xs sm:text-sm xl:text-[14px] font-medium mb-4 sm:mb-5 xl:mb-[32px]">
            <div
              className={`py-2 px-2 sm:py-2 sm:px-2 xl:py-[10px] xl:px-[10px] rounded-[8px] cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:space-x-[3px] touch-target-44 transition-all duration-200 ${
                part === "irrigation"
                  ? "bg-[#FFFFFF] text-mainColor shadow-sm"
                  : "text-[#9F9F9F] hover:text-[#6B7280]"
              }`}
              onClick={() => {
                setPart("irrigation");
              }}
            >
              <Droplet size={14} className="sm:w-4 sm:h-4 mb-1 sm:mb-0" />
              <p className="text-center text-xs sm:text-sm whitespace-nowrap">
                Irrigation
              </p>
            </div>
            <div
              className={`py-2 px-2 sm:py-2 sm:px-2 xl:py-[10px] xl:px-[10px] rounded-[8px] cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:space-x-[3px] touch-target-44 transition-all duration-200 ${
                part === "plant health"
                  ? "bg-[#FFFFFF] text-mainColor shadow-sm"
                  : "text-[#9F9F9F] hover:text-[#6B7280]"
              }`}
              onClick={() => {
                setPart("plant health");
              }}
            >
              <Leaf size={14} className="sm:w-4 sm:h-4 mb-1 sm:mb-0" />
              <p className="text-center text-xs sm:text-sm whitespace-nowrap">
                Plant Health
              </p>
            </div>
            <div
              className={`py-2 px-2 sm:py-2 sm:px-2 xl:py-[10px] xl:px-[10px] rounded-[8px] cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:space-x-[3px] touch-target-44 transition-all duration-200 ${
                part === "inventory"
                  ? "bg-[#FFFFFF] text-mainColor shadow-sm"
                  : "text-[#9F9F9F] hover:text-[#6B7280]"
              }`}
              onClick={() => {
                setPart("inventory");
              }}
            >
              <Package size={14} className="sm:w-4 sm:h-4 mb-1 sm:mb-0" />
              <p className="text-center text-xs sm:text-sm whitespace-nowrap">
                Inventory
              </p>
            </div>
            <div
              className={`py-2 px-2 sm:py-2 sm:px-2 xl:py-[10px] xl:px-[10px] rounded-[8px] cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:space-x-[3px] touch-target-44 transition-all duration-200 ${
                part === "tasks"
                  ? "bg-[#FFFFFF] text-mainColor shadow-sm"
                  : "text-[#9F9F9F] hover:text-[#6B7280]"
              }`}
              onClick={() => {
                setPart("tasks");
              }}
            >
              <ClipboardCheck
                size={14}
                className="sm:w-4 sm:h-4 mb-1 sm:mb-0"
              />
              <p className="text-center text-xs sm:text-sm whitespace-nowrap">
                Tasks
              </p>
            </div>
          </div>

          {/* Analytics Content */}
          {isLoadingFarms ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor mx-auto mb-4"></div>
                <p className="text-[#616161] text-lg">Loading farms...</p>
              </div>
            </div>
          ) : farmNames.length === 0 ? (
            <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
              <TriangleAlert size={48} className="text-yellow-500 mb-2" />
              <p className="text-[#808080]">No Analytics Access</p>
              <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
                You need &quot;Expert&quot; or &quot;Owner&quot; role in at
                least one farm to view analytics reports.
              </p>
            </div>
          ) : (
            <>
              {part === "irrigation" ? (
                <IrrigationPartAnalytics
                  selectedFarmId={farms[selectedFarmIndex]?.farmId}
                  timePeriodDays={getTimePeriodInDays()}
                  timePeriodLabel={timePeriods[selectedPeriodIndex]}
                />
              ) : part === "plant health" ? (
                <PlantHealth
                  farmId={farms[selectedFarmIndex]?.farmId}
                  timePeriodDays={getTimePeriodInDays()}
                  timePeriodLabel={timePeriods[selectedPeriodIndex]}
                />
              ) : part === "inventory" ? (
                <Inventory
                  farmId={farms[selectedFarmIndex]?.farmId}
                  timePeriodDays={getTimePeriodInDays()}
                  timePeriodLabel={timePeriods[selectedPeriodIndex]}
                />
              ) : part === "tasks" ? (
                <TasksPart
                  farmId={farms[selectedFarmIndex]?.farmId}
                  timePeriodDays={getTimePeriodInDays()}
                  timePeriodLabel={timePeriods[selectedPeriodIndex]}
                />
              ) : null}
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Analytics;
