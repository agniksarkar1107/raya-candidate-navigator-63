
import React, { useEffect } from "react";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  useEffect(() => {
    // Always set to light mode
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full opacity-0 pointer-events-none"
      aria-hidden="true"
    >
      <Sun className="h-5 w-5 text-primary" />
      <span className="sr-only">Theme</span>
    </Button>
  );
};

export default ThemeToggle;
