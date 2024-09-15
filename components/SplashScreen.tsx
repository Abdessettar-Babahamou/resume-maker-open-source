"use client";

import { motion } from "framer-motion";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center  z-50"
      //   exit={{ opacity: 0 }}
      //   transition={{ duration: 0.5 }}
      //   onAnimationComplete={onFinish}
    >
      {/* <motion.h1
        className="text-4xl font-bold mb-8 z-50 "
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to My Resume
      </motion.h1> */}

      <motion.div
        className=" absolute top-0 w-1 bg-primary z-50"
        initial={{ height:"0px"}}
        exit={{ height:"100%"  ,y:'100%' }}
        transition={{ duration: 0.3 ,delay:.3 }}
      ></motion.div>
      <motion.div
        className="w-16 h-16 border-y-4 border-primary rounded-full animate-spin z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-main_gry_color dark:bg-dark_model_color "
        exit={{ x: "-100%" }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-main_gry_color dark:bg-dark_model_color"
        exit={{ x: "100%" ,backgroundColor:"#8576ff"}}
        transition={{ duration: 0.7, delay: 0.5 , }}
      />
    </motion.div>
  );
}
