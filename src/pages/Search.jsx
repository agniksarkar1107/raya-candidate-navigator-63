import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import SearchHeader from "@/components/search/SearchHeader";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "@/lib/api/config";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Mail, Brain, ExternalLink, Linkedin, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TalentDiscovery = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [emailContent, setEmailContent] = useState(null);
  const [linkedInMessage, setLinkedInMessage] = useState(null);
  const [isGeneratingEngagement, setIsGeneratingEngagement] = useState(false);
  const [engagementProfile, setEngagementProfile] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recruiterName, setRecruiterName] = useState("");

  useEffect(() => {
    // Add a small delay to make sure animations run smoothly
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTalentDiscovery = async (e) => {
    e?.preventDefault();
    
    if (!searchPrompt.trim()) {
      toast.error("Please enter a search prompt");
      return;
    }
    
    if (!companyName.trim()) {
      toast.error("Please enter your company name");
      return;
    }
    
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    setSearchResults(null);
    setAnalysis("");
    setEmailContent(null);
    setLinkedInMessage(null);
    setEngagementProfile(null);
    
    try {
      // Prepare request data
      const requestData = {
        search_query: searchPrompt,
        job_description: jobDescription,
        company_name: companyName,
      };
      
      toast.info("Web search agent triggered");
      
      // Call the talent discovery API
      const response = await fetch(API_ENDPOINTS.search.talentDiscovery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to discover talent");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        toast.error(data.message || "Failed to discover talent");
        return;
      }
      
      setSearchResults(data.profiles);
      setAnalysis(data.analysis);
      
      toast.success(`Found ${data.profiles.length} potential candidates`);
    } catch (error) {
      console.error("Error discovering talent:", error);
      toast.error("Failed to discover talent. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const engageCandidate = async (profile) => {
    if (!recruiterName.trim()) {
      toast.error("Please enter your name as the recruiter");
      return;
    }
    
    setIsGeneratingEngagement(true);
    setEngagementProfile(profile);
    setEmailContent(null);
    setLinkedInMessage(null);
    
    // Scroll to where the engagement content will appear
    setTimeout(() => {
      document.getElementById('engagement-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    try {
      toast.info("Engagement agent triggered");
      
      // Create request data
      const requestData = {
        job_query: searchPrompt,
        job_description: jobDescription,
        company_name: companyName,
        recruiter_name: recruiterName,
        candidate_profile: profile
      };
      
      // Fetch both email and LinkedIn message in parallel
      const [emailResponse, linkedInResponse] = await Promise.all([
        fetch(API_ENDPOINTS.search.draftOutreachEmail, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }),
        fetch(API_ENDPOINTS.search.draftLinkedInMessage, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })
      ]);
      
      if (!emailResponse.ok) {
        throw new Error("Failed to generate outreach email");
      }
      
      if (!linkedInResponse.ok) {
        throw new Error("Failed to generate LinkedIn message");
      }
      
      const emailData = await emailResponse.json();
      const linkedInData = await linkedInResponse.json();
      
      if (!emailData.success) {
        toast.error(emailData.message || "Failed to generate email");
      } else {
        setEmailContent({
          profile: profile,
          subject: emailData.email.subject,
          body: emailData.email.body
        });
      }
      
      if (!linkedInData.success) {
        toast.error(linkedInData.message || "Failed to generate LinkedIn message");
      } else {
        setLinkedInMessage({
          profile: profile,
          message: linkedInData.linkedin_message
        });
      }
      
      toast.success(`Engagement content for ${profile.title} generated`);
    } catch (error) {
      console.error("Error generating engagement content:", error);
      toast.error("Failed to generate engagement content");
    } finally {
      setIsGeneratingEngagement(false);
    }
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
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center">
                  <Search className="mr-2 h-5 w-5 text-raya-purple" />
                  Talent Discovery Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTalentDiscovery} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Search prompt (e.g., 'data scientist with 5 years experience in kolkata')"
                      value={searchPrompt}
                      onChange={(e) => setSearchPrompt(e.target.value)}
                      className="bg-black/30 border-white/10 placeholder:text-raya-gray/60"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-black/30 border-white/10 placeholder:text-raya-gray/60"
                    />
                    <Input
                      placeholder="Your Name (Recruiter)"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                      className="bg-black/30 border-white/10 placeholder:text-raya-gray/60"
                    />
                  </div>
                  
                  <Textarea
                    placeholder="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="bg-black/30 border-white/10 placeholder:text-raya-gray/60 min-h-[100px]"
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-cyan-500/20"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running Agent...
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

          {hasSearched && (
            <motion.div 
              variants={itemVariants}
              className="mt-8 space-y-6"
            >
              {/* Analysis Section */}
              {analysis && (
                <Card className="bg-white/5 border-white/10 backdrop-blur overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center">
                      <Brain className="mr-2 h-5 w-5 text-raya-blue" />
                      Candidate Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/30 p-4 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                      <div className="whitespace-pre-wrap">{analysis}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search Results */}
              {searchResults && searchResults.length > 0 && (
                <Card className="bg-white/5 border-white/10 backdrop-blur overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center">
                      <Search className="mr-2 h-5 w-5 text-raya-purple" />
                      Discovered Profiles ({searchResults.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {searchResults.slice(0, 5).map((profile, index) => (
                        <div 
                          key={profile.id || index}
                          className="bg-black/30 p-4 rounded-lg border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                          <div className="md:flex-1">
                            <h3 className="font-medium text-raya-blue">{profile.title}</h3>
                            <p className="text-sm text-raya-gray mt-1">{profile.description}</p>
                            <div className="mt-2 flex items-center">
                              <a 
                                href={profile.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-raya-purple flex items-center hover:underline"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" /> View Profile
                              </a>
                            </div>
                          </div>
                          <Button
                            onClick={() => engageCandidate(profile)}
                            disabled={isGeneratingEngagement && engagementProfile?.id === profile.id}
                            className="bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 mt-3 md:mt-0"
                            size="sm"
                          >
                            {isGeneratingEngagement && engagementProfile?.id === profile.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <>
                                <MessageSquare className="mr-1 h-3 w-3" />
                                Engage Candidate
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {searchResults.length > 5 && (
                      <p className="text-sm text-raya-gray mt-4 text-center">
                        Showing 5 of {searchResults.length} profiles
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Engagement Content Section */}
              <div id="engagement-content" className="mt-8">
                {isGeneratingEngagement && !emailContent && !linkedInMessage && (
                  <Card className="border-2 border-raya-blue/20 glass-morphism shadow-[0_0_30px_rgba(0,255,255,0.1)] p-10">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-raya-blue mb-4" />
                      <p className="text-raya-blue">Generating engagement content...</p>
                    </div>
                  </Card>
                )}
                
                {(emailContent || linkedInMessage) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-2 border-raya-blue/20 glass-morphism shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                      <CardHeader className="pb-4 border-b border-white/10">
                        <CardTitle className="text-xl flex items-center">
                          <MessageSquare className="mr-2 h-5 w-5 text-raya-blue" />
                          Engagement Content for {engagementProfile?.title || "Candidate"}
                        </CardTitle>
                        <CardDescription>
                          Use these templates to reach out to your candidate
                        </CardDescription>
                      </CardHeader>
                      
                      <Tabs defaultValue="email" className="w-full">
                        <div className="px-6 pt-4">
                          <TabsList className="w-full grid grid-cols-2 mb-4">
                            <TabsTrigger value="email" className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              Email Template
                            </TabsTrigger>
                            <TabsTrigger value="linkedin" className="flex items-center">
                              <Linkedin className="mr-2 h-4 w-4" />
                              LinkedIn Message
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        
                        <TabsContent value="email" className="px-6 pb-6 space-y-4">
                          {emailContent ? (
                            <>
                              <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                                <h3 className="text-sm font-medium text-raya-blue mb-1">Subject</h3>
                                <div>{emailContent.subject}</div>
                              </div>
                              
                              <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                                <h3 className="text-sm font-medium text-raya-blue mb-1">Body</h3>
                                <div className="whitespace-pre-wrap">{emailContent.body}</div>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button
                                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md shadow-cyan-500/20"
                                  onClick={() => {
                                    toast.success("Email copied to clipboard!");
                                    navigator.clipboard.writeText(`Subject: ${emailContent.subject}\n\n${emailContent.body}`);
                                  }}
                                >
                                  <Mail className="mr-1 h-4 w-4" />
                                  Copy Email
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="h-8 w-8 animate-spin text-raya-blue" />
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="linkedin" className="px-6 pb-6 space-y-4">
                          {linkedInMessage ? (
                            <>
                              <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                                <h3 className="text-sm font-medium text-raya-blue mb-1">Connection Message</h3>
                                <div className="whitespace-pre-wrap">{linkedInMessage.message}</div>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button
                                  className="bg-gradient-to-r from-[#0077B5] to-[#0066A0] hover:from-[#0088CC] hover:to-[#0077B5] text-white shadow-md shadow-[#0077B5]/20"
                                  onClick={() => {
                                    toast.success("LinkedIn message copied to clipboard!");
                                    navigator.clipboard.writeText(linkedInMessage.message);
                                  }}
                                >
                                  <Linkedin className="mr-1 h-4 w-4" />
                                  Copy Message
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="h-8 w-8 animate-spin text-raya-blue" />
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TalentDiscovery;
