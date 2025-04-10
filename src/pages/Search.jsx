
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, Briefcase, User, MapPin, Award, X, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import CandidateCard from "@/components/CandidateCard";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mockCandidates = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    experience: "8 years",
    skills: ["React", "Vue", "JavaScript", "CSS", "HTML"],
    image: "https://i.pravatar.cc/150?img=1",
    matchScore: 92,
  },
  {
    id: 2,
    name: "Samantha Lee",
    title: "UI/UX Designer",
    location: "New York, NY",
    experience: "5 years",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    image: "https://i.pravatar.cc/150?img=5",
    matchScore: 88,
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Full Stack Developer",
    location: "Austin, TX",
    experience: "6 years",
    skills: ["Node.js", "React", "MongoDB", "Express", "TypeScript"],
    image: "https://i.pravatar.cc/150?img=3",
    matchScore: 85,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    title: "Product Manager",
    location: "Seattle, WA",
    experience: "7 years",
    skills: ["Agile", "Scrum", "Product Strategy", "User Research"],
    image: "https://i.pravatar.cc/150?img=9",
    matchScore: 79,
  },
  {
    id: 5,
    name: "David Kim",
    title: "DevOps Engineer",
    location: "Chicago, IL",
    experience: "4 years",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    image: "https://i.pravatar.cc/150?img=6",
    matchScore: 75,
  }
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a job position to search for candidates.");
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockCandidates);
      setIsSearching(false);
      toast.success(`Found ${mockCandidates.length} candidates for "${searchQuery}"`);
    }, 1500);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
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
              Enter a job position to discover qualified candidates across all major job platforms
            </p>
            
            <Card className="mb-8 overflow-hidden border-2 border-raya-purple/20">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Enter job position (e.g., 'Frontend Developer')"
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
                    Top candidates for "{searchQuery}"
                  </h3>
                  <div className="space-y-6">
                    {searchResults.map((candidate, index) => (
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
