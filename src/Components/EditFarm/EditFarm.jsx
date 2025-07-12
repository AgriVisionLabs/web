import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import MenuElement from "../MenuElement/MenuElement";
import { useFormik } from "formik";
import { number, object, string } from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

const EditFarm = ({ farmId, setEdit, display }) => {
  let { indexBI, setIndexBI, baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [farm, setFarm] = useState(null);
  const soilTypes = ["Sandy", "Clay", "Loamy"];

  useEffect(() => {
    async function getFarmDetails() {
      try {
        setIsLoading(true);
        const options = {
          url: `${baseUrl}/Farms/${farmId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        let { data } = await axios(options);
        setFarm(data);
        setIndexBI(data.soilType);
      } catch (error) {
        toast.error("Failed to load farm details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getFarmDetails();
  }, [farmId, baseUrl, token, setIndexBI]);

  const validationSchema = object({
    name: string()
      .required("Farm Name is required")
      .min(3, "Farm Name must be at least 3 characters")
      .max(100, "Farm Name cannot be more than 100 characters"),
    area: number().required("Farm Size is required"),
    location: string()
      .required("Farm Location is required")
      .min(3, "Farm Location must be at least 3 characters")
      .max(100, "Farm Location cannot be more than 100 characters"),
    soilType: number(),
  });

  const onSubmit = async (values) => {
    try {
      setIsSaving(true);
      values.soilType = indexBI;
      const options = {
        url: `${baseUrl}/Farms/${farmId}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        data: values,
      };
      const { status } = await axios(options);
      if (status >= 200 && status < 300) {
        toast.success("Farm updated successfully");
        if (typeof display === "function") {
          display();
        }
        setEdit(false);
      }
    } catch (error) {
      toast.error("Failed to update farm");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: farm || {
      name: "",
      area: 0,
      location: "",
      soilType: 0,
    },
    validationSchema,
    onSubmit: onSubmit,
  });

  formik.values.soilType = indexBI;

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%] px-2"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setEdit(false);
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-[600px] h-min border-2 rounded-2xl bg-white flex flex-col items-center"
      >
        <div className="w-[90%] mt-5 text-[22px] flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 cursor-pointer"
            onClick={() => setEdit(false)}
          ></i>
        </div>
        <div className="flex flex-col justify-center items-center mb-5">
          <div className="capitalize mb-5 text-[20px] font-semibold text-mainColor">
            Edit Farm
          </div>
        </div>

        <form
          className="w-[75%] my-5 flex flex-col text-[18px]"
          onSubmit={formik.handleSubmit}
        >
            <div className="mb-4">
              <label htmlFor="name" className="ms-1 block mb-2">
                Farm Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={isLoading ? "Loading..." : (farm ? farm.name : "Farm Name")}
                className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21]"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="area" className="ms-1 block mb-2">
                Farm Size (acres)
              </label>
              <input
                type="number"
                id="area"
                name="area"
                placeholder={isLoading ? "Loading..." : (farm ? farm.area : "Farm Size")}
                className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21]"
                value={formik.values.area}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              {formik.touched.area && formik.errors.area && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.area}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="ms-1 block mb-2">
                Farm Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder={isLoading ? "Loading..." : (farm ? farm.location : "Farm Location")}
                className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21]"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              {formik.touched.location && formik.errors.location && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.location}</div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="soilType" className="ms-1 block mb-2">
                Soil Type
              </label>
              <MenuElement
                Items={soilTypes}
                name={isLoading ? "Loading..." : (farm ? soilTypes[farm.soilType] : "Select Soil Type")}
                width="100%"
                nameChange={soilTypes[indexBI]}
                setIndex={setIndexBI}
                className="my-2 rounded-xl"
                textColor="#000"
                disabled={isLoading}
              />
            </div>

          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="w-full self-end rounded-xl py-3 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSaving ? "Saving..." : isLoading ? "Loading..." : "Update Farm"}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default EditFarm;
