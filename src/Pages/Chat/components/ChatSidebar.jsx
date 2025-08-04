/* eslint-disable react/prop-types */

import { useState, useContext } from "react";
import { Plus, Search, Users, MessageCircle, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../Context/User.context";

const ChatSidebar = ({ 
  conversations, 
  setSelectedChat, 
  selectedChat, 
  onNewChat, 
  loading,
  isMobile,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { userId } = useContext(userContext);

  // Function to get the display name for a conversation
  const getConversationDisplayName = (conversation) => {
    // For group conversations, use the conversation name
    if (conversation.isGroup) {
      return conversation.name;
    }
    
    // For 1-to-1 conversations, find the other user's name
    if (conversation.membersList && conversation.membersList.length === 2) {
      const otherUser = conversation.membersList.find(member => 
        member.id !== userId && member.email !== userId
      );
      
      if (otherUser) {
        // Return full name if available, otherwise use email
        if (otherUser.firstName && otherUser.lastName) {
          return `${otherUser.firstName} ${otherUser.lastName}`;
        } else if (otherUser.firstName) {
          return otherUser.firstName;
        } else if (otherUser.userName) {
          return otherUser.userName;
        } else {
          return otherUser.email;
        }
      }
    }
    
    // Fallback to conversation name
    return conversation.name;
  };

  const filteredConversations = conversations.filter(conversation => {
    const displayName = getConversationDisplayName(conversation);
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatLastMessage = (conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const content = conversation.lastMessage.content || '';
    return content.length > 45 ? content.substring(0, 45) + '...' : content;
  };

  const formatLastMessageTime = (conversation) => {
    if (!conversation.lastMessage?.sentAt) return '';
    
    const messageDate = new Date(conversation.lastMessage.sentAt);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d`;
      } else {
        return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
  };

  return (
    <aside className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-center mb-6 relative">
          {/* Left side buttons */}
          <div className="absolute left-0 flex items-center space-x-2">
            {/* Back to App button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Back to App"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            
            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
          
          {/* Centered Logo */}
          <img src="/blackLogo.png" className="w-[140px] h-[43px]" alt="Agrivision Logo" />
          
          {/* Add Button positioned to the right but vertically aligned */}
          <button
            onClick={onNewChat}
            className="absolute right-0 w-7 h-7 bg-mainColor hover:bg-mainColor/90 text-white rounded-[45px] transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 font-bold" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-[45px] focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors duration-200 bg-gray-50 hover:bg-white focus:bg-white"
          />
        </div>
      </header>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 pt-2">
        {/* Show loading when explicitly loading OR when conversations are empty (prevents "no conversations" flash) */}
        {loading || (conversations.length === 0 && !searchTerm) ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-mainColor border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Conversations</h3>
              <p className="text-sm text-gray-600">Please wait while we fetch your conversations...</p>
              <div className="mt-4 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-mainColor rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-mainColor rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-mainColor rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Start by creating your first conversation to begin chatting with your team.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedChat?.id === conversation.id
                    ? 'bg-mainColor/10 shadow-sm border-l-4 border-mainColor'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                      selectedChat?.id === conversation.id
                        ? 'bg-mainColor text-white'
                        : 'bg-gray-100 text-gray-700 group-hover:bg-mainColor group-hover:text-white'
                    }`}>
                      {getConversationDisplayName(conversation).charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold truncate transition-colors duration-200 ${
                        selectedChat?.id === conversation.id
                          ? 'text-gray-900'
                          : 'text-gray-800 group-hover:text-gray-900'
                      }`}>
                        {getConversationDisplayName(conversation)}
                      </h4>
                      {formatLastMessageTime(conversation) && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatLastMessageTime(conversation)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                        {formatLastMessage(conversation)}
                      </p>
                      
                      {/* Members count */}
                      <div className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0">
                        <Users className="w-3 h-3" />
                        <span>{conversation.membersList?.length || 0}</span>
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {conversation.unreadCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mainColor text-white">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
