import { useContext, useEffect } from "react";
import { AllContext } from "../../Context/All.context";
import { useState } from "react";
import MenuElement from "../MenuElement/MenuElement";
import { useFormik } from "formik";
import { number, object, string } from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import { userContext } from "../../Context/User.context";
import { motion } from "framer-motion";

const EditBasicInfo = (Children) => {
  let { indexBI, setIndexBI, baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let [farm, setFarm] = useState(null);
  var forms = ["Sandy", "Clay", "Loamy"];

  useEffect(() => {
    async function getOldFarmDetails() {
      try {
        setIsLoading(true);
        const options = {
          url: `${baseUrl}/Farms/${Children.farmId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        let { data } = await axios(options);
        setFarm(data);
        console.log(data.soilType);
        setIndexBI(data.soilType);
      } catch (error) {
        toast.error("Failed to load farm details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getOldFarmDetails();
  }, []);

  const validationSchema = object({
    name: string()
      .required("Farm Name is required")
      .min(3, "Farm Name must be at least 3 characters")
      .max(100, "Farm Name can not be than 100 characters"),
    area: number().required("Farm Size is required"),
    // .matches(/^([0-9]*?(.[0-9])*)$/, "The Farm size must be number"),
    location: string()
      .required("Farm Location is required")
      .min(3, "Farm Location must be at least 3 characters")
      .max(100, "Farm Location can not be than 100 characters"),
    soilType: number(),
  });
  // .required("Soil Type is required"),

  // async function EditFarm(values) {
  //   const loadingId = toast.loading("Waiting...");
  //   try {
  //     values.soilType = indexBI;
  //     console.log("farmIdEdit : " + Children.farmId);
  //     const options = {
  //       url: `${baseUrl}/Farms/${Children.farmId}`,
  //       method: "PUT",
  //       data: values,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };
  //     let { data } = await axios(options);
  //     setFarm(data);

  //     Children.setFarmData(values);
  //     Children.setEdit("Team");

  //     Children.display();
  //     Children.setFarmId(data.farmId);
  //   } catch (error) {
  //     toast.error("Incorrect email or password (" + error + ")");
  //     console.log(error);
  //   } finally {
  //     toast.dismiss(loadingId);
  //   }
  // }

  const onSubmit = async (values) => {
    // Persist changes immediately and close modal
    try {
      setIsSaving(true);
      values.soilType = indexBI;
      const options = {
        url: `${baseUrl}/Farms/${Children.farmId}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        data: values,
      };
      const { status, data } = await axios(options);
      if (status >= 200 && status < 300) {
        toast.success("Farm updated");
        // refresh list in parent
        if (typeof Children.display === "function") {
          Children.display();
        }
        // close modal
        Children.setEdit(false);
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
  {
    formik.values.soilType = indexBI;
  }

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%] px-2"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          Children.setEdit(false);
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
        <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
            onClick={() => {
              Children.setEdit(false);
            }}
          ></i>
        </div>
        <div className="flex flex-col justify-center items-center mt-8 mb-5">
          <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">
            Edit farm
          </div>
          <div className="w-[100%] rounded-xl flex gap-4  items-center">
            <div className=" flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
                <p className="">1</p>
              </div>
              <p className="mt-2">Basic Info</p>
            </div>
            <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
            <div className=" flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
                <p className="">2</p>
              </div>
              <p className="mt-2">Team</p>
            </div>
            <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
            <div className=" flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
                <p className="">3</p>
              </div>
              <p className="mt-2">Review</p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="w-[75%] my-5 flex flex-col items-center justify-center h-96">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          </div>
        ) : farm ? (
          <form
            action=""
            className="w-[75%] my-5 flex flex-col text-[18px]"
            onSubmit={formik.handleSubmit}
          >
            <div className="">
              <label htmlFor="" className="ms-1">
                Farm Name
              </label>
              <input
                type="text"
                placeholder={farm.name}
                className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] "
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="">
              <label htmlFor="" className="ms-1">
                Farm Size (acres)
              </label>
              <input
                type="text"
                placeholder={farm.area}
                className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] "
                name="area"
                value={formik.values.area}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="">
              <label htmlFor="" className="ms-1">
                Farm Location
              </label>
              <input
                type="text"
                placeholder={farm.location}
                className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] "
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="">
              <label htmlFor="" className="">
                Soil Type
              </label>
              {console.log(forms[farm.soilType], forms[indexBI])}
              <MenuElement
                Items={forms}
                name={forms[farm.soilType]}
                width={100 + "%"}
                nameChange={forms[indexBI]}
                setIndex={setIndexBI}
                className={"my-2"}
                // onList={onList}
                // setOnList={setOnList}
                textColor={"#9F9F9F"}
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full self-end rounded-xl py-2.5 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-12 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </form>
        ) : (
          <div className="w-[75%] my-5 flex flex-col items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <p className="mb-4">Failed to load farm details</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-mainColor text-white rounded-xl hover:bg-opacity-80"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default EditBasicInfo;
