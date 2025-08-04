import React from 'react';

const ToggleSwitch = ({ 
    enabled, 
    onClick, 
    disabled = false, 
    className = "",
    size = "default" // "default" or "small"
}) => {
    // Size configurations
    const sizeConfig = {
        default: {
            container: "w-[47px] h-[25px]",
            circle: "h-[20px] w-[20px]",
            translate: "translate-x-[22px]"
        },
        small: {
            container: "w-[38px] h-[20px]",
            circle: "h-[16px] w-[16px]",
            translate: "translate-x-[18px]"
        }
    };

    const config = sizeConfig[size] || sizeConfig.default;

    return (
        <div 
            className={`${config.container} rounded-2xl flex items-center px-1 transition-all duration-300 ${
                disabled 
                    ? 'bg-gray-200 cursor-not-allowed' 
                    : enabled 
                        ? 'bg-mainColor cursor-pointer' 
                        : 'bg-[#5e5e5f21] cursor-pointer'
            } ${className}`}
            onClick={disabled ? undefined : onClick}
        >
            <div 
                className={`${config.circle} bg-white rounded-full transition-all duration-300 ${
                    enabled ? config.translate : 'translate-x-0'
                }`}
            ></div>
        </div>
    );
};

export default ToggleSwitch; 