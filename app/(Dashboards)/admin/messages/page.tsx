"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Agent, Tenant, User } from "../adminContext";
import { agentType, tenantsType, userType } from "@/app/types";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { ImSpinner9 } from "react-icons/im";

// Define message type
interface MessageType {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  documentId?: string;
  fileType?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

// Initialize Socket.IO
const getToken = () => {
  let token = Cookies.get("token")?.trim();
  if (token) {
    token = token.replace(/^"|"$/g, "");
    return token;
  }
  return null;
};

const socket: Socket = io("ws://localhost:3001", {
  path: "/api/socket.io",
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  auth: { token: getToken() },
});

// Fetch document URL
const getDocumentUrl = async (documentId: string, retries = 3, delay = 1000): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`http://localhost:3001/api/document/url/${documentId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch document URL: ${response.status}`);
      const { url } = await response.json();
      if (url) return url;
      throw new Error("Empty URL received");
    } catch (error) {
      console.error(`Error fetching document URL for ${documentId} (attempt ${attempt}):`, error);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        return "";
      }
    }
  }
  return "";
};


export default function Messages() {
  const [selectedUser, setSelectedUser] = useState<userType | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agents = useContext(Agent) as agentType[] | null;
  const tenants = useContext(Tenant) as tenantsType[] | null;
  const admin = useContext(User) as userType | undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [fileUploading, setFileUploading] = useState<{ [key: string]: boolean }>({});
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; name: string; type: string; buffer?: ArrayBuffer }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch chat history
  const fetchChatHistory = async (userId: string | undefined, otherUserId: string | undefined) => {
    if (!userId || !otherUserId) return;
    try {
      setIsLoading(true);
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
      const messagesWithUrls = await Promise.all(
        data.map(async (msg: MessageType) => {
          if (msg.documentId && !msg.fileUrl) {
            const url = await getDocumentUrl(msg.documentId);
            return { ...msg, fileUrl: url };
          }
          return msg;
        })
      );
      setMessages(messagesWithUrls);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      alert("Failed to load chat history.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(fileUrls)

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Socket.IO setup
  useEffect(() => {
    if (!admin) return;

    // socket.on("connect", () => {
      console.log("Connected to Socket.IO, socket ID:", socket.id);
      socket.emit("join", admin.id);
    // });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      alert(`Connection error: ${error.message}`);
    });

    socket.on("reconnect", () => {
      console.log("Socket.IO reconnected, rejoining room for user ID:", admin.id);
      socket.emit("join", admin.id);
      if (selectedUser?.id) {
        fetchChatHistory(admin.id, selectedUser.id);
      }
    });

    socket.on("message", async (newMessage: MessageType) => {
      console.log("Received message:", newMessage);
      if (newMessage.receiver === admin.id || newMessage.sender === admin.id) {
        let updatedMessage = newMessage;
        if (newMessage.documentId && !newMessage.fileUrl) {
          const url = await getDocumentUrl(newMessage.documentId);
          updatedMessage = { ...newMessage, fileUrl: url };
          setFileUrls((prev) => ({ ...prev, [newMessage.documentId!]: url }));
        }
        setMessages((prev) => [...prev, updatedMessage]);
        scrollToBottom();
      }
    });

    socket.on("error", (error: string) => {
      console.error("Socket.IO error:", error);
      alert(`Error: ${error}`);
      setFileUploading({});
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("reconnect");
      socket.off("message");
      socket.off("error");
    };
  }, [admin?.id, selectedUser?.id]);

  // Fetch chat history when user is selected
  useEffect(() => {
    if (admin?.id && selectedUser?.id) {
      fetchChatHistory(admin.id, selectedUser.id);
    }
  }, [admin?.id, selectedUser?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserClick = (user: userType) => {
    setSelectedUser(user);
    setShowChat(true);
    setPreviewFiles([]);
    if (admin?.id) {
      fetchChatHistory(admin.id, user.id);
    }
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedUser(null);
    setMessages([]);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const previews: { url: string; name: string; type: string; buffer?: ArrayBuffer }[] = [];
    for (const file of Array.from(files)) {
      const url = URL.createObjectURL(file);
      try {
        const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
          reader.readAsArrayBuffer(file);
        });
        previews.push({ url, name: file.name, type: file.type, buffer });
      } catch (error) {
        console.error(error);
        alert(`Failed to read file ${file.name}`);
      }
    }
    setPreviewFiles(previews);
  };

  const handleRemovePreview = (idx: number) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current && previewFiles.length === 1) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Send button clicked", {
      message,
      adminId: admin?.id,
      selectedUserId: selectedUser?.id,
      previewFiles: previewFiles.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.buffer?.byteLength || 0,
      })),
    });

    if (!admin?.id || !selectedUser?.id) {
      console.log("Message not sent: invalid data", {
        hasMessage: !!message.trim(),
        hasAdminId: !!admin?.id,
        hasSelectedUserId: !!selectedUser?.id,
      });
      alert("Please select a user");
      return;
    }

    const receiverId = selectedUser.id;

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
          senderId: admin.id,
          receiverId,
          file: file.buffer,
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
        senderId: admin.id,
        receiverId,
        content: message,
      };
      console.log("Emitted messageSend:", messageData);
      socket.emit("messageSend", messageData);
      setMessage("");
    }

    scrollToBottom();
  };

  return (
    <section className="flex w-full h-[85vh] flex-col md:flex-row">
      {/* User List */}
      <div
        className={`
          md:w-[30%] w-full bg-sky-700 text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none shadow-lg flex flex-col
          ${showChat ? "hidden" : "flex"} md:flex
        `}
      >
        <h2 className="text-2xl font-semibold px-6 py-4 border-b border-sky-800">Messages</h2>
        <ul className="flex-1 overflow-y-auto">
          {agents?.map((agent: agentType, index: number) => (
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
          {tenants?.map((tenant: tenantsType, index: number) => (
            <li
              key={`tenant-${index}`}
              className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-sky-800 transition
                ${selectedUser?.id === tenant.user.id ? "bg-sky-800" : ""}`}
              onClick={() => handleUserClick(tenant.user)}
            >
              <img
                src={tenant.user.image || "https://via.placeholder.com/40"}
                alt={tenant.user.email}
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div className="flex-1">
                <div className="font-medium truncate">{tenant.user.email}</div>
                <div className="text-xs text-sky-200 truncate">Tenant</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div
        className={`
          md:w-[60%] w-full h-full bg-white rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none shadow-lg flex flex-col ml-0 md:ml-8 
          ${showChat ? "flex" : "hidden"} md:flex
        `}
      >
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex sm:flex-row flex-col sm:items-center justify-between px-6 py-4 border-b">
              {/* <div className="flex sm:flex-row flex-col sm:items-center gap-4"> */}
                <button onClick={handleBack} className="md:hidden text-xs self-start text-sky-700 font-bold">
                  ← Back
                </button>
                <div className="flex items-center gap-4 not-sm:mt-3">
                  <img
                    src={selectedUser.image || "https://via.placeholder.com/40"}
                    alt={selectedUser.email}
                    className="w-10 h-10 rounded-full border-2 border-sky-700 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sky-700">{selectedUser.email}</div>
                    <div className="text-xs text-gray-400">{selectedUser.role}</div>
                  </div>
                </div>
                {/* </div> */}
            </div>

            {/* Chat Messages */}
            <div 
              style={{
                backgroundImage: `url('/images/9a874cc3-e17c-4111-8c12-a35369f8f2c2.jpg')`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 relative">
              {isLoading ? (
                <div className="flex flex-col text-xs justify-center items-center h-full text-sky-700">
                            <ImSpinner9 className="animate-spin text-sky-700 text-2xl" />
                            <span className="mt-2">Loading chat...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet.</div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[60%] md:max-w-[40%] w-fit  px-4 py-2 rounded-lg text-xs flex flex-col gap-1 ${
                      msg.sender === admin?.id
                        ? "bg-sky-700 text-white ml-auto"
                        : "bg-sky-100 text-sky-800"
                    }`}
                    style={{ alignSelf: msg.sender === admin?.id ? "flex-end" : "flex-start" }}
                  >
                    
                    {msg.fileUrl && msg.fileType?.startsWith("image/") && (
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName || "sent image"}
                        className="mt-1 max-w-[180px] rounded cursor-pointer transition hover:brightness-90  mb-2"
                        onClick={() => setSelectedImage(msg.fileUrl!)}
                      />
                    )}
                    {msg.fileUrl && !msg.fileType?.startsWith("image/") && (
                      <a
                        href={msg.fileUrl}
                        download={msg.fileName}
                        className="mt-1 underline text-xs text-sky-200"
                      >
                        📄 {msg.fileName}
                      </a>
                    )}
                    {msg.content && <span className="font-bold">{msg.content}</span>}
                    <span
                      className={`text-[10px] mt-1 ${
                        msg.sender === admin?.id ? "text-sky-200" : "text-sky-600"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Image Modal */}
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

            {/* File Previews */}
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
                    <div key={idx} className="flex items-center gap-2 bg-white border rounded px-2 py-1">
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

            {/* Message Input */}
            <form className="flex items-center border-t px-4 py-3 gap-2" onSubmit={handleSend}>
              <button
                type="button"
                className="bg-sky-700 text-white not-sm:text-xs px-3 py-2 rounded font-semibold"
                onClick={handleFileButtonClick}
                title="Send image or document"
                disabled={Object.keys(fileUploading).length > 0}
              >
                📎
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                multiple
                onChange={handleFileChange}
              />
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border not-sm:text-xs rounded bg-gray-50 focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={Object.keys(fileUploading).length > 0}
              />
              <button
                type="submit"
                className="bg-sky-700 text-white px-4 not-sm:text-xs py-2 rounded font-semibold"
                disabled={Object.keys(fileUploading).length > 0}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-sky-700">
            <span>Select a user to view chat</span>
          </div>
        )}
      </div>
    </section>
  );
}