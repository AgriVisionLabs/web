import { MessageSquareMore, X } from "lucide-react";
import ChatSidebar from "./components/ChatSidebar";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AllContext } from "../../Context/All.context";
import * as signalR from "@microsoft/signalr";
import { userContext } from "../../Context/User.context";

// const hubUrl = "https://gigachat.tryasp.net/hubs/conversations";

const Chat = () => {
  const { baseUrl } = useContext(AllContext);
  const [conversations, setConversations] = useState([]);
  const [connection, setConnection] = useState(null);
  const { token, userId } = useContext(userContext);

  console.log({ userId });
  console.log({ token });

  useEffect(() => {
    if (!token || !userId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(baseUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    console.log({ newConnection });

    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (!connection) return;
    console.log("hi");

    connection
      .start()
      .then(() => {
        console.log("✅ Connected to ConversationHub");

        connection
          .invoke("SubscribeToConversationUpdates")
          .then(() =>
            console.log(`🧩 Subscribed to private group: user-${userId}`)
          )
          .catch(console.error);

        connection.on("NewConversation", (data) => {
          console.log("📥 NewConversation:", data);
          setConversations((prev) => [...prev, data]);
        });

        connection.on("ConversationRemoved", (conversationId) => {
          console.log("❌ ConversationRemoved:", conversationId);
          setConversations((prev) =>
            prev.filter((c) => c.id !== conversationId)
          );
        });

        connection.on("ConversationUpdated", (data) => {
          console.log("🔄 ConversationUpdated:", data);
          setConversations((prev) =>
            prev.map((c) => (c.id === data.id ? data : c))
          );
        });
      })
      .catch((err) => {
        console.error("❌ Connection failed:", err);
      });

    return () => {
      connection.stop();
    };
  }, [connection]);

  async function getChats() {
    if (!token) return;

    try {
      const options = {
        url: `${baseUrl}/Conversations`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log(data);
      setConversations(data);
    } catch (error) {
      console.error("Error fetching farm:", error);
    }
  }

  useEffect(() => {
    getChats();
  }, []);

  const [messages, setMessages] = useState([
    { msg: "hello youssef", senderID: 1, time: "02:30" },
    { msg: "hello", senderID: 2, time: "05:30" },
    { msg: "how are you?", senderID: 1, time: "05:36" },
    { msg: "how are you?", senderID: 1, time: "06:00" },
    { msg: "i'm good, you?", senderID: 2, time: "11:39" },
    { msg: "hello youssef", senderID: 1, time: "02:30" },
    { msg: "hello", senderID: 2, time: "05:30" },
    { msg: "how are you?", senderID: 1, time: "05:36" },
    { msg: "how are you?", senderID: 1, time: "06:00" },
    { msg: "i'm good, you?", senderID: 2, time: "11:39" },
  ]);

  // const chats = [
  //   {
  //     name: "John Doe",
  //     message: "Hey there! Are we still on for tomorrow?",
  //     time: "1h",
  //     id: "2",
  //   },
  //   {
  //     name: "Mark",
  //     message: "I’ve sent the files. Let me know what you think.",
  //     time: "2h",
  //     id: "3",
  //   },
  //   {
  //     name: "Ali",
  //     message: "Let’s meet at 5pm outside the cafe.",
  //     time: "Yesterday",
  //     id: "4",
  //   },
  //   {
  //     name: "Youssef",
  //     message: "Check the document attached to the last email.",
  //     time: "Mon",
  //     id: "5",
  //   },
  //   {
  //     name: "Btats",
  //     message: "Sure, I’ll call you in 10 mins.",
  //     time: "Sun",
  //     id: "6",
  //   },
  // ];

  const [selectedChat, setSelectedChat] = useState(null);
  // console.log(selectedChat);

  return (
    <div className="flex bg-[#F7F7F7] h-screen w-full">
      <ChatSidebar
        conversations={conversations}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
      />

      {selectedChat ? (
        <section className="w-full h-screen flex flex-col">
          <nav className="flex  items-center w-full py-3 px-6 border-b">
            <span className="bg-mainColor text-white text-sm font-semibold h-10 w-10 rounded-full flex items-center justify-center">
              {selectedChat.name.charAt(0)}
            </span>
            <h3 className="font-semibold ml-3">{selectedChat.name}</h3>
            <X
              className="ml-auto cursor-pointer"
              onClick={() => setSelectedChat(null)}
            />
          </nav>
          <section className="flex flex-col flex-grow py-4 px-1 overflow-hidden space-y-2">
            <MessageList messages={messages} currentUserID={userId} />
            <MessageInput
              onSend={(msg) =>
                setMessages([
                  ...messages,
                  { msg, senderID: userId, time: "now" },
                ])
              }
            />
          </section>
        </section>
      ) : (
        <div className="flex-grow flex items-center justify-center text-3xl font-semibold">
          <h2>Select a conversation to start messaging</h2>
          <MessageSquareMore width={35} height={30} className="mx-3 mt-2" />
        </div>
      )}
    </div>
  );
};

export default Chat;
