import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Upload, Trash2, CheckCircle, FileText, Loader2, Brain, Sparkles, Mail, XCircle, AlertTriangle } from "lucide-react";
import SearchHeader from "@/components/search/SearchHeader";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/lib/api/config";

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 border-2 border-red-500/20 glass-morphism shadow-[0_0_30px_rgba(255,0,0,0.1)] card-shimmer">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
            <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
          </div>
          <p className="mb-4">An error occurred while rendering this component.</p>
          <Button 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
          >
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

const ResumeScreening = () => {
  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [benefits, setBenefits] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEngaging, setIsEngaging] = useState(false);
  const [results, setResults] = useState(null);
  const [emailContent, setEmailContent] = useState(null);
  const [recruiterName, setRecruiterName] = useState("");
  const [activeEmailTab, setActiveEmailTab] = useState("default"); // "default", "acceptance", or "rejection"

  // Helper function to get recommendation based on match score
  const getRecommendationFromScore = (matchScore) => {
    if (matchScore >= 80) return "Highly Recommended";
    if (matchScore >= 65) return "Recommended";
    if (matchScore >= 40) return "Maybe";
    return "Not Recommended";
  };

  // Helper function to get the color for a recommendation
  const getRecommendationColor = (recommendation) => {
    if (recommendation?.includes("Highly")) return "text-green-400 bg-green-500/20";
    if (recommendation?.includes("Recommended")) return "text-blue-400 bg-blue-500/20";
    if (recommendation?.includes("Maybe")) return "text-yellow-400 bg-yellow-500/20";
    return "text-orange-400 bg-orange-500/20";
  };

  const handleFileChange = (e) => {
    console.log("File input changed:", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => {
        console.log("Processing file:", file.name, file.type, file.size);
        return {
          id: Math.random().toString(36).substring(7),
          file: file,
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          uploaded: false,
          processing: false,
          resumeId: null,
          candidateName: null,
          candidateInfo: null,
        };
      });
      setFiles([...files, ...newFiles]);
      console.log("Files state updated:", [...files, ...newFiles]);
    } else {
      console.log("No files selected or file input is null");
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const uploadResume = async (file) => {
    try {
      // Update file status
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id 
            ? { ...f, processing: true, error: false, errorMessage: null } 
            : f
        )
      );
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file.file);
      
      console.log("Uploading file:", file.name, file.file.type);
      
      // Upload to backend
      const response = await fetch(API_ENDPOINTS.resume.upload, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Upload response:", data);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload resume');
      }
      
      // Update files state with the new information
      // Create a new updated file object with all the data from the response
      const updatedFile = {
        ...file,
        processing: false,
        uploaded: true,
        resumeId: data.resume_id,
        candidateName: data.candidate_name || 'Unknown',
        candidateInfo: data.candidate_info,
      };
      
      // Update the state with the new file information
      setFiles(prevFiles => prevFiles.map(f => f.id === file.id ? updatedFile : f));
      
      if (data.parse_error) {
        console.warn("Uploaded file but parsing had issues:", data.parse_error);
        toast.warning(`File uploaded but might have parsing issues: ${file.name}`);
      } else {
        toast.success(`Successfully uploaded ${file.name}`);
      }
      
      // Return the updated file
      return updatedFile;
    } catch (error) {
      console.error("Error uploading resume:", error);
      
      // Update file status to show error
      const errorFile = {
        ...file,
        processing: false,
        uploaded: false,
        error: true, 
        errorMessage: error.message
      };
      
      setFiles(prevFiles => prevFiles.map(f => f.id === file.id ? errorFile : f));
      
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
      return null;
    }
  };

  const analyzeResumes = async () => {
    if (files.length === 0 || !jobDescription.trim() || !jobTitle.trim() || !companyName.trim()) {
      toast.error("Please enter job details and upload at least one resume");
      return;
    }
    
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      // Check if any files need to be uploaded first
      const unprocessedFiles = files.filter(file => !file.uploaded && !file.error);
      
      let currentFiles = [...files];
      
      if (unprocessedFiles.length > 0) {
        console.log("Uploading unprocessed files first:", unprocessedFiles.length);
        // Upload all unprocessed files first
        const uploadResults = await Promise.all(
          unprocessedFiles.map(file => uploadResume(file))
        );
        
        // Update our local copy of files with the latest upload results
        uploadResults.forEach(result => {
          if (result) {
            const index = currentFiles.findIndex(f => f.id === result.id);
            if (index !== -1) {
              currentFiles[index] = result;
            }
          }
        });
        
        console.log("Files after upload:", currentFiles);
      }
      
      // Get the current state of files after uploads
      const uploadedFiles = currentFiles.filter(file => file.uploaded && file.resumeId);
      
      if (uploadedFiles.length === 0) {
        toast.error("No valid resumes to analyze. Please check if uploads completed successfully.");
        setIsAnalyzing(false);
        return;
      }
      
      console.log("Analyzing uploaded files:", uploadedFiles.length);
      console.log("Files with resumeId:", uploadedFiles.map(f => f.resumeId));
      
      const jobDescriptionObj = {
        title: jobTitle,
        description: jobDescription,
        company: companyName,
        salary_range: salaryRange,
        benefits: benefits
      };
      
      // Analyze each resume
      const analysisPromises = uploadedFiles.map(async (file) => {
        try {
          const requestData = {
            job_title: jobTitle,
            job_description: jobDescription,
            company: companyName,
            resumes: [file.resumeId]
          };

          console.log("Sending analysis request for file:", file.name, "with resumeId:", file.resumeId);
          
          const response = await fetch(API_ENDPOINTS.resume.screen, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to analyze resume ${file.name}`);
          }
          
          const data = await response.json();
          console.log("Analysis response:", data);
          
          // Check if we got results back
          if (!data.results || data.results.length === 0) {
            throw new Error(`No analysis results returned for ${file.name}`);
          }

          // Get the first result (should be the only one)
          const result = data.results[0];
          
          // Check if result has analysis data
          if (!result.analysis) {
            console.warn(`No analysis data in result for ${file.name}`, result);
            throw new Error(`Analysis data missing for ${file.name}`);
          }
          
          // Handle different response structures
          let analysisData = result.analysis;
          
          // If analysis is a string, try to parse it as JSON
          if (typeof analysisData === 'string') {
            try {
              analysisData = JSON.parse(analysisData);
            } catch (e) {
              // If parsing fails, keep it as a string
              console.warn(`Could not parse analysis data as JSON for ${file.name}`);
            }
          }
          
          // Get match score, defaulting to 50 if not available
          const matchScore = analysisData.match_score || result.match_score || 50;
          
          // Ensure recommendation is consistent with the match score
          const correctRecommendation = getRecommendationFromScore(matchScore);
          
          return {
            id: file.id,
            resumeId: file.resumeId,
            name: file.name,
            candidateName: analysisData.candidate_name || result.candidate_name || 'Unknown',
            match: matchScore,
            recommendation: correctRecommendation, // Always use our consistent recommendation logic
            analysis: analysisData,
            analysisText: typeof analysisData === 'string' ? analysisData : 
                         (analysisData.summary || JSON.stringify(analysisData, null, 2)),
            suitable: matchScore >= 65, // Lower the threshold to match our new system
          };
        } catch (error) {
          console.error(`Error analyzing resume ${file.name}:`, error);
          return {
            id: file.id,
            name: file.name,
            error: true,
          };
        }
      });
      
      const analysisResults = await Promise.all(analysisPromises);
      
      // Validate all results to ensure consistent recommendations
      const validatedResults = analysisResults.map(result => {
        if (result.error) return result;
        
        // Ensure recommendation matches score
        const correctRecommendation = getRecommendationFromScore(result.match);
        if (result.recommendation !== correctRecommendation) {
          console.log(`Fixing inconsistent recommendation: ${result.recommendation} → ${correctRecommendation} for match ${result.match}%`);
          result.recommendation = correctRecommendation;
        }
        
        return result;
      });
      
      setResults(validatedResults);
      
      const successfulAnalyses = validatedResults.filter(r => !r.error);
      if (successfulAnalyses.length > 0) {
        toast.success(`Successfully analyzed ${successfulAnalyses.length} resume(s)`);
      }
    } catch (error) {
      console.error("Error analyzing resumes:", error);
      toast.error("Failed to analyze resumes");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const engageCandidate = async (candidateResult) => {
    if (!recruiterName.trim()) {
      toast.error("Please enter your name as the recruiter");
      return;
    }
    
    setIsEngaging(true);
    setEmailContent(null);
    setActiveEmailTab("default"); // Reset to default tab
    
    try {
      // Show engagement agent notification
      toast.info("Engagement agent triggered - generating both acceptance and rejection communications");
      
      const jobDetails = {
        candidate_id: candidateResult.id,
        candidate_name: candidateResult.candidateName,
        job_title: jobTitle,
        job_description: jobDescription,
        company_name: companyName,
        salary_range: salaryRange,
        benefits: benefits,
        recruiter_name: recruiterName,
        match_score: candidateResult.match,
        recommendation: candidateResult.recommendation,
        is_suitable: candidateResult.suitable,
        max_tokens: 2048
      };
      
      const response = await fetch(API_ENDPOINTS.resume.engage, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobDetails),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate engagement emails");
      }
      
      const data = await response.json();
      console.log("Engagement response:", data);
      
      // Check if response contains expected formats
      if (!data.acceptance || !data.rejection) {
        throw new Error("Incomplete communication response received");
      }
      
      // Set email content with both acceptance and rejection
      setEmailContent({
        candidateName: candidateResult.candidateName,
        isAcceptance: data.is_acceptance, // This is the default view based on match score
        acceptance: {
          subject: data.acceptance.email.subject,
          body: data.acceptance.email.body,
          linkedInMessage: data.acceptance.linkedin_message
        },
        rejection: {
          subject: data.rejection.email.subject,
          body: data.rejection.email.body,
          linkedInMessage: data.rejection.linkedin_message
        }
      });
      
      toast.success(`Communication templates for ${candidateResult.candidateName} generated successfully`);
    } catch (error) {
      console.error("Error generating engagement emails:", error);
      toast.error("Failed to generate engagement emails");
    } finally {
      setIsEngaging(false);
    }
  };

  // Add a useEffect to log state changes for debugging
  useEffect(() => {
    if (results) {
      console.log('Results state updated:', results);
    }
  }, [results]);
  
  useEffect(() => {
    if (isAnalyzing === false) {
      console.log('Analysis completed, files state:', files);
    }
  }, [isAnalyzing, files]);

  // Add safety check for unexpected data
  const safelyRenderResults = () => {
    try {
      console.log('Attempting to render results:', results);
      if (!results || !Array.isArray(results) || results.length === 0) {
        console.log('No valid results to render');
        return null;
      }
      
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Screening Results</h2>
          
          {results.map((result, index) => (
            <motion.div
              key={result.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`p-6 border-2 glass-morphism ${
                result.error ? 'border-red-500/20' :
                result.match >= 80 ? 'border-green-500/20' :
                result.match >= 65 ? 'border-blue-500/20' :
                result.match >= 40 ? 'border-yellow-500/20' :
                result.match > 0 ? 'border-orange-500/20' :
                'border-white/10'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center mb-2 md:mb-0">
                    <FileText className="h-5 w-5 mr-2 text-raya-blue" />
                    <h3 className="text-xl font-medium">{result.candidateName || result.name}</h3>
                  </div>
                  
                  {!result.error && (
                    <div className="flex items-center space-x-2">
                      <div className="text-sm bg-black/30 px-3 py-1 rounded-full">
                        Match: 
                        <span className={`ml-1 font-bold ${
                          result.match >= 80 ? 'text-green-400' :
                          result.match >= 65 ? 'text-blue-400' :
                          result.match >= 40 ? 'text-yellow-400' :
                          'text-orange-400'
                        }`}>
                          {result.match}%
                        </span>
                      </div>
                      
                      <div className={`text-sm px-3 py-1 rounded-full ${getRecommendationColor(result.recommendation)}`}>
                        {result.recommendation || "Not Rated"}
                      </div>
                    </div>
                  )}
                </div>
                
                {result.error ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <p>There was an error analyzing this resume. Please try again.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-4 bg-black/20 rounded-lg">
                      <h4 className="font-medium mb-2">Analysis</h4>
                      <p className="text-sm whitespace-pre-wrap">
                        {result.analysisText || 'Analysis not available'}
                      </p>
                      
                      {result.analysis && result.analysis.top_matches && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-1 text-green-400">Top Matches</h5>
                          <ul className="list-disc pl-5 text-sm">
                            {result.analysis.top_matches.map((match, idx) => (
                              <li key={idx}>
                                <span className="font-medium">{match.requirement || match.skill}:</span> {match.match}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.analysis && result.analysis.gaps && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-1 text-amber-400">Areas for Improvement</h5>
                          <ul className="list-disc pl-5 text-sm">
                            {result.analysis.gaps.map((gap, idx) => (
                              <li key={idx}>
                                <span className="font-medium">{gap.requirement || gap.skill}:</span> {gap.gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {result.suitable ? (
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => engageCandidate(result)}
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/20"
                          disabled={isEngaging}
                        >
                          {isEngaging ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Generate Communication
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => engageCandidate(result)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg shadow-amber-500/20"
                          disabled={isEngaging}
                        >
                          {isEngaging ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Generate Communication
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      );
    } catch (error) {
      console.error("Error rendering results:", error);
      return (
        <Card className="p-6 border-2 border-red-500/20">
          <div className="text-red-500 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>Error displaying results. Please try again.</p>
          </div>
        </Card>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-raya-dark to-black/95 overflow-hidden">
      <SearchHeader />

      <main className="flex-1 container mx-auto py-8 px-4 max-w-5xl relative">
        {/* Background elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 2 }}
            className="absolute -top-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-raya-purple blur-[120px]" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute bottom-0 left-1/4 w-1/3 h-1/3 rounded-full bg-raya-blue blur-[150px]" 
          />
        </div>
        
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-10 relative"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center mb-4"
              >
                <Brain className="h-6 w-6 mr-2 text-raya-blue" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-raya-blue via-raya-purple to-raya-green bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Resume Screening Agent
                </h1>
              </motion.div>
              <p className="text-muted-foreground">
                Upload resumes and let our superintelligent AI match them against your job description
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6 border-2 border-raya-purple/20 glass-morphism shadow-[0_0_30px_rgba(192,132,252,0.1)] card-shimmer">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-raya-purple" />
                    Job Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Job Title
                      </label>
                      <Input 
                        placeholder="e.g. Senior Frontend Developer" 
                        className="bg-black/30 border-white/10 focus:border-raya-purple/30 placeholder:text-raya-gray/60"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Company Name
                      </label>
                      <Input 
                        placeholder="e.g. Acme Corporation" 
                        className="bg-black/30 border-white/10 focus:border-raya-purple/30 placeholder:text-raya-gray/60"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Job Description
                      </label>
                      <Textarea 
                        placeholder="Enter the job description here..." 
                        className="h-24 bg-black/30 border-white/10 focus:border-raya-purple/30 placeholder:text-raya-gray/60"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">
                          Salary Range (Optional)
                        </label>
                        <Input 
                          placeholder="e.g. $80,000 - $100,000" 
                          className="bg-black/30 border-white/10 focus:border-raya-purple/30 placeholder:text-raya-gray/60"
                          value={salaryRange}
                          onChange={(e) => setSalaryRange(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">
                          Your Name (Recruiter)
                        </label>
                        <Input 
                          placeholder="e.g. Jane Smith" 
                          className="bg-black/30 border-white/10 focus:border-raya-purple/30 placeholder:text-raya-gray/60"
                          value={recruiterName}
                          onChange={(e) => setRecruiterName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Benefits (Optional)
                      </label>
                      <Input 
                        placeholder="e.g. Health insurance, 401k, Remote work" 
                        className="bg-black/30 border-white/10 focus:border-raya-purple/30 placeholder:text-raya-gray/60"
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-6 border-2 border-raya-blue/20 glass-morphism shadow-[0_0_30px_rgba(0,255,255,0.1)] card-shimmer">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-raya-blue" />
                    Upload Resumes
                  </h2>
                  
                  <motion.div 
                    whileHover={{ boxShadow: "0 0 20px rgba(0,255,255,0.2)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 mb-4 hover:border-raya-blue/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('resume-upload').click()}
                  >
                    <Upload className="h-12 w-12 text-raya-blue mb-4" />
                    <p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      id="resume-upload"
                      onChange={handleFileChange}
                      accept=".pdf,.docx"
                    />
                    <Button 
                      type="button"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-cyan-500/20" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('resume-upload').click();
                      }}
                    >
                      Select Files
                    </Button>
                  </motion.div>

                  {files.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {files.map((file, index) => (
                        <motion.div 
                          key={file.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between p-2 border border-white/10 rounded-md bg-black/20 backdrop-blur-sm"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-raya-blue" />
                            <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-2">{file.size} KB</span>
                            {file.processing && (
                              <Loader2 className="h-4 w-4 text-raya-blue animate-spin mr-2" />
                            )}
                            {file.uploaded && (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            )}
                            {file.error && (
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-6 w-6 p-0">
                              <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <Button 
                onClick={analyzeResumes} 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-cyan-500/20 px-8 py-6"
                disabled={files.length === 0 || !jobDescription.trim() || !jobTitle.trim() || !companyName.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running agent...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Analyze Resumes
                  </>
                )}
              </Button>
            </motion.div>

            {/* Results Section */}
            <ErrorBoundary>
              {results && results.length > 0 && safelyRenderResults()}
            </ErrorBoundary>
            
            {/* Email Content */}
            <ErrorBoundary>
              {emailContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8"
                >
                  <Card className="p-6 border-2 glass-morphism shadow-[0_0_30px_rgba(0,255,255,0.1)] border-white/10">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Mail className="mr-2 h-5 w-5 text-raya-blue" />
                        Communication Templates for {emailContent.candidateName}
                      </h2>
                      
                      <div className="flex space-x-2 border-b border-gray-700 mb-4">
                        <button
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            activeEmailTab === "default" ? 
                              (emailContent.isAcceptance ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-500') :
                              'hover:bg-gray-800/50'
                          }`}
                          onClick={() => setActiveEmailTab("default")}
                        >
                          {emailContent.isAcceptance ? 'Recommendation: Interview' : 'Recommendation: Reject'}
                        </button>
                        <button
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            activeEmailTab === "acceptance" ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'hover:bg-gray-800/50'
                          }`}
                          onClick={() => setActiveEmailTab("acceptance")}
                        >
                          Interview Option
                        </button>
                        <button
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                            activeEmailTab === "rejection" ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-500' : 'hover:bg-gray-800/50'
                          }`}
                          onClick={() => setActiveEmailTab("rejection")}
                        >
                          Rejection Option
                        </button>
                      </div>
                    </div>
                    
                    {/* Content based on active tab */}
                    {activeEmailTab === "default" && (
                      <div className="space-y-4">
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                          <h3 className={`text-sm font-medium mb-1 ${
                            emailContent.isAcceptance ? 'text-emerald-500' : 'text-amber-500'
                          }`}>Subject</h3>
                          <p>{emailContent.isAcceptance ? emailContent.acceptance.subject : emailContent.rejection.subject}</p>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                          <h3 className={`text-sm font-medium mb-1 ${
                            emailContent.isAcceptance ? 'text-emerald-500' : 'text-amber-500'
                          }`}>Email Body</h3>
                          <div className="whitespace-pre-wrap">
                            {emailContent.isAcceptance ? emailContent.acceptance.body : emailContent.rejection.body}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                          <h3 className={`text-sm font-medium mb-1 text-blue-400`}>LinkedIn Message</h3>
                          <div className="whitespace-pre-wrap">
                            {emailContent.isAcceptance ? emailContent.acceptance.linkedInMessage : emailContent.rejection.linkedInMessage}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeEmailTab === "acceptance" && (
                      <div className="space-y-4">
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                          <h3 className="text-sm font-medium mb-1 text-emerald-500">Subject</h3>
                          <p>{emailContent.acceptance.subject}</p>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                          <h3 className="text-sm font-medium mb-1 text-emerald-500">Email Body</h3>
                          <div className="whitespace-pre-wrap">{emailContent.acceptance.body}</div>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                          <h3 className="text-sm font-medium mb-1 text-blue-400">LinkedIn Message</h3>
                          <div className="whitespace-pre-wrap">{emailContent.acceptance.linkedInMessage}</div>
                        </div>
                      </div>
                    )}
                    
                    {activeEmailTab === "rejection" && (
                      <div className="space-y-4">
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10">
                          <h3 className="text-sm font-medium mb-1 text-amber-500">Subject</h3>
                          <p>{emailContent.rejection.subject}</p>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                          <h3 className="text-sm font-medium mb-1 text-amber-500">Email Body</h3>
                          <div className="whitespace-pre-wrap">{emailContent.rejection.body}</div>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg border border-white/10 max-h-[400px] overflow-y-auto">
                          <h3 className="text-sm font-medium mb-1 text-blue-400">LinkedIn Message</h3>
                          <div className="whitespace-pre-wrap">{emailContent.rejection.linkedInMessage}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-3 mt-4">
                      <Button 
                        variant="outline"
                        className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                        onClick={() => setEmailContent(null)}
                      >
                        Close
                      </Button>
                      
                      <Button
                        className={`text-white font-medium shadow-lg ${
                          activeEmailTab === "rejection" ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20' :
                          activeEmailTab === "acceptance" ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-emerald-500/20' :
                          (emailContent.isAcceptance ? 
                            'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-emerald-500/20' : 
                            'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20')
                        }`}
                        onClick={() => {
                          // Format based on active tab
                          let subjectText, bodyText, linkedInText;
                          
                          if (activeEmailTab === "acceptance") {
                            subjectText = emailContent.acceptance.subject;
                            bodyText = emailContent.acceptance.body;
                            linkedInText = emailContent.acceptance.linkedInMessage;
                          } else if (activeEmailTab === "rejection") {
                            subjectText = emailContent.rejection.subject;
                            bodyText = emailContent.rejection.body;
                            linkedInText = emailContent.rejection.linkedInMessage;
                          } else {
                            // Default based on recommendation
                            if (emailContent.isAcceptance) {
                              subjectText = emailContent.acceptance.subject;
                              bodyText = emailContent.acceptance.body;
                              linkedInText = emailContent.acceptance.linkedInMessage;
                            } else {
                              subjectText = emailContent.rejection.subject;
                              bodyText = emailContent.rejection.body;
                              linkedInText = emailContent.rejection.linkedInMessage;
                            }
                          }
                          
                          // Format both email and LinkedIn message together
                          const clipboardText = `
EMAIL:
Subject: ${subjectText}

${bodyText}

LINKEDIN MESSAGE:
${linkedInText}
                          `.trim();
                          
                          navigator.clipboard.writeText(clipboardText);
                          toast.success("Communication copied to clipboard!");
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </ErrorBoundary>
          </motion.div>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default ResumeScreening;
