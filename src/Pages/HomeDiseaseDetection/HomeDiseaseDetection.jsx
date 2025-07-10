import { useContext, useEffect, useState } from "react";
import DiseaseDetectionOverview from "../../Components/DiseaseDetectionOverview/DiseaseDetectionOverview";
import DiseaseDetection from "../../Components/DiseaseDetection/DiseaseDetection";
import { AllContext } from "../../Context/All.context";

const HomeDiseaseDetection = () => {
  let { detectionPage ,setDetectionPage,fieldDetection, setFieldDetection,diseaseDetection, setDiseaseDetection,stateOverview,setStateOverview} = useContext(AllContext);
  // let [field, setField] = useState();
  // let [diseaseDetections, setDiseaseDetections] = useState([]);
  // let [stateOverview, setStateOverview] = useState([]);
  return (
    <>
      <section className="transition-all duration-500 h-full">
        {detectionPage == "DiseaseDetectionpage" ? (
          <DiseaseDetection  setField={setFieldDetection} setStateOverview={setStateOverview} setDiseaseDetections={setDiseaseDetection}/>
        ) : (
          <DiseaseDetectionOverview stateOverview={stateOverview} field={fieldDetection} diseaseDetections={diseaseDetection}/>
        )}
      </section>
    </>
  );
};

export default HomeDiseaseDetection;
