import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import MenuElement from "../MenuElement/MenuElement";
import { object, string } from "yup";
import axios from "axios";
import { userContext } from "../../Context/User.context";
import { useFormik } from "formik";
import { motion } from "framer-motion";
const Team = (children) => {
  const {
    outClick,
    setTeam,
    setReview,
    setBasicInfo,
    onListItem,
    setOnListItem,
    baseUrl,
  } = useContext(AllContext);
  const { token } = useContext(userContext);

  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [indexBI, setIndexBI] = useState(0);

  // Fetch pending invitations from the backend so we always display the authoritative list
  const fetchPendingInvitations = async () => {
    if (!token || !children.farmData?.farmId) return;
    try {
      const resp = await axios({
        url: `${baseUrl}/farms/${children.farmData.farmId}/invitations/pending`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.status >= 200 && resp.status < 300) {
        // Update list in parent state so other steps have access as well
        children.setTeamMemberList(resp.data || []);
      }
    } catch (err) {
      console.error("Error fetching pending invitations", err);
    }
  };

  // Call once on mount & whenever the current farm changes
  useEffect(() => {
    fetchPendingInvitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.farmData?.farmId]);

  const forms = ["Manager", "Expert", "Worker"];
  const validationSchema = object({
    recipient: string()
      .required("Recipient is required.")
      .min(3, "Recipient must be at least 3 characters.")
      .max(150, "Recipient must not exceed 150 characters.")
      .test(
        "email-format",
        "Invalid email format.",
        (value) => {
          if (!value) return true; // handled by required
          if (value.includes("@")) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }
          return true;
        }
      ),
    roleName: string().required("Role is required."),
  });

  async function AddInvitations(values, { resetForm }) {
    setServerError("");

    if (!token) {
      setServerError("You must be logged in to invite members.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios({
        url: `${baseUrl}/farms/${children.farmData.farmId}/Invitations`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: {
          recipient: values.recipient,
          roleName: values.roleName,
        },
      });

      // Treat any 2xx response as a success so the UI updates immediately (some APIs return 204 No-Content)
      if (response.status >= 200 && response.status < 300) {
        // Refresh pending invitations list so UI shows the newly added member with its generated id
        await fetchPendingInvitations();

        // Preserve simple invitation object for later review step
        const newInvite = {
          recipient: values.recipient,
          roleName: values.roleName,
        };
        children.setFarmData((prev) => ({
          ...prev,
          invitations: prev.invitations ? [...prev.invitations, newInvite] : [newInvite],
        }));

        resetForm();
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data || {};
        let friendly = "Failed to send invitation.";
        let code = "";
        if (data.errors && data.errors.length > 0) {
          friendly = data.errors[0].description || friendly;
          code = data.errors[0].code || "";
        }
        // map codes to friendlier messages
        const map = {
          "FarmUserRole.UserAlreadyHasAccess": "User already has access to this farm.",
          "FarmInvitation.InvitationAlreadyExists": "An invitation has already been sent to this user.",
          "FarmInvitation.SelfInvitation": "You cannot invite yourself.",
          "FarmUserRole.InsufficientPermissions": "You do not have permission to add members.",
          "User.UserNotFound": "User not found.",
          "FarmRole.RoleNotFound": "Selected role is not valid.",
        };
        if (code && map[code]) friendly = map[code];
        setServerError(friendly);
      } else if (error.request) {
        setServerError("Network error. Please try again.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log("children.farmData", children.farmData);
    console.log("ِafter");
    console.log("farmData updated ===>", children.farmData);
  }, [children.farmData]);
  const formik = useFormik({
    initialValues: {
      recipient: "",
      roleName: "",
    },
    validationSchema,
    onSubmit: AddInvitations,
  });

  useEffect(() => {
    formik.values.roleName = forms[indexBI];
  }, [indexBI]);
  function displayInvitations() {
    // Sync farmData but no-op; kept for backward compatibility
    children.setFarmData((prev) => ({ ...prev }));
  }

  useEffect(() => {
    displayInvitations();
  }, [children.farmData]);

  const popupHeightClass = serverError ? "h-[720px]" : "h-[680px]";

  // Delete invitation handler
  const deleteInvitation = async (invId) => {
    if (!token || !children.farmData?.farmId) return;
    try {
      await axios({
        url: `${baseUrl}/farms/${children.farmData.farmId}/invitations/${invId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh list after deletion
      await fetchPendingInvitations();
    } catch (err) {
      console.error("Error deleting invitation", err);
    }
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
        className={`w-[600px] ${popupHeightClass} border-2 rounded-2xl bg-white flex flex-col items-center`}
      >
        <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
            onClick={() => {
              setTeam(false);
            }}
          ></i>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 mb-[12px]">
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
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
                <p className="">3</p>
              </div>
              <p className="mt-2">Review</p>
            </div>
          </div>
        </div>
        <div className="w-[85%] py-4 flex-grow flex flex-col justify-between text-[18px] overflow-y-auto">
          <div className="flex flex-col justify-between">
            {serverError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md w-full text-center">
                <p className="text-red-600 text-sm font-medium">{serverError}</p>
              </div>
            )}
            <form
              className="flex items-center justify-center space-x-3"
              onSubmit={formik.handleSubmit}
              autoComplete="off"
            >
              <div>
                <div className="flex items-center gap-2">
                  <label>Email or Username</label>
                  <div className="relative group">
                    <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                    <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Input must be:<br/>
                      &bull; Username with at least 3 characters<br/>
                      &bull; or a valid email address
                      <div className="absolute bottom-full left-3 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Enter Email or Username"
                  name="recipient"
                  value={formik.values.recipient}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                  className={`py-2.5 px-2 border mt-2 text-[16px] w-[100%] rounded-xl ${
                    formik.touched.recipient && formik.errors.recipient
                      ? "border-red-500 text-red-500 placeholder-red-400"
                      : "border-[#0d121c21]"
                  }`}
                />
                {/* Suppress inline recipient errors; handled via tooltip & banner */}
                {/* formControl */}
              </div>
              <div>
                <label>Role</label>
                <MenuElement
                  Items={forms}
                  name={"manager"}
                  width={140 + "px"}
                  Pformat={"text-[16px] font-[400]  select-none  text-[#000] "}
                  className={
                    "rounded-xl border-[1px] mt-2 px-2 py-2.5 border-[#0d121c21]"
                  }
                  onList={onListItem}
                  setOnList={setOnListItem}
                  nameChange={forms[indexBI]}
                  setIndex={setIndexBI}
                  index={indexBI}
                />
                {formik.touched.roleName && formik.errors.roleName && (
                  <i className="text-red-600 text-sm mt-1">
                    {formik.errors.roleName}
                  </i>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl mt-8 h-fit py-2.5 px-6 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
            </form>
          </div>

          <div className="flex-grow pt-4 overflow-y-auto">
            <p className="text-[20px] text-[#0b0b0bd8] font-semibold ">
              Pending Invites
            </p>
            <div className="max-h-[300px] overflow-y-auto">
              {(children.teamMemberList || []).map((item) => (
                      <div
                  key={item.id || item.recipient}
                  className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg"
                      >
                  <p className="">
                    {item.receiverEmail || item.recipient || ""}
                  </p>
                        <div className="flex items-baseline space-x-4">
                    <p className="capitalize ">{item.roleName}</p>
                    {item.id && (
                          <i
                        className="fa-solid fa-x text-[16px] hover:text-red-700 transition-all duration-300 cursor-pointer"
                        onClick={() => deleteInvitation(item.id)}
                          ></i>
                    )}
                        </div>
                      </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end items-center">
            <button
              className="rounded-xl py-3 px-6 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium"
              onClick={() => {
                setTeam(false);
                setReview(true);
              }}
            >
              {children.farmData?.invitations &&
              children.farmData.invitations.filter(inv => inv.recipient && inv.recipient.trim() !== "").length === 0
                ? "Skip"
                : "Next"}
              <i className="fa-solid fa-angle-right ms-3"></i>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Team;
