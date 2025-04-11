
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { filterCandidatesByQuery } from "@/data/mockCandidates";
import SearchHeader from "@/components/search/SearchHeader";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoaded, setPageLoaded] = useState(false);
  const resultsPerPage = 5;

  useEffect(() => {
    // Add a small delay to make sure animations run smoothly
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query, isClear = false) => {
    if (isClear) {
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    if (!query.trim()) {
      toast.error("Please enter a job position to activate the search agent.");
      return;
    }
    
    setSearchQuery(query);
    setIsSearching(true);
    setHasSearched(true);
    
    setTimeout(() => {
      const results = filterCandidatesByQuery(query);
      setSearchResults(results);
      setIsSearching(false);
      setCurrentPage(1);
      
      if (results.length > 0) {
        toast.success(`AI agent found ${results.length} candidates for "${query}"`);
      } else {
        toast.info(`No candidates found for "${query}". Try a different search term.`);
      }
    }, 1500);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-raya-dark">
      <SearchHeader />

      <main className="flex-1 container mx-auto py-8 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate={pageLoaded ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="search" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex bg-white/5 p-1">
                <TabsTrigger 
                  value="search" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  New Search
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Saved Searches
                </TabsTrigger>
              </TabsList>
              <TabsContent value="search">
                <SearchForm 
                  onSearch={handleSearch} 
                  isSearching={isSearching} 
                />
              </TabsContent>
              <TabsContent value="saved">
                <div className="p-8 text-center text-raya-gray bg-white/5 rounded-lg">
                  <p>Your saved searches will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SearchResults 
              isSearching={isSearching}
              hasSearched={hasSearched}
              searchResults={searchResults}
              searchQuery={searchQuery}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              onPageChange={goToPage}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Search;
