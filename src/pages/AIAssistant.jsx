
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2, Bot, User, Brain, Sparkles, Cpu } from "lucide-react";
import SearchHeader from "@/components/search/SearchHeader";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I'm RAYA, your superintelligent HR assistant. Ask me anything about candidates, recruitment, or HR processes.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const botResponses = [
        "I've analyzed the candidate profiles and found 3 potential matches for the Frontend Developer position. Would you like me to summarize their key qualifications?",
        "Based on recent hiring trends, technical candidates with React experience are receiving multiple offers. I recommend expediting your interview process.",
        "Looking at the job description, I suggest emphasizing collaborative skills. Our data shows this increases application rates by 15% for senior roles.",
        "The candidate has 5 years of relevant experience and a strong portfolio. Their skills closely match your requirements, particularly in UI/UX design.",
        "I can help you draft a personalized outreach email to this candidate based on their background and interests.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.sender === "user" 
                          ? "bg-raya-purple/20 border border-raya-purple/30" 
                          : "bg-raya-blue/10 border border-raya-blue/30"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Brain className="w-4 h-4 text-raya-blue" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-raya-purple/80 to-raya-neon-purple/70 text-white rounded-tr-none shadow-[0_0_8px_rgba(192,132,252,0.3)]"
                          : "bg-gradient-to-r from-raya-blue/30 to-raya-blue/10 rounded-tl-none shadow-[0_0_8px_rgba(0,255,255,0.2)]"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-raya-blue/10 border border-raya-blue/30">
                      <Brain className="w-4 h-4 text-raya-blue" />
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
                className="bg-gradient-to-r from-raya-blue to-raya-purple hover:opacity-90 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
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
