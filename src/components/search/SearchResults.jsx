
import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import SearchPagination from "./SearchPagination";

const SearchResults = ({ 
  isSearching, 
  hasSearched, 
  searchResults, 
  searchQuery, 
  currentPage,
  resultsPerPage,
  onPageChange 
}) => {
  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * resultsPerPage, 
    currentPage * resultsPerPage
  );

  if (isSearching) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-raya-purple" />
        <p className="text-lg">Searching across job platforms...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  if (searchResults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No candidates found. Try a different search.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-6">
        Found {searchResults.length} candidates for "{searchQuery}"
        <span className="text-sm font-normal ml-2 text-muted-foreground">
          (Showing {(currentPage - 1) * resultsPerPage + 1}-
          {Math.min(currentPage * resultsPerPage, searchResults.length)} of {searchResults.length})
        </span>
      </h3>
      <div className="space-y-6">
        {paginatedResults.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CandidateCard candidate={candidate} />
          </motion.div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <SearchPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </motion.div>
  );
};

export default SearchResults;
