import React, { useState } from "react";
import { toast } from "sonner";
import { filterCandidatesByQuery } from "@/data/mockCandidates";
import SearchHeader from "@/components/search/SearchHeader";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const handleSearch = (query, isClear = false) => {
    if (isClear) {
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    if (!query.trim()) {
      toast.error("Please enter a job position to search for candidates.");
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
        toast.success(`Found ${results.length} candidates for "${query}"`);
      } else {
        toast.info(`No candidates found for "${query}". Try a different search term.`);
      }
    }, 1500);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SearchHeader />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <SearchForm 
            onSearch={handleSearch} 
            isSearching={isSearching} 
          />

          <SearchResults 
            isSearching={isSearching}
            hasSearched={hasSearched}
            searchResults={searchResults}
            searchQuery={searchQuery}
            currentPage={currentPage}
            resultsPerPage={resultsPerPage}
            onPageChange={goToPage}
          />
        </div>
      </main>
    </div>
  );
};

export default Search;
