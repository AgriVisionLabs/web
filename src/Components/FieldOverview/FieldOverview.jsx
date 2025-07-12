/* eslint-disable react/prop-types */
import axios from "axios";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Edit,
  Sprout,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const FieldOverview = ({ farmId, fieldId, setShowField, userRole }) => {
  const { baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [field, setField] = useState(null);

  useEffect(() => {
    async function getField() {
      if (!token && !farmId) return;

      try {
        const options = {
          url: `${baseUrl}/farms/${farmId}/Fields/${fieldId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        let { data } = await axios(options);
        console.log(data);
        setField(data);
      } catch (error) {
        console.error("Error fetching farm:", error);
      }
    }
    getField();
  }, []);

  const handleDeleteField = async () => {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios(options);
      toast.success("Field deleted successfully!");
      setShowField(false); // Close the popup
      // Optionally refresh the parent component here
      window.location.reload(); // Simple refresh - you might want to use a callback prop instead
    } catch (error) {
      console.error("Error deleting field:", error);
      toast.error("Failed to delete field. Please try again.");
    }
  };

  const handleEditField = () => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality will be implemented soon!");
  };

  if (!field) {
    return (
      <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 mx-3 mt-20 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
        <p className="text-[#808080]">Loading field...</p>
      </div>
    );
  }

  const today = new Date();
  const harvestDate = new Date(field.expectedHarvestDate);
  const timeDiff = harvestDate.getTime() - today.getTime();
  const daysLeft = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0);

  return (
    <div className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] fixed z-50 w-[100%] px-2 inset-0">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-[800px] h-min border-2 rounded-2xl bg-white flex flex-col items-center py-4"
      >
        <header className="w-full flex items-center justify-between px-4 pb-4 border-b border-[#0D121C40]">
          <div className="flex items-end space-x-4">
            <ArrowLeft
              onClick={() => setShowField(false)}
              className="text-[#757575] cursor-pointer"
            />{" "}
            <span className="text-mainColor text-2xl font-medium">
              {field.name}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {userRole === "owner" && (
              <div className="flex items-center space-x-3">
                <Edit 
                  onClick={handleEditField}
                  className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" 
                  size={24}
                  title="Edit Field"
                />
                <Trash2 
                  onClick={handleDeleteField}
                  className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors" 
                  size={24}
                  title="Delete Field"
                />
              </div>
            )}
            <span className="rounded-xl border border-[#0D121C40] p-1.5">
              {field.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </header>
        <section className="p-4 grid grid-cols-3 gap-4">
          <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-5 col-span-1">
            <div className="flex items-center space-x-2 ">
              <AlertCircle className="text-mainColor" size={18} />
              <span className="font-semibold text-xl">Field Information</span>
            </div>
            <div>
              <span className="text-[#6A6C76] font-medium text-lg">Area</span>
              <span className="block font-semibold text-lg">{field.area}</span>
            </div>
            <div>
              <span className="text-[#6A6C76] font-medium text-lg">
                Crop Name
              </span>
              <span className="block font-semibold text-lg">
                {field.cropName}
              </span>
            </div>
          </div>
          <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-5 col-span-2">
            <div className="flex items-center space-x-2 ">
              <Activity className="text-mainColor" size={18} />
              <span className="font-semibold text-xl">Progress & Status</span>
            </div>
            <div>
              <span className="text-[#6A6C76] font-medium text-lg">
                Growth Progress
              </span>
              <span className="block font-semibold text-lg">
                {field.progress}
              </span>
              <div className="w-full bg-[#6A6C76] rounded-full h-3">
                <span
                  className="h-full bg-mainColor rounded-full block"
                  style={{ inlineSize: `${field.progress}%` }}
                />
              </div>
            </div>
            <div>
              <span className="text-[#6A6C76] font-medium text-lg">
                Days Until Harvest
              </span>
              <span className="block font-semibold text-lg">{daysLeft}</span>
            </div>
          </div>
          <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-5 col-span-1">
            <div className="flex items-center space-x-2 ">
              <Calendar className="text-mainColor" size={18} />
              <span className="font-semibold text-xl">Timeline</span>
            </div>
            <div>
              <span className="text-[#6A6C76] font-medium text-lg">
                Planting Date
              </span>
              <span className="block font-semibold text-lg">
                {new Date(field.plantingDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-[#6A6C76] font-medium text-lg">
                Expected Harvest Date
              </span>
              <span className="block font-semibold text-lg">
                {new Date(field.expectedHarvestDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
          <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-5 col-span-2">
            <div className="flex items-center space-x-2 ">
              <Sprout className="text-mainColor" size={18} />
              <span className="font-semibold text-xl">Description</span>
            </div>
            <div>
              <span className="text-[#6A6C76] font-medium text-lg">
                {field.description}
              </span>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default FieldOverview;
