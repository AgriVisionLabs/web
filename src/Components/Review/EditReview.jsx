/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export const EditReview = (children) => {
  let { outClick, baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);

  let soilTypes = ["Sandy", "Clay", "Loamy"];

  console.log(children.teamMemberList[1]);
  async function updateFarm() {
    try {
      const options = {
        url: `${baseUrl}/Farms/${children.farmId}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: children.farmData.name,
          area: children.farmData.area,
          location: children.farmData.location,
          soilType: children.farmData.soilType,
        },
      };
      console.log("Sending farmData", {
        name: children.farmData.name,
        area: children.farmData.area,
        location: children.farmData.location,
        soilType: children.farmData.soilType,
      });

      let { data } = await axios(options);
      console.log("created", data);
      toast.success("Farm updated");

      if (data) {
        console.log("res createFarm ", data.farmId);

        sendInvitation(data.farmId);
      }
    } catch (error) {
      console.log("error createFarm", error);
    }
  }

  function sendInvitation(farmId) {
    console.log("sendInvitation farmId ", farmId);
    children.farmData.invitations.map(async (item) => {
      await sendInvitationToUser(item.recipient, item.roleName, farmId);
    });
  }
  async function sendInvitationToUser(recipient, roleName, farmId) {
    console.log({ farmId });

    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Invitations`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          recipient: recipient,
          roleName: roleName,
        },
      };
      let { data } = await axios(options);
      //   display();
      // console.log("data roleName",roleName)
      console.log("data sendInvitationsToUser", data);
    } catch (error) {
      // toast.error("Incorrect email or password " + error);
      // console.log("data farmId",farmId)
      // console.log("data recipient",recipient)
      // console.log("data roleName",roleName)
      console.log("error sendInvitationsToUser", error);
    } finally {
      // toast.dismiss("Incorrect");
      console.log("----------------------------------------------/n");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    // console.log({ FormData });

    await updateFarm();
    children.setEdit(null);
    children.display();
  }

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
        }
      }}
    >
      <motion.div
        initial={{ x: 0, y: 500, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 2,
          type: "spring",
          bounce: 0.4,
        }}
        className="w-[600px] h-[680px] border-2 rounded-2xl bg-white flex  flex-col items-center"
      >
        <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
            onClick={() => {
              children.setEdit(null);
            }}
          ></i>
        </div>
        <div className="flex flex-col justify-center items-center mt-8 mb-5">
          <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">
            add new farm
          </div>

          <div className="w-[100%] rounded-xl flex gap-4  items-center">
            <div className="flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
                <p className="">1</p>
              </div>
              <p className="mt-2">Basic Info</p>
            </div>

            <div className="w-[30px] -ml-2 lg:ml-0 lg:w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>

            <div className=" flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
                <p className="">2</p>
              </div>
              <p className="mt-2">Team</p>
            </div>

            <div className="w-[30px] -ml-1 lg:ml-0 lg:w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>

            <div className=" flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
                <p className="">3</p>
              </div>
              <p className="mt-2">Review</p>
            </div>
          </div>
        </div>
        <form className="w-[85%] my-3 flex-grow  flex flex-col justify-between  text-[18px]">
          <div className="flex flex-col  ">
            <p className="text-[20px] font-semibold capitalize text-[#0b0b0bd8] mb-2 ">
              farm Details{" "}
            </p>
            <div className="  grid grid-cols-2 mx-3 ">
              <div className="mb-2 font-medium">
                <p className=" capitalize text-mainColor mb-2 text-[19px]">
                  farm name
                </p>
                <p className="text-[17px]">{children.farmData.name}</p>
              </div>
              <div className="mb-2 font-medium">
                <p className=" capitalize text-mainColor mb-2 text-[19px]">
                  farm size
                </p>
                <p className="text-[17px]">{children.farmData.area} acres</p>
              </div>
              <div className="mb-2 font-medium">
                <p className=" capitalize text-mainColor mb-2 text-[19px]">
                  location
                </p>
                <p className="text-[17px]">{children.farmData.location}</p>
              </div>
              <div className="mb-2 font-medium">
                <p className=" capitalize text-mainColor mb-2 text-[19px]">
                  soil type
                </p>
                <p className="text-[17px]">
                  {soilTypes[children.farmData.soilType]}
                </p>
              </div>
            </div>
          </div>
          <div className=" flex-grow  ">
            <p className="text-[20px] text-[#0b0b0bd8] font-semibold my-3">
              Team Members
            </p>

            <div className="h-[90%] overflow-y-auto">
              {/* {Array.isArray(children.farmData?.invitations) &&
                children.farmData.invitations.length > 0 &&
                children.farmData.invitations.map((item, index) => {
                  return item.recipient ? (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg"
                    >
                      <p className="capitalize">{item.recipient}</p>
                      <div className="flex items-baseline space-x-4">
                        <p className=" capitalize ">{item.roleName}</p>
                      </div>
                    </div>
                  ) : null;
                })} */}
              {children.teamMemberList.length > 0 &&
                children.teamMemberList[1].map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg"
                    >
                      <p className="capitalize">
                        {item.recipient || item.email}
                      </p>
                      <div className="flex items-baseline space-x-4">
                        <p className=" capitalize ">{item.roleName}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* <div className="flex justify-between items-center">
            <i
              className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px] "
              onClick={() => {
                setReview(false);
                setTeam(true);
              }}
            ></i>
            <button
              type="button"
              className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "
              onClick={() => {
                createFarm();
              }}
            >
              Create Farm
            </button>
          </div> */}
          <div className="mt-2 flex space-x-3 items-center">
            <div className="p-3 bg-gray-300 hover:text-mainColor rounded-xl transition-all duration-300  cursor-pointer">
              <i
                className="fa-solid fa-angle-left text-[22px]"
                onClick={() => {
                  children.setEdit("Team");
                }}
              ></i>
            </div>
            <button
              className="w-full self-end rounded-xl py-3 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "
              onClick={onSubmit}
            >
              Next <i className="fa-solid fa-angle-right ms-3"></i>
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};
