import { useContext, useState } from "react";
import { AllContext } from "../../Context/All.context";
import Farms from "../Farms/Farms";
import Fields from "../Fields/Fields";

const FarmsAndFields = () => {
  let { openFarmsOrFieled, SetOpenFarmsOrFieled } = useContext(AllContext);
  let [clickFarm, setClickFarm] = useState(null);
  SetOpenFarmsOrFieled(1);
  return (
    <>
      <section className="transition-all duration-500 relative h-full">
        {openFarmsOrFieled == 1 ? (
          <Farms setClickFarm={setClickFarm} />
        ) : clickFarm ? (
          openFarmsOrFieled == 2 ? (
            <Fields farmId={clickFarm} />
          ) : null
        ) : (
          openFarmsOrFieled == 1
        )}
      </section>
    </>
  );
};

export default FarmsAndFields;
