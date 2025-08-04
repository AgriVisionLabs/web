/* eslint-disable react/prop-types */
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";

export const MessageInput = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !sending && !disabled) {
      setSending(true);
      try {
        await onSend(input.trim());
        setInput("");
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isSubmitDisabled = !input.trim() || sending || disabled;

  return (
    <div className="px-2 py-2 bg-white">
      <form onSubmit={handleSubmit} className="w-full mx-auto flex space-x-2 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Connecting..." : "Type a message..."}
            disabled={disabled}
            className={`block w-full px-4 py-2.5 text-sm border resize-none rounded-[45px] outline-none transition-all duration-200 min-h-[44px] max-h-32 ${
              disabled 
                ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-white border-[#D1D5DB] text-[#616161] placeholder:text-[#616161] focus:border-mainColor focus:ring-2 focus:ring-mainColor/20'
            }`}
            rows="1"
            style={{
              height: 'auto',
              minHeight: '44px',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          
          {/* Character count (optional) */}
          {input.length > 0 && (
            <div className="absolute -bottom-5 right-0 text-xs text-gray-400">
              {input.length}/1000
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
            isSubmitDisabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-mainColor hover:bg-mainColor/90 hover:scale-105 active:scale-95'
          }`}
        >
          {sending ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </form>
      
      {/* Connection status indicator */}
      {disabled && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            Waiting for connection...
          </span>
        </div>
      )}
    </div>
  );
};
