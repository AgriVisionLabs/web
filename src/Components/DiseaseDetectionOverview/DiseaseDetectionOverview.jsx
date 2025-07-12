import {
  Calendar,
  Camera,
  ChevronLeft,
  CircleCheckBig,
  Leaf,
  Search,
  User,
  Image,
  Eye,
} from "lucide-react";
import { Line } from "rc-progress";
import { useContext, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { motion } from "framer-motion";

const DiseaseDetectionOverview = () => {
  let { setDetectionPage, getPart } = useContext(AllContext);
  let [partsDetectionOverview, setPartsDetectionOverview] =
    useState("All Fields");
  return (
    <section className="font-manrope">
      <div className="flex space-x-[50px] items-center">
        <ChevronLeft
          size={40}
          className="text-[#616161] cursor-pointer hover:text-black transition-all duration-150"
          onClick={() => {
            setDetectionPage("DiseaseDetectionpage");
          }}
        />
        <div className="">
          <h1 className="text-[25px] font-semibold capitalize">field 1</h1>
          <div className="flex items-center space-x-[11px]">
            <Leaf className="text-mainColor  " />
            <h2 className="text-[#616161] text-[22px] font-semibold capitalize">
              Corn
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-[50px] mb-[30px]">
        <div className="grid lg:grid-cols-3 gap-[40px]">
          <div className="col-span-2 min-h-[260px] border-[1px] border-[#9F9F9F] rounded-[15px] p-[15px]">
            <h3 className=" text-[#0D121C] text-[20px] font-semibold capitalize ">
              {" "}
              field Overview
            </h3>
            <div className="mt-[30px]">
              <div className="flex justify-between items-center text-[18px] text-[#0D121C] font-semibold my-[12px]">
                <p className="capitalize">crop health</p>
                <p>{95}%</p>
              </div>
              <Line
                percent={95}
                strokeLinecap="round"
                strokeColor="#1E6930"
                className="h-[6.5px] text-mainColor w-full rounded-lg"
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-[30px] space-y-[15px]  lg:text-[17px] text-[#616161] font-medium">
              <div className="flex items-center space-x-[10px]">
                <Calendar strokeWidth={1.8} size={22} />
                <p className=" capitalize">last inspection: 15 oct, 2023</p>
              </div>
              <div className="flex items-center space-x-[10px]">
                <User strokeWidth={1.8} size={22} />
                <p className=" capitalize">hussein mohamed</p>
              </div>
              <div className="flex items-center space-x-[10px]">
                <Search
                  className="rotate-[100deg]"
                  strokeWidth={1.8}
                  size={22}
                />
                <p className=" capitalize">total detection: 3</p>
              </div>
              <div className="flex items-center space-x-[10px]">
                <CircleCheckBig
                  strokeWidth={1.8}
                  size={22}
                  className="text-[#25C462]"
                />
                <p className=" capitalize">current status: healthy</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 min-h-[260px] border-[1px] border-[#9F9F9F] rounded-[15px] p-[15px]">
            <h3 className=" text-[#0D121C] text-[20px] font-semibold capitalize ">
              {" "}
              Actions
            </h3>
            <div className="mt-[45px] space-y-[35px]">
              <button
                type="button"
                className="py-[12px] px-[20px] border-[1px] w-full border-transparent rounded-[45px] bg-mainColor text-[18px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                onClick={() => {}}
              >
                <div className="flex justify-center items-center space-x-[11px] w-full">
                  <Camera size={22} />
                  <p className=" capitalize">new detection</p>
                </div>
              </button>
              <button
                type="button"
                className="py-[12px] px-[20px] border-[1px] w-full rounded-[45px] text-mainColor text-[18px] border-mainColor  hover:bg-mainColor hover:text-[#FFFFFF]  transition-all duration-300 font-medium"
                onClick={() => {}}
              >
                <div className="flex justify-center items-center space-x-[11px] w-full">
                  <Leaf size={19} />
                  <p className=" capitalize">manage field</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <h4 className="text-[21px] text-[#0D121C] font-medium capitalize">
            detection history
          </h4>
          <div className="flex items-center space-x-[18px] ">
            <h4 className="text-[21px] text-[#616161] font-medium capitalize">
              filter:{" "}
            </h4>
            <div
              className="flex items-center w-fit h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[20px] px-[10px] text-[14px] sm:text-[16px]   font-medium "
              id="parts"
              onClick={(e) => {
                getPart(e.target);
              }}
            >
              <p
                className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("All Fields");
                }}
              >
                All Fields
              </p>
              <p
                className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("Healthy");
                }}
              >
                Healthy
              </p>
              <p
                className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("At Risk");
                }}
              >
                At Risk
              </p>
              <p
                className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("Infected");
                }}
              >
                Infected
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-[30px] mt-[50px]">
          {[1, 2, 3].map((index) => {
            return (
              <motion.div
                key={index}
                initial={{ x: 0, y: -50, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.5,
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.4,
                }}
              >
                <div
                  key={index}
                  className="flex items-center h-[100px] w-full rounded-[15px] border-[1px] border-[#9F9F9F] text-[18px] text-[#616161] font-medium "
                >
                  <div className="flex w-full justify-between items-center px-[30px]">
                    <div className="flex items-center space-x-[10px] ">
                      <CircleCheckBig
                        strokeWidth={1.8}
                        size={24}
                        className="text-[#25C462]"
                      />
                      <div className="capitalize">
                        <p className="text-[#0D121C]">healthy</p>
                        <p className="">15 mar, 2025</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-[10px] ">
                      <User strokeWidth={1.8} size={24} />
                      <p className=" capitalize">hussein mohamed</p>
                    </div>
                    <div className="flex items-center space-x-[10px]">
                      <Image strokeWidth={1.8} size={24} />
                      <p className=" capitalize">3 images uploaded</p>
                    </div>
                    <div className="flex items-center space-x-[30px]">
                      <h3 className="bg-[#25C462] rounded-[15px] px-[12px] py-[4px]  text-[#FFFFFF] capitalize">
                        healthy
                      </h3>
                      <Eye strokeWidth={1.8} size={24} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DiseaseDetectionOverview;
