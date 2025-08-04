/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import BasicInfo from "../../Components/BasicInfo/BasicInfo";
import Team from "../../Components/Team/Team";
import { Review } from "../../Components/Review/Review";
import { Circle } from "rc-progress";
import { MapPin, SquarePen, Trash2, TriangleAlert } from "lucide-react";
import { AllContext } from "../../Context/All.context";
import { motion } from "framer-motion";
import axios from "axios";
import { userContext } from "../../Context/User.context";
import EditFarm from "../../Components/EditFarm/EditFarm";
import toast from "react-hot-toast";

const Farms = ({ setClickFarm }) => {
  const {
    basicInfo,
    team,
    review,
    setBasicInfo,
    SetOpenFarmsOrFieled,
    openFarmsOrFieled,
    setAllFarms,
    baseUrl,
  } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [farms, setFarms] = useState([]);
  const [farmFields, setFarmFields] = useState({});
  const [teamMemberList, setTeamMemberList] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [edit, setEdit] = useState(null);
  const [farmIdEdit, setFarmIdEdit] = useState(null);
  const [farmId, setFarmId] = useState(null);
  const editIcons = useRef(null);
  const deleteIcons = useRef(null);
  const [farmData, setFarmData] = useState({
    name: "",
    area: 0,
    location: "",
    soilType: 0,
    invitations: [
      {
        recipient: "",
        roleName: "",
      },
    ],
  });

  console.log({ farmData });
  console.log({ farms });

  const types = ["Sandy", "Clay", "Loamy"];

  useEffect(() => {
    if (openFarmsOrFieled == null) {
      SetOpenFarmsOrFieled(1);
    }
  }, []);

  async function getFarms() {
    if (!token) return;
    console.log(token);

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
      console.log(data);

      if (data) {
        setFarms(data);
        setAllFarms(data);
        // Fetch fields for each farm
        await fetchAllFarmFields(data);
      }
    } catch (error) {
      console.log("Error fetching farms:", error);
    } finally {
      setIsLoadingFarms(false);
    }
  }

  async function fetchAllFarmFields(farmsData) {
    if (!token || !farmsData?.length) return;

    const fieldsPromises = farmsData.map(async (farm) => {
      try {
        const options = {
          url: `${baseUrl}/Farms/${farm.farmId}/fields`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios(options);
        return { farmId: farm.farmId, fields: data || [] };
      } catch (error) {
        console.log(`Error fetching fields for farm ${farm.farmId}:`, error);
        return { farmId: farm.farmId, fields: [] };
      }
    });

    try {
      const results = await Promise.all(fieldsPromises);
      const fieldsMap = {};
      results.forEach(({ farmId, fields }) => {
        fieldsMap[farmId] = fields;
      });
      setFarmFields(fieldsMap);
    } catch (error) {
      console.log("Error fetching farm fields:", error);
    }
  }
  useEffect(() => {
    if (token) {
      getFarms();
    } else {
      setIsLoadingFarms(false);
    }
  }, [token]);

  async function deleteFarms(farmId) {
    console.log(farmId);

    try {
      const options = {
        url: `${baseUrl}/Farms/${farmId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios(options);
      await getFarms();
      SetOpenFarmsOrFieled(1);
      toast.success("Farm Deleted");
      // setFarms((prev) => prev.filter((farm) => farm !== prev));
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  }

  return (
    <>
      <div className="order-7 transition-all duration-500 space-y-10">
        <div className="flex justify-between items-center px-3 mb-10">
          <p className="text-[15px] md:text-[17px] lg:text-[18px] xl:text-[20px] capitalize font-medium">
            Farms & Fields Management
          </p>
          <button
            className="btn self-end py-4 w-auto px-2 md:px-4 bg-mainColor text-[12px] md:text-[14px] text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-medium"
            onClick={() => {
              setBasicInfo(true);
            }}
          >
            <i className="fa-solid fa-plus pe-2"></i> Add New Farm
          </button>
        </div>
        {isLoadingFarms ? (
          <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 mx-3 mt-20 flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
            <p className="text-[#808080]">Loading farms...</p>
          </div>
        ) : farms.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {farms.map((farm, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)] cursor-pointer h-full"
              >
                <div className="shadow-md rounded-xl border-[1px] border-[#0d121c21] h-full flex flex-col">
                  <div
                    className="px-[24px] py-6 grid grid-cols-1 h-full"
                    onClick={(e) => {
                      if (
                        e.target !== editIcons.current &&
                        e.target !== deleteIcons.current
                      ) {
                        SetOpenFarmsOrFieled(2);
                        setClickFarm(farm.farmId);
                      }
                    }}
                  >
                    <p className="font-[600] mb-4 capitalize text-mainColor text-[18px]">
                      {farm.name}
                    </p>
                    <div className="flex items-center space-x-2 text-[16px] mb-4 text-[#515050]">
                      <MapPin size={18} />
                      <p className="">{farm.location}</p>
                    </div>
                    <div className="grid grid-cols-2 mb-8 gap-y-3 font-medium text-[#2a2929]">
                      <p className="capitalize">Fields: {farm.fieldsNo}</p>
                      <p className="capitalize">Area: {farm.area} acres</p>
                      <p className="capitalize">
                        Avg. Growth:{" "}
                        {(() => {
                          const fields = farmFields[farm.farmId] || [];
                          const plantedFields = fields.filter(
                            (field) => field.cropName && field.progress !== null
                          );
                          if (plantedFields.length === 0) return "N/A";
                          const avgProgress =
                            plantedFields.reduce(
                              (sum, field) => sum + (field.progress || 0),
                              0
                            ) / plantedFields.length;
                          return Math.round(avgProgress) + "%";
                        })()}
                      </p>
                      <p className="capitalize">
                        Soil Type: {types[farm.soilType]}
                      </p>
                    </div>
                    {(() => {
                      const fields = farmFields[farm.farmId] || [];
                      const plantedFields = fields.filter(
                        (field) => field.cropName
                      );
                      const hasCrops = plantedFields.length > 0;

                      if (!hasCrops && fields.length > 0) {
                        return (
                          <div className="flex justify-center mb-8">
                            <div className="text-center">
                              <p className="text-yellow-600 font-medium text-[16px] mb-2">
                                ⚠️ No planted crops in fields
                              </p>
                              <p className="text-gray-500 text-[14px]">
                                Fields are available but no crops are planted
                                yet
                              </p>
                            </div>
                          </div>
                        );
                      }

                      if (plantedFields.length === 0) {
                        return (
                          <div className="flex justify-center mb-8">
                            <div className="text-center">
                              <p className="text-yellow-600 font-medium text-[16px] mb-2">
                                ⚠️ No fields available
                              </p>
                              <p className="text-gray-500 text-[14px]">
                                Create fields to start planting crops
                              </p>
                            </div>
                          </div>
                        );
                      }

                      const fieldsToShow = plantedFields.slice(0, 5); // Max 5 fields
                      const fieldCount = fieldsToShow.length;

                      return (
                        <div className="mb-6 w-[100%] text-[#2a2929]">
                          {fieldCount <= 3 ? (
                            // 1-3 fields: single row centered
                            <div
                              className={`grid ${
                                fieldCount === 1
                                  ? "grid-cols-1"
                                  : fieldCount === 2
                                  ? "grid-cols-2"
                                  : "grid-cols-3"
                              } justify-center gap-6`}
                            >
                              {fieldsToShow.map((field, fieldIndex) => {
                                const progress = field.progress || 0;
                                return (
                                  <div
                                    key={field.id || fieldIndex}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="relative">
                                      <Circle
                                        percent={progress}
                                        strokeWidth="7"
                                        gapDegree="0"
                                        trailWidth="7"
                                        strokeLinecap="round"
                                        strokeColor="#1E6930"
                                        trailColor="#1e693021"
                                        className="w-[90px] h-[90px]"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[#2a2929] font-medium text-[14px]">
                                          {progress}%
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-[16px] font-medium capitalize mt-2 text-center">
                                      {field.cropName}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            // 4-5 fields: multiple rows
                            <div className="space-y-4">
                              {/* First row: 3 fields */}
                              <div className="grid grid-cols-3 justify-center gap-6">
                                {fieldsToShow
                                  .slice(0, 3)
                                  .map((field, fieldIndex) => {
                                    const progress = field.progress || 0;
                                    return (
                                      <div
                                        key={field.id || fieldIndex}
                                        className="flex flex-col items-center"
                                      >
                                        <div className="relative">
                                          <Circle
                                            percent={progress}
                                            strokeWidth="7"
                                            gapDegree="0"
                                            trailWidth="7"
                                            strokeLinecap="round"
                                            strokeColor="#1E6930"
                                            trailColor="#1e693021"
                                            className="w-[90px] h-[90px]"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-[#2a2929] font-medium text-[14px]">
                                              {progress}%
                                            </span>
                                          </div>
                                        </div>
                                        <p className="text-[16px] font-medium capitalize mt-2 text-center">
                                          {field.cropName}
                                        </p>
                                      </div>
                                    );
                                  })}
                              </div>
                              {/* Second row: remaining fields centered */}
                              {fieldsToShow.length > 3 && (
                                <div
                                  className={`grid ${
                                    fieldsToShow.length === 4
                                      ? "grid-cols-1"
                                      : "grid-cols-2"
                                  } justify-center gap-6`}
                                >
                                  {fieldsToShow
                                    .slice(3)
                                    .map((field, fieldIndex) => {
                                      const progress = field.progress || 0;
                                      return (
                                        <div
                                          key={field.id || fieldIndex + 3}
                                          className="flex flex-col items-center"
                                        >
                                          <div className="relative">
                                            <Circle
                                              percent={progress}
                                              strokeWidth="7"
                                              gapDegree="0"
                                              trailWidth="7"
                                              strokeLinecap="round"
                                              strokeColor="#1E6930"
                                              trailColor="#1e693021"
                                              className="w-[90px] h-[90px]"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <span className="text-[#2a2929] font-medium text-[14px]">
                                                {progress}%
                                              </span>
                                            </div>
                                          </div>
                                          <p className="text-[16px] font-medium capitalize mt-2 text-center">
                                            {field.cropName}
                                          </p>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    <div className="flex justify-between items-center mt-auto">
                      <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3 h-min">
                        <p className="font-[500] text-[14px]">
                          {farm.roleName}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        {/* Only show edit and delete icons if user role is "owner" */}
                        {farm.roleName?.toLowerCase() === "owner" && (
                          <>
                            <SquarePen
                              strokeWidth={1.7}
                              className="hover:text-mainColor transition-all duration-150 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation(); // ⛔ prevent bubbling to parent
                                setFarmIdEdit(farm.farmId);
                                setEdit(true);
                              }}
                            />
                            <Trash2
                              strokeWidth={1.7}
                              className="hover:text-red-700 transition-all duration-150 cursor-pointer"
                              onClick={async (e) => {
                                e.stopPropagation(); // ⛔ prevent bubbling to parent
                                console.log("delete id", farm.farmId);
                                await deleteFarms(farm.farmId);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
            <TriangleAlert size={48} className="text-yellow-500 mb-2" />
            <p className="text-[#808080]">You haven&apos;t added any farms or fields yet.</p>
            <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
              Add your first farm to start managing your agricultural operations.
            </p>
          </div>
        )}
      </div>
      {basicInfo && (
        <div className="fixed z-50 inset-0">
          <BasicInfo farmData={farmData} setFarmData={setFarmData} />
        </div>
      )}
      {team && (
        <div className="fixed z-50 inset-0">
          <Team
            farmData={farmData}
            setFarmData={setFarmData}
            teamMemberList={teamMemberList}
            setTeamMemberList={setTeamMemberList}
          />
        </div>
      )}
      {review && (
        <div className="fixed z-50 inset-0">
          <Review farmId={farmId} farmData={farmData} display={getFarms} />
        </div>
      )}

      {edit && (
        <div className="fixed z-50 inset-0">
          <EditFarm farmId={farmIdEdit} setEdit={setEdit} display={getFarms} />
        </div>
      )}
    </>
  );
};

export default Farms;
