
import React, { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, MessageSquare, Calendar, Menu, X, Sparkles, Cpu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SearchHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { 
      name: "Candidate Search", 
      path: "/search", 
      icon: <Search className="w-5 h-5 mr-3 text-raya-blue" />,
      description: "Find ideal candidates"
    },
    { 
      name: "Resume Screening", 
      path: "/resume-screening", 
      icon: <FileText className="w-5 h-5 mr-3 text-raya-green" />,
      description: "Analyze applications"
    },
    { 
      name: "AI Assistant", 
      path: "/ai-assistant", 
      icon: <MessageSquare className="w-5 h-5 mr-3 text-raya-purple" />,
      description: "Chat with data"
    },
    { 
      name: "Scheduling", 
      path: "/scheduling", 
      icon: <Calendar className="w-5 h-5 mr-3 text-raya-blue" />,
      description: "Automate interviews"
    },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <header className="border-b border-white/10 backdrop-blur-md bg-raya-dark/90 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Button 
              variant="ghost" 
              className="font-bold text-xl text-gradient animate-text-shimmer bg-gradient-to-r from-raya-blue via-raya-purple to-raya-green bg-[length:200%_auto] flex items-center"
              onClick={() => navigate('/')}
            >
              <Cpu className="w-5 h-5 mr-2 text-raya-blue" />
              RAYA
            </Button>
            
            <div className="hidden md:flex items-center ml-8 space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center text-raya-text hover:text-white hover:bg-white/10 transition-all duration-300 ${
                    location.pathname === item.path ? "bg-white/10 text-white" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {item.name}
                </Button>
              ))}
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:flex"
            >
              <Avatar className="h-9 w-9 border-2 border-raya-purple/30">
                <AvatarImage src="https://ui-avatars.com/api/?name=RAYA&background=0F172A&color=00FFFF" />
                <AvatarFallback className="bg-raya-blue/10 text-raya-blue">RA</AvatarFallback>
              </Avatar>
            </motion.div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-raya-text"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed inset-0 z-50 bg-raya-dark/95 backdrop-blur-xl"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <Button 
                  variant="ghost" 
                  className="font-bold text-xl text-gradient animate-text-shimmer bg-gradient-to-r from-raya-blue via-raya-purple to-raya-green bg-[length:200%_auto]"
                  onClick={() => {
                    navigate('/');
                    setSidebarOpen(false);
                  }}
                >
                  RAYA
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-raya-text"
                  onClick={toggleSidebar}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col space-y-3 mb-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-lg text-raya-text hover:text-white hover:bg-white/10 py-4 ${
                        location.pathname === item.path ? "bg-white/10 text-white" : ""
                      }`}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                    >
                      {item.icon}
                      <div className="flex flex-col items-start">
                        <span>{item.name}</span>
                        <span className="text-xs text-raya-gray">{item.description}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                <Avatar>
                  <AvatarImage src="https://ui-avatars.com/api/?name=RAYA&background=0F172A&color=00FFFF" />
                  <AvatarFallback className="bg-raya-blue/10 text-raya-blue">RA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-raya-text">RAYA Assistant</p>
                  <p className="text-xs text-raya-gray">Superintelligent HR Agent</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SearchHeader;
