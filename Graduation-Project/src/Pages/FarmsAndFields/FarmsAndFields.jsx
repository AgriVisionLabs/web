import React, { useContext, useState } from 'react';
import BasicInfo from '../../Components/BasicInfo/BasicInfo';
import Team from '../../Components/Team/Team';
import Review from '../../Components/Review/Review';
import { Line, Circle } from 'rc-progress';
import { MapPin, SquarePen, Trash2 } from 'lucide-react';
import { AllContext } from '../../Context/All.context';
import Farms from '../Farms/Farms';
import Fields from '../Fields/Fields';

const FarmsAndFields = () => {
    let {openFarmsOrFieled,SetOpenFarmsOrFieled}=useContext(AllContext);
    let [clickFarm,setClickFarm]=useState(null);
    SetOpenFarmsOrFieled(1)
    return (
        
        <>
        
            {
                openFarmsOrFieled==1?<Farms  setClickFarm={setClickFarm}/>:
                clickFarm?(openFarmsOrFieled==2?<Fields farmId={clickFarm}/>:""):openFarmsOrFieled==1
            }
        </>
    );
}

export default FarmsAndFields;

