"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import Logo from "@/components/Logo";
import { FaUserTie, FaRocket, FaDownload, FaMagic } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Page() { 
  const { theme } = useTheme();

  const features = [
    { icon: FaUserTie, text: "Tailored for job seekers and professionals" },
    { icon: FaRocket, text: "Quick and easy resume creation" },
    { icon: FaDownload, text: "Export to multiple formats" },
    { icon: FaMagic, text: "AI-powered content suggestions" },
  ];

  return (
    <section className="bg-white dark:bg-dark_main_bg">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex items-center justify-center bg-white dark:bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <div className="text-center px-4">
            <motion.h2 
              className="mt-6 text-2xl text-start font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5  }}
            >
              Welcome to Resume Maker
            </motion.h2>
            <motion.p 
              className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400 text-start"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2  }}
            >
              Create professional resumes effortlessly with our intuitive ATS Resume Maker.<br/> Sign up now to get started!
            </motion.p>
            <div className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className="mr-3 text-xl" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <motion.main 
          className="flex items-center justify-center bg-main_gry_color dark:bg-dark_main_bg px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <SignUp />
        </motion.main>
      </div>
    </section>
  );
}
