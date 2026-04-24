import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  Send,
  Paperclip,
  Image,
  Users,
  Hash,
  Bell,
  Info,
  Phone,
  Video,
  MessageCircle,
  Circle,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_URL = BACKEND_URL?.replace("https://", "wss://").replace(
  "http://",
  "ws://",
);

export default function ChatPage() {
  const { api, user, token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("project");
  const [showInfo, setShowInfo] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket connection per room
  useEffect(() => {
    if (!selectedRoom || !token) return;

    // Fetch existing messages via REST
    fetchMessages(selectedRoom.id);

    // Connect WebSocket
    const wsUrl = `${WS_URL}/ws/chat/${selectedRoom.id}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "new_message") {
        const msg = payload.data;
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        // Update room last message
        setRooms((prev) =>
          prev.map((r) =>
            r.id === msg.room_id
              ? { ...r, last_message: msg.content, last_time: msg.timestamp }
              : r,
          ),
        );
        setTypingUser(null);
      } else if (payload.type === "typing") {
        const typer = payload.data.user;
        if (typer !== user?.name && typer !== `Demo ${user?.role}`) {
          setTypingUser(typer);
          clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
        }
      } else if (payload.type === "presence") {
        const { user: uid, status } = payload.data;
        if (status === "online") {
          setOnlineUsers((prev) =>
            prev.includes(uid) ? prev : [...prev, uid],
          );
        } else {
          setOnlineUsers((prev) => prev.filter((u) => u !== uid));
        }
      }
    };

    ws.onerror = () => console.log("WebSocket error - falling back to REST");
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [selectedRoom?.id, token]);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/chat/rooms");
      setRooms(res.data);
      if (res.data.length > 0) setSelectedRoom(res.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (rid) => {
    setMsgLoading(true);
    try {
      const res = await api.get(`/chat/rooms/${rid}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setMsgLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedRoom) return;
    const content = newMessage;
    setNewMessage("");

    // Try WebSocket first
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", content }));
    } else {
      // Fallback to REST
      try {
        const res = await api.post(`/chat/rooms/${selectedRoom.id}/messages`, {
          content,
          type: "text",
        });
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.data.id)) return prev;
          return [...prev, res.data];
        });
        setRooms((prev) =>
          prev.map((r) =>
            r.id === selectedRoom.id
              ? {
                  ...r,
                  last_message: content,
                  last_time: new Date().toISOString(),
                }
              : r,
          ),
        );
      } catch (err) {
        toast.error("Failed to send message");
        setNewMessage(content);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Send typing indicator
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      e.key !== "Enter"
    ) {
      wsRef.current.send(JSON.stringify({ type: "typing" }));
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setTypingUser(null);
  };

  const filteredRooms = rooms.filter((r) => {
    if (r.type !== activeTab) return false;
    if (chatSearch)
      return r.name.toLowerCase().includes(chatSearch.toLowerCase());
    return true;
  });

  const formatMsgTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString())
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " " +
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const isOwnMessage = (msg) =>
    msg.sender === user?.name || msg.sender === `Demo ${user?.role}`;

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex h-full bg-white" data-testid="chat-page">
      {/* Left Panel - Room List */}
      <div className="w-72 lg:w-80 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-black">Messages</h2>
            {onlineUsers.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-green-600">
                <Circle className="w-2 h-2 fill-green-500" />{" "}
                {onlineUsers.length} online
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-transparent focus-within:border-[#ef7f1b]/30">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
              data-testid="chat-search"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: "project", label: "Projects", icon: Hash },
            { id: "team", label: "Team", icon: Users },
            { id: "updates", label: "Updates", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`chat-tab-${tab.id}`}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-[#ef7f1b] text-[#ef7f1b]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Room List */}
        <ScrollArea className="flex-1">
          <div className="py-1">
            {filteredRooms.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">
                No conversations
              </p>
            )}
            {filteredRooms.map((room, i) => (
              <button
                key={room.id}
                onClick={() => selectRoom(room)}
                data-testid={`chat-room-${i}`}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  selectedRoom?.id === room.id
                    ? "bg-orange-50/50 border-l-2 border-[#ef7f1b]"
                    : "hover:bg-gray-50 border-l-2 border-transparent"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 relative ${
                    room.type === "project"
                      ? "bg-[#ef7f1b]/10 text-[#ef7f1b]"
                      : room.type === "team"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {room.type === "project" ? (
                    <Hash className="w-4 h-4" />
                  ) : room.type === "team" ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black truncate">
                      {room.name}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {room.last_time ? formatMsgTime(room.last_time) : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {room.last_message}
                  </p>
                </div>
                {room.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ef7f1b] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {room.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Center - Conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedRoom ? (
          <>
            {/* Conversation Header */}
            <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedRoom.type === "project"
                      ? "bg-[#ef7f1b]/10 text-[#ef7f1b]"
                      : selectedRoom.type === "team"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedRoom.type === "project" ? (
                    <Hash className="w-4 h-4" />
                  ) : selectedRoom.type === "team" ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">
                    {selectedRoom.name}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    {typingUser ? (
                      <span className="text-[#ef7f1b] animate-pulse">
                        {typingUser} is typing...
                      </span>
                    ) : (
                      `${selectedRoom.participants?.length || 0} participants`
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className={`p-2 rounded-lg transition-colors ${showInfo ? "bg-[#ef7f1b]/10 text-[#ef7f1b]" : "hover:bg-gray-100 text-gray-400"}`}
                  data-testid="chat-info-toggle"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4">
              {msgLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => {
                    const own = isOwnMessage(msg);
                    const isSystem =
                      msg.type === "update" || msg.sender_role === "System";
                    if (isSystem) {
                      return (
                        <div key={msg.id || i} className="flex justify-center">
                          <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 max-w-md">
                            <p className="text-xs text-gray-600">
                              {msg.content}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {formatMsgTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={msg.id || i}
                        className={`flex ${own ? "justify-end" : "justify-start"} gap-2`}
                        data-testid={`chat-msg-${i}`}
                      >
                        {!own && (
                          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                            {getInitials(msg.sender)}
                          </div>
                        )}
                        <div className={`max-w-[70%] ${own ? "order-1" : ""}`}>
                          {!own && (
                            <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                              {msg.sender}
                            </p>
                          )}
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              own
                                ? "bg-[#ef7f1b] text-white rounded-br-md"
                                : "bg-gray-100 text-black rounded-bl-md"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p
                            className={`text-[10px] text-gray-400 mt-0.5 ${own ? "text-right" : ""}`}
                          >
                            {formatMsgTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="px-4 py-3 border-t border-gray-200 shrink-0">
              {typingUser && (
                <p
                  className="text-[10px] text-[#ef7f1b] mb-1 animate-pulse"
                  data-testid="typing-indicator"
                >
                  {typingUser} is typing...
                </p>
              )}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-[#ef7f1b]/40">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Image className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  data-testid="chat-message-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-lg transition-colors ${newMessage.trim() ? "bg-[#ef7f1b] text-white hover:bg-[#d66e15]" : "text-gray-300"}`}
                  data-testid="chat-send-btn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Info */}
      {showInfo && selectedRoom && (
        <div className="w-72 border-l border-gray-200 flex flex-col shrink-0 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-black">
              {selectedRoom.name}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 capitalize">
              {selectedRoom.type} Chat
            </p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-5">
              {selectedRoom.project && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Project
                  </p>
                  <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-xs border">
                    {selectedRoom.project}
                  </Badge>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Participants ({selectedRoom.participants?.length || 0})
                </p>
                <div className="space-y-2">
                  {(selectedRoom.participants || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                          {getInitials(p)}
                        </div>
                        {onlineUsers.includes(p) && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{p}</span>
                      {onlineUsers.includes(p) && (
                        <span className="text-[9px] text-green-600">
                          online
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Shared Files
                </p>
                <p className="text-xs text-gray-400">No files shared yet</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Pinned Messages
                </p>
                <p className="text-xs text-gray-400">No pinned messages</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
