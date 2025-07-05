import { Star } from "lucide-react";

// eslint-disable-next-line react/prop-types
export const Testimonials = ({ review, name, role, loc }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0px_1px_10px_0px_#00000040] border border-[#D2E1D6] space-y-6 flex flex-col">
      <div className="flex items-center space-x-1">
        <Star className="text-[#FACC1B]" fill={"#FACC1B"} />
        <Star className="text-[#FACC1B]" fill={"#FACC1B"} />
        <Star className="text-[#FACC1B]" fill={"#FACC1B"} />
        <Star className="text-[#FACC1B]" fill={"#FACC1B"} />
        <Star className="text-[#FACC1B]" fill={"#FACC1B"} />
      </div>

      <p className="text-sm font-medium text-[#4B5563] flex-1">{review}</p>

      <div className="flex items-center space-x-4">
        <span className="flex items-center justify-center bg-green-900 w-10 h-10 rounded-full text-white">
          {(name || "").charAt(0).toUpperCase()}
        </span>

        <div>
          <p className="text-sm font-bold capitalize">{name}</p>
          <span className="block text-sm font-semibold text-[#4B5563]">
            {role}
          </span>
          <span className="block text-sm font-semibold text-[#4B5563]">
            {loc}
          </span>
        </div>
      </div>
    </div>
  );
};
