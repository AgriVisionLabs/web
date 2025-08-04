/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { date, number, object, string } from "yup";
import { useFormik } from "formik";
import MenuElement from "../MenuElement/MenuElement";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const InventoryManagement = (children) => {
  let { baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [fields, setFields] = useState([]);
  let [fieldNames, setFieldNames] = useState(null);
  let [indexFarm, setIndexFarm] = useState(0);
  let [indexField, setIndexField] = useState(0);
  let [indexMeasurementUnit, setIndexMeasurementUnit] = useState(0);
  let [indexCategory, setIndexCategory] = useState(0);
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [apiErrors, setApiErrors] = useState({});
  let MeasurementUnit = ["Unit", "Kg", "L", "g", "mL", "Ibs", "oz"];
  let Category = [
    "Fertilizer",
    "Chemicals", 
    "Treatments",
    "Produce",
  ];

  const validationSchema = object({
    fieldId: string().required("Field is required"),
    name: string().required("Name is required").min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
    category: number().required("Category is required"),
    quantity: string().required("Quantity is required").matches(/^\d+(\.\d+)?$/, "Quantity must be a valid number"),
    thresholdQuantity: string().required("Threshold quantity is required").matches(/^\d+(\.\d+)?$/, "Threshold quantity must be a valid number"),
    unitCost: string().required("Unit cost is required").matches(/^\d+(\.\d+)?$/, "Unit cost must be a valid number"),
    measurementUnit: string().required("Measurement unit is required"),
    expirationDate: date().required("Expiration date is required").min(new Date(), "Expiration date must be in the future"),
  });

  async function getFields() {
    if (!token || children.farms.length === 0) {
      console.error("No token available or invalid farm data for getFields");
      return;
    }
    try {
      const options = {
        url: `${baseUrl}/farms/${children.farms[indexFarm].farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log(fields);

      setFields(data);
      setFieldNames(
        data.map((field) => {
          return field.name;
        })
      );
    } catch (error) {
      console.error("Error fetching fields:", error);
      toast.error("Failed to load fields");
    }
  }
  
  useEffect(() => {
    getFields();
  }, []);

  async function sendNewInventory(values) {
    console.log("Creating new inventory item with values:", values);
    setIsSubmitting(true);
    setApiErrors({}); // Clear previous API errors

    if (!token) {
      console.error("No token available for sendNewInventory");
      toast.error("Authentication required");
      setIsSubmitting(false);
      return;
    }

    try {
      const option = {
        url: `${baseUrl}/farms/${children.farms[indexFarm].farmId}/InventoryItems`,
        method: "POST",
        data: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(option);
      console.log("Inventory item created successfully:", data);
      
      toast.success("Inventory item added successfully!");
      children.display(); // Refresh the inventory list

      if (data) {
        children.setAddNewInventory(null);
      }
    } catch (error) {
      console.error("Error creating inventory item:", error);
      
      if (error?.response?.data?.errors) {
        // Handle validation errors from API
        const serverErrors = error.response.data.errors;
        setApiErrors(serverErrors);
        
        // Display the first error as a toast
        const firstErrorKey = Object.keys(serverErrors)[0];
        if (firstErrorKey && serverErrors[firstErrorKey][0]) {
          toast.error(serverErrors[firstErrorKey][0]);
        }
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.response?.status === 400) {
        toast.error("Invalid data provided. Please check your input.");
      } else {
        toast.error("Failed to add inventory item. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      fieldId: "",
      name: "",
      category: 0,
      quantity: "",
      thresholdQuantity: "",
      unitCost: "",
      measurementUnit: "",
      expirationDate: "",
    },
    validationSchema,
    onSubmit: sendNewInventory,
  });

  console.log("Formik errors:", formik.errors);
  console.log("API errors:", apiErrors);

  useEffect(() => {
    console.log(fields[indexField]?.id);

    formik.setFieldValue("fieldId", fields[indexField]?.id);
    formik.setFieldValue(
      "measurementUnit",
      MeasurementUnit[indexMeasurementUnit]
    );
  }, [fields, indexField, indexMeasurementUnit]);

  // Helper function to get error message for a field
  const getFieldError = (fieldName) => {
    // Check API errors first, then formik errors
    if (apiErrors[fieldName] && apiErrors[fieldName][0]) {
      return apiErrors[fieldName][0];
    }
    if (formik.touched[fieldName] && formik.errors[fieldName]) {
      return formik.errors[fieldName];
    }
    return null;
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName) => {
    return (apiErrors[fieldName] && apiErrors[fieldName][0]) || 
           (formik.touched[fieldName] && formik.errors[fieldName]);
  };

  return (
    <section
      className="flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute inset-0 z-50 w-[100%]"
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          children.setAddNewInventory(null);
        }
      }}
    >
      <div className=" w-[640px] h-[665px] overflow-y-auto px-[40px] border-2 rounded-2xl bg-white pt-[10px] text-[#0D121C] font-manrope">
        <X
          size={33}
          className="ms-auto cursor-pointer hover:text-red-500 transition-all duration-150"
          onClick={() => {
            children.setAddNewInventory(null);
          }}
        />
        <div className="space-y-[8px]">
          <h1 className="text-[23px] mb-[20px] font-semibold capitalize text-mainColor">
            add new inventory item
          </h1>
        </div>
        <form action="" className="my-[20px] " onSubmit={formik.handleSubmit}>
          <div className="gap-y-[10px] grid grid-cols-1">
            <div className=" flex flex-col">
              <label className="text-[17px] text-[#0D121C]  font-semibold">
                Farm
              </label>
              <MenuElement
                Items={children.farmNames ? children.farmNames : []}
                nameChange={
                  children.farmNames ? children.farmNames[indexFarm] : null
                }
                setIndex={setIndexFarm}
                Pformat={"text-[#0D121C] font-[400]"}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[17px] text-[#0D121C]  font-semibold">
                Field
              </label>
              <MenuElement
                Items={fieldNames ? fieldNames : []}
                nameChange={fieldNames ? fieldNames[indexField] : null}
                setIndex={setIndexField}
                Pformat={"text-[#0D121C] font-[400]"}
              />
              {getFieldError('fieldId') && (
                <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('fieldId')}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-[40px] ">
              <div className=" flex flex-col">
                <label
                  htmlFor="Name"
                  className="text-[17px] text-[#0D121C]  font-semibold"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="Name"
                  className={`border-[1px] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor ${hasFieldError('name') ? 'border-red-500' : 'border-[#0d121c21]'}`}
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter item name"
                  disabled={isSubmitting}
                />
                {getFieldError('name') && (
                  <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('name')}</p>
                )}
              </div>
              <div className="">
                <label className="text-[17px] text-[#0D121C]  font-semibold ">
                  Category
                </label>
                <MenuElement
                  name="category"
                  Items={Category}
                  nameChange={Category[indexCategory]}
                  setIndex={(index) => {
                    setIndexCategory(index);
                    formik.setFieldValue("category", index);
                  }}
                  index={indexCategory}
                  className={"mt-0 w-full"}
                  Pformat={"text-[#0D121C] font-[400] mb-0"}
                />
                {getFieldError('category') && (
                  <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('category')}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-[40px] ">
              <div className=" space-y-1 flex flex-col">
                <label
                  htmlFor="Quantity"
                  className="text-[17px] text-[#0D121C]  font-semibold"
                >
                  Quantity
                </label>
                <input
                  type="text"
                  id="Quantity"
                  className={`border-[1px] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor ${hasFieldError('quantity') ? 'border-red-500' : 'border-[#0d121c21]'}`}
                  name="quantity"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {getFieldError('quantity') && (
                  <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('quantity')}</p>
                )}
              </div>
              <div className="space-y-1 flex flex-col">
                <label className="text-[17px] text-[#0D121C]  font-semibold ">
                  Measurement Unit
                </label>
                <MenuElement
                  Items={MeasurementUnit}
                  nameChange={MeasurementUnit[indexMeasurementUnit]}
                  setIndex={setIndexMeasurementUnit}
                  index={indexMeasurementUnit}
                  Pformat={"text-[#0D121C] font-[400]"}
                />
                {getFieldError('measurementUnit') && (
                  <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('measurementUnit')}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-[40px] ">
              <div className=" space-y-1 flex flex-col">
                <label
                  htmlFor="Threshold Quantity"
                  className="text-[17px] text-[#0D121C]  font-semibold"
                >
                  Threshold Quantity
                </label>
                <input
                  type="text"
                  id="Threshold Quantity"
                  className={`border-[1px] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor ${hasFieldError('thresholdQuantity') ? 'border-red-500' : 'border-[#0d121c21]'}`}
                  name="thresholdQuantity"
                  value={formik.values.thresholdQuantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {getFieldError('thresholdQuantity') && (
                  <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('thresholdQuantity')}</p>
                )}
              </div>
              <div className=" space-y-1 flex flex-col">
                <label
                  htmlFor="Unit Cost"
                  className="text-[17px] text-[#0D121C]  font-semibold"
                >
                  Unit Cost
                </label>
                <input
                  type="text"
                  id="Unit Cost"
                  className={`border-[1px] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor ${hasFieldError('unitCost') ? 'border-red-500' : 'border-[#0d121c21]'}`}
                  name="unitCost"
                  value={formik.values.unitCost}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {getFieldError('unitCost') && (
                  <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('unitCost')}</p>
                )}
              </div>
            </div>
            <div className=" space-y-1 flex flex-col ">
              <label
                htmlFor="Expiration Date"
                className="text-[17px] text-[#0D121C]  font-semibold"
              >
                Expiration Date
              </label>
              <input
                type="date"
                id="Expiration Date"
                className={`border-[1px] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor ${hasFieldError('expirationDate') ? 'border-red-500' : 'border-[#0d121c21]'}`}
                name="expirationDate"
                value={formik.values.expirationDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
              {getFieldError('expirationDate') && (
                <p className="text-red-500 text-[13px] mt-[5px]">{getFieldError('expirationDate')}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-[20px] items-cente">
            <button
              type="button"
              className="py-[10px] px-[15px]  border-[1px] border-[#616161] rounded-[12px] text-[#333333]  text-[17px]  hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-semibold"
              onClick={() => {
                children.setAddNewInventory(null);
              }}
              disabled={isSubmitting}
            >
              <div className="flex justify-center items-center space-x-[11px]">
                <p className="">Cancel</p>
              </div>
            </button>
            <button
              type="submit"
              className={`py-[10px] px-[15px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[17px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              <div className="flex justify-center items-center space-x-[11px]">
                <p className="">{isSubmitting ? 'Adding...' : 'Add Item'}</p>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InventoryManagement;
