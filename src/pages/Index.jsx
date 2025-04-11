import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, FileText, MessageSquare, Sparkles, Brain } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, amount: 0.2 });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/search');
  };

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
      title: "Candidate Search Agent",
      description: "Deploy our AI to find perfect candidates across all job platforms",
      icon: <Search className="w-6 h-6 text-raya-yellow/90" />,
      route: "/search",
      delay: 0.2
    },
    {
      title: "Resume Screening Agent",
      description: "Upload and analyze resumes with superintelligent matching",
      icon: <FileText className="w-6 h-6 text-raya-green/90" />,
      route: "/resume-screening",
      delay: 0.3
    },
    {
      title: "AI Conversation Agent",
      description: "Chat with our superintelligent AI to analyze candidate data",
      icon: <MessageSquare className="w-6 h-6 text-raya-purple/90" />,
      route: "/ai-assistant",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <header className="w-full p-6 flex justify-between items-center z-10 sticky top-0 backdrop-blur-sm bg-background/70 border-b border-border">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl font-bold flex items-center"
        >
          <Brain className="w-5 h-5 mr-2 text-raya-yellow/90" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-raya-yellow/90 via-raya-purple/80 to-raya-green/80 bg-[length:200%_auto]">
            RAYA
          </span>
        </motion.div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
          <div className="relative min-h-[100vh] flex flex-col">
            <section className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-24 relative">
              <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.07 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-raya-yellow/50 blur-[120px]" 
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.05 }}
                  transition={{ duration: 2, delay: 0.7 }}
                  className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-raya-green/50 blur-[140px]" 
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.05 }}
                  transition={{ duration: 2, delay: 0.9 }}
                  className="absolute top-1/3 left-1/4 w-1/3 h-1/3 rounded-full bg-raya-purple/30 blur-[100px]" 
                />
              </div>
              
              <motion.div 
                className="text-center relative z-10 max-w-5xl"
                initial="hidden"
                animate={loaded ? "visible" : "hidden"}
                variants={containerVariants}
              >
                <motion.div 
                  className="mb-6 flex justify-center"
                  variants={itemVariants}
                >
                  <div className="relative">
                    <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-raya-yellow/20 shadow-lg">
                      <AvatarImage src="https://ui-avatars.com/api/?name=RAYA&background=080A12&color=FEFD9A&size=128" alt="RAYA AI Assistant" />
                      <AvatarFallback className="bg-raya-dark text-raya-yellow/90 text-2xl">RA</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-raya-green/10 text-raya-green/90 rounded-full px-2 py-1 text-xs border border-raya-green/20">
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-raya-green/90 rounded-full mr-1 animate-pulse"></span>
                        Active
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mb-8 flex justify-center"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    {Array.from("RAYA").map((letter, index) => (
                      <motion.span 
                        key={index}
                        custom={index}
                        variants={letterVariants}
                        className="inline-block text-7xl sm:text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-raya-yellow/90 via-raya-yellow/80 to-raya-green/80 bg-[length:200%_auto]"
                        style={{ 
                          textShadow: 'rgba(254, 253, 154, 0.3) 0px 0px 10px, rgba(254, 253, 154, 0.2) 0px 0px 20px'
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.h2 
                  className="text-xl md:text-3xl mb-8 text-raya-yellow/90 font-light tracking-wide"
                  style={{ 
                    textShadow: 'rgba(254, 253, 154, 0.2) 0px 0px 8px'
                  }}
                  variants={itemVariants}
                >
                  Not your average HR
                </motion.h2>

                <motion.div 
                  className="max-w-2xl mx-auto mb-12 text-muted-foreground text-lg"
                  variants={itemVariants}
                >
                  <p>Transforming recruitment with superhuman AI technology</p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="mb-16"
                >
                  <Button 
                    onClick={handleGetStarted} 
                    size="lg" 
                    className="bg-gradient-to-r from-raya-yellow/90 to-raya-green/90 hover:from-raya-yellow/80 hover:to-raya-green/80 text-black px-8 py-6 rounded-full text-lg group transition-all duration-300 ease-in-out shadow-md"
                    style={{ 
                      boxShadow: 'rgba(254, 253, 154, 0.2) 0px 0px 8px, rgba(254, 253, 154, 0.1) 0px 0px 16px'
                    }}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
                
                <motion.div
                  className="flex justify-center"
                  variants={itemVariants}
                >
                  <a 
                    href="#features" 
                    className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <span className="mb-2">Discover our AI Agents</span>
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </a>
                </motion.div>
              </motion.div>
            </section>

            <section 
              id="features" 
              ref={featuresRef}
              className="py-24 px-4 md:px-8 bg-gradient-to-b from-background to-background/90"
            >
              <div className="max-w-5xl mx-auto">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-raya-yellow/90 to-raya-green/80"
                  style={{ 
                    textShadow: 'rgba(254, 253, 154, 0.15) 0px 0px 8px'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6 }}
                >
                  Our AI Agents
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuresData.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="dark:glass-morphism light:light-glass-morphism p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-md flex flex-col h-full"
                      onClick={() => navigate(feature.route)}
                      role="button"
                      tabIndex={0}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="p-3 rounded-full bg-black/20 dark:bg-black/30 w-fit border border-raya-yellow/10 shadow-sm mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center">
                        {feature.title}
                        <Sparkles className="w-4 h-4 ml-2 text-raya-yellow/80" />
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                      <div className="mt-auto pt-4">
                        <Button 
                          variant="ghost" 
                          className="group px-0 hover:bg-transparent"
                        >
                          <span className="text-raya-yellow/90">Explore</span>
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 text-raya-yellow/90" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </main>

      <footer className="w-full py-4 px-4 text-center text-sm text-muted-foreground border-t border-border backdrop-blur-sm">
        <p>© 2025 RAYA • Superintelligent Recruitment Assistant</p>
      </footer>
    </div>
  );
};

export default Index;
