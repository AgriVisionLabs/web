import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const fallbackDays = [
  { day: "Monday", max: 34, min: 22 },
  { day: "Tuesday", max: 32, min: 21 },
  { day: "Wednesday", max: 28, min: 18 },
  { day: "Thursday", max: 30, min: 20 },
  { day: "Friday", max: 35, min: 23 },
  { day: "Saturday", max: 33, min: 22 },
  { day: "Sunday", max: 31, min: 21 },
];

const Slider = ({ forecast = [] }) => {
  const days = forecast.length > 0 ? forecast : fallbackDays;

  // Determine today's day name
  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const initialIndex = Math.max(
    days.findIndex((d) => d.day === todayName),
    0
  );
  return (
    <div className="mx-auto w-full sm:w-[470px] md:w-[570px] lg:w-auto">
      <Swiper
        spaceBetween={8}
        initialSlide={initialIndex}
        breakpoints={{
          400: {
            slidesPerView: 3,
          },
          640: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 5,
          },
        }}
      >
        {days.map((e, index) => {
          const isToday = e.day === todayName;
          let iconClass = "fa-solid fa-cloud text-blue-400";
          if (e.max >= 35) {
            iconClass = "fa-solid fa-temperature-high text-red-500";
          } else if (e.max >= 30) {
            iconClass = "fa-solid fa-sun text-orange-400";
          } else if (e.max >= 20) {
            iconClass = "fa-solid fa-cloud-sun text-yellow-400";
          }
          return (
            <SwiperSlide key={index}>
              <div
                className={`py-3 px-2 flex flex-col items-center rounded-lg space-y-1 ${
                  isToday ? "bg-mainColor/10" : ""
                }`}
              >
                <p className={`text-sm font-semibold ${isToday ? "text-mainColor" : ""}`}>
                  {e.day.slice(0, 3)}
                </p>
                <i className={`${iconClass} text-[18px]`}></i>
                {e.max !== undefined && (
                  <>
                    <p className="text-sm font-medium">{e.max}°</p>
                    <p className="text-sm font-medium">{e.min}°</p>
                  </>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slider;
