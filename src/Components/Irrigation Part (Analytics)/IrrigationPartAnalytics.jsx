/* eslint-disable react/prop-types */
import { Clock, Zap, Calendar, User, Eye, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useContext, useState, useEffect } from "react";
import { userContext } from "../../Context/User.context";
import { AllContext } from "../../Context/All.context";
import axios from "axios";
import toast from "react-hot-toast";
const IrrigationPartAnalytics = ({
  selectedFarmId,
  timePeriodDays = 30,
  timePeriodLabel = "Last 30 days",
}) => {
  const { token } = useContext(userContext);
  const { baseUrl } = useContext(AllContext);

  // States for real data
  const [irrigationData, setIrrigationData] = useState({
    chartData: [],
    fieldStats: {},
    totalEvents: 0,
    thresholdEvents: 0,
    scheduledEvents: 0,
    manualEvents: 0,
    automationCoverage: 0,
    currentPeriodHours: 0,
    previousPeriodHours: 0,
    changePercentage: 0,
    avgDurationHours: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  // Fetch irrigation events data
  const fetchIrrigationData = async () => {
    if (!token || !baseUrl || !selectedFarmId) return;

    setIsLoading(true);
    try {
      const options = {
        url: `${baseUrl}/farms/${selectedFarmId}/IrrigationEvents`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data: events } = await axios(options);

      // Process the data
      processIrrigationData(events || []);
    } catch (error) {
      console.error("Error fetching irrigation data:", error);
      toast.error("Failed to load irrigation data");
    } finally {
      setIsLoading(false);
    }
  };

  // Process irrigation events data
  const processIrrigationData = (events) => {
    if (!events || events.length === 0) {
      setIrrigationData({
        chartData: [],
        fieldStats: {},
        totalEvents: 0,
        thresholdEvents: 0,
        scheduledEvents: 0,
        manualEvents: 0,
        automationCoverage: 0,
        currentPeriodHours: 0,
        previousPeriodHours: 0,
        changePercentage: 0,
        avgDurationHours: 0,
      });
      return;
    }

    console.log("Processing irrigation events:", events);

    // Calculate duration for each event
    const eventsWithDuration = events.map((event) => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      const durationMs = endTime - startTime;
      const durationMinutes = durationMs / (1000 * 60); // Convert ms to minutes
      const durationHours = durationMinutes / 60; // Convert minutes to hours

      console.log(
        `Event ${
          event.id
        }: ${startTime.toISOString()} to ${endTime.toISOString()}`
      );
      console.log(
        `Duration: ${durationMs}ms = ${durationMinutes.toFixed(
          2
        )} minutes = ${durationHours.toFixed(4)} hours`
      );

      return {
        ...event,
        durationHours: Math.max(durationHours, 0), // Ensure non-negative
        durationMinutes: Math.max(durationMinutes, 0),
      };
    });

    // Generate chart data based on selected time period
    const chartData = generateChartData(eventsWithDuration);

    // Calculate field statistics for trigger method distribution
    const fieldStats = calculateFieldStats(eventsWithDuration);

    // Calculate overall metrics
    const totalEvents = events.length;
    const manualEvents = events.filter((e) => e.triggerMethod === 0).length;
    const thresholdEvents = events.filter((e) => e.triggerMethod === 1).length;
    const scheduledEvents = events.filter((e) => e.triggerMethod === 2).length;

    const automatedEvents = thresholdEvents + scheduledEvents;
    const automationCoverage =
      totalEvents > 0 ? Math.round((automatedEvents / totalEvents) * 100) : 0;

    // Calculate period comparisons (current period vs previous period)
    const now = new Date();
    const currentPeriodStart = new Date(
      now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000
    );
    const previousPeriodStart = new Date(
      now.getTime() - timePeriodDays * 2 * 24 * 60 * 60 * 1000
    );

    const currentPeriodEvents = eventsWithDuration.filter(
      (e) => new Date(e.startTime) >= currentPeriodStart
    );
    const previousPeriodEvents = eventsWithDuration.filter((e) => {
      const eventDate = new Date(e.startTime);
      return eventDate >= previousPeriodStart && eventDate < currentPeriodStart;
    });

    const currentPeriodHours = currentPeriodEvents.reduce(
      (sum, e) => sum + e.durationHours,
      0
    );
    const previousPeriodHours = previousPeriodEvents.reduce(
      (sum, e) => sum + e.durationHours,
      0
    );

    const changePercentage =
      previousPeriodHours > 0
        ? Math.round(
            ((currentPeriodHours - previousPeriodHours) / previousPeriodHours) *
              100
          )
        : 0;

    const avgDurationHours =
      totalEvents > 0
        ? eventsWithDuration.reduce((sum, e) => sum + e.durationHours, 0) /
          totalEvents
        : 0;

    // Update state
    setIrrigationData({
      chartData,
      fieldStats,
      totalEvents,
      thresholdEvents,
      scheduledEvents,
      manualEvents,
      automationCoverage,
      currentPeriodHours: Math.round(currentPeriodHours * 10) / 10,
      previousPeriodHours: Math.round(previousPeriodHours * 10) / 10,
      changePercentage,
      avgDurationHours: Math.round(avgDurationHours * 10) / 10,
    });

    // Store all events for modal display (sorted by most recent first)
    setAllEvents(
      eventsWithDuration.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      )
    );
  };

  // Generate chart data grouped by crop/field based on selected time period
  const generateChartData = (events) => {
    const now = new Date();
    const periods = [];

    console.log("Generating chart data for events:", events);
    console.log("Current date:", now);
    console.log("Time period:", timePeriodDays, "days");

    // Calculate number of periods and period length based on time period
    let numPeriods, periodDays, periodLabel;

    if (timePeriodDays <= 7) {
      numPeriods = 7;
      periodDays = 1;
      periodLabel = "Day";
    } else if (timePeriodDays <= 30) {
      numPeriods = 4;
      periodDays = 7;
      periodLabel = "Week";
    } else if (timePeriodDays <= 90) {
      numPeriods = 6;
      periodDays = 15;
      periodLabel = "Period";
    } else if (timePeriodDays <= 180) {
      numPeriods = 6;
      periodDays = 30;
      periodLabel = "Month";
    } else {
      numPeriods = 12;
      periodDays = 30;
      periodLabel = "Month";
    }

    // Generate periods
    for (let i = numPeriods - 1; i >= 0; i--) {
      const periodEnd = new Date(
        now.getTime() - i * periodDays * 24 * 60 * 60 * 1000
      );
      const periodStart = new Date(
        periodEnd.getTime() - periodDays * 24 * 60 * 60 * 1000
      );

      periods.push({
        label: `${periodLabel} ${numPeriods - i}`,
        start: periodStart,
        end: periodEnd,
      });
    }

    console.log("Period ranges:", periods);

    // Filter events to only include those within the selected time period
    const cutoffDate = new Date(
      now.getTime() - timePeriodDays * 24 * 60 * 60 * 1000
    );
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= cutoffDate;
    });

    console.log(
      `Filtered ${filteredEvents.length} events from last ${timePeriodDays} days`
    );

    // Group events by crop for each period
    const chartData = periods.map((period) => {
      const periodEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.startTime);
        const isInRange = eventDate >= period.start && eventDate < period.end;
        return isInRange;
      });

      console.log(`${period.label} events:`, periodEvents.length);

      // Group by crop and sum durations
      const cropHours = {};
      periodEvents.forEach((event) => {
        const crop = event.cropName || "Unknown";
        const hours = event.durationHours;
        cropHours[crop] = (cropHours[crop] || 0) + hours;
      });

      return {
        week: period.label,
        ...cropHours,
      };
    });

    console.log("Final chart data:", chartData);

    // If no data in recent periods, show all filtered events grouped artificially
    const hasData = chartData.some(
      (period) => Object.keys(period).filter((key) => key !== "week").length > 0
    );

    if (!hasData && filteredEvents.length > 0) {
      console.log(
        "No data in recent periods, creating fallback with all filtered events"
      );

      // Simple fallback: distribute all filtered events across periods
      const eventsPerPeriod = Math.ceil(filteredEvents.length / numPeriods);
      const fallbackData = [];

      for (let periodIndex = 0; periodIndex < numPeriods; periodIndex++) {
        const periodEvents = filteredEvents.slice(
          periodIndex * eventsPerPeriod,
          (periodIndex + 1) * eventsPerPeriod
        );
        const periodData = { week: `${periodLabel} ${periodIndex + 1}` };

        periodEvents.forEach((event) => {
          const crop = event.cropName || "Unknown";
          periodData[crop] = (periodData[crop] || 0) + event.durationHours;
        });

        fallbackData.push(periodData);
      }

      console.log("Fallback chart data:", fallbackData);
      return fallbackData;
    }

    // If still no data, create a minimal structure
    if (chartData.every((period) => Object.keys(period).length === 1)) {
      console.log("Creating minimal chart data structure");
      return chartData.map((period) => ({
        ...period,
        "No Data": 0.001, // Very small value to show structure
      }));
    }

    return chartData;
  };

  // Calculate field statistics for trigger method distribution
  const calculateFieldStats = (events) => {
    const fieldStats = {};

    // Group events by field
    events.forEach((event) => {
      const fieldKey = `${event.fieldName}_${event.cropName}`;
      if (!fieldStats[fieldKey]) {
        fieldStats[fieldKey] = {
          fieldName: event.fieldName,
          cropName: event.cropName,
          total: 0,
          manual: 0,
          threshold: 0,
          scheduled: 0,
        };
      }

      fieldStats[fieldKey].total++;
      if (event.triggerMethod === 0) {
        fieldStats[fieldKey].manual++;
      } else if (event.triggerMethod === 1) {
        fieldStats[fieldKey].threshold++;
      } else if (event.triggerMethod === 2) {
        fieldStats[fieldKey].scheduled++;
      }
    });

    // Calculate percentages
    Object.keys(fieldStats).forEach((fieldKey) => {
      const field = fieldStats[fieldKey];
      field.manualPercent =
        field.total > 0 ? Math.round((field.manual / field.total) * 100) : 0;
      field.thresholdPercent =
        field.total > 0 ? Math.round((field.threshold / field.total) * 100) : 0;
      field.scheduledPercent =
        field.total > 0 ? Math.round((field.scheduled / field.total) * 100) : 0;
    });

    return fieldStats;
  };

  // Helper function to get trigger method name
  const getTriggerMethodName = (method) => {
    switch (method) {
      case 0:
        return { name: "Manual", color: "text-red-600 bg-red-50" };
      case 1:
        return { name: "Threshold", color: "text-green-600 bg-green-50" };
      case 2:
        return { name: "Scheduled", color: "text-blue-600 bg-blue-50" };
      default:
        return { name: "Unknown", color: "text-gray-600 bg-gray-50" };
    }
  };

  // Helper function to format duration
  const formatDuration = (hours) => {
    if (hours >= 1) {
      return `${hours.toFixed(1)} hours`;
    } else {
      return `${(hours * 60).toFixed(1)} minutes`;
    }
  };

  // Fetch data when component mounts, farm changes, or time period changes
  useEffect(() => {
    fetchIrrigationData();
  }, [token, baseUrl, selectedFarmId, timePeriodDays]);
  return (
    <section className="mb-[20px]">
      <div className="grid xl:grid-cols-3 gap-[20px]">
        <div className=" xl:col-span-2  border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px]">
          <div className="p-[16px] flex justify-between items-start">
            <div>
              <h2 className="text-[#0D121C] text-[16px] font-medium mb-[8px]">
                Irrigation Duration History
              </h2>
              <p className="text-[#616161] text-[14px] font-medium">
                Total irrigation time by field - {timePeriodLabel}
              </p>
            </div>
            {/* See All Events Button */}
            <button
              onClick={() => setShowEventsModal(true)}
              className="bg-mainColor text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-transparent hover:border-mainColor border-2 border-transparent hover:text-mainColor transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <Eye size={14} />
              See All Events ({irrigationData.totalEvents})
            </button>
          </div>
          <div className="h-[60%] xl:h-[70%]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={irrigationData.chartData}
                  margin={{ top: 20, right: 30, left: 60, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis
                    label={{
                      value: "Irrigation Time (hours)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -10,
                      style: {
                        textAnchor: "middle",
                        fontSize: 14,
                        fill: "#333",
                      },
                    }}
                    domain={[0, "dataMax + 5"]}
                    tickCount={6}
                    tickFormatter={(value) => Number(value).toFixed(2)}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const numValue = Number(value);
                      if (numValue >= 1) {
                        return [`${numValue.toFixed(1)} hours`, name];
                      } else if (numValue >= 0.01) {
                        return [`${numValue.toFixed(3)} hours`, name];
                      } else {
                        return [`${(numValue * 60).toFixed(1)} minutes`, name];
                      }
                    }}
                  />
                  <Legend
                    iconSize={16}
                    verticalAlign="top"
                    iconType="plainline"
                    height={30}
                    wrapperStyle={{ marginTop: "-16px", fontSize: "14px" }}
                  />

                  {/* Get all unique crops from all weeks */}
                  {(() => {
                    const allCrops = new Set();
                    irrigationData.chartData.forEach((week) => {
                      Object.keys(week)
                        .filter((key) => key !== "week")
                        .forEach((crop) => {
                          allCrops.add(crop);
                        });
                    });

                    console.log(
                      "All crops found for chart:",
                      Array.from(allCrops)
                    );
                    console.log(
                      "Chart data for rendering:",
                      irrigationData.chartData
                    );

                    return Array.from(allCrops).map((crop, index) => {
                      const colors = [
                        "#007bff",
                        "#FFA500",
                        "#28a745",
                        "#DC3545",
                        "#6F42C1",
                        "#20C997",
                      ];
                      return (
                        <Bar
                          key={crop}
                          barSize={32}
                          dataKey={crop}
                          fill={colors[index % colors.length]}
                          name={`${crop} Field`}
                        />
                      );
                    });
                  })()}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-between  mx-auto text-[13px] md:text-[14px] p-[16px]">
            <div className="space-y-[6px] flex flex-col items-center">
              <p className="text-[#616161]  font-semibold">This Period</p>
              <p className=" font-medium">
                {isLoading
                  ? "Loading..."
                  : `${irrigationData.currentPeriodHours} hrs`}
              </p>
            </div>
            <div className="space-y-[6px] flex flex-col items-center">
              <p className="text-[#616161]  font-semibold">Previous Period</p>
              <p className=" font-medium">
                {isLoading
                  ? "Loading..."
                  : `${irrigationData.previousPeriodHours} hrs`}
              </p>
            </div>
            <div className="space-y-[6px] flex flex-col items-center">
              <p className="text-[#616161]  font-semibold">Change</p>
              <p
                className={`font-medium ${
                  irrigationData.changePercentage >= 0
                    ? "text-[#25C462]"
                    : "text-[#E13939]"
                }`}
              >
                {isLoading
                  ? "Loading..."
                  : `${irrigationData.changePercentage >= 0 ? "+" : ""}${
                      irrigationData.changePercentage
                    }%`}
              </p>
            </div>
            <div className="space-y-[6px] flex flex-col items-center">
              <p className="text-[#616161]  font-semibold">
                Avg. Event Duration
              </p>
              <p className=" font-medium">
                {isLoading
                  ? "Loading..."
                  : `${irrigationData.avgDurationHours} hrs`}
              </p>
            </div>
          </div>
        </div>
        <div className=" grid grid-rows-2 gap-y-[24px]">
          <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px] p-[12px]">
            <h2 className="text-[#0D121C] text-[16px] font-medium mb-[10px]">
              Trigger Method Distribution
            </h2>
            <p className="text-[#616161] text-[14px] font-medium">
              How irrigation was initiated per field
            </p>
            {isLoading ? (
              <div className="flex justify-center items-center mt-[40px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
              </div>
            ) : Object.keys(irrigationData.fieldStats).length === 0 ? (
              <div className="text-center mt-[40px] text-[#616161]">
                <p>No irrigation events found</p>
              </div>
            ) : (
              Object.keys(irrigationData.fieldStats).map((fieldKey) => {
                const field = irrigationData.fieldStats[fieldKey];
                return (
                  <div key={fieldKey} className="mt-[16px] space-y-[10px]">
                    <div className="flex justify-between items-center text-[#0D121C] text-[15px] font-medium mb-[4px]">
                      <p className="">
                        {field.fieldName} ({field.cropName})
                      </p>
                      <p className="text-[12px] text-[#616161]">
                        {field.total} events
                      </p>
                    </div>
                    <div className="flex h-[5px] w-full rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-[#1E6930]"
                        style={{ width: `${field.thresholdPercent}%` }}
                      ></div>
                      <div
                        className="h-full bg-[#007bff]"
                        style={{ width: `${field.scheduledPercent}%` }}
                      ></div>
                      <div
                        className="h-full bg-[#E13939]"
                        style={{ width: `${field.manualPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
            <div className="mt-[20px] pt-[12px] border-t-[1px] border-[#9F9F9F] flex justify-between text-[12px] text-[#616161]">
              <div className="flex items-center gap-[4px]">
                <div className="w-[8px] h-[8px] bg-[#1E6930] rounded-sm"></div>
                <span>Threshold</span>
              </div>
              <div className="flex items-center gap-[4px]">
                <div className="w-[8px] h-[8px] bg-[#007bff] rounded-sm"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center gap-[4px]">
                <div className="w-[8px] h-[8px] bg-[#E13939] rounded-sm"></div>
                <span>Manual</span>
              </div>
            </div>
          </div>
          <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px] p-[12px]">
            <h2 className="text-[#0D121C] text-[16px] font-medium mb-[12px]">
              Automation Insights
            </h2>
            <p className="text-[#616161] text-[14px] font-medium">
              Trigger method performance
            </p>
            {isLoading ? (
              <div className="flex justify-center items-center mt-[40px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
              </div>
            ) : (
              <>
                <div className="mt-[16px] pb-[10px] space-y-[8px] border-b-[1px] border-[#9F9F9F]">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-[6px] items-center text-[14px] font-medium">
                      <Clock
                        strokeWidth={2}
                        size={18}
                        className="text-[#616161]"
                      />
                      <p className="">Total Events</p>
                    </div>
                    <div className="px-[8px] py-[1px] rounded-[12px] bg-[rgba(13,18,28,0.10)] border-[1px] border-[#616161]">
                      <p className=" capitalize text-[12px] text-[#616161] font-bold">
                        {irrigationData.totalEvents}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-[6px] items-center text-[14px] font-medium">
                      <Zap
                        strokeWidth={2}
                        size={18}
                        className="text-[#1E6930]"
                      />
                      <p className="">Threshold Events</p>
                    </div>
                    <div className="px-[8px] py-[1px] rounded-[12px] bg-[rgba(30,105,48,0.10)] border-[1px] border-[#1E6930]">
                      <p className=" capitalize text-[12px] text-[#1E6930] font-bold">
                        {irrigationData.thresholdEvents}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-[6px] items-center text-[14px] font-medium">
                      <Calendar
                        strokeWidth={2}
                        size={18}
                        className="text-[#007bff]"
                      />
                      <p className="">Scheduled Events</p>
                    </div>
                    <div className="px-[8px] py-[1px] rounded-[12px] bg-[rgba(0,123,255,0.10)] border-[1px] border-[#007bff]">
                      <p className=" capitalize text-[12px] text-[#007bff] font-bold">
                        {irrigationData.scheduledEvents}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-[6px] items-center text-[14px] font-medium">
                      <User
                        strokeWidth={2}
                        size={18}
                        className="text-[#E13939]"
                      />
                      <p className="">Manual Events</p>
                    </div>
                    <div className="px-[8px] py-[1px] rounded-[12px] bg-[rgba(225,57,57,0.10)] border-[1px] border-[#E13939]">
                      <p className=" capitalize text-[12px] text-[#E13939] font-bold">
                        {irrigationData.manualEvents}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" font-medium pt-[10px]">
                  <div className="flex justify-between items-center text-[15px]">
                    <p className="mb-[10px]">Automation Coverage</p>
                    <p className="text-mainColor">
                      {irrigationData.automationCoverage}%
                    </p>
                  </div>
                  <p className="text-[#616161] text-[13px]">
                    Percentage of events that were automated (threshold +
                    scheduled)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Irrigation Events Modal */}
      {showEventsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-[#0D121C]">
                All Irrigation Events ({allEvents.length})
              </h2>
              <button
                onClick={() => setShowEventsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
                </div>
              ) : allEvents.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">
                    No irrigation events found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-3 text-left font-semibold text-sm">
                          Date & Time
                        </th>
                        <th className="border p-3 text-left font-semibold text-sm">
                          Field
                        </th>
                        <th className="border p-3 text-left font-semibold text-sm">
                          Crop
                        </th>
                        <th className="border p-3 text-left font-semibold text-sm">
                          Duration
                        </th>
                        <th className="border p-3 text-left font-semibold text-sm">
                          Trigger Method
                        </th>
                        <th className="border p-3 text-left font-semibold text-sm">
                          Start Time
                        </th>
                        <th className="border p-3 text-left font-semibold text-sm">
                          End Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEvents.map((event, index) => {
                        const triggerMethod = getTriggerMethodName(
                          event.triggerMethod
                        );
                        const startDate = new Date(event.startTime);
                        const endDate = new Date(event.endTime);
                        
                        // Add 3 hours to both start and end times
                        startDate.setHours(startDate.getHours() + 3);
                        endDate.setHours(endDate.getHours() + 3);

                        return (
                          <tr
                            key={event.id || index}
                            className="hover:bg-gray-50"
                          >
                            <td className="border p-3 text-sm">
                              {startDate.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="border p-3 text-sm font-medium">
                              {event.fieldName || "Unknown Field"}
                            </td>
                            <td className="border p-3 text-sm">
                              {event.cropName || "Unknown Crop"}
                            </td>
                            <td className="border p-3 text-sm font-medium">
                              {formatDuration(event.durationHours)}
                            </td>
                            <td className="border p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${triggerMethod.color}`}
                              >
                                {triggerMethod.name}
                              </span>
                            </td>
                            <td className="border p-3 text-sm text-gray-600">
                              {startDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="border p-3 text-sm text-gray-600">
                              {event.endTime ? endDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              }) : "null"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowEventsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default IrrigationPartAnalytics;
