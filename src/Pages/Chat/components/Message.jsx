/* eslint-disable react/prop-types */
export const Message = ({ message, isCurrentUser }) => (
  <div
    className={`relative  flex ${
      isCurrentUser ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`rounded-2xl px-4 py-2 max-w-[70%] text-base font-semibold ${
        isCurrentUser
          ? "bg-mainColor text-white rounded-br-none"
          : "bg-white text-[#0D121C] border rounded-bl-none"
      }`}
    >
      {message.msg}
    </div>
    <span className="absolute px-1 -bottom-6 text-[#616161] text-sm">
      {message.time}
    </span>
  </div>
);
