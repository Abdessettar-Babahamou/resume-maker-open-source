'use client'

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import AddResume from "@/components/AddResume";
import SplashScreen from "@/components/SplashScreen";

export default function DashboardClient() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="">
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Dashboard content */}
  
    </div>
  );
}
