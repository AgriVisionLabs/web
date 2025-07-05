import { Dot } from "lucide-react";
import { useMemo, useEffect, useState } from "react";

export default function ScrollMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [isDesktop, setIsDesktop] = useState(false);

  const links = useMemo(
    () => [
      {
        title: "home",
        id: "#home",
      },
      {
        title: "features",
        id: "#features",
      },
      {
        title: "how it works",
        id: "#how_it_works",
      },
      {
        title: "pricing",
        id: "#pricing",
      },
      {
        title: "testimonials",
        id: "#testimonials",
      },
    ],
    []
  );

  // useEffect(() => {
  //   let timeoutId;

  //   const handleScroll = () => {
  //     setShowMenu(true);

  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => {
  //       setShowMenu(false);
  //     }, 400);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     clearTimeout(timeoutId);
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    let timeoutId;

    const handleScroll = () => {
      setShowMenu((prev) => (!prev ? true : prev));

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowMenu((prev) => (prev ? false : prev));
      }, 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;
    const sections = links.map((link) => document.getElementById(link.id));

    const handleScroll = () => {
      sections.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setActive(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [links, isDesktop]);

  if (!showMenu || !isDesktop) return null;

  return (
    <div className="fixed z-50 top-[30%] right-4 p-2 py-3 md:px-6 space-y-1 bg-white rounded-xl shadow-lg transition duration-500">
      {links.map((link) => (
        <p
          key={link.title}
          className={`flex items-center px-2 font-semibold rounded-xl capitalize transition-all duration-200 ${
            link.id === active ? "bg-[#1E6930] text-white" : "text-[#4B5563]"
          }`}
        >
          <Dot size={50} className="-ml-4" />
          <span className="-ml-3">{link.title}</span>
        </p>
      ))}
    </div>
  );
}
