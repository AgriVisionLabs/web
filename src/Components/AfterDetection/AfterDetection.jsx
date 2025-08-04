import { Calendar, CircleCheckBig, CircleX, User, X } from "lucide-react";
import { useContext } from "react";
import { AllContext } from "../../Context/All.context";

const AfterDetection = (children) => {
  let { setDetection } = useContext(AllContext);
  let data = children.DataAfterDetection;

  if (!data) return null;

  // Use the closeDetectionPopup function if provided, otherwise fall back to setDetection
  const handleClose = () => {
    if (children.closeDetectionPopup) {
      children.closeDetectionPopup();
    } else {
      setDetection(null);
    }
  };

  const getHealthStatusText = (healthStatus) => {
    switch (healthStatus) {
      case 0:
        return "healthy";
      case 1:
        return "at risk";
      case 2:
        return "infected";
      default:
        return "unknown";
    }
  };

  const getHealthStatusColor = (healthStatus) => {
    switch (healthStatus) {
      case 0:
        return { bg: "bg-[#25C462]", text: "text-[#25C462]" };
      case 1:
        return { bg: "bg-yellow-500", text: "text-yellow-500" };
      case 2:
        return { bg: "bg-[#E13939]", text: "text-[#E13939]" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-500" };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const healthStatusText = getHealthStatusText(data.healthStatus);
  const healthStatusColors = getHealthStatusColor(data.healthStatus);

  return (
    <div className="mx-3 w-full sm:min-w-[600px] sm:max-w-[95vw] lg:min-w-[900px] lg:max-w-[1100px] min-h-[500px] sm:min-h-[600px] lg:min-h-[800px] max-h-[90vh] sm:max-h-[95vh] overflow-y-auto py-8 sm:py-10 lg:py-[50px] px-6 sm:px-8 lg:px-[60px] rounded-[18px] sm:rounded-[22px] lg:rounded-[28px] font-manrope bg-[#FFFFFF] flex flex-col shadow-2xl">
      <div className="flex justify-between pb-6 sm:pb-8 lg:pb-[30px] border-b-[1px] border-[#9F9F9F]">
        <h3 className="text-xl sm:text-2xl lg:text-[26px] text-[#1E6930] font-semibold capitalize">
          Detection from {formatDate(data.createdOn)}
        </h3>
        <X
          size={28}
          className="sm:w-8 sm:h-8 lg:w-9 lg:h-9 cursor-pointer text-black hover:text-red-600 transition-all duration-150"
          onClick={handleClose}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-[15px] my-6 sm:my-[30px]">
          {data.isHealthy ? (
            <CircleCheckBig
              strokeWidth={1.5}
              size={24}
              className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#25C462]"
            />
          ) : (
            <CircleX
              strokeWidth={1.5}
              size={24}
              className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#E13939]"
            />
          )}
          <p className="text-lg sm:text-xl lg:text-[22px] font-semibold capitalize">
            {data.diseaseName || healthStatusText}
          </p>
        </div>
        <h3
          className={`${healthStatusColors.bg} rounded-[18px] px-4 sm:px-[16px] py-2 text-base sm:text-lg lg:text-[18px] font-semibold text-[#FFFFFF] capitalize w-fit`}
        >
          {healthStatusText}
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 text-base sm:text-lg lg:text-[18px] text-[#616161] font-medium mb-6 sm:mb-8 lg:mb-[32px]">
        <div className="flex items-center space-x-3 sm:space-x-[10px]">
          <Calendar
            strokeWidth={1.5}
            size={18}
            className="sm:w-6 sm:h-6 lg:w-7 lg:h-7"
          />
          <p className="capitalize">{formatDate(data.createdOn)}</p>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-[10px]">
          <CircleCheckBig
            strokeWidth={1.5}
            size={18}
            className="sm:w-6 sm:h-6 lg:w-7 lg:h-7"
          />
          <p className="capitalize">
            accuracy level : {Math.round(data.confidenceLevel * 100)}%
          </p>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-[10px]">
          <User
            strokeWidth={1.5}
            size={18}
            className="sm:w-6 sm:h-6 lg:w-7 lg:h-7"
          />
          <p className="capitalize">{data.createdBy || "unknown"}</p>
        </div>
      </div>

      <div className="flex flex-col items-center mt-6 sm:mt-8 lg:mt-[32px] flex-1">
        <div className="max-w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={data.imageUrl}
            alt="Detection result"
            className="max-w-full max-h-[45vh] sm:max-h-[55vh] lg:max-h-[65vh] object-contain"
          />
        </div>
      </div>

      <div className="bg-[rgba(159,159,159,0.15)] mt-6 sm:mt-8 lg:mt-[32px] min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] rounded-[18px] w-full text-lg sm:text-xl lg:text-[20px] font-medium px-6 sm:px-8 lg:px-[32px] py-4 sm:py-6 lg:py-[20px] space-y-3 sm:space-y-[15px]">
        <p className="capitalize font-semibold text-[#0D121C]">
          analysis result
        </p>
        <p className="text-base sm:text-lg lg:text-[18px] leading-relaxed text-[#333333]">
          {data.isHealthy
            ? `No disease detected. The ${
                data.cropName || "crop"
              } appears healthy.`
            : `${data.diseaseName || "Disease"} detected in ${
                data.cropName || "crop"
              }.`}
          {data.treatments && data.treatments.length > 0 && (
            <span className="block mt-2">
              Recommended treatments: {data.treatments.join(", ")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default AfterDetection;
