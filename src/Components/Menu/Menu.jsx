const Menu = ({ item, index, setIndex, selected = false }) => {
  return (
    <div
      className={`px-4 py-2 cursor-pointer hover:text-mainColor hover:bg-slate-200 ${
        selected ? "text-mainColor" : ""
      }`}
      onClick={() => setIndex(index)}
    >
      <p>{item}</p>
    </div>
  );
};

export default Menu;
