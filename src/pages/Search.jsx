
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, Briefcase, User, MapPin, Award, X, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import CandidateCard from "@/components/CandidateCard";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { filterCandidatesByQuery } from "@/data/mockCandidates";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a job position to search for candidates.");
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call with our large dataset
    setTimeout(() => {
      const results = filterCandidatesByQuery(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setCurrentPage(1);
      
      if (results.length > 0) {
        toast.success(`Found ${results.length} candidates for "${searchQuery}"`);
      } else {
        toast.info(`No candidates found for "${searchQuery}". Try a different search term.`);
      }
    }, 1500);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * resultsPerPage, 
    currentPage * resultsPerPage
  );

  // Handle page change
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">RAYA</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Find Top Talent</h2>
            <p className="text-muted-foreground text-center mb-8">
              Enter a job position, skill, or category to discover qualified candidates across all major job platforms
            </p>
            
            <Card className="mb-8 overflow-hidden border-2 border-raya-purple/20">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Try 'Frontend Developer', 'React', 'Marketing', etc."
                      className="pl-10 py-6 text-lg"
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
                    className="bg-raya-purple hover:bg-raya-purple/90 text-white px-6"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {isSearching && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-raya-purple" />
              <p className="text-lg">Searching across job platforms...</p>
            </div>
          )}

          {hasSearched && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {searchResults.length > 0 ? (
                <>
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
                    <Pagination className="my-8">
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => 
                            page === 1 || 
                            page === totalPages || 
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          )
                          .map((page, i, array) => {
                            // Add ellipsis where needed
                            if (i > 0 && array[i - 1] !== page - 1) {
                              return (
                                <React.Fragment key={`ellipsis-${page}`}>
                                  <PaginationItem>
                                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                                  </PaginationItem>
                                  <PaginationItem>
                                    <PaginationLink 
                                      onClick={() => goToPage(page)} 
                                      isActive={page === currentPage}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                </React.Fragment>
                              );
                            }
                            
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink 
                                  onClick={() => goToPage(page)} 
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })
                        }
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext onClick={() => goToPage(currentPage + 1)} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No candidates found. Try a different search.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;
