/* eslint-disable react/prop-types */
const Feature = ({ icon, title, desc }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0px_1px_10px_0px_#00000040] border border-[#D2E1D6] max-w-[279px] min-h-[219px] space-y-3 mx-auto transition duration-300 hover:bg-[#FAFFF9] hover:border-[#E2E9DA]">
      <span className="p-4 bg-[#1E6930] w-fit rounded-lg block">{icon}</span>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm font-medium text-[#4B5563]">{desc}</p>
    </div>
  );
};

export default Feature;
