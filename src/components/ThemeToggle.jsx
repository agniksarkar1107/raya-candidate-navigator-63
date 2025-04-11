
import React, { useEffect } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  useEffect(() => {
    // Always set to dark mode
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full opacity-0 pointer-events-none"
      aria-hidden="true"
    >
      <Moon className="h-5 w-5 text-primary" />
      <span className="sr-only">Theme</span>
    </Button>
  );
};

export default ThemeToggle;
