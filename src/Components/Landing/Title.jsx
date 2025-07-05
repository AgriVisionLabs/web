// eslint-disable-next-line react/prop-types
const Title = ({ title, greenTitle, desc }) => {
  return (
    <div className="md:w-[55%] mx-auto my-10 text-center space-y-5">
      <h2 className="text-3xl md:text-4xl font-bold">
        {title} <span className="text-[#1E6930]">{greenTitle}</span>
      </h2>
      <p className="text-lg md:text-xl font-medium text-[#4B5563]">{desc}</p>
    </div>
  );
};

export default Title;
