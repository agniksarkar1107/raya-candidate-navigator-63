import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2, Bot, User, Brain, Sparkles, Cpu, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchHeader from "@/components/search/SearchHeader";
import { API_ENDPOINTS } from "@/lib/api/config";
import { toast } from "sonner";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm RAYA, your superintelligent HR assistant. Ask me anything about candidates, recruitment, or HR processes.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isWebSearching, setIsWebSearching] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect if the user is asking for latest or recent information
  const isAskingForLatestInfo = (text) => {
    const latestInfoKeywords = [
      "latest", "recent", "current", "new", "up to date", "today", "this week",
      "this month", "this year", "trends", "news", "update"
    ];
    
    return latestInfoKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Check if the user is asking for latest information
    const needsWebSearch = isAskingForLatestInfo(input);
    let webSearchQuery = null;
    
    if (needsWebSearch) {
      setIsWebSearching(true);
      // Extract a search query from the user's message
      webSearchQuery = input;
      
      // Add a message indicating web search is happening
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: "search-notification",
          role: "system",
          content: "Web search agent triggered",
          timestamp: new Date(),
          isSearchNotification: true
        }
      ]);
    }

    try {
      // Prepare the chat history for the API
      const chatHistory = messages.filter(msg => msg.role === "user" || msg.role === "assistant")
        .map(({ role, content }) => ({ role, content }));

      // Add the current user message
      chatHistory.push({ role: "user", content: input });

      // Call the backend API
      const response = await fetch(API_ENDPOINTS.assistant.chat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
          use_web_search: needsWebSearch,
          search_query: webSearchQuery
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI assistant");
      }

      const data = await response.json();
      
      // Remove the search notification if it exists
      if (needsWebSearch) {
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== "search-notification")
        );
        setIsWebSearching(false);
      }

      // Add the AI response
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          ...data.message,
          timestamp: new Date(),
          webSearchUsed: data.web_search_used
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error getting response from AI assistant");
      
      // Remove the search notification if it exists
      if (needsWebSearch) {
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== "search-notification")
        );
        setIsWebSearching(false);
      }
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          timestamp: new Date(),
          isError: true
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-raya-dark to-black/95 overflow-hidden">
      <SearchHeader />

      <main className="flex-1 container mx-auto py-8 px-4 max-w-4xl flex flex-col relative">
        {/* Background elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 2 }}
            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-raya-blue blur-[120px]" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-raya-purple blur-[150px]" 
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center z-10"
        >
          <div className="inline-flex items-center space-x-2 mb-2">
            <Cpu className="h-6 w-6 text-raya-neon-cyan animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-raya-blue via-raya-neon-purple to-raya-purple bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
              RAYA Conversation
            </h1>
            <Cpu className="h-6 w-6 text-raya-neon-cyan animate-pulse" />
          </div>
          <p className="text-muted-foreground">
            Your superintelligent HR companion for recruitment insights and candidate analysis
          </p>
        </motion.div>

        <div className="flex-1 flex flex-col glass-morphism rounded-xl overflow-hidden border border-white/10 backdrop-blur-lg bg-black/30 p-1 z-10 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-2 scrollbar-none">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : 
                    message.isSearchNotification ? "justify-center" : "justify-start"
                  }`}
                >
                  {message.isSearchNotification ? (
                    <div className="px-3 py-2 bg-raya-blue/20 rounded-full flex items-center space-x-2 border border-raya-blue/30">
                      <Search className="h-4 w-4 text-raya-blue animate-pulse" />
                      <span className="text-xs text-raya-blue">{message.content}</span>
                    </div>
                  ) : (
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message.role === "user" 
                            ? "bg-raya-purple/20 border border-raya-purple/30" 
                            : "bg-raya-blue/10 border border-raya-blue/30"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Avatar className="w-full h-full">
                            <AvatarImage src="https://ui-avatars.com/api/?name=RAYA&background=080A12&color=FEFD9A&size=32" alt="RAYA" />
                            <AvatarFallback className="bg-raya-dark text-raya-yellow text-[10px]">RA</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-raya-purple/80 to-raya-neon-purple/70 text-white rounded-tr-none shadow-[0_0_8px_rgba(192,132,252,0.3)]"
                            : "bg-gradient-to-r from-raya-blue/30 to-raya-blue/10 rounded-tl-none shadow-[0_0_8px_rgba(0,255,255,0.2)]"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {message.webSearchUsed && (
                          <div className="mt-2 pt-2 border-t border-raya-blue/20 flex items-center space-x-1">
                            <Search className="h-3 w-3 text-raya-blue" />
                            <span className="text-xs text-raya-blue">Web search used for this response</span>
                          </div>
                        )}
                        
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && !isWebSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-raya-blue/10 border border-raya-blue/30">
                      <Avatar className="w-full h-full">
                        <AvatarImage src="https://ui-avatars.com/api/?name=RAYA&background=080A12&color=FEFD9A&size=32" alt="RAYA" />
                        <AvatarFallback className="bg-raya-dark text-raya-yellow text-[10px]">RA</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-raya-blue/30 to-raya-blue/10 rounded-tl-none">
                      <div className="flex space-x-1">
                        <motion.div 
                          animate={{ scale: [0.8, 1.2, 0.8] }} 
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="w-2 h-2 rounded-full bg-raya-blue"
                        ></motion.div>
                        <motion.div 
                          animate={{ scale: [0.8, 1.2, 0.8] }} 
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          className="w-2 h-2 rounded-full bg-raya-blue"
                        ></motion.div>
                        <motion.div 
                          animate={{ scale: [0.8, 1.2, 0.8] }} 
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          className="w-2 h-2 rounded-full bg-raya-blue"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/10 bg-black/40 backdrop-blur-sm rounded-b-lg"
          >
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask about candidates, recruitment, or HR processes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black/30 border-white/10 text-raya-text placeholder:text-raya-gray/60 focus:border-raya-purple/50"
                disabled={isTyping}
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-cyan-500/20"
                disabled={!input.trim() || isTyping}
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span className="mr-1">Run</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
