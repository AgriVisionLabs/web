/* eslint-disable react/prop-types */
export const Button = ({ children, className, link, ...props }) => {
  return (
    <a
      href={link}
      type="button"
      className={`${className} rounded-full text-sm font-semibold min-w-[90px] h-10 text-white capitalize flex items-center justify-center`}
      {...props}
    >
      {children}
    </a>
  );
};
