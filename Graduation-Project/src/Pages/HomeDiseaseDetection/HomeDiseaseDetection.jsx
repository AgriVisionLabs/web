import { useContext } from 'react';
import DiseaseDetectionOverview from '../../Components/DiseaseDetectionOverview/DiseaseDetectionOverview';
import DiseaseDetection from '../../Components/DiseaseDetection/DiseaseDetection';
import { AllContext } from '../../Context/All.context';

const HomeDiseaseDetection = () => {
    let {detectionPage}=useContext(AllContext);
    return (
        <>
        {detectionPage=="DiseaseDetectionpage"?<DiseaseDetection/>:<DiseaseDetectionOverview/>}
        </>
    )
    }

export default HomeDiseaseDetection;
