import { useContext, useState, useEffect } from "react";
import { AllContext } from "../../Context/All.context";
import Farms from "../Farms/Farms";
import Fields from "../Fields/Fields";
import { Helmet } from "react-helmet";

const FarmsAndFields = () => {
  let { openFarmsOrFieled, SetOpenFarmsOrFieled } = useContext(AllContext);
  let [clickFarm, setClickFarm] = useState(1);

  useEffect(() => {
    // Check if we have a selected farm from localStorage (from Dashboard navigation)
    const selectedFarmId = localStorage.getItem('selectedFarmId');
    if (selectedFarmId) {
      setClickFarm(selectedFarmId);
      SetOpenFarmsOrFieled(2); // Go directly to fields view
      // Clear the localStorage after using it
      localStorage.removeItem('selectedFarmId');
    } else {
      SetOpenFarmsOrFieled(1); // Default to farms view
    }
  }, []);
  const renderContent = () => {
    if (openFarmsOrFieled === 1) {
      return <Farms setClickFarm={setClickFarm} />;
    } else if (openFarmsOrFieled === 2 && clickFarm) {
      return <Fields farmId={clickFarm} />;
    }
    return null;
  };

  return (
    <section className="transition-all duration-500 relative">
      <Helmet>
        <title>Farms And Fields</title>
      </Helmet>
      {renderContent()}
    </section>
  );
};

export default FarmsAndFields;
