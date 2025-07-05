import { Button } from "../ui/Button";
const LandingNavBar = () => {
  return (
    <nav className="flex items-center justify-between px-3 md:px-10 py-5">
      <img src="/logo.png" className="w-32 md:w-[148px] md:h-[46px]" />
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button link={"/login"} className="border border-white/35 bg-white/35">
          log in
        </Button>
        <Button link={"/signup"} className="border border-white/35 bg-white/35">
          register
        </Button>
      </div>
    </nav>
  );
};

export default LandingNavBar;
