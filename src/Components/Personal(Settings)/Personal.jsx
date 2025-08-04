import { Check, Edit, User2, X } from "lucide-react";
import imageIcon from "../../assets/images/image 6.png";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

const Personal = () => {
  const { baseUrl } = useContext(AllContext);
  const { token, profileData, updateProfileData, fetchProfileData } = useContext(userContext);
  const [firstName, setFirstName] = useState({ state: 0, value: "" });
  const [lastName, setLastName] = useState({ state: 0, value: "" });
  const [username, setUsername] = useState({ state: 0, value: "" });
  const [phoneNumber, setPhoneNumber] = useState({ state: 0, value: "" });
  const [img, setImg] = useState(null);

  function cancelChange() {
    setFirstName({ state: 0, value: "" });
    setLastName({ state: 0, value: "" });
    setUsername({ state: 0, value: "" });
    setPhoneNumber({ state: 0, value: "" });
  }

  async function updateAccountData(values) {
    try {
      const response = await axios.put(`${baseUrl}/Accounts`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cancelChange();
      // Update the profile data in context
      updateProfileData(response.data);
    } catch (err) {
      console.error("Error updating account data:", err);
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select only PNG or JPG files.');
        return;
      }
      
      console.log("Selected file:", file);
      try {
        const formData = new FormData();
        formData.append('Image', file);
        
        const response = await axios.put(`${baseUrl}/accounts/update-profile-image`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        
        // Update the profile data in context with the new image
        if (response.data) {
          updateProfileData(response.data);
        }
        
        // Refresh the profile data to get the updated image
        await fetchProfileData();
        
        // Update local image state with the new image URL
        if (response.data?.pfpImageUrl) {
          setImg(response.data.pfpImageUrl);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Update local image state when profile data changes
  useEffect(() => {
    if (profileData?.pfpImageUrl) {
      setImg(profileData.pfpImageUrl);
    }
  }, [profileData]);

  const schemas = {
    firstName: Yup.object({
      firstName: Yup.string()
        .required("First name is required")
        .min(3, "First Name must be at least 3 characters"),
    }),
    lastName: Yup.object({
      lastName: Yup.string()
        .required("Last name is required")
        .min(3, "Last Name must be at least 3 characters"),
    }),
    username: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "User Name must be at least 3 characters"),
    }),
    phoneNumber: Yup.object({
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .matches(
          /^(2)01[0125][0-9]{8}$/,
          "Sorry, we Accept Egyption Phone Numbers Only"
        ),
    }),
  };

  return profileData ? (
    <section className="mb-[20px]">
      <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px] p-[16px]">
        <div className="flex space-x-2 items-center text-[#0D121C] mb-[8px]">
          <h2 className="text-[17px] font-medium">Personal Information</h2>
        </div>
        <p className="text-[#9F9F9F] text-[14px] font-medium">
          Manage your personal details and contact information.
        </p>

        <div className="mt-[18px] pb-[16px] space-y-[16px]">
          <p className="text-[16px] font-medium">Profile Picture</p>
          <div className="text-[14px] font-medium flex items-center space-x-4">
            {img ? (
              <img 
                src={img} 
                alt="Profile" 
                className="w-[80px] h-[80px] rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <img src={imageIcon} alt="" className="w-[80px]" />
            )}
                          <div className="flex flex-col items-start space-y-[8px]">
                <div>
                                  <input
                  type="file"
                  id="profilePicUpload"
                  className="hidden"
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={handleFileChange}
                />
                  <button
                    type="button"
                    className="text-[#616161]"
                    onClick={() =>
                      document.getElementById("profilePicUpload").click()
                    }
                  >
                    Upload new picture
                  </button>
                </div>
              </div>
          </div>
        </div>

        {[
          {
            label: "First Name",
            state: firstName,
            setState: setFirstName,
            key: "firstName",
            schema: schemas.firstName,
            value: profileData.firstName,
          },
          {
            label: "Last Name",
            state: lastName,
            setState: setLastName,
            key: "lastName",
            schema: schemas.lastName,
            value: profileData.lastName,
          },
          {
            label: "Username",
            state: username,
            setState: setUsername,
            key: "username",
            schema: schemas.username,
            value: profileData.userName,
          },
          {
            label: "Phone Number",
            state: phoneNumber,
            setState: setPhoneNumber,
            key: "phoneNumber",
            schema: schemas.phoneNumber,
            value: profileData.phoneNumber,
          },
        ].map(({ label, state, setState, key, schema, value }) => (
          <div
            className="border-t-[1px] border-[#0d121c3c] py-[12px]"
            key={key}
          >
            <div className="flex justify-between items-center">
              <h3 className="mb-[8px] text-[15px] font-semibold">{label}</h3>
              {!state.state ? (
                <div
                  className="flex items-center space-x-1 hover:text-mainColor cursor-pointer"
                  onClick={() => setState({ ...state, state: 1 })}
                >
                  <Edit strokeWidth={1.4} size={16} />
                  <p className="text-[13px] font-medium">Edit</p>
                </div>
              ) : null}
            </div>
            {state.state ? (
              <Formik
                initialValues={{ [key]: "" }}
                validationSchema={schema}
                onSubmit={(values) => {
                  updateAccountData({
                    ...profileData,
                    [key]: values[key],
                  });
                }}
              >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                  <div className="relative">
                    <input
                      type="text"
                      name={key}
                      value={values[key]}
                      onChange={handleChange}
                      placeholder={value}
                      className="w-full py-[6px] px-[12px] rounded-[8px] border-[2px] border-[#9F9F9F] placeholder:text-[13px]"
                    />
                    {key === "phoneNumber" && (
                      <div className="absolute right-3 top-3 group">
                        <svg
                          className="w-4 h-4 text-gray-400 cursor-help"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                          <div className="font-medium text-blue-200 mb-1">
                            Phone Format:
                          </div>
                          <div>• Egyptian phone number format</div>
                          <div>• Start with 201 (e.g., 201012345678)</div>
                          <div>• 12 digits total</div>
                        </div>
                      </div>
                    )}
                    {errors[key] && touched[key] && (
                      <p className="text-red-500 text-[13px] mt-1">
                        {errors[key]}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 mt-2">
                      <div
                        className="flex items-center space-x-1 hover:text-mainColor cursor-pointer"
                        onClick={handleSubmit}
                      >
                        <Check strokeWidth={1.8} size={16} />
                        <p className="text-[13px] font-medium">Save</p>
                      </div>
                      <div
                        className="flex items-center space-x-1 hover:text-red-500 cursor-pointer"
                        onClick={() => setState({ value: "", state: 0 })}
                      >
                        <X strokeWidth={1.8} size={16} />
                        <p className="text-[13px] font-medium">Cancel</p>
                      </div>
                    </div>
                  </div>
                )}
              </Formik>
            ) : (
              <p className="text-[13px] font-medium">{value}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  ) : null;
};

export default Personal;
