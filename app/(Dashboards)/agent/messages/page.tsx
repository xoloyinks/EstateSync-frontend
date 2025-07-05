"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { Admin, Agent, Agents } from "../agentContext";
import { agentType, PropertyType, userType } from "@/app/types";
import Cookies from "js-cookie";
import { ImSpinner9 } from "react-icons/im";

// Retrieve JWT token
const getToken = () => {
  let token = Cookies.get("token")?.trim();
  if (token) {
    token = token.replace(/^"|"$/g, "");
    return token;
  }
};

// Initialize Socket.IO with increased payload limit
const socket: Socket = io("ws://localhost:3001", {
  path: "/api/socket.io",
  reconnection: true,
  // autoConnect: false, // don't connect immediately
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  auth: { token: getToken() },
});

// Fetch document URL from backend with retry
const getDocumentUrl = async (documentId: string, retries = 3, delay = 1000): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`http://localhost:3001/api/document/url/${documentId}`);
      if (!response.ok) throw new Error(`Failed to fetch document URL: ${response.status}`);
      const { url } = await response.json();
      console.log(`Fetched URL for document ${documentId} (attempt ${attempt}): ${url}`);
      if (url) return url;
      throw new Error("Empty URL received");
    } catch (error) {
      console.error(`Error fetching document URL for ${documentId} (attempt ${attempt}):`, error);
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error(`Failed to fetch URL for ${documentId} after ${retries} attempts`);
        return "";
      }
    }
  }
  return "";
};

