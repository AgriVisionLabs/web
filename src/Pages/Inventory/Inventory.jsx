import { useContext, useEffect, useState } from "react";
import MenuElement from "../../Components/MenuElement/MenuElement";
import { AllContext } from "../../Context/All.context";
import {
  AlertTriangle,
  Clock5,
  ClockAlert,
  DollarSign,
  Edit,
  FileText,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { userContext } from "../../Context/User.context";
import axios from "@axiosInstance";
import InventoryManagement from "../../Components/InventoryManagement (Inventory Page)/InventoryManagement";
import InventoryManagementUpdateItem from "../../Components/InventoryManagementUpdateItem/InventoryManagementUpdateItem";

  
const Inventory = () => {
  console.log("Axios:", axios.defaults)
  let { baseUrl,getPart,index,setIndex  } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [part,setPart] = useState("all items");
  let [farms, setFarms] = useState([]);
  let [farmNames, setFarmNames] = useState([]);
  let [inventory, setInventory] = useState([]);
  let [inventoryFarmId, setInventoryFarmId] = useState();
  let [inventoryId, setInventoryId] = useState();
  // let [indexFarm, setIndexFarm] = useState(0); UpdateItem
  let stockLevel = [{level:"Low" ,color:"#25C462"}, {level:"Medium" ,color:"#F4731C"}, {level:"High" ,color:"#F04444"}];
  let [pageInventory,setPageInventory]=useState(false)
  let Category = [
        "Irrigation",
        "Fertilization",
        "PlantingOrHarvesting",
        "Maintenance",
        "Inspection",
        "PestAndHealthControl",
    ];
  async function getFarms() {
        try {
        const options = {
            url: `${baseUrl}/farms`,
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        let { data } = await axios(options);
        if (data) {
            setFarms(data)
            setFarmNames(
            data.map((farm) => {
                return farm.name;
            })
            );
            console.log("getFarms",data);
        }
        } catch (error) {
        console.log(error);
        }
    }
  async function getInventory() {
        try {
        const options = {
            url: `${baseUrl}/farms/${farms[index].farmId}/InventoryItems`,
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        let { data } = await axios(options);
        if (data) {
            setInventory(data)
            
            console.log("getInventory",data);
        }
        } catch (error) {
        console.log(error);
        }
    }
    useEffect(()=>{getFarms()},[])
    useEffect(()=>{getInventory()},[index])
  return (
    <section className="text-[#0D121C] transition-all duration-500">
      <div className="flex  gap-y-[20px] flex-col xl:flex-row justify-between items-center mb-[40px]">
        <div className="text-center xl:text-start">
          <h1 className="text-[23px] font-semibold">Inventory Management </h1>
          <p className=" capitalize text-[16px] text-[#616161]  font-medium">
            Comprehensive insights into your farm operations
          </p>
        </div>
        <div className="flex space-y-4 xl:space-y-0 xl:space-x-4 flex-col xl:flex-row items-center  xl:items-start space-[12px] text-[15px] font-medium">
          <MenuElement
            Items={farmNames}
            nameChange={farmNames[index]}
            setIndex={setIndex}
            index={index}
            className={"w-[200px]"}
            name={"All Farms"}
            Pformat={"text-[#0D121C] font-[400]  px-[12px]"}
          />

          <button className="border-[1px] border-mainColor bg-mainColor hover:bg-transparent hover:text-mainColor  rounded-[8px] px-[15px] py-[9px] text-white hover " onClick={()=>{setPageInventory("AddNewInventory")}}>
            <div className="flex items-center space-x-1">
              <Plus strokeWidth={1.7} />
              <p className="">Add Item</p>
            </div>
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-[40px]">
        <div className="rounded-[15px]  border-[1px] border-[rgba(13,18,28,0.25)]">
          <div className=" font-manrope px-[24px] pb-[20px] ">
            <div className="pt-[15px]  mb-[10px] flex justify-between items-center">
              <h3 className="text-[18px] font-semibold capitalize ">
                total items
              </h3>
              <Package />
            </div>
            <div className="space-y-[10px] mb-[10px]  font-semibold">
              <p className="text-[25px] font-semibold">247</p>
              <p className="text-[#616161] text-[15px] ">
                Across all categories and farms
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[15px]  border-[1px] border-[rgba(13,18,28,0.25)]">
          <div className=" font-manrope px-[24px] pb-[20px] ">
            <div className="pt-[15px]  mb-[10px] flex justify-between items-center">
              <h3 className="text-[18px] font-semibold capitalize ">
                low stock items
              </h3>
              <DollarSign className="text-[#F49E0B]" />
            </div>
            <div className="space-y-[10px] mb-[10px]  font-semibold">
              <p className="text-[25px] font-semibold">23</p>
              <p className="text-[#616161] text-[15px] ">
                Items that need reordering soon
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[15px]  border-[1px] border-[rgba(13,18,28,0.25)]">
          <div className=" font-manrope px-[24px] pb-[20px] ">
            <div className="pt-[15px]  mb-[10px] flex justify-between items-center">
              <h3 className="text-[18px] font-semibold capitalize ">
                expiring soon
              </h3>
              <ClockAlert className="text-[#E13939]" />
            </div>
            <div className="space-y-[10px] mb-[10px]  font-semibold">
              <p className="text-[25px] font-semibold">12</p>
              <p className="text-[#616161] text-[15px] ">
                Items expiring within 30 days
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[40px]">
        <div
          className="grid grid-cols-2 gap-y-[10px] xl:grid-cols-5  min-h-[60px] rounded-[10px] bg-[rgba(217,217,217,0.3)]  p-[10px] text-[14px] sm:text-[15px]   font-medium mb-[52px]"
          id="parts"
          onClick={(e) => {
            getPart(e.target);
          }}
        >
          <div
            className="py-[8px] px-[20px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer flex  justify-center items-center "
            onClick={() => {
              setPart("all items");
            }}
          >
            <p className="">All Items</p>
          </div>
          <div
            className="py-[8px] px-[20px]   rounded-[10px] cursor-pointer flex  justify-center items-center text-[#9F9F9F]"
            onClick={() => {
              setPart("fertilizers");
            }}
          >
            <p className="">Fertilizers</p>
          </div>
          <div
            className="py-[8px] px-[20px]   rounded-[10px] cursor-pointer flex  justify-center items-center text-[#9F9F9F]"
            onClick={() => {
              setPart("chemicals");
            }}
          >
            <p className="">Chemicals</p>
          </div>
          <div
            className="py-[8px] px-[20px]   rounded-[10px] cursor-pointer flex  justify-center items-center text-[#9F9F9F]"
            onClick={() => {
              setPart("treatments");
            }}
          >
            <p className="">Treatments</p>
          </div>
          <div
            className="py-[8px] px-[20px]   rounded-[10px] cursor-pointer flex  justify-center items-center text-[#9F9F9F]"
            onClick={() => {
              setPart("produce");
            }}
          >
            <p className="">Produce</p>
          </div>
        </div>
      </div>

      <div className="mt-[20px]">
        {inventory.map((item, index)=>{return <div key={index} className="rounded-[15px] w-full grid grid-cols-7   relative border border-[#0d121c37]">
          <div className=" w-full border-b col-span-7 border-[#0d121c37] text-[#616161] rounded-t-[15px]">
            <div className="min-w-[700px]  lg:min-w-[900px] xl:min-w-[1000px] 2xl:min-w-[1237px] grid grid-cols-7    text-center space-x-6 text-[16px]  bg-[#F4F4F4]">
              <p className=" p-[15px]">Name</p>
              <p className=" p-[15px]">Category</p>
              <p className=" p-[15px]">Quantity</p>
              <p className=" p-[15px]">Stock Level</p>
              <p className=" p-[15px]">Expiry</p>
              <p className=" p-[15px]">Field</p>
              <p className=" p-[15px]">Actions</p>
            </div>
          </div>

          <div className="  border-b col-span-7 border-[#0d121c37] text-[#616161] rounded-t-[15px]">
            <div className="min-w-[700px] lg:min-w-[900px] xl:min-w-[1000px] 2xl:min-w-[1237px]">
              <div  className="grid grid-cols-7  space-x-6 font-medium text-[14px] text-center">
                <div className="p-[15px]">{item.name}</div>
                <div className="p-[15px]">{Category[item.category]}</div>
                <div className="p-[15px]">{item.quantity} {item.measurementUnit}</div>
                <div className="p-[15px]  text-white">
                  <div className="flex justify-center w-full   items-start">
                    <p className={` capitalize flex justify-center  items-center px-[12px] rounded-full py-[2px] bg-[${stockLevel[0].level==item.stockLevel?stockLevel[0].color:stockLevel[1].level==item.stockLevel?stockLevel[1].color:stockLevel[2].color}]`}>{item.stockLevel}</p>
                  </div>
                </div>
                <div className="p-[15px]">
                  <div className="rounded-full flex justify-center space-x-[5px] items-center  text-[#25C462] ">
                    <Clock5 size={18} />
                    <p className=" capitalize ">57 days</p>
                  </div>
                </div>
                <div className="p-[15px] capitalize">Field 1</div>
                <div className="p-[15px]  flex justify-center items-center">
                  <div className=" w-full relative ">
                    <div
                      className="flex space-x-[3px]   items-center  justify-center  cursor-pointer"
                      onClick={(e) => {
                        e.currentTarget.nextElementSibling.classList.toggle(
                          "hidden"
                        );
                      }}
                    >
                      <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                      <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                      <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    </div>
                    <div className=" absolute  hidden justify-cente space-y-[10px]  w-[150px] top-[20px] left-[50%] translate-x-[-50%] rounded-[15px] border-[1px] bg-white z-20 border-[#0d121c3e] p-[10px] ">
                      <div className="flex items-center space-x-3  cursor-pointer" onClick={()=>{
                        setInventoryFarmId(item.farmId)
                        setInventoryId(item.id)
                        setPageInventory("UpdateItem")
                      }}>
                        <Edit size={20} />
                        <p className="">Update</p>
                      </div>
                      <div className="flex items-center space-x-3 cursor-pointer">
                        <FileText size={20} />
                        <p className="">Log Change</p>
                      </div>
                      <div className="flex items-center space-x-3 text-[#E13939] cursor-pointer">
                        <Trash2 size={20} />
                        <p className="">Delete</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>})}
      </div>
      
      {pageInventory=="AddNewInventory"?
      <div className="flex absolute inset-0 justify-center items-center">
        <InventoryManagement setAddNewInventory={setPageInventory} farmNames={farmNames} farms={farms}/>
      </div>:
      pageInventory=="UpdateItem"?
      <div className="flex absolute inset-0 justify-center items-center">
        <InventoryManagementUpdateItem itemId={inventoryId} farmId={inventoryFarmId} />
      </div>:
      null}
    </section>
  );
};

export default Inventory;

{
  /* <div className="mt-[20px] ">
        <div className="border-[1px] border-[#0d121c37] rounded-[15px]   ">
          <div className="grid grid-cols-1 w-full ">
            <div className="grid grid-cols-7 border-b-[1px] rounded-[15px] border-[#0d121c37] bg-[#F4F4F4] text-[#616161]  ">
              <p className="text-start p-[15px] ">Name</p>
              <p className="text-start p-[15px]">Category</p>
              <p className="text-start p-[15px]">Quantity</p>
              <p className="text-start p-[15px]">Stock Level</p>
              <p className="text-start p-[15px]">Expiry</p>
              <p className="text-start p-[15px]">Field</p>
              <p className="text-start p-[15px]">Actions</p>
            </div>
            <div className="grid grid-cols-7 font-medium text-[15px]">
              <div className="p-[15px]">Nitrogen Fertilizer</div>
              <div className="p-[15px]">Fertilizers</div>
              <div className="p-[15px]">500 Kg</div>
              <div className="p-[15px] flex text-white">
                <div className="rounded-full flex justify-center items-center px-[12px] py-[2px] bg-[#25C462]">
                  <p className=" capitalize">high</p>
                </div>
              </div>
              <div className="p-[15px]">
                <div className="rounded-full flex space-x-[5px] items-center  text-[#25C462]">
                  <Clock5 size={18} />
                  <p className=" capitalize">57 days</p>
                </div>
              </div>
              <div className="p-[15px]">Field 1</div>
              <div className="p-[15px] ">
                <div className=" relative  w-fit">
                  <div
                    className="flex space-x-[3px] items-center  cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.nextElementSibling.classList.toggle(
                        "hidden"
                      );
                    }}
                  >
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                  </div>
                  <div className=" absolute  hidden justify-cente space-y-[10px]  w-[150px] top-[20px] left-[50%] translate-x-[-50%] rounded-[15px] border-[1px] bg-white z-20 border-[#0d121c3e] p-[10px] ">
                    <div className="flex items-center space-x-3  cursor-pointer">
                      <Edit size={20} />
                      <p className="">Update</p>
                    </div>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <FileText size={20} />
                      <p className="">Log Change</p>
                    </div>
                    <div className="flex items-center space-x-3 text-[#E13939] cursor-pointer">
                      <Trash2 size={20} />
                      <p className="">Delete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 font-medium text-[15px]">
              <div className="p-[15px]">Phosphorus Fertilizer</div>
              <div className="p-[15px]">Fertilizers</div>
              <div className="p-[15px]">250 Kg</div>
              <div className="p-[15px] flex text-white">
                <div className="rounded-full flex justify-center items-center px-[12px] py-[2px] bg-[#F4731C]">
                  <p className=" capitalize">medium</p>
                </div>
              </div>
              <div className="p-[15px]">
                <div className="rounded-full flex space-x-[5px] items-center  text-[#25C462]">
                  <Clock5 size={18} />
                  <p className=" capitalize">250 Kg</p>
                </div>
              </div>
              <div className="p-[15px]">Field 1</div>
              <div className="p-[15px] ">
                <div className=" relative  w-fit">
                  <div
                    className="flex space-x-[3px] items-center  cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.nextElementSibling.classList.toggle(
                        "hidden"
                      );
                    }}
                  >
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                  </div>
                  <div className=" absolute  hidden justify-cente space-y-[10px]  w-[150px] top-[20px] left-[50%] translate-x-[-50%] rounded-[15px] border-[1px] bg-white z-20 border-[#0d121c3e] p-[10px] ">
                    <div className="flex items-center space-x-3  cursor-pointer">
                      <Edit size={20} />
                      <p className="">Update</p>
                    </div>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <FileText size={20} />
                      <p className="">Log Change</p>
                    </div>
                    <div className="flex items-center space-x-3 text-[#E13939] cursor-pointer">
                      <Trash2 size={20} />
                      <p className="">Delete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 font-medium text-[15px]">
              <div className="p-[15px]">Herbicide X-200</div>
              <div className="p-[15px]">Chemicals</div>
              <div className="p-[15px]">50 L</div>
              <div className="p-[15px] flex text-white">
                <div className="rounded-full flex justify-center items-center px-[12px] py-[2px] bg-[#F04444]">
                  <p className=" capitalize">low</p>
                </div>
              </div>
              <div className="p-[15px]">
                <div className="rounded-full flex space-x-[5px] items-center  text-[#E13939]">
                  <AlertTriangle size={18} />
                  <p className=" capitalize">Expired</p>
                </div>
              </div>
              <div className="p-[15px]">Field 2</div>
              <div className="p-[15px] ">
                <div className=" relative  w-fit">
                  <div
                    className="flex space-x-[3px] items-center  cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.nextElementSibling.classList.toggle(
                        "hidden"
                      );
                    }}
                  >
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                  </div>
                  <div className=" absolute  hidden justify-cente space-y-[10px]  w-[150px] top-[20px] left-[50%] translate-x-[-50%] rounded-[15px] border-[1px] bg-white z-20 border-[#0d121c3e] p-[10px] ">
                    <div className="flex items-center space-x-3  cursor-pointer">
                      <Edit size={20} />
                      <p className="">Update</p>
                    </div>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <FileText size={20} />
                      <p className="">Log Change</p>
                    </div>
                    <div className="flex items-center space-x-3 text-[#E13939] cursor-pointer">
                      <Trash2 size={20} />
                      <p className="">Delete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 font-medium text-[15px]">
              <div className="p-[15px]">Fungicide Pro</div>
              <div className="p-[15px]">Chemicals</div>
              <div className="p-[15px]">75 L</div>
              <div className="p-[15px] flex text-white">
                <div className="rounded-full flex justify-center items-center px-[12px] py-[2px] bg-[#F4731C]">
                  <p className=" capitalize">medium</p>
                </div>
              </div>
              <div className="p-[15px]">
                <div className="rounded-full flex space-x-[5px] items-center  text-[#E13939]">
                  <AlertTriangle size={18} />
                  <p className=" capitalize">Expired</p>
                </div>
              </div>
              <div className="p-[15px]">Field 3</div>
              <div className="p-[15px] ">
                <div className=" relative  w-fit">
                  <div
                    className="flex space-x-[3px] items-center  cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.nextElementSibling.classList.toggle(
                        "hidden"
                      );
                    }}
                  >
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                  </div>
                  <div className=" absolute  hidden justify-cente space-y-[10px]  w-[150px] top-[20px] left-[50%] translate-x-[-50%] rounded-[15px] border-[1px] bg-white z-20 border-[#0d121c3e] p-[10px] ">
                    <div className="flex items-center space-x-3  cursor-pointer">
                      <Edit size={20} />
                      <p className="">Update</p>
                    </div>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <FileText size={20} />
                      <p className="">Log Change</p>
                    </div>
                    <div className="flex items-center space-x-3 text-[#E13939] cursor-pointer">
                      <Trash2 size={20} />
                      <p className="">Delete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */
}
