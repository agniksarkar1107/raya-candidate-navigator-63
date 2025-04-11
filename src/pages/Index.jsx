
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, FileText, MessageSquare, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/search');
  };

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.12,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const featuresData = [
    {
      title: "Candidate Search",
      description: "Find perfect candidates across all job platforms",
      icon: <Search className="w-6 h-6 text-raya-blue" />,
      delay: 0.2
    },
    {
      title: "Resume Screening",
      description: "Upload and analyze resumes for job matching",
      icon: <FileText className="w-6 h-6 text-raya-green" />,
      delay: 0.3
    },
    {
      title: "AI Assistant",
      description: "Chat with our AI to analyze candidate data",
      icon: <MessageSquare className="w-6 h-6 text-raya-purple" />,
      delay: 0.4
    },
    {
      title: "Scheduling",
      description: "Automate interview scheduling and emails",
      icon: <Calendar className="w-6 h-6 text-raya-blue" />,
      delay: 0.5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-raya-dark">
      <header className="w-full p-6 flex justify-between items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl font-bold text-gradient animate-text-shimmer bg-gradient-to-r from-raya-blue via-raya-purple to-raya-green bg-[length:200%_auto]"
        >
          RAYA
        </motion.div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-raya-blue blur-[120px]" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.07 }}
            transition={{ duration: 2, delay: 0.7 }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-raya-green blur-[140px]" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.07 }}
            transition={{ duration: 2, delay: 0.9 }}
            className="absolute top-1/3 left-1/4 w-1/3 h-1/3 rounded-full bg-raya-purple/40 blur-[100px]" 
          />
        </div>
        
        <motion.div 
          className="text-center relative z-10 max-w-5xl"
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div 
            className="mb-12 flex justify-center"
            variants={itemVariants}
          >
            <div className="flex items-center">
              {Array.from("RAYA").map((letter, index) => (
                <motion.span 
                  key={index}
                  custom={index}
                  variants={letterVariants}
                  className="inline-block text-8xl md:text-9xl font-bold text-gradient animate-text-shimmer bg-gradient-to-r from-raya-blue via-raya-purple to-raya-green bg-[length:200%_auto]"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.h2 
            className="text-xl md:text-3xl mb-8 text-raya-text font-light tracking-wide"
            variants={itemVariants}
          >
            Your AI-powered HR Assistant
          </motion.h2>

          <motion.div 
            className="max-w-2xl mx-auto mb-16 text-raya-gray text-lg"
            variants={itemVariants}
          >
            <p>Transforming recruitment with cutting-edge AI technology</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mb-20"
          >
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-gradient-to-r from-raya-blue to-raya-purple hover:from-raya-blue/90 hover:to-raya-purple/90 text-raya-dark px-10 py-7 rounded-full text-lg group transition-all duration-300 ease-in-out shadow-lg shadow-raya-blue/20"
            >
              <span>Get Started</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {featuresData.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: feature.delay, ease: [0.22, 1, 0.36, 1] }}
                className="glass-morphism p-6 rounded-2xl border border-white/10 backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/20"
              >
                <div className="mb-4 p-3 rounded-full bg-white/5 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-raya-text">{feature.title}</h3>
                <p className="text-sm text-raya-gray">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <footer className="w-full py-6 px-4 text-center text-sm text-raya-gray border-t border-white/5 backdrop-blur-sm">
        <p>© 2025 RAYA • AI-Powered Recruitment Assistant</p>
      </footer>
    </div>
  );
};

export default Index;
