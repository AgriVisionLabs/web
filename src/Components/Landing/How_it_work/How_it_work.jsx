import { Dot } from "lucide-react";

/* eslint-disable react/prop-types */
const How_it_work = ({ icon, title, step, desc, steps }) => {
  console.log(steps);

  return (
    <div className="space-y-4 py-3 px-2 md:w-3/4 lg:w-1/2">
      <div className="flex items-center space-x-6">
        <span className="p-4 bg-[#1E6930] w-fit rounded-lg">{icon}</span>
        <div className="space-t-2">
          <span className="block uppercase text-[#1E6930]">Step {step}</span>
          <h3 className="text-2xl font-extrabold capitalize">{title}</h3>
        </div>
      </div>
      <p className="text-lg font-medium text-[#4B5563]">{desc}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {steps.map((step, index) => (
          <span
            className="text-sm font-medium text-[#4B5563] flex items-center -ml-4"
            key={index}
          >
            <Dot className="text-[#1E6930]" size={40} />
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

export default How_it_work;