interface MessageType {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  documentId?: string;
  fileType?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export default function Messages() {
  const [selectedUser, setSelectedUser] = useState<userType | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [fileUploading, setFileUploading] = useState<{ [key: string]: boolean }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const agentData: agentType | undefined = useContext(Agent);
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; name: string; type: string; buffer?: ArrayBuffer }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previousChatLoading, setPreviousChatLoading] = useState(false);
  const agents = useContext(Agents) as agentType[] | null;
  const admin = useContext(Admin) as userType | undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log(fileUrls)

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async (userId: string, otherUserId: string) => {
    try {
      setPreviousChatLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/chat/history/${userId}/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!response.ok) throw new Error(`Failed to fetch chat history: ${response.status}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setPreviousChatLoading(false);
    }
  };

  const handleRemovePreview = (idx: number) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current && previewFiles.length === 1) {
      fileInputRef.current.value = "";
    }
  };

  // Agent code (in useEffect)
useEffect(() => {
  if (!agentData?.user?.id) {
    console.log("No agentData.user.id available");
    return;
  }
  const userId = agentData.user.id.toString(); // Ensure string
  // socket.on("connect", () => {
    console.log("Connected to Socket.IO, socket ID:", socket.id);
    socket.emit("join", userId);
  //   console.log("Emitted join for user:", userId);
  // });
   socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      alert(`Connection error: ${error.message}`);
    });
    socket.on("message", async (newMessage: MessageType) => {
      console.log("Received message:", newMessage);
      let updatedMessage = newMessage;
      if (newMessage.documentId && !newMessage.fileUrl) {
        const url = await getDocumentUrl(newMessage.documentId);
        updatedMessage = { ...newMessage, fileUrl: url };
        setFileUrls((prev) => ({ ...prev, [newMessage.documentId!]: url }));
      }
      setMessages((prev) => [...prev, updatedMessage]);
      setFileUploading((prev) => {
        const updated = { ...prev };
        delete updated[newMessage.fileName || ""];
        return updated;
      });
    });
    socket.on("error", (error: string) => {
      console.error("Socket.IO error:", error);
      alert(`Error: ${error}`);
      setFileUploading((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((fileName) => delete updated[fileName]);
        return updated;
      });
    });
  console.log("Agent userId:", userId, "Type:", typeof userId);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("message");
      socket.off("error");
    };
}, [agentData?.user?.id]);



  useEffect(() => {
    if (selectedUser && agentData?.user?.id) {
      const selectedUserId = selectedUser._id || selectedUser.id;
      if (selectedUserId) {
        fetchChatHistory(agentData.user.id, selectedUserId);
      } else {
        console.log("No valid selectedUser ID (_id or id)");
      }
    }
  }, [selectedUser, agentData?.user?.id]);

  const handleUserClick = (user: userType | undefined) => {
    // if (user?.id === selectedUser?._id) {
    //   return;
    // }
    if (user) {
      console.log("User clicked:", user);
      setSelectedUser(user);
      setShowChat(true);
      setPreviewFiles([]);
      setMessages([]);
      setFileUrls({});
      setFileUploading({});
    }
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedUser(null);
    setMessages([]);
    setFileUrls({});
    setFileUploading({});
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const previews: { url: string; name: string; type: string; buffer?: ArrayBuffer }[] = [];
    for (const file of Array.from(files)) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds 10MB limit`);
        continue;
      }
      console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      const url = URL.createObjectURL(file);
      const buffer = await file.arrayBuffer();
      previews.push({ url, name: file.name, type: file.type, buffer });
    }
    setPreviewFiles(previews);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentData?.user?.id || !(selectedUser?._id || selectedUser?.id) || !message.trim()) {
      console.log("Message not sent: invalid data", {
        hasMessage: !!message.trim(),
        hasAgentId: !!agentData?.user?.id,
        hasSelectedUserId: !!(selectedUser?._id),
      });
      alert("Please select a user");
      return;
    }

    const receiverId = selectedUser._id || selectedUser.id;
    console.log("first", receiverId)
    if (previewFiles.length > 0) {
      setFileUploading((prev) => {
        const updated = { ...prev };
        previewFiles.forEach((file) => {
          updated[file.name] = true;
        });
        return updated;
      });
      for (const file of previewFiles) {
        if (!file.buffer) {
          console.error(`Failed to read file data for ${file.name}`);
          alert(`Failed to read file data for ${file.name}`);
          setFileUploading((prev) => {
            const updated = { ...prev };
            delete updated[file.name];
            return updated;
          });
          continue;
        }
        const fileData = {
          senderId: agentData.user.id,
          receiverId,
          file: file.buffer, // Send raw ArrayBuffer
          fileName: file.name,
          fileType: file.type,
          content: message.trim(),
        };
        console.log(`Emitting fileMessageSend for ${file.name}:`, {
          fileType: fileData.fileType,
          fileSize: fileData.file.byteLength,
          bufferSample: new Uint8Array(fileData.file).slice(0, 10),
        });
        socket.emit("fileMessageSend", fileData);
      }
      setPreviewFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMessage("");
    } else if (message.trim()) {
      const messageData = {
        senderId: agentData.user.id,
        receiverId,
        content: message,
      };
      console.log("Emitted messageSend:", messageData);
      socket.emit("messageSend", messageData);
      setMessage("");
    }
  };

  return (
    <section className="flex w-full h-[85vh] flex-col md:flex-row">
      <div
        className={`
          md:w-[30%] w-full bg-sky-700 text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none shadow-lg flex flex-col
          ${showChat ? "hidden" : "flex"}
          md:flex
        `}
      >
        <h2 className="text-2xl font-semibold px-6 py-4 border-b border-sky-800">
          Messages
        </h2>
        <ul className="flex-1 overflow-y-auto">
          {/* Admin */}
          {admin && (
            <li
              className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-sky-800 transition
                ${selectedUser && selectedUser._id === admin._id ? "bg-sky-800" : ""}`}
              onClick={() => handleUserClick(admin)}
            >
              <img
                src={admin.image || "https://via.placeholder.com/40"}
                alt={admin.email}
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div className="flex-1">
                <div className="font-medium truncate">{admin.email}</div>
                <div className="text-xs text-sky-200 truncate">Admin</div>
              </div>
            </li>
          )}
          {/* My tenents */}
          {agentData?.assignedProperties.map(
            (property: PropertyType, index: number) =>
              property.acquired && (
                <li
                  key={index}
                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-sky-800 transition
                    ${
                      selectedUser &&
                      selectedUser._id === property.acquired.id
                        ? "bg-sky-800"
                        : ""
                    }`}
                  onClick={() => handleUserClick(property.acquired)}
                >
                  <img
                    src={property.acquired.image}
                    alt={property.acquired.email}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium truncate">{property.acquired.email}</div>
                    <div className="text-xs text-sky-200 truncate">{property.acquired.role}</div>
                  </div>
                </li>
              )
          )}

          {/* All agents */}
          {agents?.map((agent: agentType, index: number) => (
            agent.user && agent.user.id !== agentData?.user?.id &&
                      <li
                        key={`agent-${index}`}
                        className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-sky-800 transition
                          ${selectedUser?.id === agent.user.id ? "bg-sky-800" : ""}`}
                        onClick={() => handleUserClick(agent.user)}
                      >
                        <img
                          src={agent.user.image || "https://via.placeholder.com/40"}
                          alt={agent.user.email}
                          className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium truncate">{agent.user.email}</div>
                          <div className="text-xs text-sky-200 truncate">Agent</div>
                        </div>
                      </li>
          ))}

        </ul>
      </div>

      <div
        className={`
          md:w-[70%] w-full h-full bg-white rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none shadow-lg ml-0 md:ml-8 flex flex-col
          ${showChat ? "flex" : "hidden"}
          md:flex
        `}
      >
        {selectedUser ? (
          <>
            <div  className="md:hidden flex flex-col px-4 py-2 border-b">
              <button onClick={handleBack} className="text-sky-700 font-bold mr-2 self-start text-sm mb-3">
                ← Back
              </button>
              <span className="font-semibold">{selectedUser.email}</span>
            </div>
            <div className="hidden md:flex items-center gap-4 px-6 py-4 border-b">
              <img
                src={selectedUser.image}
                alt={selectedUser.email}
                className="w-10 h-10 rounded-full border-2 border-sky-700 object-cover"
              />
              <div>
                <div className="font-semibold text-sky-700">{selectedUser.email}</div>
                <div className="text-xs text-gray-400">{selectedUser.role}</div>
              </div>
            </div>

            <div 
               style={{
                backgroundImage: `url('/images/9a874cc3-e17c-4111-8c12-a35369f8f2c2.jpg')`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            className="flex-1 overflow-y-auto p-4 text-[10px]">
              {previousChatLoading && (
                <div className="flex flex-col text-xs justify-center items-center h-full text-sky-700">
                  <ImSpinner9 className="animate-spin text-black text-2xl" />
                  <span className="mt-2">Loading chat...</span>
                </div>
              )}
              {Object.keys(fileUploading).map((fileName) => (
                <div key={fileName} className="mb-4 flex justify-end">
                  <div className="max-w-[70%] p-3 rounded-lg bg-sky-700 text-white">
                    <div className="flex items-center gap-2">
                      <ImSpinner9 className="animate-spin text-white text-lg" />
                      <p>Uploading {fileName}...</p>
                    </div>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date().toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-4 flex ${
                    msg.sender === agentData?.user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[60%] md:max-w-[40%] w-fit p-3 rounded-lg ${
                      msg.sender === agentData?.user?.id
                        ? "bg-sky-700 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content && !msg.documentId && <p className="font-bold">{msg.content}</p>}
                    {msg.documentId && msg.fileType ? (
                      msg.fileUrl ? (
                        <div>
                          {msg.fileType.startsWith("image/") ? (
                            <img
                              src={msg.fileUrl}
                              alt="Uploaded file"
                              className="max-w-full h-auto rounded"
                              onClick={() => setSelectedImage(msg.fileUrl ? msg.fileUrl : null)}
                              style={{ cursor: "pointer" }}
                            />
                          ) : (
                            <a
                              href={msg.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {msg.fileName || "Unnamed Document"}
                            </a>
                          )}
                          {(msg.content || msg.fileType.startsWith("image/")) && msg.fileName && (
                            <p className="pt-3 text-xs font-bold">{msg.content}</p>
                          )}
                        </div>
                      ) : (
                        <p>Loading file...</p>
                      )
                    ) : null}
                    <p className="text-[9px] mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {selectedImage && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                onClick={() => setSelectedImage(null)}
              >
                <img
                  src={selectedImage}
                  alt="Enlarged"
                  className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="absolute top-6 right-8 text-white text-3xl font-bold"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close"
                  type="button"
                >
                  ×
                </button>
              </div>
            )}

            {previewFiles.length > 0 && (
              <div className="px-6 py-2 flex gap-3 flex-wrap border-t bg-sky-50">
                {previewFiles.map((file, idx) =>
                  file.type.startsWith("image/") ? (
                    <div key={idx} className="relative">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded border"
                        onClick={() => setSelectedImage(file.url)}
                        style={{ cursor: "pointer" }}
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        onClick={() => handleRemovePreview(idx)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white border rounded px-2 py-1"
                    >
                      <span className="text-sky-700 text-xl">📄</span>
                      <span className="text-xs">{file.name}</span>
                      <button
                        type="button"
                        className="text-red-600 text-xs"
                        onClick={() => handleRemovePreview(idx)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

             <form className="flex items-center border-t p-2 sm:px-4 py-3 gap-2" onSubmit={handleSendMessage}>
              <button
                type="button"
                className="bg-sky-700 text-white px-3 py-2 not-sm:text-xs rounded font-semibold"
                onClick={handleFileButtonClick}
                title="Send image or document"
                disabled={!selectedUser}
              >
                📎
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                multiple
                onChange={handleFileChange}
              />
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded bg-gray-50 focus:outline-none not-sm:text-xs"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={previousChatLoading || !selectedUser}
                className={`text-white px-4 py-2 rounded font-semibold not-sm:text-xs ${
                  previousChatLoading || !selectedUser ? "bg-sky-600" : "bg-sky-700"
                }`}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col text-xs justify-center items-center h-full text-sky-700">
            <span className="text-xs">Select a user to view chat</span>
          </div>
        )}
      </div>
    </section>
  );
}