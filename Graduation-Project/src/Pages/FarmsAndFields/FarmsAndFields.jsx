import React, { useContext } from 'react';
import BasicInfo from '../../Components/BasicInfo/BasicInfo';
import Team from '../../Components/Team/Team';
import Review from '../../Components/Review/Review';
import { Line, Circle } from 'rc-progress';
import { MapPin, SquarePen, Trash2 } from 'lucide-react';
import { AllContext } from '../../Context/All.context';
import Farms from '../Farms/Farms';
import Fields from '../Fields/Fields';

const FarmsAndFields = () => {
    let {openFarmsOrFieled}=useContext(AllContext);
    let {SetOpenFarmsOrFieled}=useContext(AllContext);
    SetOpenFarmsOrFieled(1)
    return (
        
        <>
        
            {
                openFarmsOrFieled==1?<Farms/>:
                openFarmsOrFieled==2?<Fields/>:""
            }
        </>
    );
}

export default FarmsAndFields;

