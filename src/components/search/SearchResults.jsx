import React from "react";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import SearchPagination from "./SearchPagination";
import { Button } from "@/components/ui/button";

const SearchResults = ({ 
  isSearching, 
  hasSearched, 
  searchResults, 
  searchQuery, 
  currentPage,
  resultsPerPage,
  onPageChange,
  onEngageCandidate,
  isGeneratingEmail
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
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-raya-blue/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div className="flex items-center mb-2 md:mb-0">
                  <img 
                    src={candidate.image} 
                    alt={candidate.name} 
                    className="h-10 w-10 rounded-full mr-3 border border-white/20" 
                  />
                  <div>
                    <h4 className="font-semibold">{candidate.name}</h4>
                    <p className="text-sm text-muted-foreground">{candidate.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      candidate.matchScore >= 80 ? 'bg-green-500/20 text-green-400' :
                      candidate.matchScore >= 70 ? 'bg-blue-500/20 text-blue-400' :
                      candidate.matchScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {candidate.matchScore}% Match
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-raya-blue hover:bg-raya-blue/90"
                    onClick={() => onEngageCandidate(candidate)}
                    disabled={isGeneratingEmail}
                  >
                    {isGeneratingEmail ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Mail className="h-3 w-3 mr-1" />
                        Engage
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex flex-wrap gap-1 mb-2">
                  {candidate.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="text-xs px-2 py-0.5 bg-white/5 rounded-full border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-3">
                  <div className="flex items-center">
                    <span className="text-raya-gray mr-2">Experience:</span>
                    <span>{candidate.experience}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-raya-gray mr-2">Location:</span>
                    <span>{candidate.location}</span>
                  </div>
                </div>
              </div>
            </div>
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
