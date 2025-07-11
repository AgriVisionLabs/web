import {
  CircleAlert,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import MenuElement from "../MenuElement/MenuElement";
import { AllContext } from "../../Context/All.context";
import NewDetection from "../NewDetection/NewDetection";
import AfterDetection from "../AfterDetection/AfterDetection";
import axios from "axios";
import { userContext } from "../../Context/User.context";
import toast from "react-hot-toast";
import Detection from "../Detection/Detection";

const DiseaseDetection = (children) => {
  let { detection, setDetection, setDetectionPage, getPart, baseUrl,index,setIndex } =
    useContext(AllContext);
  let { token } = useContext(userContext);
  let [partsDetection, setPartsDetection] = useState("All Fields");
  let [fields, setFields] = useState([]);
  // let [index, setIndex] = useState(0);
  let [Farms, setFarms] = useState([]);
  let [allFarms, setAllFarms] = useState([]);
  let [farmCheck, setFarmCheck] = useState(0);
  let [fieldCheck, setFieldCheck] = useState(0);
  let [Imagecheck, setImagecheck] = useState("");
  let [DataAfterDetection, setDataAfterDetection] = useState();
  let [search,setSearch]=useState("")
  let [searchInput,setSearchInput]=useState("")
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
        setAllFarms(
          data.map((farm) => {
            return farm.name;
          })
        );
        setFarms(data);
        getFields()
      }
    } catch (error) {
      if(error.response?.data){
        if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
        else{toast.error("There is an error");}
      }else{console.log(error)}
    }
  }
  async function getFields() {
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
      console.log("getFields :", data);
    } catch (error) {
      if(error.response?.data){
        if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
        else{toast.error("There is an error");}
      }else{console.log(error)}
    }
  }
  useEffect(() => {
    getFarms();
  }, []);
  useEffect(() => {
    getFields();
  }, [index,Farms]);
  return (
    <>
      {Farms.length!=0?<div>
        <div className="mb-[35px] flex items-center space-x-[15px]">
          <p className="text-[23px] text-[#0D121C] font-semibold font-manrope ">
            Disease Detection
          </p>
          <CircleAlert strokeWidth={3} size={23} />
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-[20px] mb-[44px]">
          {/* <MenuElement Items={forms} name={"green farm"} width={300+"px"} onList={onListDisDet} setOnList={setOnListDisDet}/> */}
          <MenuElement
            Items={allFarms}
            nameChange={allFarms[index]}
            setIndex={setIndex}
            index={index}
            width={200 + "px"}
            Pformat={"text-[#0D121C] font-[400] text-[15px]"}
          />
          <form action="" className="">
            <input
              type="text"
              placeholder="Search Fields or crops ..."
              className=" text-[14px] md:text-[15px]   text-[#616161] font-[400] font-manrope h-[43px]  py-[8px] px-[22px] rounded-[8px] border-[1px] border-[#D9D9D9] w-[200px] sm:w-[300px] md:w-[400px] focus:outline-mainColor"
              onChange={(e)=>{setSearchInput(e.target.value)}}
            />
          </form>
        </div>
        <div
          className="flex items-center w-fit h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[20px] px-[10px] text-[14px] sm:text-[15px]   font-medium mb-[52px]"
          id="parts"
          onClick={(e) => {
            getPart(e.target);
          }}
        >
          <p
            className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer "
            onClick={() => {
              setPartsDetection("All Fields");
              setSearch(3)
            }}
          >
            All Fields
          </p>
          <p
            className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer text-[#9F9F9F]"
            onClick={() => {
              setPartsDetection("Healthy");
              setSearch(0)
            }}
          >
            Healthy
          </p>
          <p
            className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer text-[#9F9F9F]"
            onClick={() => {
              setPartsDetection("At Risk");
              setSearch(1)
            }}
          >
            At Risk
          </p>
          <p
            className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer text-[#9F9F9F]"
            onClick={() => {
              setPartsDetection("Infected");
              setSearch(2)
            }}
          >
            Infected
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-[28px] font-manrope">
          {fields?.filter((field)=> (field.name?.toLowerCase().includes(searchInput.toLowerCase())||field.cropName?.toLowerCase().includes(searchInput.toLowerCase()))).map((item, index) => {
            return (
              <div key={index} className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]">
                {/* <div
                  className="p-[24px]"
                  onClick={() => {
                    setDetectionPage("DiseaseDetectionOverviewpage");
                  }}
                >
                  <div className="mb-[20px] flex justify-between items-center">
                    <h3 className="text-[18px] font-bold capitalize">
                      {item.name}
                    </h3>
                    <h3 className="bg-[#25C462] rounded-[15px] px-[12px] py-[2px] text-[15px] font-semibold text-[#FFFFFF] capitalize">
                      healthy
                    </h3>
                  </div>
                  <div className="flex items-center space-x-[8px]">
                    <Leaf size={23} className="text-mainColor" />
                    <p className="text-[17px] text-[#9F9F9F] font-semibold">
                      {item.cropName}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-[16px] font-medium my-[12px]">
                      <p className="capitalize">crop health</p>
                      <p>{95}%</p>
                    </div>
                    <Line
                      percent={95}
                      strokeLinecap="round"
                      strokeColor="#1E6930"
                      className="h-[6.5px] text-mainColor w-full rounded-lg"
                    />
                  </div>
                  <div className="text-[16px] font-medium my-[20px] border-b-[1px] border-[#9F9F9F]">
                    <h3 className="capitalize">recent detections</h3>
                    <div className="mt-[12px] pb-[24px] space-y-[12px]  h-[130px] overflow-y-auto">
                      {[1, 2, 3].map((_, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-[8px]">
                            <CircleCheckBig
                              size={19}
                              strokeWidth={1.5}
                              className="text-[#25C462]"
                            />
                            <p className="text-[15px] capitalize">
                              15 mar, 2025
                            </p>
                          </div>
                          <h3 className="bg-[#25C462] rounded-[15px] px-[12px] py-[2px] text-[15px] font-semibold text-[#FFFFFF] capitalize">
                            healthy
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[#9F9F9F] space-y-[15px]">
                    <div className="flex items-center space-x-[7px]">
                      <Calendar />
                      <p className="capitalize text-[15px]">last: 15 mar, 2025</p>
                    </div>
                    <div className="flex items-center space-x-[7px]">
                      <User />
                      <p className="capitalize text-[15px]">by: hussein mohamed</p>
                    </div>
                  </div>
                </div>
                <div className="border-t-[1px] border-[#9F9F9F] flex justify-center py-[15px]">
                  <button
                    className="py-[8px] px-[20px] border-[1px] border-transparent rounded-[45px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                    onClick={() => {
                      setDetection("NewDetection");
                    }}
                  >
                    <div
                      className="flex justify-center items-center space-x-[11px]"
                      onClick={() => {
                        setFarmCheck(item.farmId);
                        setFieldCheck(item.id);
                      }}
                    >
                      <Camera size={19} />
                      <p className="">new detection</p>
                    </div>
                  </button>
                </div> */}
                <Detection search={search}  setStateOverview={children.setStateOverview} setDiseaseDetections={children.setDiseaseDetections} setField={children.setField} setDetectionPage={setDetectionPage} setDetection={setDetection} fieldId={item.id} farmId={item.farmId} setFarmCheck={setFarmCheck} setFieldCheck={setFieldCheck}/>
              </div>
            );
          })}
        </div>
        {detection == "NewDetection" ? (
          <div className=" fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 ">
            <NewDetection
              farmId={farmCheck}
              fieldId={fieldCheck}
              Imagecheck={Imagecheck}
              setImagecheck={setImagecheck}
              setDataAfterDetection={setDataAfterDetection}
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
      </div>:
      <div className="h-[80%]  flex justify-center items-center">
        <p className="text-[17px] text-[#333333] w-[480px] text-center font-medium">You don’t have any farms yet</p>
      </div>
      }
    </>
  );
};

export default DiseaseDetection;
