
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, X, Loader2, Sparkles, Zap, Brain } from "lucide-react";
import { motion } from "framer-motion";

const SearchForm = ({ onSearch, isSearching }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("", true); // Pass true as second argument to indicate clear action
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <Brain className="w-6 h-6 mr-2 text-raya-yellow animate-pulse-glow" />
        Talent Discovery Agent
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Enter a job position, skill, or category to activate the AI agent and discover qualified candidates
      </p>
      
      <Card className="mb-8 overflow-hidden border-2 border-raya-yellow/20 shadow-lg shadow-raya-yellow/10 card-shimmer">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Try 'Frontend Developer', 'React', 'Marketing', etc."
                className="pl-10 py-6 text-lg bg-black/30 border-white/10 focus:border-raya-yellow/50 focus:ring-1 focus:ring-raya-yellow/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-raya-yellow to-raya-green hover:from-raya-yellow/90 hover:to-raya-green/90 text-black font-medium px-6 py-6 neon-yellow-box"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running agent...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Run Agent
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SearchForm;
