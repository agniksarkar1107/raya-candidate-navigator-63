
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Upload, Trash2, CheckCircle, FileText, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <SearchHeader />

      <main className="flex-1 container mx-auto py-8 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Resume Screening</h1>
          <p className="text-muted-foreground text-center mb-12">
            Upload resumes and check their match against your job description
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 border-2 border-raya-purple/20">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <Textarea 
                placeholder="Enter the job description here..." 
                className="h-48 mb-4"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="text-sm text-muted-foreground mb-4">
                Add details about the role, required skills, and experience level.
              </div>
            </Card>

            <Card className="p-6 border-2 border-raya-purple/20">
              <h2 className="text-xl font-semibold mb-4">Upload Resumes</h2>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 mb-4 hover:border-raya-purple/50 transition-colors">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                <Input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  id="resume-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="resume-upload">
                  <Button className="bg-raya-purple hover:bg-raya-purple/90" size="sm">
                    Select Files
                  </Button>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2 border border-border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-2">{file.size} KB</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-6 w-6 p-0">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="flex justify-center mb-12">
            <Button 
              onClick={analyzeResumes} 
              className="bg-raya-purple hover:bg-raya-purple/90 px-8"
              disabled={files.length === 0 || !jobDescription.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resumes'
              )}
            </Button>
          </div>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
              
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6 border-2 border-muted/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-raya-purple" />
                        <h3 className="text-lg font-medium">{result.name}</h3>
                      </div>
                      <div className="flex items-center">
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          result.match >= 80 ? 'bg-green-500/20 text-green-600' : 
                          result.match >= 70 ? 'bg-amber-500/20 text-amber-600' : 
                          'bg-red-500/20 text-red-600'
                        }`}>
                          {result.match}% Match
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.keySkills.map(skill => (
                            <span key={skill} className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Strengths</h4>
                        <ul className="text-sm space-y-1">
                          {result.strengths.map(strength => (
                            <li key={strength} className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Gaps</h4>
                        <ul className="text-sm space-y-1">
                          {result.gaps.map(gap => (
                            <li key={gap} className="flex items-center">
                              <span className="h-3 w-3 mr-2 text-red-500">•</span>
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
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
