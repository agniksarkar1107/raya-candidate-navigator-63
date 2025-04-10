
import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, MessageSquare, Calendar } from "lucide-react";

const SearchHeader = () => {
  const navigate = useNavigate();

  const navItems = [
    { 
      name: "Search", 
      path: "/search", 
      icon: <Search className="w-4 h-4 mr-2" /> 
    },
    { 
      name: "Resume Screening", 
      path: "/resume-screening", 
      icon: <FileText className="w-4 h-4 mr-2" /> 
    },
    { 
      name: "AI Assistant", 
      path: "/ai-assistant", 
      icon: <MessageSquare className="w-4 h-4 mr-2" /> 
    },
    { 
      name: "Scheduling", 
      path: "/scheduling", 
      icon: <Calendar className="w-4 h-4 mr-2" /> 
    },
  ];

  return (
    <header className="border-b backdrop-blur-md bg-background/50 sticky top-0 z-10">
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
              className="font-bold text-xl text-gradient animate-text-shimmer bg-gradient-to-r from-raya-purple via-indigo-500 to-purple-300 bg-[length:200%_auto]"
              onClick={() => navigate('/')}
            >
              RAYA
            </Button>
            
            <div className="hidden md:flex items-center ml-8 space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {item.name}
                </Button>
              ))}
            </div>
          </motion.div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
