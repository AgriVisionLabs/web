/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export const Review = (children) => {
  let { outClick, setReview, setTeam, baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);

  let soilTypes = ["Sandy", "Clay", "Loamy"];

  // `null` until fetched; once fetched can be [] (no invites) or the array of invites
  const [pendingInvites, setPendingInvites] = useState(null);

  // Fetch latest pending invitations so the review view is always up-to-date
  useEffect(() => {
    const fetchPending = async () => {
      if (!token || !children.farmData?.farmId) return;
      try {
        const { data, status } = await axios({
          url: `${baseUrl}/farms/${children.farmData.farmId}/invitations/pending`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (status >= 200 && status < 300) {
          setPendingInvites(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch pending invitations", err);
      }
    };

    fetchPending();
  }, [token, children.farmData?.farmId]);

  async function createFarm() {
    console.log(children.farmData);
    try {
      const options = {
        url: `${baseUrl}/farms`,
        method: "POST",
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
      toast.success("Farm Added");

      if (data) {
        console.log("res createFarm ", data.farmId);
        // setFarmId(data.farmId)

        sendInvitation(data.farmId);
      }
      setReview(false);
      // console.log("farmIdValue createFarm  ",farmId)
    } catch (error) {
      console.log("error createFarm", error);
      
      // Handle different types of errors
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 409) {
          // Handle 409 Conflict - Duplicate farm name
          if (data.errors && data.errors.length > 0) {
            const duplicateError = data.errors.find(err => err.code === "Farm.DuplicateName");
            if (duplicateError) {
              toast.error(duplicateError.description || "You already have a farm with this name.");
            } else {
              toast.error("Farm name already exists. Please choose a different name.");
            }
          } else {
            toast.error("Farm name already exists. Please choose a different name.");
          }
        } else if (status === 400) {
          // Handle validation errors
          if (data.errors && data.errors.length > 0) {
            // Show the first validation error
            toast.error(data.errors[0].description || "Please check your input and try again.");
          } else {
            toast.error("Please check your input and try again.");
          }
        } else {
          // Handle other HTTP errors
          toast.error(data.title || "Failed to create farm. Please try again.");
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection and try again.");
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
      }
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
      setReview(false);
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

  // Finalise review – just close the popup and let parent refresh
  const handleDone = () => {
    setReview(false);
    if (typeof children.display === "function") children.display();
  };

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
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-[600px] h-[680px] border-2 rounded-2xl bg-white flex  flex-col items-center"
      >
        <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
            onClick={() => {
              setReview(false);
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
          <div className=" flex-grow  h-[200px] ">
            <p className="text-[20px] text-[#0b0b0bd8] font-semibold my-3">
              Team Members
            </p>

            <div className="h-[70%] overflow-y-auto">
              {(() => {
                const source = pendingInvites !== null ? pendingInvites : children.farmData.invitations;
                const seen = new Set();
                const deduped = source.filter((inv) => {
                  const emailKey = (inv.receiverEmail || inv.recipient || "").toLowerCase();
                  if (!emailKey) return false;
                  if (seen.has(emailKey)) return false;
                  seen.add(emailKey);
                  return true;
                });
                if (deduped.length === 0) {
                  return (
                    <p key="no-invites" className="text-center text-gray-500 py-4">
                      No team members invited
                    </p>
                  );
                }
                return deduped.map((item, index) => {
                  const email = (item.receiverEmail || item.recipient || "").toLowerCase();
                  return (
                  <div
                      key={item.id || index}
                    className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg"
                  >
                      <p className="lowercase">{email}</p>
                    <div className="flex items-baseline space-x-4">
                      <p className=" capitalize ">{item.roleName}</p>
                    </div>
                  </div>
                  );
                });
              })()}
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
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="rounded-xl py-3 px-6 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium"
              onClick={handleDone}
            >
              Done
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};
