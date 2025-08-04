/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllContext } from "../../Context/All.context";

import {
  MapPin,
  Sprout,
  Ruler,
  Users,
  SquarePen,
  SquareKanban,
  Trash2,
  ChevronLeft,
  TriangleAlert,
} from "lucide-react";
import AddNewField from "../../Components/AddNewField/AddNewField";
import Irrigation from "../../Components/Irrigation/Irrigation";
import Sensors from "../../Components/Sensors/Sensors";
import ReviewField from "../../Components/ReviewField/ReviewField";
import EditFarm from "../../Components/EditFarm/EditFarm";
import MenuElement from "../../Components/MenuElement/MenuElement";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import { motion } from "framer-motion";
import { Line } from "rc-progress";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { object, string } from "yup";
import FieldOverview from "../../Components/FieldOverview/FieldOverview";

const Fields = ({ farmId }) => {
  const { SetOpenFarmsOrFieled, addField, setAddField, baseUrl } =
    useContext(AllContext);
  const { token, userId } = useContext(userContext);
  const navigate = useNavigate();
  const [farmData, setFarmData] = useState(null);
  const [fieldsData, setFieldsData] = useState([]);
  const [membersData, setMembersData] = useState(null);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [cropType, setCropType] = useState(null);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [showEditFarm, setShowEditFarm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [teamTab, setTeamTab] = useState("members"); // 'members' or 'invitations'
  // const [inviteEmail, setInviteEmail] = useState("");
  // const [inviteRole, setInviteRole] = useState("worker");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteIndex, setInviteIndex] = useState(0);
  const [onInviteList, setOnInviteList] = useState(false);
  const [inviteServerError, setInviteServerError] = useState("");
  const [showField, setShowField] = useState(false);
  const [fieldId, setFieldId] = useState("");
  const members = useRef();

  const types = ["Sandy", "Clay", "Loamy"];
  const roleOptions = ["Worker", "Expert", "Manager"];

  const inviteValidationSchema = object({
    recipient: string()
      .required("Email is required")
      .email("Invalid email format")
      .min(3, "Email must be at least 3 characters")
      .max(150, "Email must not exceed 150 characters"),
    roleName: string().required("Role is required"),
  });

  const [FieldData, setFieldData] = useState({
    FieldName: "",
    FieldSize: "",
    CropType: "",
    IrrigationUnit: [],
    SensorUnit: [],
  });
  const [createdFieldId, setCreatedFieldId] = useState(null);

  // function toggleMember() {
  //   [
  //     "border-[1px]",
  //     "px-[10px]",
  //     "py-[15px]",
  //     "border-[rgba(13,18,28,0.25)]",
  //     "w-[300px]",
  //     "min-h-[120px]",
  //   ].forEach((cls) => members.current.classList.toggle(cls));
  // }

  useEffect(() => {
    SetOpenFarmsOrFieled(2);
  }, []);

  async function getFarm() {
    if (!token && !farmId) return;

    try {
      const options = {
        url: `${baseUrl}/Farms/${farmId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFarmData(data);
      getFields();
    } catch (error) {
      console.error("Error fetching farm:", error);
    }
  }

  async function getFields() {
    if (!token && !farmId) return;

    setIsLoadingFields(true);
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFieldsData(data || []);
    } catch (error) {
      console.error("Error fetching fields:", error);
      setFieldsData([]);
    } finally {
      setIsLoadingFields(false);
    }
  }

  async function getmembers() {
    if (!token && !farmId) return;

    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/members`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setMembersData(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }

  async function getPendingInvites() {
    if (!token && !farmId) return;

    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/invitations/pending`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setPendingInvites(data || []);
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
      setPendingInvites([]);
    }
  }

  // Initialize formik for invitations
  const inviteFormik = useFormik({
    initialValues: {
      recipient: "",
      roleName: "Worker",
    },
    validationSchema: inviteValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setInviteServerError("");
      setIsInviting(true);

      try {
        const response = await axios({
          url: `${baseUrl}/farms/${farmId}/Invitations`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            recipient: values.recipient,
            roleName: values.roleName,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          toast.success("Invitation sent successfully!");
          resetForm();
          setInviteIndex(0);
          // Clear any previous server errors
          setInviteServerError("");
          // Refresh pending invites to show the new invitation
          await getPendingInvites();
        }
      } catch (error) {
        console.error("Error inviting member:", error);
        if (error.response) {
          const data = error.response.data || {};
          let friendly = "Failed to send invitation.";
          let code = "";

          if (data.errors && data.errors.length > 0) {
            friendly = data.errors[0].description || friendly;
            code = data.errors[0].code || "";
          }

          // Map error codes to friendlier messages
          const errorMap = {
            "FarmUserRole.UserAlreadyHasAccess":
              "User already has access to this farm.",
            "FarmInvitation.InvitationAlreadyExists":
              "An invitation has already been sent to this user.",
            "FarmInvitation.SelfInvitation": "You cannot invite yourself.",
            "FarmUserRole.InsufficientPermissions":
              "You do not have permission to add members.",
            "User.UserNotFound": "User not found.",
            "FarmRole.RoleNotFound": "Selected role is not valid.",
          };

          if (code && errorMap[code]) {
            friendly = errorMap[code];
          }

          setInviteServerError(friendly);
        } else if (error.request) {
          setInviteServerError("Network error. Please try again.");
        } else {
          setInviteServerError("An unexpected error occurred.");
        }
      } finally {
        setIsInviting(false);
      }
    },
  });

  // Update formik role value when index changes
  inviteFormik.values.roleName = roleOptions[inviteIndex];

  // Delete invitation function
  const deleteInvitation = async (invitationId) => {
    if (!token || !invitationId) return;

    try {
      const response = await axios({
        url: `${baseUrl}/farms/${farmId}/invitations/${invitationId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Invitation deleted successfully");
        // Refresh pending invites list
        getPendingInvites();
      }
    } catch (error) {
      console.error("Error deleting invitation:", error);
      toast.error("Failed to delete invitation");
    }
  };

  // Delete member function with role-based permissions
  const deleteMember = async (memberId, memberRole) => {
    if (!token || !memberId) return;

    const currentUserRole = farmData.roleName?.toLowerCase();
    const targetRole = memberRole?.toLowerCase();

    // Role-based permission checks
    if (currentUserRole === "manager") {
      // Manager can't delete owner or other managers
      if (targetRole === "owner" || targetRole === "manager") {
        toast.error("You don't have permission to remove this member");
        return;
      }
    }

    try {
      const response = await axios({
        url: `${baseUrl}/farms/${farmId}/members/${memberId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Member removed successfully");
        // Refresh team data
        refreshTeamData();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  // Helper function to refresh team data
  const refreshTeamData = () => {
    getmembers();
    if (["owner", "manager"].includes(farmData.roleName?.toLowerCase())) {
      getPendingInvites();
    }
  };

  async function deleteFarm() {
    if (!token && !farmId) return;

    try {
      const options = {
        url: `${baseUrl}/Farms/${farmId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      toast.success("Farm deleted successfully!");
      SetOpenFarmsOrFieled(1); // Navigate back to farms list
    } catch (error) {
      console.error("Error deleting farm:", error);
      toast.error(error.response?.data?.message || "Failed to delete farm");
    }
  }

  useEffect(() => {
    if (farmId && token) {
      getFarm();
      getFields();
      // Note: Members and pending invites are now fetched only when team popup is opened
    } else {
      setIsLoadingFields(false);
    }
  }, [farmId, token]);

  return (
    <>
      {farmData ? (
        <div className="h-full order-7 overflow-hidden transition-all duration-500">
          <header className="flex justify-between items-center">
            <div className="flex space-x-[15px] items-center">
              <div className="text-[#585858] hover:text-[#070707] transition-all duration-150 cursor-pointer">
                <ChevronLeft
                  size={40}
                  onClick={() => {
                    SetOpenFarmsOrFieled(1);
                  }}
                />
              </div>
              <p className="text-[25px] md:text-[28px] font-medium text-mainColor">
                {farmData.name}
              </p>
            </div>
            <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3 h-min">
              <p className="font-[500] text-[12px] md:text-[14px]">
                {farmData.roleName}
              </p>
            </div>
          </header>
          <div className="grid gap-4 md:grid-cols-2 my-5">
            <div className="flex gap-9 text-[#616161] text-[14px] md:text-[14px] lg:text-[20px]">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <p className="">{farmData.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <Sprout size={20} />
                <p className="">{types[farmData.soilType]}</p>
              </div>
              <div className="flex items-center gap-2">
                <Ruler size={20} />
                <p className="">{farmData.area} acres</p>
              </div>
            </div>
            <div className="flex md:mt-5 md:ms-auto gap-5 relative">
              {/* Show Analytics icon for owners and experts only */}
              {["owner", "expert"].includes(
                farmData.roleName?.toLowerCase()
              ) && (
                <SquareKanban
                  className="transition-all duration-200 hover:text-[#e42ad2] cursor-pointer"
                  onClick={() => {
                    // Navigate to analytics page
                    navigate('/analytics');
                  }}
                  title="View Analytics & Reports"
                />
              )}

              {/* Show Users icon based on role permissions */}
              {["owner", "manager"].includes(
                farmData.roleName?.toLowerCase()
              ) ? (
                <Users
                  className="transition-all duration-200 hover:text-[#1f54b6] cursor-pointer"
                  onClick={() => {
                    // Fetch fresh data when opening the popup
                    refreshTeamData();
                    setShowTeamPopup(true);
                  }}
                />
              ) : farmData.roleName?.toLowerCase() === "worker" ||
                farmData.roleName?.toLowerCase() === "expert" ? (
                <Users
                  className="transition-all duration-200 text-gray-400 cursor-not-allowed"
                  title="Access denied: Insufficient permissions"
                />
              ) : null}

              {/* Only show edit and delete icons if user role is "owner" */}
              {farmData.roleName?.toLowerCase() === "owner" && (
                <>
                  <SquarePen
                    className="transition-all duration-200 hover:text-mainColor cursor-pointer"
                    onClick={() => setShowEditFarm(true)}
                  />
                  <Trash2
                    className="transition-all duration-200 hover:text-[#f02929] cursor-pointer"
                    onClick={() => setShowDeleteConfirm(true)}
                  />
                </>
              )}
              <div
                className="absolute right-[158px] top-[3px] space-y-[10px] rounded-b-[12px] rounded-l-[12px] overflow-hidden transition-all duration-700 ease-in-out w-0 h-0 bg-[#FFFFFF]"
                ref={members}
              >
                {membersData
                  ? membersData.map((member, index) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center rounded-[5px] py-[10px] px-[4px] hover:bg-[#dbdbdb9a] cursor-pointer"
                        >
                          <p className="font-[500] text-[16px] capitalize">
                            {member.userName}
                          </p>
                          <div className="px-3 border-[1px] rounded-2xl border-[#0d121c21] text-[15px] flex justify-center items-center">
                            {member.roleName}
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
          <div className="flex justify-between my-10 items-center">
            <p className="text-[20px] md:text-[25px] font-medium">Fields</p>
            {farmData?.roleName?.toLowerCase() === "owner" && (
              <button
                className="btn self-end py-4 w-auto px-2 md:px-4 bg-mainColor text-[13px] md:text-[15px] text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-medium z-30"
                onClick={() => {
                  setAddField(1);
                }}
              >
                <i className="fa-solid fa-plus pe-2"></i> Add Field{" "}
              </button>
            )}
          </div>

          {isLoadingFields ? (
            <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 mx-3 mt-20 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
              <p className="text-[#808080]">Loading fields...</p>
            </div>
          ) : fieldsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4 py-2">
              {fieldsData.map((field, index) => {
                const fieldProgress = field.progress ?? 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)] cursor-pointer"
                    onClick={() => {
                      setFieldId(field.id);
                      setShowField(true);
                      console.log({ field });
                    }}
                  >
                    <div className="shadow-md px-3 py-2 rounded-xl border-[1px] border-[#0d121c00] h-[135px]">
                      <div className="flex justify-between items-center">
                        <p className="text-mainColor font-[500] text-[19px] capitalize">
                          {field.name}
                        </p>
                        <div className="h-[30px] px-3 border-[1px] rounded-2xl border-[#0d121c21] text-[14px] font-medium flex justify-center items-center">
                          {field.isActive ? (
                            <span>Active</span>
                          ) : (
                            <span>Inactive</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-[600] text-[17px] my-2">
                          {field.cropName || "No Crop Planted"}
                        </p>
                        <Line
                          percent={fieldProgress}
                          strokeLinecap="round"
                          strokeColor="#1E6930"
                          className="h-[6.5px] text-mainColor w-full rounded-lg"
                        />
                        <p className="pt-2 pb-2 font-[400]">
                          Progress: {fieldProgress}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
              <TriangleAlert size={48} className="text-yellow-500 mb-2" />
              <p className="text-[#808080]">No Fields Available</p>
              <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
                No fields found in this farm. Try adding a new field to get
                started.
              </p>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
      {addField == 1 ? (
        <div className="fixed z-50 inset-0">
          <AddNewField
            setFieldData={setFieldData}
            setCropType={setCropType}
            farmId={farmId}
            getFields={getFields}
            userRole={farmData?.roleName?.toLowerCase()}
            setCreatedFieldId={setCreatedFieldId}
          />
        </div>
      ) : addField == 2 ? (
        <div className="fixed z-50 inset-0">
          <Irrigation 
            setFieldData={setFieldData} 
            FieldData={FieldData}
            farmId={farmId}
            fieldId={createdFieldId}
          />
        </div>
      ) : addField == 3 ? (
        <div className="fixed z-50 inset-0">
          <Sensors 
            setFieldData={setFieldData} 
            FieldData={FieldData}
            farmId={farmId}
            fieldId={createdFieldId}
          />
        </div>
      ) : addField == 4 ? (
        <div className="fixed z-50 inset-0">
          <ReviewField
            FieldData={FieldData}
            getFields={getFields}
            farmId={farmId}
            cropType={cropType}
          />
        </div>
      ) : (
        ""
      )}

      {/* Edit Farm Popup */}
      {showEditFarm && (
        <div className="fixed z-50 inset-0">
          <EditFarm
            farmId={farmId}
            setEdit={setShowEditFarm}
            display={() => {
              getFarm(); // Refresh farm data after update
            }}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-96 mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              Delete Farm
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this farm? This action cannot be
              undone and will remove all fields and data associated with this
              farm.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFarm();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Farm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Team Management Popup */}
      {showTeamPopup && (
        <section
          className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] fixed z-50 w-[100%] px-2 inset-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTeamPopup(false);
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
            className={`w-[600px] ${
              inviteServerError ? "h-[720px]" : "h-[680px]"
            } border-2 rounded-2xl bg-white flex flex-col items-center`}
          >
            <div className="w-[90%] mt-5 text-[22px] flex justify-end">
              <i
                className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 cursor-pointer"
                onClick={() => setShowTeamPopup(false)}
              ></i>
            </div>
            <div className="flex flex-col justify-center items-center mb-5">
              <div className="capitalize mb-5 text-[20px] font-semibold text-mainColor">
                Team Management
              </div>
            </div>

            {/* Tabs */}
            <div className="w-[85%] flex space-x-1 bg-gray-100 rounded-lg p-1 mb-5">
              <button
                onClick={() => setTeamTab("members")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  teamTab === "members"
                    ? "bg-white text-mainColor shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Members ({membersData?.length || 0})
              </button>
              {["owner", "manager"].includes(
                farmData.roleName?.toLowerCase()
              ) && (
                <button
                  onClick={() => setTeamTab("invitations")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    teamTab === "invitations"
                      ? "bg-white text-mainColor shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Invitations ({pendingInvites.length})
                </button>
              )}
            </div>

            {/* Content */}
            <div className="w-[85%] flex-grow flex flex-col overflow-hidden">
              {teamTab === "members" && (
                <div className="flex-grow overflow-y-auto">
                  <div className="space-y-3">
                    {membersData && membersData.length > 0 ? (
                      membersData.map((member, index) => {
                        const currentUserRole =
                          farmData.roleName?.toLowerCase();
                        const memberRole = member.roleName?.toLowerCase();
                        const isCurrentUser = member.memberId === userId;

                        // Determine if current user can delete this member
                        const canDelete = (() => {
                          // Users can't delete themselves
                          if (isCurrentUser) return false;

                          // Owner can delete anyone except themselves
                          if (currentUserRole === "owner") return true;

                          // Manager can only delete members they invited and cannot delete owners or other managers
                          if (currentUserRole === "manager") {
                            // Can't delete owners or other managers
                            if (
                              memberRole === "owner" ||
                              memberRole === "manager"
                            )
                              return false;
                            // Can only delete members they invited themselves
                            return member.invitedById === userId;
                          }

                          // Workers and experts can't delete anyone
                          return false;
                        })();

                        return (
                          <div
                            key={member.memberId || index}
                            className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-xl hover:bg-[#e9ecef] transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-[#212529] capitalize text-[16px]">
                                {member.userName}
                                {isCurrentUser && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-[#6c757d] mt-1">
                                {member.email}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="px-3 py-2 bg-white border border-[#0d121c21] rounded-xl text-sm font-medium text-mainColor capitalize">
                                {member.roleName}
                              </div>
                              {canDelete && (
                                <i
                                  className="fa-solid fa-x text-[16px] text-gray-400 hover:text-red-600 transition-all duration-300 cursor-pointer p-2"
                                  onClick={() =>
                                    deleteMember(
                                      member.memberId,
                                      member.roleName
                                    )
                                  }
                                  title="Remove member"
                                ></i>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-[#6c757d] text-[16px]">
                          No members found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {teamTab === "invitations" &&
                ["owner", "manager"].includes(
                  farmData.roleName?.toLowerCase()
                ) && (
                  <div className="flex-grow flex flex-col justify-between text-[18px]">
                    <div className="flex flex-col justify-between">
                      {/* Server Error Display */}
                      {inviteServerError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md w-full text-center">
                          <p className="text-red-600 text-sm font-medium">
                            {inviteServerError}
                          </p>
                        </div>
                      )}

                      {/* Invite Form */}
                      <form
                        className="flex items-center justify-center space-x-3"
                        onSubmit={inviteFormik.handleSubmit}
                        autoComplete="off"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <label>Email or Username</label>
                            <div className="relative group">
                              <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                              <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Input must be:
                                <br />
                                &bull; Username with at least 3 characters
                                <br />
                                &bull; or a valid email address
                                <div className="absolute bottom-full left-3 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                              </div>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter Email or Username"
                            name="recipient"
                            value={inviteFormik.values.recipient}
                            onChange={inviteFormik.handleChange}
                            onBlur={inviteFormik.handleBlur}
                            autoComplete="off"
                            className={`py-2.5 px-2 border mt-2 text-[16px] w-[100%] rounded-xl ${
                              inviteFormik.touched.recipient &&
                              inviteFormik.errors.recipient
                                ? "border-red-500 text-red-500 placeholder-red-400"
                                : "border-[#0d121c21]"
                            }`}
                          />
                        </div>
                        <div>
                          <label>Role</label>
                          <MenuElement
                            Items={
                              farmData.roleName?.toLowerCase() === "owner"
                                ? roleOptions
                                : roleOptions.slice(0, 2)
                            }
                            name={"manager"}
                            width={140 + "px"}
                            Pformat={
                              "text-[16px] font-[400]  select-none  text-[#000] "
                            }
                            className={
                              "rounded-xl border-[1px] mt-2 px-2 py-2.5 border-[#0d121c21]"
                            }
                            onList={onInviteList}
                            setOnList={setOnInviteList}
                            nameChange={roleOptions[inviteIndex]}
                            setIndex={setInviteIndex}
                            index={inviteIndex}
                          />
                          {inviteFormik.touched.roleName &&
                            inviteFormik.errors.roleName && (
                              <i className="text-red-600 text-sm mt-1">
                                {inviteFormik.errors.roleName}
                              </i>
                            )}
                        </div>
                        <button
                          type="submit"
                          disabled={isInviting}
                          className="rounded-xl mt-8 h-fit py-2.5 px-6 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium disabled:opacity-50"
                        >
                          {isInviting ? "Adding..." : "Add"}
                        </button>
                      </form>
                    </div>

                    <div className="flex-grow pt-4 overflow-y-auto">
                      <p className="text-[20px] text-[#0b0b0bd8] font-semibold ">
                        Pending Invites
                      </p>
                      <div className="max-h-[300px] overflow-y-auto">
                        {pendingInvites.map((item) => (
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
                  </div>
                )}
            </div>
          </motion.div>
        </section>
      )}

      {showField && fieldId && (
        <FieldOverview
          farmId={farmId}
          fieldId={fieldId}
          setShowField={setShowField}
          userRole={farmData?.roleName?.toLowerCase()}
        />
      )}
    </>
  );
};

export default Fields;
