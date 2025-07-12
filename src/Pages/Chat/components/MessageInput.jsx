/* eslint-disable react/prop-types */
import { Send } from "lucide-react";
import { useState } from "react";

export const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };
  return (
    <form
      //   onSubmit={handleSubmit}
      className="w-full mx-auto flex space-x-2 items-center"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        className="block w-full px-4 py-2.5 text-sm border border-[#D1D5DB] text-[#616161] placeholder:text-[#616161] rounded-xl bg-white outline-none"
      />
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-mainColor w-12 h-12 rounded-full flex items-center justify-center"
      >
        <Send className="text-white" />
      </button>
    </form>
  );
};
