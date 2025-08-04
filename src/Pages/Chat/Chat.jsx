/* eslint-disable react/prop-types */
import {
  MessageSquareMore,
  X,
  Plus,
  Users,
  MoreVertical,
  Trash2,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import ChatSidebar from "./components/ChatSidebar";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { chatService } from "../../services/chatService";
import { chatApiService } from "../../services/chatApiService";
import toast from "react-hot-toast";

/**
 * Chat Component - Conversation Loading Flow:
 * 1. Initial Load: Conversations are loaded from GET /conversations API endpoint
 * 2. Real-time Updates: New conversations are added via SignalR onNewConversation events
 * 3. Duplicate Prevention: Processed IDs are tracked to prevent duplicate conversations
 */

const Chat = () => {
  const { baseUrl } = useContext(AllContext);
  const { token, userId } = useContext(userContext);
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  // Track processed IDs to prevent duplicates across re-renders
  const processedConversationIds = useRef(new Set());
  const processedMessageIds = useRef(new Set());

  // Helper function to get sender name from message
  const getSenderName = (message, conversationMembers) => {
    // Return provided sender name if exists
    if (message.senderName) {
      return message.senderName;
    }

    // If this is current user
    if (message.senderId === userId) {
      return "You";
    }

    // Try to find sender name from conversation members
    if (conversationMembers && message.senderId) {
      const sender = conversationMembers.find(
        (member) =>
          member.userId === message.senderId || member.id === message.senderId
      );
      if (sender) {
        return (
          sender.name || sender.firstName || sender.email || sender.username
        );
      }
    }

    // Fallback to partial senderId or Unknown
    return `User ${message.senderId?.substring(0, 8) || "Unknown"}`;
  };

  // Function to get the display name for a conversation
  const getConversationDisplayName = (conversation) => {
    // For group conversations, use the conversation name
    if (conversation.isGroup) {
      return conversation.name;
    }

    // For 1-to-1 conversations, find the other user's name
    if (conversation.membersList && conversation.membersList.length === 2) {
      const otherUser = conversation.membersList.find(
        (member) => member.id !== userId && member.email !== userId
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

  // Initialize chat service and API service
  useEffect(() => {
    if (!token || !userId || !baseUrl) return;

    let isMounted = true;
    let initializationPromise = null;

    const initializeChat = async () => {
      // Prevent multiple simultaneous initialization attempts
      if (initializationPromise) {
        return initializationPromise;
      }

      initializationPromise = (async () => {
        try {
          if (!isMounted) return false;

          setIsInitializing(true);

          // Configure API service
          chatApiService.setConfig(baseUrl, token);

          // Small delay to ensure component is fully mounted
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (!isMounted) return false;

          // Start SignalR connection
          const connected = await chatService.startConnection(token, baseUrl);

          console.log("🔍 Connection result:", connected);
          console.log("🔍 isMounted:", isMounted);

          if (!isMounted) return false;

          if (connected) {
            console.log("✅ Chat service connected successfully");
            console.log("Connected to both hubs (messages & conversations).");

            // Set up event listeners for real-time updates
            console.log("🔧 Setting up SignalR event listeners...");
            setupEventListeners();

            // Load initial conversations from API
            console.log("📥 Loading initial conversations from API...");
            await loadConversations();

            setIsInitializing(false);
            return true;
          } else {
            console.log("❌ Failed to connect to chat service");
            setIsInitializing(false);
            return false;
          }
        } catch (error) {
          if (!isMounted) return false;

          console.error("Error initializing chat:", error);
          setIsInitializing(false);
          return false;
        } finally {
          initializationPromise = null;
          setIsInitializing(false);
        }
      })();

      return initializationPromise;
    };

    // Start initialization
    initializeChat().catch((error) => {
      console.error("Failed to initialize chat:", error);
    });

    // Cleanup on unmount
    return () => {
      console.log("🧹 Chat component unmounting, cleaning up...");
      isMounted = false;

      // Clean up listeners
      chatService.removeAllListeners();

      // Stop connection if not in progress and no other components are using it
      setTimeout(() => {
        if (!chatService.connectionInProgress) {
          chatService.stopConnection();
        }
      }, 100);
    };
  }, [token, userId, baseUrl]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChatMenu && !event.target.closest(".chat-menu-container")) {
        setShowChatMenu(false);
      }
      if (
        showMembersModal &&
        !event.target.closest(".members-modal-container")
      ) {
        setShowMembersModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatMenu, showMembersModal]);

  const setupEventListeners = () => {
    console.log("🎧 Setting up conversation event listeners...");
    // Use refs to track processed IDs across re-renders

    // Real-time conversation events
    chatService.onNewConversation((conversation) => {
      console.log(
        "📥 NewConversation received via SignalR (real-time):",
        conversation
      );

      if (processedConversationIds.current.has(conversation.id)) {
        console.log(
          "🔄 Duplicate conversation detected, skipping...",
          conversation.id
        );
        return;
      }
      processedConversationIds.current.add(conversation.id);

      setConversations((prev) => {
        // Double-check for existing conversation
        const existingIndex = prev.findIndex((c) => c.id === conversation.id);
        if (existingIndex !== -1) {
          console.log("🔄 Updating existing conversation:", conversation.id);
          // Update existing conversation
          return prev.map((c) => (c.id === conversation.id ? conversation : c));
        } else {
          console.log(
            "✅ Adding new conversation to top of list:",
            conversation.id
          );
          // Add new conversation to the top of the list
          return [conversation, ...prev];
        }
      });
    });

    chatService.onConversationUpdated((conversation) => {
      console.log("🔄 ConversationUpdated received via SignalR:", conversation);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversation.id ? conversation : c))
      );
    });

    chatService.onConversationRemoved((conversationId) => {
      console.log(
        "❌ ConversationRemoved received via SignalR:",
        conversationId
      );
      processedConversationIds.current.delete(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (selectedChat?.id === conversationId) {
        setSelectedChat(null);
        setMessages([]);
      }
    });

    // Message events
    chatService.onNewMessage((message) => {
      console.log("New Message Received:");
      console.log(message); // Log the full message object like the C# code

      if (processedMessageIds.current.has(message.id)) {
        console.log("🔄 Duplicate message detected, skipping...", message.id);
        return;
      }
      processedMessageIds.current.add(message.id);

      setMessages((prev) => {
        // Double-check for existing message
        const existingIndex = prev.findIndex((m) => m.id === message.id);
        if (existingIndex !== -1) {
          console.log(
            "🔄 Message already exists in state, updating...",
            message.id
          );
          return prev.map((m) => (m.id === message.id ? message : m));
        } else {
          // Add new message in chronological order
          console.log("✅ Adding new message to state:", message.id);
          const newMessages = [...prev, message];

          // Sort to maintain chronological order (oldest first, newest last)
          return newMessages.sort(
            (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
          );
        }
      });

      // Show notification if message is not from current user
      if (message.senderId !== userId) {
        // Get current conversations to find the conversation members
        setConversations((currentConversations) => {
          const conversation = currentConversations.find(
            (c) => c.id === message.conversationId
          );
          const senderName = getSenderName(message, conversation?.membersList);
          console.log(senderName);

          return currentConversations; // Return unchanged conversations
        });
      }
    });

    chatService.onMessageDeleted((messageId) => {
      processedMessageIds.current.delete(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    chatService.onMessageEdited((message) => {
      setMessages((prev) => {
        const updatedMessages = prev.map((m) =>
          m.id === message.id ? message : m
        );
        // Re-sort to maintain chronological order in case edit changed timestamp
        return updatedMessages.sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
        );
      });
    });

    console.log("✅ All SignalR event listeners registered successfully");
  };

  // Load initial conversations from GET /conversations API endpoint
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const conversationsData = await chatApiService.getConversations();
      setConversations(conversationsData);

      // Clear processed IDs when loading conversations to ensure fresh state
      processedConversationIds.current.clear();
      processedMessageIds.current.clear();

      console.log(
        "✅ Conversations loaded from API:",
        conversationsData.length
      );
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const messagesData = await chatApiService.getMessages(conversationId);

      // Sort messages chronologically (oldest first, newest last)
      const sortedMessages = messagesData.sort(
        (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
      );

      setMessages(sortedMessages);

      // Subscribe to real-time updates for this conversation
      console.log(`Subscribing to conversation: ${conversationId}`);
      await chatService.subscribeToConversation(conversationId);
      console.log(
        `✅ Successfully subscribed to conversation: ${conversationId}`
      );
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = async (chat) => {
    // Unsubscribe from previous conversation if any
    if (selectedChat) {
      await chatService.unsubscribeFromConversation(selectedChat.id);
    }

    setSelectedChat(chat);
    setMessages([]);

    if (chat) {
      await loadMessages(chat.id);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    try {
      // Send message via API (SignalR will handle the real-time update)
      await chatApiService.sendMessage(selectedChat.id, content);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleCreateConversation = async (name, membersList) => {
    try {
      // For 1-to-1 chats, generate a name from the member email if no name provided
      let conversationName = name;
      if (!conversationName && membersList.length === 1) {
        conversationName = membersList[0].split("@")[0]; // Use email username as conversation name
      }

      const newConversation = await chatApiService.createConversation({
        name: conversationName,
        membersList,
      });

      // The conversation will be added via SignalR event
      setShowNewChatModal(false);

      if (membersList.length === 1) {
        toast.success("1-to-1 conversation created successfully");
      } else {
        toast.success("Group conversation created successfully");
      }

      return newConversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
      throw error;
    }
  };

  const handleClearChat = async () => {
    if (!selectedChat) return;

    try {
      // Call the clear chat API
      await chatApiService.clearConversation(selectedChat.id);

      // Clear messages from state
      setMessages([]);

      // Close menu and show success message
      setShowChatMenu(false);
      toast.success("Chat cleared successfully");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Failed to clear chat");
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedChat) return;

    try {
      // Call the delete conversation API
      await chatApiService.deleteConversation(selectedChat.id);

      // Remove conversation from state and deselect
      setConversations((prev) => prev.filter((c) => c.id !== selectedChat.id));
      setSelectedChat(null);
      setMessages([]);

      // Close menu and show success message
      setShowChatMenu(false);
      toast.success("Conversation deleted successfully");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  const handleShowMembers = () => {
    setShowChatMenu(false);
    setShowMembersModal(true);
  };

  const formatMessageForDisplay = (message) => {
    return {
      id: message.id,
      msg: message.content,
      senderID: message.senderId,
      senderName: getSenderName(message, selectedChat?.membersList),
      time: new Date(message.sentAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sentAt: message.sentAt,
    };
  };

  const displayMessages = messages.map(formatMessageForDisplay);

  return (
    <div className="flex bg-gray-50 h-screen w-full overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
        <div
          className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ChatSidebar
            conversations={conversations}
            setSelectedChat={(chat) => {
              handleChatSelect(chat);
              setIsMobileSidebarOpen(false);
            }}
            selectedChat={selectedChat}
            onNewChat={() => setShowNewChatModal(true)}
            loading={loadingConversations}
            isMobile={true}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop Sidebar - Fixed width for better desktop experience */}
      <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0 border-r border-gray-200 bg-white">
        <ChatSidebar
          conversations={conversations}
          setSelectedChat={handleChatSelect}
          selectedChat={selectedChat}
          onNewChat={() => setShowNewChatModal(true)}
          loading={loadingConversations}
        />
      </div>

      {/* Main Chat Area */}
      {isInitializing ? (
        <main className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="text-center max-w-md mx-auto px-6">
            {/* Logo or Icon */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquareMore size={40} className="text-gray-400" />
            </div>

            {/* Initialization Loading Content */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Initializing Chat
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Setting up your chat connection and loading conversations...
            </p>

            {/* Loading Animation */}
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-mainColor border-t-transparent"></div>
            </div>

            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-mainColor rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-mainColor rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-mainColor rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </main>
      ) : selectedChat ? (
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Chat Header */}
          <header className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-[45px] transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Chat Avatar and Info */}
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-mainColor text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getConversationDisplayName(selectedChat)
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-semibold text-gray-900 truncate">
                    {getConversationDisplayName(selectedChat)}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {selectedChat.membersList?.length || 0} member
                    {selectedChat.membersList?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Back to App Button */}
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-[45px] transition-colors duration-200 text-gray-500 hover:text-gray-700"
                title="Back to App"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Chat Menu */}
              <div className="relative chat-menu-container">
                <button
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className="p-2 hover:bg-gray-100 rounded-[45px] transition-colors duration-200 text-gray-500 hover:text-gray-700"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {showChatMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
                    {/* Clear Chat - Available for all chats */}
                    <button
                      onClick={handleClearChat}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Chat</span>
                    </button>

                    {/* Group Chat Options - Only show for groups (more than 2 members) */}
                    {selectedChat?.membersList &&
                      selectedChat.membersList.length > 2 && (
                        <>
                          <hr className="my-1 border-gray-200" />

                          {/* Members */}
                          <button
                            onClick={handleShowMembers}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Members</span>
                          </button>

                          {/* Delete Conversation */}
                          <button
                            onClick={handleDeleteConversation}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Conversation</span>
                          </button>
                        </>
                      )}
                  </div>
                )}
              </div>

              {/* Close Chat Button */}
              <button
                onClick={() => handleChatSelect(null)}
                className="p-2 hover:bg-gray-100 rounded-[45px] transition-colors duration-200 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <section className="flex-1 flex flex-col min-h-0 bg-gray-50 overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-mainColor border-t-transparent mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Loading Conversation
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Please wait while we load the messages...
                  </p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-mainColor rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-mainColor rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-mainColor rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <MessageList
                    messages={displayMessages}
                    currentUserID={userId}
                    conversationId={selectedChat?.id}
                  />
                </div>

                {/* Message Input Area */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                  <MessageInput onSend={handleSendMessage} />
                </div>
              </>
            )}
          </section>
        </main>
      ) : (
        /* Empty State */
        <main className="flex-1 flex flex-col items-center justify-center bg-white">
          {/* Mobile Menu Button for empty state */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-[45px] transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Back to App Button for empty state */}
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-[45px] transition-colors duration-200 text-gray-500 hover:text-gray-700"
            title="Back to App"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center max-w-md mx-auto px-6">
            {/* Logo or Icon */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquareMore size={40} className="text-gray-400" />
            </div>

            {/* Empty State Content */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Welcome to Chat
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Select a conversation from the sidebar to start messaging, or
              create a new conversation to get started.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-[45px] transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft size={18} />
                <span>Back to App</span>
              </button>

              <button
                onClick={() => setShowNewChatModal(true)}
                className="bg-mainColor hover:bg-mainColor/90 text-white font-medium px-6 py-3 rounded-[45px] transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Plus size={18} />
                <span>New Conversation</span>
              </button>
            </div>

            {/* Additional Help Text - Removed Pro tip */}
          </div>
        </main>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}

      {/* Members Modal */}
      {showMembersModal && (
        <MembersModal
          conversation={selectedChat}
          onClose={() => setShowMembersModal(false)}
        />
      )}
    </div>
  );
};

// New Chat Modal Component
const NewChatModal = ({ onClose, onCreateConversation }) => {
  const [step, setStep] = useState(1);
  const [memberEmails, setMemberEmails] = useState("");
  const [conversationName, setConversationName] = useState("");
  const [creating, setCreating] = useState(false);
  const [membersList, setMembersList] = useState([]);

  const handleStep1Submit = (e) => {
    e.preventDefault();

    if (!memberEmails.trim()) {
      toast.error("Please enter at least one member email");
      return;
    }

    const emails = memberEmails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    if (emails.length === 0) {
      toast.error("Please enter valid email addresses");
      return;
    }

    setMembersList(emails);

    // If only one recipient (1-to-1 chat), create directly
    if (emails.length === 1) {
      handleCreateConversation("", emails);
    } else {
      // Multiple recipients, go to step 2 for naming
      setStep(2);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!conversationName.trim()) {
      toast.error("Please enter a conversation name");
      return;
    }

    if (conversationName.trim().length < 3) {
      toast.error("Conversation name must be at least 3 characters long");
      return;
    }

    await handleCreateConversation(conversationName.trim(), membersList);
  };

  const handleCreateConversation = async (name, members) => {
    try {
      setCreating(true);

      await onCreateConversation(name, members);

      // Reset form
      setStep(1);
      setMemberEmails("");
      setConversationName("");
      setMembersList([]);
    } catch (error) {
      // Error is already handled in the parent component
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setConversationName("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {step === 1 ? "Add Members" : "Name Your Group"}
          </h2>
          <X className="cursor-pointer hover:text-red-500" onClick={onClose} />
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Emails (comma-separated)
              </label>
              <textarea
                value={memberEmails}
                onChange={(e) => setMemberEmails(e.target.value)}
                placeholder="user1@example.com, user2@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor resize-none"
                rows="3"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Add one email for 1-to-1 chat, or multiple emails for group chat
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-[45px] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mainColor text-white rounded-[45px] hover:bg-mainColor/90 flex items-center space-x-2"
              >
                <Users size={16} />
                <span>Next</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                placeholder="Enter group name (minimum 3 characters)"
                className="w-full px-3 py-2 border border-gray-300 rounded-[45px] focus:outline-none focus:ring-2 focus:ring-mainColor"
                required
                minLength={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Members: {membersList.join(", ")}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-[45px] hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-mainColor text-white rounded-[45px] hover:bg-mainColor/90 disabled:opacity-50 flex items-center space-x-2"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Create Group</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Members Modal Component
const MembersModal = ({ conversation, onClose }) => {
  const [openMemberMenu, setOpenMemberMenu] = useState(null);
  const { userId } = useContext(userContext);

  // Check if current user is admin
  const currentUserMember = conversation.membersList.find(
    (m) => (m.id || m.userId) === userId
  );
  const isCurrentUserAdmin = currentUserMember?.isAdmin || false;

  // Close member menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMemberMenu && !event.target.closest(".member-menu-container")) {
        setOpenMemberMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMemberMenu]);

  if (!conversation || !conversation.membersList) {
    return null;
  }

  const getMemberInitials = (member) => {
    const name = member.name || member.firstName || member.email || "Unknown";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberDisplayName = (member) => {
    return (
      member.name ||
      (member.firstName && member.lastName
        ? `${member.firstName} ${member.lastName}`
        : member.firstName) ||
      member.email ||
      "Unknown User"
    );
  };

  const handleMakeAdmin = async (member) => {
    try {
      await chatApiService.promoteMemberToAdmin(
        conversation.id,
        member.id || member.userId
      );
      toast.success(`${getMemberDisplayName(member)} promoted to admin`);
      setOpenMemberMenu(null);
      // Note: UI will be updated via SignalR ConversationUpdated event
    } catch (error) {
      console.error("Error promoting member to admin:", error);
      toast.error("Failed to promote member to admin");
    }
  };

  const handleRemoveMember = async (member) => {
    try {
      await chatApiService.removeMemberFromConversation(
        conversation.id,
        member.id || member.userId
      );
      toast.success(`${getMemberDisplayName(member)} removed from group`);
      setOpenMemberMenu(null);
      // Note: UI will be updated via SignalR ConversationUpdated event
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  const canRemoveMember = (member) => {
    // Only admins can remove members, and you can't remove yourself
    return isCurrentUserAdmin && (member.id || member.userId) !== userId;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden members-modal-container">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Group Members ({conversation.membersList.length})
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-[45px] transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Members List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {conversation.membersList.map((member, index) => {
            const totalMembers = conversation.membersList.length;
            const isInBottomHalf = index >= Math.floor(totalMembers / 2);

            return (
              <div
                key={member.id || member.userId || index}
                className="flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Member Avatar */}
                <div className="w-12 h-12 bg-mainColor text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getMemberInitials(member)}
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {getMemberDisplayName(member)}
                      {(member.id || member.userId) === userId && (
                        <span className="text-sm text-gray-500 ml-1">
                          (You)
                        </span>
                      )}
                    </h3>
                    {member.isAdmin && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Admin
                      </span>
                    )}
                  </div>
                  {member.email && (
                    <p className="text-sm text-gray-500 truncate">
                      {member.email}
                    </p>
                  )}
                </div>

                {/* Member Menu - Only show if there are actions available */}
                {((!member.isAdmin &&
                  (member.id || member.userId) !== userId) ||
                  canRemoveMember(member)) && (
                  <div className="relative flex-shrink-0 member-menu-container">
                    <button
                      onClick={() =>
                        setOpenMemberMenu(
                          openMemberMenu === (member.id || member.userId)
                            ? null
                            : member.id || member.userId
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-[45px] transition-colors duration-200 text-gray-500 hover:text-gray-700"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Member Dropdown Menu - Dynamic positioning */}
                    {openMemberMenu === (member.id || member.userId) && (
                      <div
                        className={`absolute right-0 ${
                          isInBottomHalf ? "bottom-full mb-1" : "top-full mt-1"
                        } bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-40 z-20`}
                      >
                        {!member.isAdmin &&
                          (member.id || member.userId) !== userId && (
                            <button
                              onClick={() => handleMakeAdmin(member)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Make Admin</span>
                            </button>
                          )}

                        {canRemoveMember(member) && (
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove Member</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chat;
