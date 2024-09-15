"use client";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import {
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import SideBar from "./SideBar";
import CvPreview from "./CvPreview";
import { usePathname } from "next/navigation";
import { dark } from "@clerk/themes";

function Header() {
  // Get user authentication status
  const { isSignedIn } = useUser();
  // Get current pathname for conditional rendering
  const pathname = usePathname();

  return (
    // Animated header container
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
      className="flex items-center justify-between px-8 h-[60px] shadow-md no-print-area
        bg-white dark:bg-dark_sec_bg border-b-2 fixed w-full lg:w-[calc(100vw-250px)] z-10"
    > 
      {/* Mobile menu trigger */}
      <Sheet>
        <SheetTrigger className="flex lg:hidden">
          <Menu className="cursor-pointer  flex lg:hidden " />
        </SheetTrigger>
        {/* Mobile sidebar */}
        <SheetContent
          side={"left"}
          className="!max-w-[250px] dark:bg-darkCardColor bg-primary p-0 h-screen"
        >
          <SideBar isInMobile={true} />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex gap-8">
        {/* CV Preview button (only shown on CV pages) */}
        {pathname.startsWith("/dashboard/cv/") && (
          <Sheet>
            <SheetTrigger className="no-print-area flex lg:hidden">
              <span className="bg-primary text-white p-2 rounded-md">
                Preview
              </span>
            </SheetTrigger>
            {/* CV Preview sheet */}
            <SheetContent className="!w-[900px] !max-w-full md:max-w-[1000px] h-screen overflow-auto">
              <CvPreview />
            </SheetContent>
          </Sheet>
        )}
        {/* User profile button (only shown when signed in) */}
        {isSignedIn && <UserButton  />}
      </div>
    </motion.div>
  );
}

export default Header;
