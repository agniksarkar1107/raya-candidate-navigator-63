
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
        staggerChildren: 0.1,
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

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full p-4 flex justify-end">
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div 
          className="text-center"
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div 
            className="mb-6 flex justify-center"
            variants={itemVariants}
          >
            <div className="flex items-center">
              {Array.from("RAYA").map((letter, index) => (
                <motion.span 
                  key={index}
                  custom={index}
                  variants={letterVariants}
                  className="inline-block text-8xl md:text-9xl font-bold text-gradient animate-text-shimmer bg-gradient-to-r from-raya-purple via-indigo-500 to-purple-300 bg-[length:200%_auto]"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.h2 
            className="text-xl md:text-2xl mb-8 text-muted-foreground"
            variants={itemVariants}
          >
            Your AI-powered HR Assistant
          </motion.h2>

          <motion.div 
            className="max-w-md mx-auto mb-12 text-muted-foreground"
            variants={itemVariants}
          >
            <p>Effortlessly find the perfect candidates for any position across all job platforms</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-raya-purple hover:bg-raya-purple/90 text-white px-8 py-6 rounded-full"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </main>

      <footer className="w-full p-4 text-center text-sm text-muted-foreground">
        <p>© 2025 RAYA • AI-Powered Recruitment Assistant</p>
      </footer>
    </div>
  );
};

export default Index;
