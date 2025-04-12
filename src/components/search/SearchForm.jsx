import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, X, Loader2, Sparkles, Zap, Brain, Building, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const SearchForm = ({ onSearch, isSearching, recruiterName, onRecruiterNameChange }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (jobTitle.trim()) {
      onSearch({
        jobTitle,
        companyName,
        jobDescription,
        skillsRequired,
        experienceLevel,
        location
      });
    }
  };

  const clearSearch = () => {
    setJobTitle("");
    setCompanyName("");
    setJobDescription("");
    setSkillsRequired("");
    setExperienceLevel("");
    setLocation("");
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
        Enter job details to activate the AI agent and discover qualified candidates
      </p>
      
      <Card className="mb-8 overflow-hidden border-2 border-raya-yellow/20 shadow-lg shadow-raya-yellow/10 card-shimmer">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Label htmlFor="jobTitle" className="text-sm text-muted-foreground mb-1 block">
                Job Title <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g. Frontend Developer, Marketing Manager, Data Scientist"
                  className="pl-10 bg-black/30 border-white/10 focus:border-raya-yellow/50 focus:ring-1 focus:ring-raya-yellow/30"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
                {jobTitle && (
                  <button
                    type="button"
                    onClick={() => setJobTitle("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            
            <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-sm text-muted-foreground mb-1 block">
                    Company Name <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="e.g. Acme Corporation"
                      className="pl-10 bg-black/30 border-white/10 focus:border-raya-yellow/50"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-sm text-muted-foreground mb-1 block">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g. San Francisco, CA or Remote"
                      className="pl-10 bg-black/30 border-white/10 focus:border-raya-yellow/50"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="jobDescription" className="text-sm text-muted-foreground mb-1 block">
                  Job Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Enter a detailed job description..."
                  className="h-20 bg-black/30 border-white/10 focus:border-raya-yellow/50 resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="skillsRequired" className="text-sm text-muted-foreground mb-1 block">
                  Skills Required <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="skillsRequired"
                  type="text"
                  placeholder="e.g. React, JavaScript, UI/UX, Communication (comma-separated)"
                  className="bg-black/30 border-white/10 focus:border-raya-yellow/50"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceLevel" className="text-sm text-muted-foreground mb-1 block">
                    Experience Level <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="experienceLevel"
                    type="text"
                    placeholder="e.g. Entry, Mid-level, Senior"
                    className="bg-black/30 border-white/10 focus:border-raya-yellow/50"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="recruiterName" className="text-sm text-muted-foreground mb-1 block">
                    Your Name (Recruiter) <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="recruiterName"
                    type="text"
                    placeholder="e.g. Jane Smith"
                    className="bg-black/30 border-white/10 focus:border-raya-yellow/50"
                    value={recruiterName || ""}
                    onChange={(e) => onRecruiterNameChange(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                type="button" 
                variant="ghost" 
                className="text-raya-yellow hover:text-raya-yellow/80 hover:bg-transparent underline"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide Details" : "Show More Details"}
              </Button>
              
              <div className="flex items-center space-x-2">
                {(jobTitle || companyName || jobDescription) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearSearch}
                    className="border-white/10 hover:bg-white/5"
                  >
                    Clear
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-raya-yellow to-raya-green hover:from-raya-yellow/90 hover:to-raya-green/90 text-black font-medium px-6 neon-yellow-box"
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
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SearchForm;
