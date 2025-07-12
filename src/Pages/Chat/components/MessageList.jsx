/* eslint-disable react/prop-types */
import { Message } from "./Message";
import { useEffect, useRef } from "react";
export const MessageList = ({ messages, currentUserID }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto space-y-8 p-2 custom-scrollbar">
      {[...messages].map((msg, i) => (
        <Message
          key={i}
          message={msg}
          isCurrentUser={msg.senderID === currentUserID}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
