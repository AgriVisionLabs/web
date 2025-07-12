// import { useContext, useRef, useState } from "react";
// import { AllContext } from "../../Context/All.context";
// import { QrCode, X } from "lucide-react";

// const Sensors = (children) => {
//   let { outClick, setAddField } = useContext(AllContext);
//   let Name = useRef(null);
//   let SerialNumber = useRef(null);
//   let [sensorsList] = useState([]);
//   function addSensorData() {
//     sensorsList.push({
//       name: Name.current.value,
//       serialNumber: SerialNumber.current.value,
//     });
//     children.setFieldData((prev) => ({
//       ...prev,
//       SensorUnit: [...sensorsList],
//     }));
//     Name.current.value = "";
//     SerialNumber.current.value = "";
//     console.log("irrigationList", children.FieldData);
//   }
//   return (
//     <section
//       className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           outClick();
//         }
//       }}
//     >
//       <div className=" w-[600px] h-[660px]   border-2 rounded-2xl bg-white flex  flex-col items-center">
//         <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
//           <i
//             className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
//             onClick={() => {
//               outClick();
//             }}
//           ></i>
//         </div>
//         <div className="flex flex-col justify-center items-center mt-8 mb-5">
//           <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">
//             add new field
//           </div>
//           <div className="w-[100%] rounded-xl flex gap-2  items-center">
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
//                 <p className="">1</p>
//               </div>
//               <p className="mt-2">Basic Info</p>
//             </div>
//             <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full ">
//                 <p className="">2</p>
//               </div>
//               <p className="mt-2">Irrigation</p>
//             </div>
//             <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full ">
//                 <p className="">3</p>
//               </div>

//               <p className="mt-2">Sensors</p>
//             </div>
//             <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
//                 <p className="">4</p>
//               </div>

//               <p className="mt-2">Review</p>
//             </div>
//           </div>
//         </div>
//         <form
//           action=""
//           className="w-[85%] my-5 flex flex-col justify-between  text-[18px] flex-grow"
//         >
//           <div className="flex flex-col gap-3 my-5">
//             <div className="">
//               <label htmlFor="" className="ms-1">
//                 Sensor unit name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Sensor unit name "
//                 ref={Name}
//                 className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] "
//               />
//             </div>
//             <div className="">
//               <label htmlFor="" className="ms-1">
//                 Serial Number
//               </label>
//               <div className="flex justify-center items-center gap-3">
//                 <input
//                   type="text"
//                   placeholder="Enter Serial Number"
//                   ref={SerialNumber}
//                   className="formControl mx-0 rounded-xl text-[16px] py-5  border-[#0d121c21] "
//                 />
//                 <div className="flex justify-center items-center mx-0 rounded-xl text-[16px] p-2 w-20  border-2 border-[#0d121c21]">
//                   <QrCode strokeWidth={1.2} size={25} />
//                 </div>
//               </div>
//             </div>
//             <button
//               type="button"
//               className="btn2 rounded-xl w-[100%]  py-5 bg-mainColor text-[16px] text-white hover:bg-[#616161]  font-medium "
//               onClick={() => {
//                 addSensorData();
//               }}
//             >
//               <i className="fa-solid fa-plus me-2"></i>Add Sensor
//             </button>
//           </div>
//           <div className=" flex flex-col gap-1  h-[80px] overflow-y-scroll">
//             {children.FieldData.SensorUnit?.map((item, index) => {
//               return (
//                 <div className=" flex-grow " key={`${item.name}-${index}`}>
//                   <div className="bg-[#1e693021] rounded-lg py-3 px-5 my-1 flex justify-between items-center">
//                     <div className="flex flex-col  ">
//                       <p className="capitalize text-[15px] py-1">{item.Name}</p>
//                       <p className="text-[13px] text-[#757575]">
//                         {item.SerialNumber}
//                       </p>
//                     </div>
//                     <X
//                       className="fa-solid fa-x text-[#9F9F9F] hover:text-red-600 transition-colors duration-300 "
//                       onClick={() => {
//                         sensorsList = sensorsList.filter((_, i) => i !== index);
//                         children.setFieldData((prev) => ({
//                           ...prev,
//                           SensorUnit: children.FieldData.SensorUnit.filter(
//                             (_, i) => i !== index
//                           ),
//                         }));
//                       }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <div className="flex justify-between items-center mt-[10px] ">
//             <i
//               className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px]"
//               onClick={() => {
//                 setAddField(2);
//               }}
//             ></i>
//             <button
//               type="button"
//               className="btn2  w-[150px] self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "
//               onClick={() => {
//                 setAddField(4);
//               }}
//             >
//               Next <i className="fa-solid fa-angle-right ms-3"></i>
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Sensors;

