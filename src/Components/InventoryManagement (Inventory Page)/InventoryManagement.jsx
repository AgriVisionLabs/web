import React, { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import { date, object, string } from 'yup';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import MenuElement from '../MenuElement/MenuElement';
import { X } from 'lucide-react';
import axios from 'axios';

const InventoryManagement = (children) => {
    let { baseUrl } = useContext(AllContext);
    let { token } = useContext(userContext);
    let [fields, setFields] = useState([]);
    let [fieldNames, setFieldNames] = useState([]);
    let [indexFarm, setIndexFarm] = useState(0);
    let [indexField, setIndexField] = useState(0);
    let [indexMeasurementUnit, setIndexMeasurementUnit] = useState(0);
    let [indexCategory, setIndexCategory] = useState(0);
    let MeasurementUnit= ["Kg", "L", "g","mL","Ibs","oz"];
    let Category = [
        "Irrigation",
        "Fertilization",
        "PlantingOrHarvesting",
        "Maintenance",
        "Inspection",
        "PestAndHealthControl",
    ];
    const validationSchema = object({
        fieldId: string(),
        name: string().required("title is required"),
        category: string().required("category is required"),
        quantity: string().required("quantity is required"),
        thresholdQuantity: string().required("thresholdQuantity is required"),
        unitCost: string().required("unitCost is required"),
        measurementUnit: string().required("measurementUnit is required"),
        expirationDate: date(),
    });
    // async function getFarms() {
    //     try {
    //     const options = {
    //         url: `${baseUrl}/farms`,
    //         method: "GET",
    //         headers: {
    //         Authorization: `Bearer ${token}`,
    //         },
    //     };
    //     let { data } = await axios(options);
    //     if (data) {
    //         setFarms(data)
    //         setFarmNames(
    //         data.map((field) => {
    //             return field.name;
    //         })
    //         );
    //         console.log("getFarms",data);
    //     }
    //     } catch (error) {
    //     // toast.error("Incorrect email or password "+error);
    //     console.log(error);
    //     }
    // }
    async function getFields() {
        try {
        const options = {
            url: `${baseUrl}/farms/${children.farms[indexFarm].farmId}/Fields`,
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        let { data } = await axios(options);
        
        setFields(data)
        setFieldNames(
            data.map((field) => {
                return field.name;
            })
        );
        console.log("data",fields[indexField].id)
        } catch (error) {
            if(error.response.data.errors[0].description){toast.error(error.response.data.errors[0].description, { position: "top-left" })}
            else{toast.error("Invalid Data", { position: "top-left" })}
        console.log(error);
        }
    }
    useEffect(() => {
        getFields();
    }, [indexFarm,children.farmData]);
    async function sendNewInventory(values) {
        const loadingId = toast.loading("Waiting...", { position: "top-left" });
        try {
        const filteredValues = Object.fromEntries(
            Object.entries(values).filter(
            ([_, value]) => value !== "" && value !== null && value !== undefined
            )
        );
        const option = {
            url: `${baseUrl}/farms/${children.farms[indexFarm].farmId}/InventoryItems`,
            method: "POST",
            data: filteredValues,
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        let data= await axios(option);
        children.setPageInventory(null)
        children.getInventory()
        } catch (error) {
            if(error.response.data.errors[0].description){toast.error(error.response.data.errors[0].description, { position: "top-left" })}
            else{toast.error("Invalid Data", { position: "top-left" })}
        } finally {
        toast.dismiss(loadingId);
        }
    }
    const formik = useFormik({
        initialValues: {
        fieldId: "",
        name:"",
        category:"",
        quantity:"",
        thresholdQuantity:"",
        unitCost:"",
        measurementUnit:"",
        expirationDate:""
        },
        validationSchema,
        onSubmit: sendNewInventory,
    });
    useEffect(() => {
        if (fields.length > 0 && fields[indexField]) {
                formik.setFieldValue("fieldId", fields[indexField].id);
            }
        formik.setFieldValue("category",indexCategory);
        formik.setFieldValue("measurementUnit", MeasurementUnit[indexMeasurementUnit]);
    }, [indexField, indexCategory,indexMeasurementUnit,children.farms[indexFarm]]);

    return (
        children.farms[indexFarm].farmId?<section
        className=" flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute inset-0 z-50 w-[100%]"
        onClick={(e) => {
            if (e.target == e.currentTarget) {
            children.setPageInventory(null);
            }
        }}
        >
        <div className=" w-[640px] h-[665px] px-[40px] border-2 rounded-2xl bg-white pt-[10px] text-[#0D121C] font-manrope">
            <X
            size={33}
            className="ms-auto cursor-pointer hover:text-red-500 transition-all duration-150"
            onClick={() => {
                children.setPageInventory(null);
            }}
            />
            <div className="space-y-[8px]">
            <h1 className="text-[23px] mb-[20px] font-semibold capitalize text-mainColor">
                add new inventory item
            </h1>
            </div>
            <form
            action=""
            className="my-[20px] "
            onSubmit={formik.handleSubmit}
            >
            
            <div className="gap-y-[10px] grid grid-cols-1">
                <div className=" flex flex-col">
                    <label
                        className="text-[17px] text-[#0D121C]  font-semibold"
                    >
                        Farm
                    </label>
                    <MenuElement
                        Items={children.farmNames ? children.farmNames : []}
                        nameChange={children.farmNames ? children.farmNames[indexFarm] : null}
                        setIndex={setIndexFarm}
                        index={indexFarm}
                        Pformat={"text-[#0D121C] font-[400]"}
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        className="text-[17px] text-[#0D121C]  font-semibold"
                    >
                        Field
                    </label>
                    {fieldNames&&<MenuElement
                        Items={fieldNames.length>0 ? fieldNames : []}
                        nameChange={fieldNames.length>0 ? fieldNames[indexField] : null}
                        setIndex={setIndexField}
                        index={indexField}
                        Pformat={"text-[#0D121C] font-[400]"}
                    />}
                </div>
                <div className="grid grid-cols-2 gap-x-[40px] ">
                    <div className=" flex flex-col">
                        <label htmlFor="Name" className="text-[17px] text-[#0D121C]  font-semibold">Name</label>
                        <input
                            type='text'
                            id="Name"
                            className="border-[1px] border-[#0d121c21] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor  "
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='Enter item name'
                        />
                    </div>
                    <div className="">
                        <label
                            className="text-[17px] text-[#0D121C]  font-semibold "
                        >
                            Category
                        </label>
                        <MenuElement
                            Items={Category}
                            nameChange={Category[indexCategory]}
                            setIndex={setIndexCategory}
                            index={indexCategory}
                            className={"mt-0 w-full"}
                            Pformat={"text-[#0D121C] font-[400] mb-0"}
                        />
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
                            type="number"
                            id="Quantity"
                            className="border-[1px] border-[##0d121c21] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor  "
                            name="quantity"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='0.00'
                        />
                    </div>
                    <div className="space-y-1 flex flex-col">
                        <label
                            className="text-[17px] text-[#0D121C]  font-semibold "
                        >
                            Measurement Unit
                        </label>
                        <MenuElement
                            Items={MeasurementUnit}
                            nameChange={MeasurementUnit[indexMeasurementUnit]}
                            setIndex={setIndexMeasurementUnit}
                            index={indexMeasurementUnit}
                            Pformat={"text-[#0D121C] font-[400]"}
                        />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-x-[40px] '>
                    <div className=" space-y-1 flex flex-col">
                        <label
                            htmlFor="Threshold Quantity"
                            className="text-[17px] text-[#0D121C]  font-semibold"
                        >
                            Threshold Quantity
                        </label>
                        <input
                            type="number"
                            id="Threshold Quantity"
                            className="border-[1px] border-[##0d121c21] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor  "
                            name="thresholdQuantity"
                            value={formik.values.thresholdQuantity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='0.00'
                        />
                    </div>
                    <div className=" space-y-1 flex flex-col">
                        <label
                            htmlFor="Unit Cost"
                            className="text-[17px] text-[#0D121C]  font-semibold"
                        >
                            Unit Cost
                        </label>
                        <input
                            type="number"
                            id="Unit Cost"
                            className="border-[1px] border-[##0d121c21] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor  "
                            name="unitCost"
                            value={formik.values.unitCost}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='0.00'
                        />
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
                            type='date'
                            id="Expiration Date"
                            className="border-[1px] border-[##0d121c21] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor  "
                            name="expirationDate"
                            value={formik.values.expirationDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-[20px] items-cente">
                <button
                type="button"
                className="py-[10px] px-[15px]  border-[1px] border-[#616161] rounded-[12px] text-[#333333]  text-[17px]  hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-semibold"
                onClick={(e) => {
                    if (e.target == e.currentTarget) {
                    children.setPageInventory(null);
                    }
                }}
                >
                <div
                    className="flex justify-center items-center space-x-[11px]"
                >
                    <p className="">Cancel</p>
                </div>
                </button>
                <button
                type="submit"
                className="py-[10px] px-[15px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[17px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                >
                <div className="flex justify-center items-center space-x-[11px]">
                    <p className="">Add Item</p>
                </div>
                </button>
            </div>
            </form>
        </div>
        </section>:null
    );
}

export default InventoryManagement;
