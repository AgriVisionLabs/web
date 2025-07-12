import { useContext } from "react";
import DiseaseDetectionOverview from "../../Components/DiseaseDetectionOverview/DiseaseDetectionOverview";
import DiseaseDetection from "../../Components/DiseaseDetection/DiseaseDetection";
import { AllContext } from "../../Context/All.context";
import { Helmet } from "react-helmet";

const HomeDiseaseDetection = () => {
  let { detectionPage } = useContext(AllContext);
  return (
    <>
      <Helmet>
        <title>Disease Detection</title>
      </Helmet>
      <section className="transition-all duration-500">
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
