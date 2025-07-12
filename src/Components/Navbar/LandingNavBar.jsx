import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LandingNavBar = ({ alwaysSolid = false }) => {
  const [isScrolled, setIsScrolled] = useState(alwaysSolid);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (alwaysSolid) return; // Skip scroll listener when solid background is forced

    const handleScroll = () => {
      // Check if user has scrolled past the hero section (you can adjust this value)
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // Adjust this threshold as needed
      
      setIsScrolled(scrollPosition > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [alwaysSolid]);

  return (
    <>
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 
        flex items-center px-3 md:px-10 py-3
        transition-all duration-300 ease-in-out
        ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20'
          : isMenuOpen
            ? 'bg-white/30 backdrop-blur-lg'
            : 'bg-transparent'
        }
      `}
    >
      <div className="flex items-center flex-1">
        <img 
          src={isScrolled ? "/blackLogo.png" : "/logo.png"}
          className="w-[100px] md:w-[130px] md:h-[40px] transition-all duration-300" 
        />
      </div>
      <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
        <Link 
          to="/" 
          className={`font-medium transition-all duration-300 ${
            isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'
          }`}
        >
          Home
        </Link>
        <Link 
          to="/features" 
          className={`font-medium transition-all duration-300 ${
            isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'
          }`}
        >
          Features
        </Link>
        <Link 
          to="/pricing" 
          className={`font-medium transition-all duration-300 ${
            isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'
          }`}
        >
          Pricing
        </Link>
        <Link 
          to="/about" 
          className={`font-medium transition-all duration-300 ${
            isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'
          }`}
        >
          About
        </Link>
      </div>
      <div className="hidden md:flex items-center justify-end space-x-3 md:space-x-4 flex-1">
        <Button 
          link={"/login"} 
          className={`
            transition-all duration-300
            ${isScrolled 
              ? 'border-2 border-[#1E6930] bg-transparent !text-[#1E6930] hover:bg-[#1E6930] hover:!text-white' 
              : 'border border-white/35 bg-white/35 !text-white hover:bg-white/50'
            }
          `}
        >
          Log In
        </Button>
        <Button 
          link={"/signup"} 
          className={`
            transition-all duration-300
            ${isScrolled 
              ? 'border-2 border-[#1E6930] bg-[#1E6930] text-white hover:bg-transparent hover:text-[#1E6930]' 
              : 'border border-white/35 bg-white/35 text-white hover:bg-white/50'
            }
          `}
        >
          Register
        </Button>
      </div>
      {/* Mobile menu toggle */}
      <div className="flex items-center justify-end md:hidden flex-1">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="p-2 rounded-lg transition-all duration-300"
        >
          {isMenuOpen ? (
            <X 
              size={24} 
              className={`transition-all duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`} 
            />
          ) : (
            <Menu 
              size={24} 
              className={`transition-all duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`} 
            />
          )}
        </button>
      </div>
    </nav>
    {/* Mobile dropdown menu */}
    {isMenuOpen && (
      <div className={`md:hidden fixed top-16 left-0 right-0 z-50 flex flex-col items-center space-y-6 py-6 ${isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white/30 backdrop-blur-lg'}`}>
        <Link 
          to="/" 
          onClick={() => setIsMenuOpen(false)} 
          className={`font-medium transition-all duration-300 ${isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'}`}
        >
          Home
        </Link>
        <Link 
          to="/features" 
          onClick={() => setIsMenuOpen(false)} 
          className={`font-medium transition-all duration-300 ${isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'}`}
        >
          Features
        </Link>
        <Link 
          to="/pricing" 
          onClick={() => setIsMenuOpen(false)} 
          className={`font-medium transition-all duration-300 ${isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'}`}
        >
          Pricing
        </Link>
        <Link 
          to="/about" 
          onClick={() => setIsMenuOpen(false)} 
          className={`font-medium transition-all duration-300 ${isScrolled ? 'text-gray-700 hover:text-[#1E6930]' : 'text-white hover:text-[#E8F0EA]'}`}
        >
          About
        </Link>
        <div className="flex items-center space-x-3">
          <Button 
            link="/login" 
            className={`transition-all duration-300 ${isScrolled ? 'border-2 border-[#1E6930] bg-transparent !text-[#1E6930] hover:bg-[#1E6930] hover:!text-white' : 'border border-white/35 bg-white/35 !text-white hover:bg-white/50'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Log In
          </Button>
          <Button 
            link="/signup" 
            className={`transition-all duration-300 ${isScrolled ? 'border-2 border-[#1E6930] bg-[#1E6930] text-white hover:bg-transparent hover:text-[#1E6930]' : 'border border-white/35 bg-white/35 text-white hover:bg-white/50'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Button>
        </div>
      </div>
    )}
    </>
  );
};

export default LandingNavBar;