import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AllContext } from "../../Context/All.context";
import { QrCode, X } from "lucide-react";

const Sensors = (children) => {
  const { outClick, setAddField } = useContext(AllContext);
  console.log(children.FieldData);

  const sensorSchema = Yup.object({
    name: Yup.string().optional(),
    serialNumber: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      serialNumber: "",
    },
    validationSchema: sensorSchema,
    onSubmit: (values, { resetForm }) => {
      const newSensor = {
        name: values.name,
        serialNumber: values.serialNumber,
      };

      children.setFieldData((prev) => ({
        ...prev,
        SensorUnit: [...(prev.SensorUnit || []), newSensor],
      }));

      resetForm();
    },
  });

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
        }
      }}
    >
      <div className="w-[600px] h-[660px] border-2 rounded-2xl bg-white flex flex-col items-center">
        <div className="w-[90%] mt-5 text-[22px] flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300"
            onClick={outClick}
          ></i>
        </div>

        <div className="flex flex-col justify-center items-center mt-8 mb-5">
          <div className="capitalize mb-5 text-[20px] font-semibold text-mainColor">
            add new field
          </div>
          <div className="w-[100%] rounded-xl flex gap-2 items-center">
            {["Basic Info", "Irrigation", "Sensors", "Review"].map(
              (step, i) => (
                <div className="flex items-center" key={i}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center rounded-full ${
                        i <= 2 ? "bg-mainColor" : "bg-mainColor opacity-[0.3]"
                      }`}
                    >
                      <p>{i + 1}</p>
                    </div>
                    <p className="mt-2">{step}</p>
                  </div>
                  {i < 3 && (
                    <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3] mx-1"></div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-[85%] my-5 flex flex-col justify-between text-[18px] flex-grow"
        >
          <div className="flex flex-col gap-3 my-5">
            <div>
              <label className="ms-1">Sensor unit name</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Sensor unit name"
                className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21]"
              />
              {/* {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )} */}
            </div>

            <div>
              <label className="ms-1">Serial Number</label>
              <div className="flex justify-center items-center gap-3">
                <input
                  type="text"
                  name="serialNumber"
                  value={formik.values.serialNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Serial Number"
                  className="formControl mx-0 rounded-xl text-[16px] py-5 border-[#0d121c21]"
                />
                <div className="flex justify-center items-center mx-0 rounded-xl text-[16px] p-2 w-20 border-2 border-[#0d121c21]">
                  <QrCode strokeWidth={1.2} size={25} />
                </div>
              </div>
              {/* {formik.touched.serialNumber && formik.errors.serialNumber && (
                <p className="text-red-500 text-sm">
                  {formik.errors.serialNumber}
                </p>
              )} */}
            </div>

            <button
              type="submit"
              className="btn2 rounded-xl w-full py-5 bg-mainColor text-[16px] text-white hover:bg-[#616161] font-medium"
            >
              <i className="fa-solid fa-plus me-2"></i>Add Sensor
            </button>
          </div>

          <div className="flex flex-col gap-1 h-[80px] overflow-y-scroll">
            {children.FieldData.SensorUnit?.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex-grow">
                <div className="bg-[#1e693021] rounded-lg py-3 px-5 my-1 flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="capitalize text-[15px] py-1">{item.name}</p>
                    <p className="text-[13px] text-[#757575]">
                      {item.serialNumber}
                    </p>
                  </div>
                  <X
                    className="text-[#9F9F9F] hover:text-red-600 transition-colors duration-300 cursor-pointer"
                    onClick={() => {
                      children.setFieldData((prev) => ({
                        ...prev,
                        SensorUnit: prev.SensorUnit.filter(
                          (_, i) => i !== index
                        ),
                      }));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-[10px]">
            <i
              className="fa-solid fa-angle-left hover:text-mainColor transition-all duration-300 cursor-pointer text-[22px]"
              onClick={() => {
                setAddField(2);
              }}
            ></i>
            <button
              type="button"
              className="btn2 w-[150px] self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium"
              onClick={() => {
                setAddField(4);
              }}
            >
              Next <i className="fa-solid fa-angle-right ms-3"></i>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Sensors;
