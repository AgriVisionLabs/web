import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const WeeklyWeather = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    const lat = 30.5965; // Ismailia
    const lon = 32.2715;

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const weatherMap = {
    0: { text: "Clear sky", icon: "☀️" },
    1: { text: "Mainly clear", icon: "🌤️" },
    2: { text: "Partly cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Fog", icon: "🌫️" },
    48: { text: "Depositing rime fog", icon: "🌫️❄️" },
    51: { text: "Light drizzle", icon: "🌦️" },
    53: { text: "Moderate drizzle", icon: "🌦️" },
    55: { text: "Dense drizzle", icon: "🌧️" },
    61: { text: "Slight rain", icon: "🌧️" },
    63: { text: "Moderate rain", icon: "🌧️" },
    65: { text: "Heavy rain", icon: "🌧️" },
    66: { text: "Freezing rain", icon: "🌨️" },
    71: { text: "Slight snow", icon: "🌨️" },
    73: { text: "Moderate snow", icon: "❄️" },
    75: { text: "Heavy snow", icon: "❄️" },
    95: { text: "Thunderstorm", icon: "⛈️" },
    99: { text: "Hail", icon: "🌩️" },
    };

    async function getWeather() {
        try {
        const res = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
        );
        setData(res.data.daily);
        setLoading(false);
        } catch (error) {
        console.error("Failed to fetch weather data", error);
        setLoading(false);
        }
    }

    useEffect(() => {
        getWeather();
    }, []);

return (
    <div className=" w-[570px] shadow-md px-3 pt-4 pb-[6px] rounded-xl border-2 border-[#0d121c21] ">
        <h2 className="font-[500] text-[20px] mb-1">Weather Forecast</h2>
        {loading ? (
            <p className="text-center">Loading...</p>
        ) : (
            <Swiper
            spaceBetween={16}
            breakpoints={{
                320: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
            }}
            >
            {data.time.map((date, index) => {
                const day = new Date(date);
                const dayName = days[day.getDay()];
                const code = data.weathercode[index];
                const weather = weatherMap[code] || { text: "Unknown", icon: "❔" };

                return (
                <SwiperSlide key={index}>
                    <div className={`p-2 rounded text-black  text-center ${index==0?"bg-mainColor/10":""} `}>
                    <h3 className={`font-semibold mb-[2px] ${index==0?"text-mainColor":""}`}>{dayName}</h3>
                    <div className="text-3xl mb-[2px]">{weather.icon}</div>
                    <p className="text-sm mb-[2px]">{weather.text}</p>
                    <p>
                        {data.temperature_2m_max[index]}° / {data.temperature_2m_min[index]}°
                    </p>
                    </div>
                </SwiperSlide>
                );
            })}
            </Swiper>
        )}
        </div>
    );
};

export default WeeklyWeather;
