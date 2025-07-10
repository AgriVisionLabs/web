import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
let days = [
  { day: "Monday", tem: "34° c" },
  { day: "Monday", tem: "34° c" },
  { day: "Monday", tem: "34° c" },
  { day: "Monday", tem: "34° c" },
  { day: "Monday", tem: "34° c" },
  { day: "Monday", tem: "34° c" },
  { day: "Monday", tem: "34° c" },
  { day: "Monday", tem: "34° c" },
];

const Slider = () => {
  return (
    <div className="mx-auto w-full sm:w-[470px] md:w-[570px] lg:w-auto">
      {
        <Swiper
          spaceBetween={0}
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
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {days.map((e,index) => (
            
              <SwiperSlide key={`${e.day}-${index}`}>
                <div className="mt-2  flex flex-col items-center  space-y-2    ">
                  <p className="">{e.day}</p>
                  <i className="fa-solid fa-sun text-orange-400 text-[20px]"></i>
                  <p className=" ">{e.tem}</p>
                </div>
              </SwiperSlide>
            
          ))}
        </Swiper>
      }
    </div>
  );
};

export default Slider;
