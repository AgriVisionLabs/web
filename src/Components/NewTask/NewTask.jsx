import { X } from "lucide-react";
import MenuElement from "../MenuElement/MenuElement";
import { useContext, useState } from "react";
import { date, object, string } from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import { userContext } from "../../Context/User.context";
import { AllContext } from "../../Context/All.context";

const NewTask = (children) => {
  let { baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [onList1, setOnList1] = useState();
  let [onList2, setOnList2] = useState();
  let [onList3, setOnList3] = useState();
  let [Fields, setFields] = useState([]);
  let [FieldNames, setFieldNames] = useState(null);
  let [index, setIndex] = useState(null);
  let [indexPriority, setIndexPriority] = useState(0);
  let [indexCategory, setIndexCategory] = useState(0);
  let Priority = ["Low", "Medium", "High"];
  let Category = [
    "Irrigation",
    "Fertilization",
    "PlantingOrHarvesting",
    "Maintenance",
    "Inspection",
    "PestAndHealthControl",
  ];
  const validationSchema = object({
    assignedToId: string(),
    title: string().required("title is required"),
    description: string(),
    dueDate: date(),
    itemPriority: string().required("item Priority is required"),
    category: string().required("category is required"),
  });

  async function getFields() {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmData.farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFields(data);
      if (data) {
        setIndex(0);
        setFieldNames(
          data.map((field) => {
            return field.name;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  }
  useEffect(() => {
    getFields();
  }, []);

  async function sendNewTask(values) {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    console.log(values);

    try {
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      const option = {
        url: `${baseUrl}/farms/${children.farmData.farmId}/fields/${Fields[index].id}/Tasks`,
        method: "POST",
        data: filteredValues,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let data = await axios(option);
      if (data) {
        children.setCreateTask(null);
      }
      children.display();
    } catch (error) {
      console.error("Error creating new task:", error);
    }
  }
  const formik = useFormik({
    initialValues: {
      assignedToId: "",
      title: "",
      description: "",
      dueDate: "",
      itemPriority: "",
      category: "",
    },
    validationSchema,
    onSubmit: sendNewTask,
  });
  useEffect(() => {
    formik.values.itemPriority = indexPriority;
    formik.values.category = indexCategory;
  }, [indexPriority, indexCategory]);

  return (
    <section
      className="flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute inset-0 z-50 w-[100%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          children.setCreateTask(null);
        }
      }}
    >
      <div className="w-[95%] lg:w-1/2 px-[40px] border-2 rounded-2xl bg-white py-[10px] text-[#0D121C] font-manrope">
        <X
          size={33}
          className="ms-auto cursor-pointer hover:text-red-500 transition-all duration-150"
          onClick={() => {
            children.setCreateTask(null);
          }}
        />
        <div className="space-y-[8px]">
          <h1 className="text-[25px] font-semibold capitalize">
            create new task
          </h1>
          <p className="text-[17px] text-[#616161] font-semibold">
            Add a new task to the selected farm.
          </p>
        </div>
        <form
          action=""
          className="my-[20px] space-y-[25px]"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col">
            <label
              htmlFor="taskTitle"
              className="text-[19px] text-[#0D121C] font-semibold mb-[8px]"
            >
              Task title
            </label>
            <input
              type="text"
              id="taskTitle"
              className="border-[2px] border-[#9F9F9F] rounded-[12px] px-[20px] py-[12px] focus:outline-mainColor"
              placeholder="Enter a descriptive title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-[19px] text-[#0D121C] font-semibold mb-[8px]"
            >
              description
            </label>
            <textarea
              href=""
              alt=""
              id="description"
              className="min-h-[100px] max-h-min border-[2px] border-[#9F9F9F] rounded-[12px] px-[20px] py-[12px] focus:outline-mainColor"
              placeholder="Provide details about the task"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-x-[30px] gap-y-[10px] justify-between items-center">
            <div className="space-y-1">
              <label
                htmlFor="Field"
                className="text-[19px] text-[#0D121C] font-semibold"
              >
                Field
              </label>
              <MenuElement
                Items={FieldNames ? FieldNames : []}
                nameChange={FieldNames ? FieldNames[index] : null}
                setIndex={setIndex}
                index={index}
                onList={onList1}
                width={250 + "px"}
                setOnList={setOnList1}
                Pformat={"text-[#0D121C] font-[400]"}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="Priority"
                className="text-[19px] text-[#0D121C] font-semibold mb-[8px]"
              >
                Priority
              </label>
              <MenuElement
                Items={Priority}
                nameChange={Priority[indexPriority]}
                setIndex={setIndexPriority}
                index={indexPriority}
                onList={onList2}
                width={250 + "px"}
                setOnList={setOnList2}
                Pformat={"text-[#0D121C] font-[400]"}
              />
            </div>
            <div className="flex flex-col space-y-1 w-[250px]">
              <label
                htmlFor="Due Date"
                className="text-[19px] text-[#0D121C] font-semibold"
              >
                Due Date
              </label>
              <input
                type="datetime-local"
                id="task title"
                className="border-[1px] border-[##0d121c21] rounded-lg px-5 py-2 text-[17px] font-[400] focus:outline-mainColor"
                name="dueDate"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="Category"
                className="text-[19px] text-[#0D121C] font-semibold mb-[8px]"
              >
                Category
              </label>
              <MenuElement
                Items={Category}
                nameChange={Category[indexCategory]}
                setIndex={setIndexCategory}
                index={indexCategory}
                onList={onList3}
                width={250 + "px"}
                setOnList={setOnList3}
                Pformat={"text-[#0D121C] font-[400]"}
              />
            </div>
          </div>

          <div className="flex justify-start space-x-3 items-cente">
            <button
              type="button"
              className="py-[10px] px-[15px] border-[1px] border-[#616161] rounded-[12px] text-[#333333] text-[17px] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-semibold"
              onClick={(e) => {
                if (e.target == e.currentTarget) {
                  children.setDisplayTask(null);
                }
              }}
            >
              <div
                className="flex justify-center items-center space-x-[11px]"
                onClick={() => {
                  children.setCreateTask(null);
                }}
              >
                <p className="">Cancel</p>
              </div>
            </button>
            <button
              type="submit"
              className="py-[10px] px-[15px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[17px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
            >
              <div className="flex justify-center items-center space-x-[11px]">
                <p className="">Create Task</p>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewTask;
