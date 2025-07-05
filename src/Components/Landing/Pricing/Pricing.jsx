import { Check } from "lucide-react";
import { Button } from "../../ui/Button";

// eslint-disable-next-line react/prop-types
const Pricing = ({ title, price, desc, availableFarmers, features }) => {
  return (
    <div
      className={`
    flex flex-col justify-between
    bg-white rounded-2xl px-6 py-8 
    shadow-[0px_1px_10px_0px_#00000040] 
    ${
      title === "Advanced"
        ? "xl:min-h-[660px] border-2 border-[#1E6930] relative"
        : "border border-[#D2E1D6]"
    }
  `}
    >
      {title === "Advanced" && (
        <span className="absolute -top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[#1E6930] py-2 px-4 rounded-full text-sm font-semibold text-white">
          Most Popular
        </span>
      )}
      <div className="space-y-6 flex-1">
        <h3 className="text-2xl font-bold text-center">{title}</h3>
        <span className="text-3xl font-bold text-[#1E6930] block text-center">
          {price}
        </span>
        <p className="text-base font-medium text-[#4B5563] text-center">
          {desc}
        </p>

        <div className="space-y-4">
          {[...availableFarmers].map((farm) => (
            <p key={farm} className="flex items-center">
              <Check className="text-[#1E6930] mr-2" />
              {farm}
            </p>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-semibold">Features:</h4>
          {[...features].map((farm) => (
            <p key={farm} className="flex items-center space-x-2">
              <Check className="text-[#1E6930] min-w-7 min-h-5" />
              <span>{farm}</span>
            </p>
          ))}
        </div>
      </div>
      <Button
        link={"/signup"}
        className={`${
          title === "Enterprise" ? "bg-[#111827]" : "bg-[#1E6930]"
        } h-[45px] px-10 text-lg mx-auto w-full mt-10`}
      >
        {title === "Enterprise" ? "Contact Sales" : "Get Started"}
      </Button>
    </div>
  );
};

export default Pricing;
