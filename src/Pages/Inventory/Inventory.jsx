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
import axios from "axios";
import InventoryManagement from "../../Components/InventoryManagement (Inventory Page)/InventoryManagement";
import { Helmet } from "react-helmet";
import EditItem from "../../Components/InventoryManagement (Inventory Page)/EditItem";

const Inventory = () => {
  const { baseUrl, getPart } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [farms, setFarms] = useState([]);
  const [farmNames, setFarmNames] = useState([]);
  const [indexFarm, setIndexFarm] = useState(0);
  const [openDialog, setOpenDialog] = useState(null);
  const [itemSelected, setItem] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [lowStock, setLow] = useState([]);
  const [expir, setexpire] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  let [part, setPart] = useState("all items");

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".dropdown-action")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function getFarms() {
    if (!token) {
      console.error("No token available for getFarms");
      return;
    }
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
        setFarms(data);
        setFarmNames(
          data.map((farm) => {
            return farm.name;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  }

  async function inventoryItems() {
    if (!token) {
      console.error("No token available for getFarms");
      return;
    }
    console.log(farms[indexFarm].farmId);

    try {
      const options = {
        url: `${baseUrl}/farms/${farms[indexFarm].farmId}/InventoryItems`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log(data);

      setLow(
        data.filter(
          (item) => item.stockLevel === "low" || item.stockLevel === "Low"
        )
      );
      const expirSoonItems = data.filter((item) => {
        if (!item.expirationDate) return false;

        const now = new Date();
        const expiryDate = new Date(item.expirationDate);

        // calculate days until expiry
        const diffDays = (expiryDate - now) / (1000 * 60 * 60 * 24);

        return diffDays > 0 && diffDays <= 7; // expires within next 7 days only
      });
      setexpire(expirSoonItems);

      if (data) {
        setTableData(data);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  }

  async function deleteItem(itemId) {
    console.log({ itemId });
    console.log(farms[indexFarm].farmId);

    if (!token) {
      console.error("No token available for getFarms");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${farms[indexFarm].farmId}/InventoryItems/${itemId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let res = await axios(options);
      if (res) {
        setTableData((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  }

  useEffect(() => {
    getFarms();
  }, []);

  useEffect(() => {
    if (farms.length) {
      inventoryItems();
    }
  }, [farms, indexFarm]);

  const categories = [
    "Irrigation",
    "Fertilization",
    "PlantingOrHarvesting",
    "Maintenance",
    "Inspection",
    "PestAndHealthControl",
  ];

  const partOptions = [
    { label: "All Items", value: "all items" },
    { label: "Fertilizers", value: "fertilizers" },
    { label: "Chemicals", value: "chemicals" },
    { label: "Treatments", value: "treatments" },
    { label: "Produce", value: "produce" },
  ];

  const partToCategoryLabel = {
    fertilizers: "Fertilization",
    chemicals: "PestAndHealthControl",
    treatments: "Inspection",
    produce: "PlantingOrHarvesting",
  };

  console.log(part);

  const filteredTableData = tableData.filter((item) => {
    if (part === "all items") return true;

    const categoryName = categories[item.category];
    const expectedCategory = partToCategoryLabel[part];

    return categoryName === expectedCategory;
  });

  return (
    <>
      <section className="text-[#0D121C] transition-all duration-500">
        <Helmet>
          <title>Inventory</title>
        </Helmet>
        <header className="flex flex-col xl:flex-row justify-between items-center mb-[40px]">
          <div className="text-center xl:text-start">
            <h1 className="text-[23px] font-semibold">Inventory Management </h1>
            <p className=" capitalize text-[16px] text-[#616161]  font-medium">
              Comprehensive insights into your farm operations
            </p>
          </div>
          <div className="flex space-y-4 xl:space-y-0 xl:space-x-4 flex-col xl:flex-row items-center  xl:items-start space-[12px] text-[15px] font-medium">
            <MenuElement
              Items={farmNames}
              nameChange={farmNames[indexFarm]}
              setIndex={setIndexFarm}
              index={indexFarm}
              className={"w-[200px]"}
              name={"All Farms"}
              Pformat={"text-[#0D121C] font-[400]  px-[12px]"}
            />

            <button
              className="border-[1px] border-mainColor w-full flex items-center space-x-1 bg-mainColor hover:bg-transparent hover:text-mainColor  rounded-[8px] px-[15px] py-[9px] text-white hover "
              onClick={() => {
                setOpenDialog("new");
              }}
            >
              <Plus strokeWidth={1.7} />
              <p className="">Add Item</p>
            </button>
          </div>
        </header>

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
                <p className="text-[25px] font-semibold">{tableData.length}</p>
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
                <p className="text-[25px] font-semibold">{lowStock.length}</p>
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
                <p className="text-[25px] font-semibold">{expir.length}</p>
                <p className="text-[#616161] text-[15px] ">
                  Items expiring within 30 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-[40px]">
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
        </div> */}
        <div className="mt-[40px]">
          <div
            className="grid grid-cols-2 gap-y-[10px] xl:grid-cols-5 min-h-[60px] rounded-[10px] bg-[rgba(217,217,217,0.3)] p-[10px] text-[14px] sm:text-[15px] font-medium mb-[52px]"
            id="parts"
            onClick={(e) => {
              getPart(e.target);
            }}
          >
            {partOptions.map((option) => (
              <div
                key={option.value}
                className={`py-[8px] px-[20px] rounded-[10px] cursor-pointer flex justify-center items-center ${
                  part === option.value
                    ? "bg-[#FFFFFF] text-mainColor"
                    : "text-[#9F9F9F]"
                }`}
                onClick={() => {
                  setPart(option.value);
                }}
              >
                <p>{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[20px]">
          <div className="rounded-[15px] w-full grid grid-cols-7  border border-[#0d121c37]">
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

            <div className=" border-b col-span-7 border-[#0d121c37] text-[#616161] rounded-t-[15px]">
              <div className="min-w-[700px] lg:min-w-[900px] xl:min-w-[1000px] 2xl:min-w-[1237px]">
                {filteredTableData.length > 0 ? (
                  filteredTableData.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="grid grid-cols-7 space-x-6 font-medium text-[14px] text-center"
                    >
                      {/* Name */}
                      <div className="p-[15px]">{item.name}</div>

                      {/* Category */}
                      <div className="p-[15px]">
                        {categories[item.category]}
                      </div>

                      {/* Quantity */}
                      <div className="p-[15px]">
                        {item.quantity} {item.measurementUnit}
                      </div>

                      {/* Stock Level */}
                      <div className="p-[15px] text-white">
                        <div className="flex justify-center w-full items-start">
                          <p
                            className={`capitalize flex justify-center items-center px-[12px] rounded-full py-[2px] ${
                              item.stockLevel === "Low"
                                ? "bg-[#F04444]"
                                : item.stockLevel === "Medium"
                                ? "bg-[#F4731C]"
                                : "bg-[#25C462]"
                            }`}
                          >
                            {item.stockLevel.toLowerCase()}
                          </p>
                        </div>
                      </div>

                      {/* Expiry */}
                      <div className="py-[15px] pl-10">
                        <div
                          className={`rounded-full flex items-center ${
                            expir.includes(item)
                              ? "text-[#E13939]"
                              : "text-[#25C462]"
                          }`}
                        >
                          {item.dayTillExpiry <= 0 ? (
                            <AlertTriangle size={18} />
                          ) : (
                            <Clock5 size={18} />
                          )}
                          <p className="capitalize ml-2">
                            {item.dayTillExpiry <= 0
                              ? "Expired"
                              : `${item.dayTillExpiry} days`}
                          </p>
                        </div>
                      </div>

                      {/* Field */}
                      <div className="p-[15px]">{item.fieldName || "N/A"}</div>

                      {/* Actions (اختياري) */}
                      <div className="p-[15px]">
                        <div className="relative w-full">
                          <div
                            className="flex space-x-[3px] items-center justify-center cursor-pointer"
                            onClick={() => {
                              setOpenDropdownId((prev) =>
                                prev === item.id ? null : item.id
                              );

                              // setOpenDropdownId((prev) => !prev)
                            }}
                            // onClick={(e) => {
                            //   e.currentTarget.nextElementSibling.classList.toggle(
                            //     "hidden"
                            //   );
                            // }}
                          >
                            <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                            <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                            <div className="w-[5px] h-[5px] rounded-full bg-black"></div>
                          </div>

                          {openDropdownId === item.id ? (
                            <div className="absolute dropdown-action justify-cente space-y-[10px]  w-[150px] top-[10px] left-[50%] translate-x-[-50%] rounded-[15px] border-[1px] bg-white z-20 border-[#0d121c3e] p-[10px] ">
                              <div
                                className="flex items-center space-x-3  cursor-pointer"
                                onClick={() => {
                                  setItem(item);
                                  setOpenDialog("edit");
                                }}
                              >
                                <Edit size={20} />
                                <p className="">Update</p>
                              </div>
                              <div className="flex items-center space-x-3 cursor-pointer">
                                <FileText size={20} />
                                <p className="">Log Change</p>
                              </div>
                              <div
                                className="flex items-center space-x-3 text-[#E13939] cursor-pointer"
                                onClick={() => {
                                  deleteItem(item.id);
                                }}
                              >
                                <Trash2 size={20} />
                                <p className="">Delete</p>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-7 text-center py-4 text-[#9F9F9F] font-medium">
                    No inventory items available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {openDialog === "new" ? (
        <div className="fixed z-50 inset-0">
          <InventoryManagement
            setAddNewInventory={setOpenDialog}
            farmNames={farmNames}
            farms={farms}
            display={inventoryItems}
          />
        </div>
      ) : null}

      {openDialog}
      {openDialog === "edit" && itemSelected ? (
        <div className="fixed z-50 inset-0">
          <EditItem
            editItem={itemSelected}
            display={inventoryItems}
            farmNames={farmNames}
            farms={farms}
            setEditItem={setOpenDialog}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Inventory;
