import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  // 1. Initialize theme from localStorage (Defaults to dark for the AI Video)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true; // Default to true for your new theme
  });

  // 2. Sync the 'dark' class with the <html> tag for Tailwind's dark: utilities
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  // 3. Toggle function
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    /* bg-[#F1F5F9] is your Light mode (Clean Slate)
       dark:bg-[#020617] is your Midnight Slate (Matches the video exactly)
    */
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#020617] flex flex-col transition-colors duration-700">
      <ScrollToTop /> 
      
      {/* 4. CRITICAL: Pass these props so the button in Header can reach this state */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="flex-grow">
        <Outlet /> 
      </main>
      
      <Footer />
    </div>
  );
}

export default App;