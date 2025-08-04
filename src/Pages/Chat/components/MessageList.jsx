/* eslint-disable react/prop-types */
import { Message } from "./Message";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

/**
 * MessageList Component - Auto-scroll Behavior:
 * 1. Instantly positions at bottom when a conversation is opened (no visible scroll)
 * 2. Detects conversation changes via conversationId prop
 * 3. Auto-scrolls for new messages when user is close to bottom
 * 4. Shows scroll button when user is far from bottom
 */

export const MessageList = ({ messages, currentUserID, conversationId }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const previousMessageCount = useRef(messages.length);
  const previousMessagesRef = useRef([]);
  const conversationIdRef = useRef(null);

  // Check if user is at the bottom of the container
  const checkIfAtBottom = useCallback(() => {
    if (!containerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Two different thresholds for different behaviors
    const strictBottomThreshold = 50; // Very close to bottom
    const autoScrollThreshold = 200; // Close enough to auto-scroll
    
    const isAtStrictBottom = distanceFromBottom <= strictBottomThreshold;
    const isCloseToBottom = distanceFromBottom <= autoScrollThreshold;
    
    setIsUserAtBottom(isAtStrictBottom);
    
    return { isAtStrictBottom, isCloseToBottom, distanceFromBottom };
  }, []);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
      setIsUserAtBottom(true);
    }
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const { isAtStrictBottom, isCloseToBottom, distanceFromBottom } = checkIfAtBottom();
    
    // Hide scroll button when user reaches close to bottom
    if (isCloseToBottom && showScrollButton) {
      console.log('📋 MessageList: User scrolled close to bottom, hiding scroll button');
      setShowScrollButton(false);
    }
    
    // Optional: Log scroll position for debugging
    if (distanceFromBottom > 500) {
      // Only log when user is far from bottom to avoid spam
      console.log('📋 MessageList: User scroll position:', Math.round(distanceFromBottom), 'px from bottom');
    }
  }, [checkIfAtBottom, showScrollButton]);

  // Effect to handle new messages and conversation changes
  useEffect(() => {
    const currentMessageCount = messages.length;
    const hasNewMessages = currentMessageCount > previousMessageCount.current;
    const isInitialLoad = previousMessageCount.current === 0 && currentMessageCount > 0;
    
    // Check if this is a conversation change by comparing conversation IDs
    const currentConversationId = messages.length > 0 ? messages[0]?.conversationId : null;
    const isConversationChange = currentConversationId && 
      currentConversationId !== conversationIdRef.current;
    
    console.log('📋 MessageList: Messages updated', {
      currentCount: currentMessageCount,
      previousCount: previousMessageCount.current,
      hasNewMessages,
      isInitialLoad,
      isConversationChange
    });
    
    // Always scroll to bottom on initial load or conversation change
    if (isInitialLoad || isConversationChange) {
      previousMessageCount.current = currentMessageCount;
      previousMessagesRef.current = [...messages];
      conversationIdRef.current = currentConversationId;
      console.log('📋 MessageList: Initial load or conversation change, scrolling to bottom');
      
      // Use requestAnimationFrame to ensure DOM is ready, then scroll instantly
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        setIsUserAtBottom(true);
        setShowScrollButton(false);
      });
      return;
    }

    // Handle new messages in existing conversation
    if (hasNewMessages) {
      previousMessageCount.current = currentMessageCount;
      previousMessagesRef.current = [...messages];
      conversationIdRef.current = currentConversationId;
      
      // Check user's scroll position with intelligent thresholds
      const { isAtStrictBottom, isCloseToBottom, distanceFromBottom } = checkIfAtBottom();
      console.log('📋 MessageList: New message detected', {
        isAtStrictBottom,
        isCloseToBottom,
        distanceFromBottom: Math.round(distanceFromBottom)
      });
      
      if (isCloseToBottom) {
        // If user is close to bottom (within 200px), auto-scroll to show new message
        console.log('📋 MessageList: User close to bottom, auto-scrolling to new message');
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          setIsUserAtBottom(true);
        }, 100);
      } else {
        // If user is far from bottom, show the scroll button
        console.log('📋 MessageList: User far from bottom, showing scroll button');
        setShowScrollButton(true);
      }
    } else {
      // Update the previous messages reference even if no new messages
      previousMessagesRef.current = [...messages];
      conversationIdRef.current = currentConversationId;
    }
  }, [messages, checkIfAtBottom]); // Watch the full messages array

  // Effect to handle conversation changes
  useEffect(() => {
    if (conversationId && conversationId !== conversationIdRef.current) {
      console.log('📋 MessageList: Conversation changed, scrolling to bottom');
      conversationIdRef.current = conversationId;
      
      // Use requestAnimationFrame to ensure DOM is ready, then scroll instantly
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        setIsUserAtBottom(true);
        setShowScrollButton(false);
      });
    }
  }, [conversationId]);

  // Setup scroll listener and initialize position
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Initial check when container is ready
      const { isAtStrictBottom } = checkIfAtBottom();
      console.log('📋 MessageList: Container ready, initial position:', isAtStrictBottom);
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, checkIfAtBottom]);

  return (
    <div className="relative h-full flex flex-col">
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-4 px-4 lg:px-6 py-4 custom-scrollbar"
        onScroll={handleScroll}
      >
        {messages.map((msg, i) => (
        <Message
            key={msg.id ? `msg-${msg.id}` : `temp-${i}-${msg.msg || ''}-${msg.time || ''}`}
          message={msg}
          isCurrentUser={msg.senderID === currentUserID}
        />
      ))}
      <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 w-12 h-12 bg-mainColor hover:bg-mainColor/90 text-white rounded-[45px] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-10"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
