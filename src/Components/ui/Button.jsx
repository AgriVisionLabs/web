/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export const Button = ({ children, className, link, ...props }) => {
  return (
    <Link
      to={link}
      className={`${className} rounded-full text-sm font-semibold min-w-[90px] h-10 text-white capitalize flex items-center justify-center`}
      {...props}
    >
      {children}
    </Link>
  );
};
