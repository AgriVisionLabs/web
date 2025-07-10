import React from 'react';

const DateDisplay = ({ dateStr }) => {
    const date = new Date(dateStr);

    const day = date.getDate();
    const monthShort = date.toLocaleString('en-US', { month: 'short' }); // eg. "May"
    const year = date.getFullYear();

    return (
        day&&monthShort&&year?<span>
        {monthShort} {day} ,{year}
        </span>:<span>No date</span>
    );
};

export default DateDisplay;