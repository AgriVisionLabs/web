/* eslint-disable react/prop-types */

import { useState } from "react";

const ChatSidebar = ({ conversations, setSelectedChat, selectedChat }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <aside className="py-4 h-full flex flex-col items-center lg:w-[25%] xl:w-[21%] border-r space-y-8">
      <header className="px-4 space-y-8 w-full">
        <img src="/blackLogo.png" className="w-[120px] h-[37px] mx-auto" />

        <form className="w-full mx-auto">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only "
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-3.5 h-3.5 text-[#9F9F9F] "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="default-search"
              className="block w-full px-4 py-2.5 ps-10 text-sm text-[#616161] placeholder:text-[#616161] rounded-xl bg-[#F9FAFB] outline-none"
              placeholder="Search Conversations..."
              required
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </header>

      <div className="flex-grow overflow-y-auto flex flex-col items-center space-y-2 px-0 w-full custom-scrollbar">
        {conversations
          .filter((chat) =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((chat, index) => {
            const isSelected = selectedChat?.id === chat.id;

            return (
              <div
                onClick={() => setSelectedChat(chat)}
                key={index}
                className={`relative flex space-x-3 items-start w-full py-3 px-3 cursor-pointer ${
                  isSelected ? "bg-[#F0FDF4]" : "bg-transparent"
                }`}
              >
                <span className="bg-mainColor text-white text-sm font-semibold h-11 w-11 rounded-full flex items-center justify-center">
                  {chat.name.charAt(0)}
                </span>
                <div className="flex flex-col max-w-[200px] space-y-1">
                  <h3 className="font-semibold">{chat.name}</h3>
                  <p className="truncate text-sm text-gray-500 w-3/4">
                    {chat.message}
                  </p>
                </div>
                <span className="absolute -t right-2 text-[#6B7280] text-sm ">
                  {chat.time}
                </span>
              </div>
            );
          })}
      </div>
    </aside>
  );
};

export default ChatSidebar;
