import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import Farms from "../Farms/Farms";
import Fields from "../Fields/Fields";

const FarmsAndFields = () => {
  let { openFarmsOrFieled, SetOpenFarmsOrFieled ,farmID, setFarmID } = useContext(AllContext);
  let [clickFarm, setClickFarm] = useState(null);
  // useEffect(()=>{SetOpenFarmsOrFieled(1);},[])
  return (
    <>
      <section className="transition-all duration-500 relative h-full">
        {openFarmsOrFieled == 1 ? (
          <Farms setClickFarm={setFarmID} />
        ) : farmID ? (
          openFarmsOrFieled == 2 ? (
            <Fields farmId={farmID} />
          ) : null
        ) : (
          openFarmsOrFieled == 1
        )}
      </section>
    </>
  );
};

export default FarmsAndFields;
