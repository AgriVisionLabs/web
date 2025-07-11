import { useContext, useEffect, useRef, useState } from "react";
import BasicInfo from "../../Components/BasicInfo/BasicInfo";
import Team from "../../Components/Team/Team";
import Review from "../../Components/Review/Review";
import { Circle } from "rc-progress";
import { MapPin, SquarePen, Trash2 } from "lucide-react";
import { AllContext } from "../../Context/All.context";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "@axiosInstance";
import { userContext } from "../../Context/User.context";
import EditBasicInfo from "../../Components/EditBasicInfo/EditBasicInfo";
import EditTeam from "../../Components/EditTeam/EditTeam";
import EditReview from "../../Components/EditReview/EditReview";
import Farm from "../../Components/Farm/Farm";

const Farms = (children) => {
  let {
    basicInfo,
    team,
    review,
    setBasicInfo,
    SetOpenFarmsOrFieled,
    setAllFarms,
    baseUrl,
  } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [farms, setFarms] = useState([]);
  let [teamMemberList, setTeamMemberList] = useState([]);
  let [edit, setEdit] = useState(null);
  let [farmIdEdit, setFarmIdEdit] = useState(null);
  let [farmId, setFarmId] = useState(null);
  let [farmData, setFarmData] = useState({
    name: "",
    area: "",
    location: "",
    soilType: "",
    invitations: [
      {
        recipient: "",
        roleName: "",
      },
    ],
  });
  var types = ["Sandy", "Clay", "Loamy"];
  async function getFarms() {
    console.log(token);
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
        setFarms(data);
        setAllFarms(data);
        console.log(data);
      }
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  
  // async function editFarms(){
  //     try {
  //         const options={
  //             url:`${baseUrl}/Farms`,
  //             method:"GET",
  //             headers:{
  //                 Authorization:`Bearer ${token}`,
  //             }
  //         }
  //         let {data}=await axios(options);
  //         setFarms(data);
  //         console.log(farms)
  //     }catch(error){
  // toast.error("Incorrect email or password "+error);
  //     }finally{
  //         toast.dismiss("Incorrect");
  //     }
  // }
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
    } catch (error) {
      if(error.response.data){
        if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
        else{toast.error("There is an error");}
      }else{console.log(error)}
    } finally {
      toast.dismiss("Incorrect");
      getFarms();
    }
  }
  // async function getFields(farmId){
  //     try {
  //         const options={
  //             url:`${baseUrl}/farms/${farmId}/Fields` ,
  //             method:"GET",
  //             headers:{
  //                 Authorization:`Bearer ${token}`,
  //             }
  //         }
  //         let {data}=await axios(options);
  //         console.log("fields: "+data)
  //         return data;
  //     }catch(error){
  // toast.error("Incorrect email or password "+error);
  //         console.log("fields error : "+error)
  //     }finally{
  //         toast.dismiss("Incorrect");
  //     }
  //     return []
  // }
  useEffect(() => {
    getFarms();
  }, [token]);
  return (
    <>
      <div className="order-7 transition-all duration-500 space-y-10 h-full">
        <div className=" flex justify-between items-center px-3 mb-10">
          <p className="text-[15px] md:text-[17px] lg:text-[18px] xl:text-[20px] capitalize font-medium">
            farms & fields management
          </p>
          <button
            className="btn self-end py-4 w-auto px-2 md:px-4 bg-mainColor text-[12px] md:text-[14px]  text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-medium  "
            onClick={() => {
              setBasicInfo(true);
            }}
          >
            <i className="fa-solid fa-plus pe-2"></i> add new farm
          </button>
        </div>
        {farms.length?<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {farms?farms.map((farm, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ x: 300, y: -50, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.35,
                      duration: 0.5,
                      type: "spring",
                      bounce: 0.4,
                    }}
                    className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]"
                  >
                    {/* <div className=" shadow-md rounded-xl border-[1px]  border-[#0d121c21] ">
                      <div
                        className="mt-2 px-[24px] py-2  grid grid-cols-1  "
                        onClick={(e) => {
                          if ( e.target === e.currentTarget ) {
                            SetOpenFarmsOrFieled(2);
                            children.setClickFarm(farm.farmId);
                          }
                        }}
                      >
                        <p className="font-[600]  my-2  capitalize text-mainColor text-[18px]  ">
                          {farm.name}
                        </p>
                        <div className="flex items-center space-x-2 text-[16px] my-2 text-[#515050]">
                          <MapPin size={18} />
                          <p className="">{farm.location}</p>
                        </div>
                        <div className="grid grid-cols-2  mb-10 gap-y-3 font-medium text-[#2a2929]">
                          <p className=" capitalize ">
                            field : {farm.fieldsNo}
                          </p>
                          <p className=" capitalize ">
                            area : {farm.area} acres{" "}
                          </p>
                          <p className=" capitalize ">avg. growth : 75%</p>
                          <p className=" capitalize ">
                            soil type : {types[farm.soilType]}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 justify-center gap-6 my-5 w-[100%]  text-[#2a2929]  ">
                          {[1, 2, 3].map((e, index) => {
                            return (
                              <div
                                key={index}
                                className="flex flex-col items-center "
                              >
                                <p className="before:content-['90%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative">
                                  <Circle
                                    percent={90}
                                    strokeWidth="7"
                                    gapDegree="0"
                                    trailWidth="7"
                                    strokeLinecap="round"
                                    strokeColor="#1E6930"
                                    trailColor="#1e693021"
                                    className={`w-[90px] h-[90px]`}
                                  />
                                </p>
                                <p className="text-[16px] font-medium capitalize ">
                                  soybeans
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center mt-2 mb-5">
                          <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                            <p className="font-[500] text-[14px] ">
                              {farm.roleName}
                            </p>
                          </div>
                          <div className="flex space-x-3" >
                            <SquarePen
                              strokeWidth={1.7}
                              
                              className=" hover:text-mainColor transition-all  duration-150 cursor-pointer"
                              onClick={() => {
                                setFarmIdEdit(farm.farmId);
                                setEdit("BasicInfo");
                              }}
                            />
                            <Trash2
                              strokeWidth={1.7}
                              className="hover:text-red-700 transition-all  duration-150 cursor-pointer"
                              onClick={() => {
                                deleteFarms(farm.farmId);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <Farm farm={farm} deleteFarms={deleteFarms} ClickFarm={children.ClickFarm} setFarmIdEdit={setFarmIdEdit} setEdit={setEdit} S types={types}/>
                  </motion.div>
                );
              })
            : ""}
        </div>:<div className="h-[80%]  flex justify-center items-center">
        <p className="text-[17px] text-[#333333] w-[480px] text-center font-medium">You don’t have any farms yet</p>
      </div>}
      </div>
      
      {basicInfo ? (
        <div className="fixed z-50 inset-0">
          <BasicInfo farmData={farmData} setFarmData={setFarmData} setTeamMemberList={setTeamMemberList} />
        </div>
      ) : (
        ""
      )}
      {team ? (
        <div className=" fixed z-50 inset-0  ">
          <Team
            farmData={farmData}
            setFarmData={setFarmData}
            teamMemberList={teamMemberList}
            setTeamMemberList={setTeamMemberList}
          />
        </div>
      ) : (
        ""
      )}
      {review ? (
        <div className=" fixed z-50 inset-0  ">
          <Review
            farmId={farmId}
            setFarmId={setFarmId}
            farmData={farmData}
            setFarmData={setFarmData}
            teamMemberList={teamMemberList}
            
            display={getFarms}
          />
        </div>
      ) : (
        ""
      )}
      {edit == "BasicInfo" ? (
        <div className=" fixed z-50 inset-0  ">
          <EditBasicInfo
            setEdit={setEdit}
            farmId={farmIdEdit}
            teamMemberList={teamMemberList}
            setFarmId={setFarmId}
            setFarmData={setFarmData}
            display={getFarms}
          />
        </div>
      ) : edit == "Team" ? (
        <div className=" fixed z-50 inset-0  ">
          <EditTeam
            setFarmData={setFarmData}
            farmData={farmData}
            setEdit={setEdit}
            farmId={farmIdEdit}
            setTeamMemberList={setTeamMemberList}
          />
        </div>
      ) : edit == "Review" ? (
        <div className=" fixed z-50 inset-0  ">
          <EditReview
            setFarmData={setFarmData}
            farmData={farmData}
            setEdit={setEdit}
            farmId={farmIdEdit}
            teamMemberList={teamMemberList}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Farms;
