/* eslint-disable react/prop-types */
export const Message = ({ message, isCurrentUser }) => {
  const formatTime = (time) => {
    // If time is already formatted as string, return it
    if (typeof time === 'string' && time.includes(':')) {
      return time;
    }
    
    // Otherwise, format the date/time
    try {
      const date = new Date(time);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return time;
    }
  };

  const getSenderInitials = (senderName) => {
    if (!senderName) return '?';
    return senderName.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        {/* Sender info for non-current users */}
        {!isCurrentUser && (
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              {getSenderInitials(message.senderName)}
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {message.senderName || 'Unknown'}
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`relative rounded-2xl px-4 py-2 text-base font-medium shadow-sm ${
            isCurrentUser
              ? "bg-mainColor text-white rounded-br-none"
              : "bg-white text-[#0D121C] border border-gray-200 rounded-bl-none"
          }`}
        >
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {message.msg}
          </div>
          
          {/* Message time */}
          <div className={`text-xs mt-1 ${
            isCurrentUser 
              ? 'text-white/70 text-right' 
              : 'text-gray-500 text-right'
          }`}>
            {formatTime(message.time)}
          </div>
        </div>
      </div>
    </div>
  );
};
