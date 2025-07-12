import { useContext, useState } from "react";
import { AllContext } from "../../Context/All.context";
import MenuElement from "../../Components/MenuElement/MenuElement";
import {
  ChartNoAxesColumn,
  ClipboardCheck,
  Download,
  Droplet,
  Leaf,
  MoveDownRight,
  MoveUpRight,
  Podcast,
  Thermometer,
  TrendingUp,
} from "lucide-react";
import { Line } from "rc-progress";
import Environmental from "../../Components/Environmental Part (Analytics)/Environmental";
import IrrigationPartAnalytics from "../../Components/Irrigation Part (Analytics)/IrrigationPartAnalytics";
import PlantHealth from "../../Components/Plant Health Part (Analytics)/PlantHealth";
import Growth from "../../Components/Growth Part (Analytics)/Growth";
import Yield from "../../Components/Yield Part (Analytics)/Yield";
import Inventory from "../../Components/Inventory Part (Analytics)/Inventory";
import TasksPart from "../../Components/Tasks Part (Analytics)/TasksPart";
import Subscription from "../../Components/Subscription Part (Analytics)/Subscription";
import { Helmet } from "react-helmet";

const Analytics = () => {
  let { getPart } = useContext(AllContext);
  let [onlist1, setOnlist1] = useState(0);
  let [allFarms1, setAllFarms1] = useState([]);
  let [onlist2, setOnlist2] = useState(0);
  let [allFarms2, setAllFarms2] = useState([]);
  let [index1, setIndex1] = useState([]);
  let [index2, setIndex2] = useState([]);
  let [part, setPart] = useState("environmental");
  return (
    <section className="text-[#0D121C] transition-all duration-500">
      <Helmet>
        <title>Analytics</title>
      </Helmet>
      <div className="flex gap-y-[20px] flex-col xl:flex-row justify-between items-center mb-[40px]">
        <div className="text-center xl:text-start">
          <h1 className="text-[25px] font-semibold">Analytics & Reports</h1>
          <p className="capitalize text-[18px] text-[#616161] font-medium">
            Comprehensive insights into your farm operations
          </p>
        </div>
        <div className="flex space-x-4 flex-col xl:flex-row items-center xl:items-start space-[12px]">
          <div className="flex space-x-4 space-[12px]">
            <MenuElement
              Items={allFarms1}
              nameChange={allFarms1[index1]}
              setIndex={setIndex1}
              index={index1}
              onList={onlist1}
              name={"All Farms"}
              setOnList={setOnlist1}
              Pformat={"text-[#0D121C] font-[400] px-[12px]"}
            />
            <MenuElement
              Items={allFarms2}
              nameChange={allFarms2[index2]}
              setIndex={setIndex2}
              index={index2}
              onList={onlist2}
              name={"last 30 days"}
              setOnList={setOnlist2}
              Pformat={"text-[#0D121C] font-[400] px-[12px]"}
            />
          </div>

          <button className="border-[1px] border-[#D9D9D9] rounded-[8px] px-[15px] py-[9px]">
            <div className="flex items-center space-x-1">
              <Download strokeWidth={1.7} />
              <p className="">Export</p>
            </div>
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-[40px]">
        <div className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]">
          <div className="font-manrope px-[24px] pb-[20px]">
            <div className="pt-[15px] mb-[10px] flex justify-between items-center">
              <h3 className="text-[19px] font-semibold capitalize">
                average soil moisture
              </h3>
              <Droplet />
            </div>
            <div className="space-y-[10px] mb-[10px] font-semibold">
              <p className="text-[#616161] text-[17px]">Across all fields</p>
              <p className="text-[17px]">68%</p>
            </div>
            <div className="mt-1 text-[17px] font-manrope">
              <div className="space-y-[8px]">
                <div className="flex space-x-[8px] text-[17px] font-semibold mb-[10px]">
                  <div className="text-[#25C462] flex space-x-[4px] mb-[10px]">
                    <MoveUpRight />
                    <p className="">+4.3%</p>
                  </div>
                  <p className="text-[#616161]">from last period</p>
                </div>
                <Line
                  percent={70}
                  strokeLinecap="round"
                  strokeColor="#1E6930"
                  className="h-[6.5px] text-mainColor w-full rounded-lg"
                />
                <p className="text-[#616161] text-[17px] font-semibold">
                  Optimal: 60 - 75 %
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]">
          <div className="font-manrope px-[24px] pb-[20px]">
            <div className="pt-[15px] mb-[10px] flex justify-between items-center">
              <h3 className="text-[19px] font-semibold capitalize">
                crop health index
              </h3>
              <Leaf />
            </div>
            <div className="space-y-[10px] mb-[10px] font-semibold">
              <p className="text-[#616161] text-[17px]">
                Average across all crops
              </p>
              <p className="text-[17px]">87</p>
            </div>
            <div className="mt-1 text-[17px] font-manrope">
              <div className="space-y-[8px]">
                <div className="flex space-x-[8px] text-[17px] font-semibold mb-[10px]">
                  <div className="text-[#E13939] flex space-x-[4px] mb-[10px]">
                    <MoveDownRight />
                    <p className="">-2.1%</p>
                  </div>
                  <p className="text-[#616161]">from last period</p>
                </div>
                <Line
                  percent={95}
                  strokeLinecap="round"
                  strokeColor="#1E6930"
                  className="h-[6.5px] text-mainColor w-full rounded-lg"
                />
                <p className="text-[#616161] text-[17px] font-semibold">
                  Optimal: 85 - 100 %
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]">
          <div className="font-manrope px-[24px] pb-[20px]">
            <div className="pt-[15px] mb-[10px] flex justify-between items-center">
              <h3 className="text-[19px] font-semibold capitalize">
                water usage
              </h3>
              <Droplet />
            </div>
            <div className="space-y-[10px] mb-[10px] font-semibold">
              <p className="text-[#616161] text-[17px]">Last 7 days</p>
              <p className="text-[17px]">1,243 gal</p>
            </div>
            <div className="mt-1 text-[17px] font-manrope">
              <div className="space-y-[8px]">
                <div className="flex space-x-[8px] text-[17px] font-semibold mb-[10px]">
                  <div className="text-[#E13939] flex space-x-[4px] mb-[10px]">
                    <MoveDownRight />
                    <p className="">-12.5%</p>
                  </div>
                  <p className="text-[#616161]">from last period</p>
                </div>
                <Line
                  percent={87.5}
                  strokeLinecap="round"
                  strokeColor="#1E6930"
                  className="h-[6.5px] text-mainColor w-full rounded-lg"
                />
                <p className="text-[#616161] text-[17px] font-semibold">
                  Optimal: reduced by 12.5%
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]">
          <div className="font-manrope px-[24px] pb-[20px]">
            <div className="pt-[15px] mb-[10px] flex justify-between items-center">
              <h3 className="text-[19px] font-semibold capitalize">
                estimated yield
              </h3>
              <TrendingUp />
            </div>
            <div className="space-y-[10px] mb-[10px] font-semibold">
              <p className="text-[#616161] text-[17px]">Of projected target</p>
              <p className="text-[17px]">92 %</p>
            </div>
            <div className="mt-1 text-[17px] font-manrope">
              <div className="space-y-[8px]">
                <div className="flex space-x-[8px] text-[17px] font-semibold mb-[10px]">
                  <div className="text-[#25C462] flex space-x-[4px] mb-[10px]">
                    <MoveUpRight />
                    <p className="">+3.8%</p>
                  </div>
                  <p className="text-[#616161]">from last period</p>
                </div>
                <Line
                  percent={100}
                  strokeLinecap="round"
                  strokeColor="#1E6930"
                  className="h-[6.5px] text-mainColor w-full rounded-lg"
                />
                <p className="text-[#616161] text-[17px] font-semibold">
                  Optimal: Target 100%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[40px]">
        <div
          className="grid grid-cols-2 gap-y-[10px] xl:grid-cols-8 min-h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] p-[10px] text-[16px] sm:text-[17px] font-medium mb-[52px]"
          id="parts"
          onClick={(e) => {
            getPart(e.target);
          }}
        >
          <div
            className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer flex items-center space-x-[4px]"
            onClick={() => {
              setPart("environmental");
            }}
          >
            <Thermometer />
            <p className="">Environmental</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("irrigation");
            }}
          >
            <Droplet />
            <p className="">Irrigation</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("plant health");
            }}
          >
            <Leaf />
            <p className="">Plant Health</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("growth");
            }}
          >
            <TrendingUp />
            <p className="">Growth</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("yield");
            }}
          >
            <ChartNoAxesColumn />
            <p className="">Yield</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("inventory");
            }}
          >
            <Droplet />
            <p className="">Inventory</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("tasks");
            }}
          >
            <ClipboardCheck />
            <p className="">Tasks</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("subscription");
            }}
          >
            <Podcast />
            <p className="">Subscription</p>
          </div>
        </div>
        <div className="">
          {part === "environmental" ? (
            <Environmental />
          ) : part === "irrigation" ? (
            <IrrigationPartAnalytics />
          ) : part === "plant health" ? (
            <PlantHealth />
          ) : part === "growth" ? (
            <Growth />
          ) : part === "yield" ? (
            <Yield />
          ) : part === "inventory" ? (
            <Inventory />
          ) : part === "tasks" ? (
            <TasksPart />
          ) : part === "subscription" ? (
            <Subscription />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Analytics;
