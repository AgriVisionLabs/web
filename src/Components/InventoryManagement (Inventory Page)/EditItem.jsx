/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { date, number, object, string } from "yup";
import { useFormik } from "formik";
import MenuElement from "../MenuElement/MenuElement";
import { X } from "lucide-react";
import axios from "axios";

const EditItem = ({
  setEditItem,
  farms,
  farmNames,
  display,
  editItem = null,
}) => {
  const { baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [fields, setFields] = useState([]);
  const [fieldNames, setFieldNames] = useState(null);
  const [indexFarm, setIndexFarm] = useState(0);
  const [indexField, setIndexField] = useState(0);
  const [indexMeasurementUnit, setIndexMeasurementUnit] = useState(0);
  //   const [indexCategory, setIndexCategory] = useState(0);

  const MeasurementUnit = ["Kg", "L", "g", "mL", "Ibs", "oz"];
  const Category = [
    "Irrigation",
    "Fertilization",
    "PlantingOrHarvesting",
    "Maintenance",
    "Inspection",
    "PestAndHealthControl",
  ];

  const validationSchema = object({
    fieldId: string().required("fieldId is required"),
    name: string().required("title is required"),
    category: number().required("category is required"),
    quantity: string().required("quantity is required"),
    thresholdQuantity: string().required("thresholdQuantity is required"),
    unitCost: string().required("unitCost is required"),
    measurementUnit: string().required("measurementUnit is required"),
    expirationDate: date(),
  });

  const [editData, setEditData] = useState(null);

  async function getOneItem(id) {
    if (!token) return;

    try {
      const res = await axios.get(
        `${baseUrl}/farms/${editItem.farmId}/InventoryItems/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditData(res.data);
    } catch (err) {
      console.error("Error fetching item for edit:", err);
    }
  }

  useEffect(() => {
    if (editItem) {
      getOneItem(editItem.id);
    }
  }, [editItem]);

  async function getFields() {
    if (!token || farms.length === 0) return;
    try {
      const options = {
        url: `${baseUrl}/farms/${farms[indexFarm].farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFields(data);
      setFieldNames(data.map((field) => field.name));
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  }

  useEffect(() => {
    getFields();
  }, [indexFarm]);

  async function sendNewInventory(values) {
    if (!token) return;
    try {
      const option = {
        url: `${baseUrl}/farms/${farms[indexFarm].farmId}/InventoryItems`,
        method: "POST",
        data: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(option);
      display();
      setEditItem(null);
    } catch (error) {
      console.error("Error creating inventory item:", error);
    }
  }

  async function updateInventoryItem(values) {
    if (!token) return;
    try {
      const option = {
        url: `${baseUrl}/farms/${editItem.farmId}/InventoryItems/${editItem.id}`,
        method: "PUT",
        data: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(option);
      display();
      setEditItem(null);
    } catch (error) {
      console.error("Error updating inventory item:", error);
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fieldId: editData?.fieldId || "",
      name: editData?.name || "",
      category: editData?.category ?? 0,
      quantity: editData?.quantity?.toString() || "",
      thresholdQuantity: editData?.thresholdQuantity?.toString() || "",
      unitCost: editData?.unitCost?.toString() || "",
      measurementUnit: editData?.measurementUnit || MeasurementUnit[0],
      expirationDate: editData?.expirationDate?.slice(0, 10) || "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (editItem) {
        updateInventoryItem(values);
      } else {
        sendNewInventory(values);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("fieldId", fields[indexField]?.id);
    formik.setFieldValue(
      "measurementUnit",
      MeasurementUnit[indexMeasurementUnit]
    );
  }, [fields, indexField, indexMeasurementUnit]);

  return (
    <section
      className="flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute inset-0 z-50 w-[100%]"
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          setEditItem(null);
        }
      }}
    >
      <div className=" w-[640px] h-[665px] px-[40px] border-2 rounded-2xl bg-white pt-[10px] text-[#0D121C] font-manrope overflow-auto">
        <X
          size={33}
          className="ms-auto cursor-pointer hover:text-red-500 transition-all duration-150"
          onClick={() => setEditItem(null)}
        />
        <div className="space-y-[8px]">
          <h1 className="text-[23px] mb-[20px] font-semibold capitalize text-mainColor">
            {editItem ? "Update Inventory Item" : "Add New Inventory Item"}
          </h1>
        </div>

        <form className="my-[20px]" onSubmit={formik.handleSubmit}>
          <div className="gap-y-[10px] grid grid-cols-1">
            <div className="flex flex-col">
              <label className="text-[17px] font-semibold">Farm</label>
              <MenuElement
                Items={farmNames || []}
                nameChange={farmNames ? farmNames[indexFarm] : null}
                setIndex={setIndexFarm}
                Pformat="text-[#0D121C] font-[400]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[17px] font-semibold">Field</label>
              <MenuElement
                Items={fieldNames || []}
                nameChange={fieldNames ? fieldNames[indexField] : null}
                setIndex={setIndexField}
                Pformat="text-[#0D121C] font-[400]"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-[40px]">
              <div className="flex flex-col">
                <label htmlFor="Name" className="text-[17px] font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  className="border px-5 py-2 rounded-lg text-[17px]"
                  placeholder="Enter item name"
                />
              </div>
              <div className="">
                <label className="text-[17px] font-semibold">Category</label>
                <MenuElement
                  name="category"
                  Items={Category}
                  nameChange={Category[formik.values.category]}
                  setIndex={(index) => {
                    formik.setFieldValue("category", index);
                    // setIndexCategory(index);
                  }}
                  className="mt-0 w-full"
                  Pformat="text-[#0D121C] font-[400] mb-0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-[40px]">
              <div className="flex flex-col">
                <label htmlFor="Quantity" className="text-[17px] font-semibold">
                  Quantity
                </label>
                <input
                  type="text"
                  id="Quantity"
                  name="quantity"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  className="border px-5 py-2 rounded-lg text-[17px]"
                  placeholder="0.00"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[17px] font-semibold">
                  Measurement Unit
                </label>
                <MenuElement
                  Items={MeasurementUnit}
                  nameChange={formik.values.measurementUnit}
                  setIndex={(index) => {
                    formik.setFieldValue(
                      "measurementUnit",
                      MeasurementUnit[index]
                    );
                    setIndexMeasurementUnit(index);
                  }}
                  Pformat="text-[#0D121C] font-[400]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-[40px]">
              <div className="flex flex-col">
                <label
                  htmlFor="Threshold Quantity"
                  className="text-[17px] font-semibold"
                >
                  Threshold Quantity
                </label>
                <input
                  type="text"
                  id="Threshold Quantity"
                  name="thresholdQuantity"
                  value={formik.values.thresholdQuantity}
                  onChange={formik.handleChange}
                  className="border px-5 py-2 rounded-lg text-[17px]"
                  placeholder="0.00"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="Unit Cost"
                  className="text-[17px] font-semibold"
                >
                  Unit Cost
                </label>
                <input
                  type="text"
                  id="Unit Cost"
                  name="unitCost"
                  value={formik.values.unitCost}
                  onChange={formik.handleChange}
                  className="border px-5 py-2 rounded-lg text-[17px]"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="Expiration Date"
                className="text-[17px] font-semibold"
              >
                Expiration Date
              </label>
              <input
                type="date"
                id="Expiration Date"
                name="expirationDate"
                value={formik.values.expirationDate}
                onChange={formik.handleChange}
                className="border px-5 py-2 rounded-lg text-[17px]"
              />
            </div>
          </div>

          <div className="flex justify-end mt-[20px] space-x-3">
            <button
              type="button"
              onClick={() => setEditItem(null)}
              className="py-[10px] px-[15px] border rounded-[12px] text-[17px] hover:bg-mainColor hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-[10px] px-[15px] bg-mainColor border text-white rounded-[12px] text-[17px] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all"
            >
              {editItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditItem;
