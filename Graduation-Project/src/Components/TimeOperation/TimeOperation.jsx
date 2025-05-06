import React from 'react';

const TimeOperation = (children) => {
    const [hours, minutes, seconds] = children.timeStr.split(':').map(Number);
    console.log(children.timeStr)
    const plural = (value, unit) => {
         return `${value} ${unit}${value !== 1 ? 's' : ''}`;
    };
    
    return (
        <p className='text-black font-semibold'>
            {plural(hours, 'hour')} {plural(minutes, 'minute')} {String(plural(seconds, 'second')).split(".")[0]}
        </p>
    );
}

export default TimeOperation;
