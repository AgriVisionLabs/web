import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import MenuElement from "../MenuElement/MenuElement";
import { object, string } from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { userContext } from "../../Context/User.context";
import { motion } from "framer-motion";
const EditTeam = (children) => {
  const { outClick, onListItem, setOnListItem, baseUrl } =
    useContext(AllContext);
  const { token } = useContext(userContext);
  const [indexBI, setIndexBI] = useState(1);
  const [pendings, setPendings] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [idOfUser, setIdOfUser] = useState(null);
  const [emailOrNameField, setEmailOrNameField] = useState(null);
  const [role, setRole] = useState(null);
  const forms = ["Owner", "Manager", "Expert", "Worker"];

  const validationSchema = object({
    recipient: string().required("Recipient is required"),
    roleName: string().required("RoleName is required"),
  });

  async function getInvitations() {
    console.log(children.farmId);

    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmId}/Invitations/pending`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log("getUsers");
      console.log(data);
      setTeamMembers(data);
      setPendings(data);
      // children.setTeamMemberList(data);
    } catch (error) {
      toast.error("Incorrect email or password " + error);
      console.log(error);
    } finally {
      toast.dismiss("Incorrect");
    }
  }

  async function getMembers() {
    console.log(children.farmId);

    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmId}/members`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log(data);
      setTeamMembers(data);
      children.setTeamMemberList(data);
    } catch (error) {
      toast.error("Incorrect email or password " + error);
      console.log(error);
    } finally {
      toast.dismiss("Incorrect");
    }
  }

  useEffect(() => {
    getInvitations();
    getMembers();
    console.log("Team farm data", children.farmData);
  }, []);

  async function deleteInvitations(farmId, invitationId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Invitations/${invitationId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);

      console.log("UP : ");
      console.log(data);
      getInvitations();
    } catch (error) {
      toast.error("Incorrect email or password " + error);
    } finally {
      toast.dismiss("Incorrect");
      getInvitations();
    }
  }

  async function deleteMember(farmId, memberId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/members/${memberId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);

      console.log("member deleted");
      console.log(data);
      getInvitations();
    } catch (error) {
      toast.error("Incorrect email or password " + error);
    } finally {
      toast.dismiss("Incorrect");
      getInvitations();
    }
  }

  async function updateMemberRole(value) {
    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmId}/members/${idOfUser}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: value,
      };
      await axios(options);
      getInvitations();
    } catch (error) {
      toast.error("Incorrect email or password " + error);
    } finally {
      toast.dismiss("Incorrect");
    }
  }

  function AddInvitations(values) {
    // children.teamMemberList.push({
    //   recipient: values.recipient,
    //   roleName: values.roleName,
    // });
    // children.setFarmData((prev) => ({
    //   ...prev,
    //   invitations: [...pendings],
    // }));
    // console.log(children.farmData);

    // children.setFarmData.push((prev) => ({
    //   ...prev,
    //   invitations: [...pendings],
    // }));
    setPendings((prev) => [...prev, values]);

    console.log("here", children.farmData);
  }

  const onSubmit = async (values) => {
    if (teamMembers.includes(values)) {
      console.log("update member");

      await updateMemberRole(values);
    } else if (!pendings.includes(values) && !teamMembers.includes(values)) {
      console.log("add new");

      AddInvitations(values);
    }
  };

  const formik = useFormik({
    initialValues: {
      recipient: "",
      roleName: "",
    },
    validationSchema,
    onSubmit: onSubmit,
  });
  {
    formik.values.roleName = forms[indexBI];
  }

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%] px-2"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
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
        className="w-[600px] min-h-[700px] border-2 rounded-2xl bg-white flex flex-col items-center"
      >
        <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
            onClick={() => {
              children.setEdit(null);
            }}
          ></i>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 mb-[12px]">
          <div className="capitalize mb-5 text-[20px] font-semibold text-mainColor">
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
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full ">
                <p className="">2</p>
              </div>
              <p className="mt-2   ">Team</p>
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
        <div className="w-[85%] mt-4 flex-grow  flex flex-col justify-between   text-[18px] h-[90%]">
          <div className=" flex flex-col justify-between ">
            <form
              className="flex items-end space-x-3  "
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label htmlFor="email" className="ms-1 ">
                  Email or Username
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder={emailOrNameField}
                  name="recipient"
                  value={formik.values.recipient}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="py-2.5 px-2 border border-[#0d121c21] mt-2 text-[16px] w-[100%] rounded-xl"
                  // disabled
                />
              </div>
              <div>
                <label htmlFor="" className="ms-1 ">
                  Role
                </label>
                <MenuElement
                  Items={forms}
                  name={role}
                  width={140 + "px"}
                  Pformat={
                    "text-[16px] font-[400]  select-none  text-[#9F9F9F]"
                  }
                  className={
                    "rounded-xl border-[1px] mt-2 px-2 py-2.5 border-[#0d121c21]"
                  }
                  onList={onListItem}
                  setOnList={setOnListItem}
                  nameChange={forms[indexBI]}
                  setIndex={setIndexBI}
                />
              </div>

              <button
                type="submit"
                className="rounded-xl mt-8 h-fit py-2.5 px-6 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium"
              >
                Add
              </button>
            </form>
          </div>
          <div className=" flex-grow  overflow-hidden  ">
            <p className="text-[20px] text-[#0b0b0bd8] font-semibold pt-2">
              Team Members
            </p>
            <div className="h-[90%] overflow-y-auto">
              {teamMembers.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg cursor-pointer  "
                    onClick={() => {
                      setIdOfUser(item.id);
                      setEmailOrNameField(
                        item.receiverUserName != "User not registered"
                          ? item.receiverUserName
                          : item.receiverEmail
                      );
                      setRole(forms[item.roleName]);
                      console.log("role : " + role);
                    }}
                  >
                    <p className="capitalize">
                      {item.recipient || item.email}
                      {/* {item.receiverUserName != "User not registered"
                        ? item.receiverUserName
                        : item.receiverEmail} */}
                    </p>
                    <div className="flex items-baseline space-x-4">
                      <p className=" capitalize ">{item.roleName}</p>
                      <i
                        className="fa-solid fa-x text-[16px] hover:text-red-700  transition-all duration-300"
                        onClick={() => {
                          deleteMember(item.farmId, item.id);
                        }}
                      ></i>
                      {/* <p className="capitalize">
                                        {item.receiverUserName!="User not registered"?item.receiverUserName:item.receiverEmail}
                                        </p>
                                    <div className="flex items-baseline space-x-4">
                                        <p className=" capitalize ">{item.roleName}</p>
                                        <i className="fa-solid fa-x text-[16px] hover:text-red-700  transition-all duration-300" onClick={()=>{
                                            deleteInvitations(item.farmId,item.id)
                                        }}></i>
                                    </div> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className=" flex-grow  overflow-hidden  ">
            <p className="text-[20px] text-[#0b0b0bd8] font-semibold pt-2">
              Pending Members
            </p>
            <div className="h-[90%] overflow-y-auto">
              {pendings.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg cursor-pointer  "
                    onClick={() => {
                      setIdOfUser(item.id);
                      setEmailOrNameField(
                        item.receiverUserName != "User not registered"
                          ? item.receiverUserName
                          : item.receiverEmail
                      );
                      setRole(forms[item.roleName]);
                      console.log("role : " + role);
                    }}
                  >
                    <p className="capitalize">
                      {item.recipient}
                      {/* {item.receiverUserName != "User not registered"
                        ? item.receiverUserName
                        : item.receiverEmail} */}
                    </p>
                    <div className="flex items-baseline space-x-4">
                      <p className=" capitalize ">{item.roleName}</p>
                      <i
                        className="fa-solid fa-x text-[16px] hover:text-red-700  transition-all duration-300"
                        onClick={() => {
                          deleteInvitations(item.farmId, item.id);
                        }}
                      ></i>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-3 items-center mb-2">
            <div
              onClick={() => {
                children.setEdit("BasicInfo");
              }}
              className="p-3 bg-gray-300  hover:text-mainColor rounded-xl transition-all duration-300  cursor-pointer"
            >
              <i className="fa-solid fa-angle-left text-[22px]"></i>
            </div>
            <button
              className="w-full rounded-xl py-2.5 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "
              onClick={() => {
                children.teamMemberList.push([...pendings]);
                children.setEdit("Review");
              }}
            >
              Next <i className="fa-solid fa-angle-right ms-3"></i>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default EditTeam;
