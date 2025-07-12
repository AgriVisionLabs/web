import imgPersonalIcon from "../../assets/images/image 6.png";
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
import { TriangleAlert } from "lucide-react";
import { Helmet } from "react-helmet";

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
      <div className="formGroup flex justify-between items-baseline px-4 transition-all duration-500">
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
                    <div className="pt-1 px-3 border-2 rounded-2xl border-[#0d121c21]">
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
          <p className="font-[500] text-[20px] mb-5">Alerts & Notifications</p>
          <div className="mt-2 flex space-x-3 items-baseline text-gray-700">
            <i className="fa-solid fa-triangle-exclamation text-[#ff0000a6]"></i>
            <p className="font-[400]">
              Disease detected in sector B-Green Acres
            </p>
          </div>
          <div className="mt-2 flex space-x-3 items-baseline text-gray-700">
            <i className="fa-solid fa-triangle-exclamation text-[#ffad33d0]"></i>
            <p className="font-[400]">
              Low soil moisture in sector C-Sunset Fields
            </p>
          </div>
          <div className="mt-2 flex space-x-3 items-baseline text-gray-700">
            <i className="fa-solid fa-triangle-exclamation text-[#0000ffa1]"></i>
            <p className="font-[400]">
              Irrigation system maintenance due - Valley View
            </p>
          </div>
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
          Key Performance Indicators
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="shadow-md px-4 py-3 rounded-xl border-2 border-[#0d121c21]">
            <div className="flex justify-between items-center">
              <p className="text-mainColor font-[500] text-[16px]">
                Temperature
              </p>
              <i className="fa-solid fa-temperature-high"></i>
            </div>
            <div className="mt-2">
              <p className="font-medium text-[20px] my-2">Good</p>
              <Line
                percent={75}
                strokeLinecap="round"
                strokeColor="#1E6930"
                className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"
              />
            </div>
          </div>
          <div className="shadow-md px-4 py-3 rounded-xl border-2 border-[#0d121c21]">
            <div className="flex justify-between items-center">
              <p className="text-mainColor font-[500] text-[16px]">
                Moisture Level
              </p>
              <i className="fa-solid fa-droplet"></i>
            </div>
            <div className="mt-2">
              <p className="font-medium text-[20px] my-2">Optimal</p>
              <Line
                percent={85}
                strokeLinecap="round"
                strokeColor="#1E6930"
                className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"
              />
            </div>
          </div>
          <div className="shadow-md px-4 py-3 rounded-xl border-2 border-[#0d121c21]">
            <div className="flex justify-between items-center">
              <p className="text-mainColor font-[500] text-[16px]">
                Crop Growth
              </p>
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
            <div className="mt-2">
              <p className="font-medium text-[20px] my-2">On Track</p>
              <Line
                percent={70}
                strokeLinecap="round"
                strokeColor="#1E6930"
                className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"
              />
            </div>
          </div>
          <div className="shadow-md px-4 py-3 rounded-xl border-2 border-[#0d121c21]">
            <div className="flex justify-between items-center">
              <p className="text-mainColor font-[500] text-[16px]">
                Yield Forecast
              </p>
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div className="mt-2">
              <p className="font-medium text-[20px] my-2">4.2 tons/acre</p>
              <Line
                percent={80}
                strokeLinecap="round"
                strokeColor="#1E6930"
                className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shadow-md px-5 py-5 rounded-xl border-2 space-y-4 border-[#0d121c21]">
          <p className="font-[500] text-[21px] mb-5 capitalize">
            Recent Activity
          </p>
          <div className="mt-2 flex space-x-5 leading-5 place-items-start">
            <img src={imgPersonalIcon} alt="User" className="w-[30px]" />
            <div className="">
              <p className="font-[400]">
                Updated irrigation schedule for Sector A
              </p>
              <p className="font-manrope font-[500] text-[#9F9F9F] text-[14px]">
                2 hours ago
              </p>
            </div>
          </div>
          <div className="mt-2 flex space-x-5 leading-5 place-items-start text-gray-700">
            <img src={imgPersonalIcon} alt="User" className="w-[30px]" />
            <div className="">
              <p className="font-[400]">
                Reported equipment malfunction in Barn 2
              </p>
              <p className="font-manrope font-[500] text-[#9F9F9F] text-[14px]">
                2 hours ago
              </p>
            </div>
          </div>
          <div className="mt-2 flex place-items-start space-x-5 leading-5 text-gray-700">
            <img src={imgPersonalIcon} alt="User" className="w-[30px]" />
            <div className="">
              <p className="font-[400]">Completed harvest in Field 3</p>
              <p className="font-manrope font-[500] text-[#9F9F9F] text-[14px]">
                2 hours ago
              </p>
            </div>
          </div>
        </div>
        <div className="shadow-md px-5 py-5 rounded-xl border-2 border-[#0d121c21]">
          <p className="font-[500] text-[21px] mb-5 capitalize">To-Do List</p>
          <div className="flex mb-3 items-center space-x-3 mt-4">
            <input
              type="checkbox"
              id="todo-1"
              className="w-[21px] h-[21px] rounded-lg accent-mainColor"
            />
            <div className="flex-grow flex justify-between">
              <label htmlFor="todo-1" className="text-[17px]">
                Schedule equipment maintenance
              </label>
              <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3 h-min">
                <p className="capitalize">Today</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              id="todo-2"
              className="w-[21px] h-[21px] rounded-lg accent-mainColor"
            />
            <div className="flex-grow flex justify-between">
              <label htmlFor="todo-2" className="text-[17px]">
                Review crop health reports
              </label>
              <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3 h-min">
                <p className="capitalize">Tomorrow</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              id="todo-3"
              className="w-[21px] h-[21px] rounded-lg accent-mainColor"
            />
            <div className="flex-grow flex justify-between">
              <label htmlFor="todo-3" className="text-[17px]">
                Update irrigation settings
              </label>
              <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3 h-min">
                <p className="capitalize">This Week</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              id="todo-4"
              className="w-[21px] h-[21px] rounded-lg accent-mainColor"
            />
            <div className="flex-grow flex justify-between">
              <label htmlFor="todo-4" className="text-[17px]">
                Order fertilizer supplies
              </label>
              <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3 h-min">
                <p className="capitalize">This Week</p>
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
