import { useContext } from "react";
import DiseaseDetectionOverview from "../../Components/DiseaseDetectionOverview/DiseaseDetectionOverview";
import DiseaseDetection from "../../Components/DiseaseDetection/DiseaseDetection";
import { AllContext } from "../../Context/All.context";

const HomeDiseaseDetection = () => {
  let { detectionPage } = useContext(AllContext);
  return (
    <>
      <section className="transition-all duration-500 h-full">
        {detectionPage == "DiseaseDetectionpage" ? (
          <DiseaseDetection />
        ) : (
          <DiseaseDetectionOverview />
        )}
      </section>
    </>
  );
};

export default HomeDiseaseDetection;
