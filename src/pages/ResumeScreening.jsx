
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Upload, Trash2, CheckCircle, FileText, Loader2, Brain, Sparkles } from "lucide-react";
import SearchHeader from "@/components/search/SearchHeader";

const ResumeScreening = () => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(7),
        file: file,
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        uploaded: true,
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const analyzeResumes = () => {
    if (files.length === 0 || !jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    
    // Mock analysis (in a real app, this would call an API)
    setTimeout(() => {
      const mockResults = files.map(file => ({
        id: file.id,
        name: file.name,
        match: Math.floor(Math.random() * 41) + 60, // Random match score between 60-100
        keySkills: ["React", "JavaScript", "UI/UX", "API Integration"].sort(() => 0.5 - Math.random()).slice(0, 3),
        strengths: ["Technical knowledge", "Problem solving", "Communication"].sort(() => 0.5 - Math.random()).slice(0, 2),
        gaps: ["Leadership experience", "Project management"].sort(() => 0.5 - Math.random()).slice(0, 1),
      }));
      
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2500);
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
                  Job Description
                </h2>
                <Textarea 
                  placeholder="Enter the job description here..." 
                  className="h-48 mb-4 bg-black/30 border-white/10 focus:border-raya-purple/30 placeholder:text-raya-gray/60"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="text-sm text-muted-foreground mb-4">
                  Add details about the role, required skills, and experience level.
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
                  className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 mb-4 hover:border-raya-blue/50 transition-colors"
                >
                  <Upload className="h-12 w-12 text-raya-blue mb-4" />
                  <p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                  <Input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="resume-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="resume-upload">
                    <Button className="bg-gradient-to-r from-raya-blue to-raya-purple hover:opacity-90 shadow-[0_0_10px_rgba(0,255,255,0.3)]" size="sm">
                      Select Files
                    </Button>
                  </label>
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
              className="bg-gradient-to-r from-raya-blue to-raya-purple hover:opacity-90 shadow-[0_0_15px_rgba(0,255,255,0.4)] px-8 py-6"
              disabled={files.length === 0 || !jobDescription.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running agent...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Run Agent
                </>
              )}
            </Button>
          </motion.div>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-raya-green" />
                Analysis Results
              </h2>
              
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="p-6 border-2 border-white/5 glass-morphism shadow-[0_0_20px_rgba(0,0,0,0.3)] card-shimmer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-raya-purple" />
                        <h3 className="text-lg font-medium">{result.name}</h3>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          result.match >= 80 ? 'bg-raya-green/20 text-raya-green border border-raya-green/30 shadow-[0_0_10px_rgba(57,255,20,0.2)]' : 
                          result.match >= 70 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {result.match}% Match
                      </motion.div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <h4 className="text-sm font-medium text-raya-blue">Key Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.keySkills.map(skill => (
                            <motion.span 
                              key={skill} 
                              whileHover={{ scale: 1.05 }}
                              className="text-xs px-2 py-1 bg-raya-blue/10 border border-raya-blue/30 rounded-full text-raya-blue"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <h4 className="text-sm font-medium text-raya-green">Strengths</h4>
                        <ul className="text-sm space-y-1">
                          {result.strengths.map(strength => (
                            <li key={strength} className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-raya-green" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <h4 className="text-sm font-medium text-raya-purple">Gaps</h4>
                        <ul className="text-sm space-y-1">
                          {result.gaps.map(gap => (
                            <li key={gap} className="flex items-center">
                              <span className="h-3 w-3 mr-2 text-raya-purple">•</span>
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ResumeScreening;
