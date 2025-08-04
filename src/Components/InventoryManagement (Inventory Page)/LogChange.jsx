/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { number, object, string } from "yup";
import { useFormik } from "formik";
import MenuElement from "../MenuElement/MenuElement";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const LogChange = ({ item, farmId, onClose, onSuccess }) => {
  const { baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(0);

  const transactionTypes = [
    { label: "Restock", value: 1 },
    { label: "Usage", value: 2 },
    { label: "Expired", value: 3 },
    { label: "Transfer", value: 4 },
    { label: "Manual Adjustment", value: 5 }
  ];

  const validationSchema = object({
    quantity: string()
      .required("Quantity change is required")
      .matches(/^-?\d+(\.\d+)?$/, "Quantity must be a valid number")
      .test('quantity-reason-logic', function(value) {
        const { reason } = this.parent;
        const quantity = parseFloat(value);
        
        if (isNaN(quantity)) {
          return true; // Let the regex validation handle invalid numbers
        }
        
        // Define which transaction types should only allow positive quantities
        const positiveOnlyTransactions = [1]; // Restock
        
        // Define which transaction types should only allow negative quantities  
        const negativeOnlyTransactions = [2, 3]; // Usage, Expired
        
        if (positiveOnlyTransactions.includes(reason) && quantity <= 0) {
          return this.createError({
            message: 'Restock operations must have a positive quantity (you are adding inventory)'
          });
        }
        
        if (negativeOnlyTransactions.includes(reason) && quantity >= 0) {
          return this.createError({
            message: 'Usage and Expired operations must have a negative quantity (you are removing inventory)'
          });
        }
        
        return true;
      }),
    reason: number().required("Reason is required"),
  });

  async function logInventoryChange(values) {
    console.log("Logging inventory change:", values);
    setIsSubmitting(true);

    if (!token) {
      console.error("No token available for logInventoryChange");
      toast.error("Authentication required");
      setIsSubmitting(false);
      return;
    }

    try {
      const option = {
        url: `${baseUrl}/farms/${farmId}/InventoryItems/${item.id}/log`,
        method: "POST",
        data: {
          quantity: parseFloat(values.quantity),
          reason: values.reason
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      let { data } = await axios(option);
      console.log("Inventory change logged successfully:", data);
      
      toast.success("Inventory change logged successfully!");
      onSuccess(); // Refresh the inventory list
      onClose(); // Close the popup
      
    } catch (error) {
      console.error("Error logging inventory change:", error);
      
      // Check for specific inventory errors
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const insufficientQuantityError = errors.find(err => 
          err.code === "InventoryItemErrors.InsufficientInventoryQuantity"
        );
        
        if (insufficientQuantityError) {
          toast.error(`Cannot reduce inventory by that amount. Current quantity is ${item.quantity} ${item.measurementUnit}. Please enter a smaller reduction amount.`);
        } else {
          // Handle other error codes
          const firstError = errors[0];
          toast.error(firstError.description || "An error occurred while logging the inventory change.");
        }
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.response?.status === 400) {
        toast.error("Invalid data provided. Please check your input.");
      } else {
        toast.error("Failed to log inventory change. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      quantity: "",
      reason: 1, // Default to Restock (first available option)
    },
    validationSchema,
    onSubmit: logInventoryChange,
  });

  // Update reason when dropdown selection changes
  const handleReasonChange = (index) => {
    setSelectedReasonIndex(index);
    formik.setFieldValue("reason", transactionTypes[index].value);
  };

  return (
    <section
      className="flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute inset-0 z-50 w-[100%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-[500px] px-[40px] border-2 rounded-2xl bg-white py-[20px] text-[#0D121C] font-manrope">
        <div className="flex justify-between items-center mb-[20px]">
          <h1 className="text-[23px] font-semibold capitalize text-mainColor">
            Log Inventory Change
          </h1>
          <X
            size={24}
            className="cursor-pointer hover:text-red-500 transition-all duration-150"
            onClick={onClose}
          />
        </div>

        <div className="mb-[20px] p-[15px] bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-[16px] mb-[5px]">{item?.name}</h3>
          <p className="text-[14px] text-gray-600">
            Current Quantity: {item?.quantity} {item?.measurementUnit}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-[20px]">
          <div className="flex flex-col">
            <label className="text-[17px] text-[#0D121C] font-semibold mb-[8px]">
              Quantity Change
            </label>
            <input
              type="text"
              className={`border-[1px] rounded-lg px-4 py-3 text-[16px] font-[400] focus:outline-mainColor ${
                formik.touched.quantity && formik.errors.quantity
                  ? 'border-red-500'
                  : 'border-[#0d121c21]'
              }`}
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={
                selectedReasonIndex === 0 ? "Enter positive amount for restock" :
                selectedReasonIndex === 1 || selectedReasonIndex === 2 ? "Enter negative amount (e.g., -50)" :
                "Enter amount (positive or negative)"
              }
              disabled={isSubmitting}
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <p className="text-red-500 text-[13px] mt-[5px]">{formik.errors.quantity}</p>
            )}
            <p className="text-[12px] text-gray-500 mt-[5px]">
              {selectedReasonIndex === 0 && "Restock: Use positive numbers to add inventory"}
              {(selectedReasonIndex === 1 || selectedReasonIndex === 2) && "Usage/Expired: Use negative numbers to remove inventory (e.g., -50)"}
              {(selectedReasonIndex === 3 || selectedReasonIndex === 4) && "Transfer/Adjustment: Use positive for additions, negative for reductions"}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-[17px] text-[#0D121C] font-semibold mb-[8px]">
              Reason
            </label>
            <MenuElement
              Items={transactionTypes.map(type => type.label)}
              nameChange={transactionTypes[selectedReasonIndex]?.label}
              setIndex={handleReasonChange}
              index={selectedReasonIndex}
              Pformat={"text-[#0D121C] font-[400]"}
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="text-red-500 text-[13px] mt-[5px]">{formik.errors.reason}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-[10px]">
            <button
              type="button"
              className="py-[10px] px-[20px] border-[1px] border-[#616161] rounded-[12px] text-[#333333] text-[16px] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-semibold"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`py-[10px] px-[20px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging...' : 'Log Change'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LogChange; 