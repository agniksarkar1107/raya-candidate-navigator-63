
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2, Bot, User } from "lucide-react";
import SearchHeader from "@/components/search/SearchHeader";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I'm RAYA's AI Assistant. Ask me anything about candidates, recruitment, or HR processes.",
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <SearchHeader />

      <main className="flex-1 container mx-auto py-8 px-4 max-w-4xl flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-4">AI Assistant</h1>
          <p className="text-muted-foreground">
            Your intelligent HR companion for recruitment insights and candidate analysis
          </p>
        </motion.div>

        <div className="flex-1 flex flex-col glass-morphism rounded-xl overflow-hidden border border-white/10 backdrop-blur-lg bg-white/5 dark:bg-black/20 p-1">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-2">
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
                        message.sender === "user" ? "bg-raya-purple/20" : "bg-primary/10"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-raya-purple text-white rounded-tr-none"
                          : "bg-muted/50 dark:bg-muted/20 rounded-tl-none"
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
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/50 dark:bg-muted/20 rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse delay-150"></div>
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
            className="p-2 border-t border-border/30 bg-background/50 backdrop-blur-sm rounded-b-lg"
          >
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask about candidates, recruitment, or HR processes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                type="submit"
                className="bg-raya-purple hover:bg-raya-purple/90"
                disabled={!input.trim() || isTyping}
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
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
