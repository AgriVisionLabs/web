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
  MoreVertical,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import InventoryManagement from "../../Components/InventoryManagement (Inventory Page)/InventoryManagement";
import { Helmet } from "react-helmet";
import EditItem from "../../Components/InventoryManagement (Inventory Page)/EditItem";
import LogChange from "../../Components/InventoryManagement (Inventory Page)/LogChange";

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [logChangeItem, setLogChangeItem] = useState(null);
  let [part, setPart] = useState("all items");

  const calculateDropdownPosition = (buttonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    const position = {
      top: rect.bottom + scrollTop + 5,
      left: Math.max(10, rect.right + scrollLeft - 140), // 140px is min-w of dropdown, ensure it doesn't go off-screen
    };
    
    console.log("Dropdown position calculated:", position);
    return position;
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".dropdown-action") && !e.target.closest(".global-dropdown-menu")) {
        setOpenDropdownId(null);
      }
    };
    
    const handleScroll = () => {
      setOpenDropdownId(null);
    };
    
    const handleResize = () => {
      setOpenDropdownId(null);
    };
    
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
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
    "Fertilizer",
    "Chemicals", 
    "Treatments",
    "Produce",
  ];

  const partOptions = [
    { label: "All Items", value: "all items" },
    { label: "Fertilizers", value: "fertilizers" },
    { label: "Chemicals", value: "chemicals" },
    { label: "Treatments", value: "treatments" },
    { label: "Produce", value: "produce" },
  ];

  const partToCategoryLabel = {
    fertilizers: "Fertilizer",
    chemicals: "Chemicals",
    treatments: "Treatments",
    produce: "Produce",
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
          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            {filteredTableData.length > 0 ? (
              <div className="space-y-4">
                {filteredTableData.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="bg-white rounded-lg border border-[#0d121c37] p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-[16px] text-[#0D121C]">{item.name}</h3>
                        <p className="text-sm text-[#616161]">{categories[item.category]}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {item.quantity} {item.measurementUnit}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col space-y-2">
                        <p
                          className={`capitalize text-white text-xs px-2 py-1 rounded-full w-fit ${
                            item.stockLevel === "Low"
                              ? "bg-[#F04444]"
                              : item.stockLevel === "Medium"
                              ? "bg-[#F4731C]"
                              : "bg-[#25C462]"
                          }`}
                        >
                          {item.stockLevel.toLowerCase()}
                        </p>
                        <p className="text-xs text-[#616161]">
                          Field: {item.fieldName || "N/A"}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div
                          className={`rounded-full flex items-center text-xs px-2 py-1 ${
                            expir.includes(item)
                              ? "text-[#E13939] bg-red-50"
                              : "text-[#25C462] bg-green-50"
                          }`}
                        >
                          <p>
                            {expir.includes(item)
                              ? "Expires Soon"
                              : "Fresh"}
                          </p>
                        </div>
                        
                                                <div className="dropdown-action">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Mobile dropdown button clicked for item:", item.id);
                              if (openDropdownId === item.id) {
                                console.log("Closing mobile dropdown");
                                setOpenDropdownId(null);
                              } else {
                                console.log("Opening mobile dropdown");
                                const position = calculateDropdownPosition(e.currentTarget);
                                setDropdownPosition(position);
                                setOpenDropdownId(item.id);
                              }
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-[#616161]">No inventory items found</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-[15px] border border-[#0d121c37]">
              <div className="min-w-[700px] lg:min-w-[900px] xl:min-w-[1000px] 2xl:min-w-[1237px]">
                {/* Table Header */}
                <div className="grid grid-cols-7 text-center text-[16px] bg-[#F4F4F4] text-[#616161] border-b border-[#0d121c37]">
                  <div className="p-[15px] font-semibold">Name</div>
                  <div className="p-[15px] font-semibold">Category</div>
                  <div className="p-[15px] font-semibold">Quantity</div>
                  <div className="p-[15px] font-semibold">Stock Level</div>
                  <div className="p-[15px] font-semibold">Expiry</div>
                  <div className="p-[15px] font-semibold">Field</div>
                  <div className="p-[15px] font-semibold">Actions</div>
                </div>

                {/* Table Body */}
                <div className="bg-white">
                  {filteredTableData.length > 0 ? (
                    filteredTableData.map((item, index) => (
                      <div
                        key={item.id || index}
                        className={`grid grid-cols-7 text-center font-medium text-[14px] hover:bg-gray-50 transition-colors ${
                          index !== filteredTableData.length - 1 ? 'border-b border-[#0d121c37]' : ''
                        }`}
                      >
                        {/* Name */}
                        <div className="p-[15px] text-[#0D121C]">{item.name}</div>

                        {/* Category */}
                        <div className="p-[15px] text-[#616161]">
                          {categories[item.category]}
                        </div>

                        {/* Quantity */}
                        <div className="p-[15px] text-[#0D121C]">
                          {item.quantity} {item.measurementUnit}
                        </div>

                        {/* Stock Level */}
                        <div className="p-[15px]">
                          <div className="flex justify-center">
                            <span
                              className={`capitalize text-white px-[12px] rounded-full py-[2px] text-xs font-medium ${
                                item.stockLevel === "Low"
                                  ? "bg-[#F04444]"
                                  : item.stockLevel === "Medium"
                                  ? "bg-[#F4731C]"
                                  : "bg-[#25C462]"
                              }`}
                            >
                              {item.stockLevel.toLowerCase()}
                            </span>
                          </div>
                        </div>

                        {/* Expiry */}
                        <div className="p-[15px]">
                          <span
                            className={`text-xs font-medium ${
                              expir.includes(item)
                                ? "text-[#E13939]"
                                : "text-[#25C462]"
                            }`}
                          >
                            {expir.includes(item)
                              ? "Expires Soon"
                              : "Fresh"}
                          </span>
                        </div>

                        {/* Field */}
                        <div className="p-[15px] text-[#616161]">{item.fieldName || "N/A"}</div>

                        {/* Actions */}
                        <div className="p-[15px] flex justify-center">
                          <div className="dropdown-action">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Desktop dropdown button clicked for item:", item.id);
                                if (openDropdownId === item.id) {
                                  console.log("Closing dropdown");
                                  setOpenDropdownId(null);
                                } else {
                                  console.log("Opening dropdown");
                                  const position = calculateDropdownPosition(e.currentTarget);
                                  setDropdownPosition(position);
                                  setOpenDropdownId(item.id);
                                }
                              }}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <MoreVertical size={16} className="text-[#616161]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-[#616161]">No inventory items found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Dropdown Menu */}
        {openDropdownId && (
          <div
            className="global-dropdown-menu fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Log Change clicked for item ID:", openDropdownId);
                const selectedItem = [...filteredTableData].find(item => item.id === openDropdownId);
                console.log("Selected item:", selectedItem);
                setLogChangeItem(selectedItem);
                setOpenDropdownId(null);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-[#0D121C]"
            >
              <FileText size={14} />
              <span>Log Change</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Update clicked for item ID:", openDropdownId);
                const selectedItem = [...filteredTableData].find(item => item.id === openDropdownId);
                console.log("Selected item:", selectedItem);
                setItem(selectedItem);
                setOpenDialog("edit");
                setOpenDropdownId(null);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-[#0D121C]"
            >
              <Edit size={14} />
              <span>Update</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Delete clicked for item ID:", openDropdownId);
                deleteItem(openDropdownId);
                setOpenDropdownId(null);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
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

      {logChangeItem && (
        <div className="fixed z-50 inset-0">
          <LogChange
            item={logChangeItem}
            farmId={farms[indexFarm]?.farmId}
            onClose={() => setLogChangeItem(null)}
            onSuccess={inventoryItems}
          />
        </div>
      )}
    </>
  );
};

export default Inventory;
