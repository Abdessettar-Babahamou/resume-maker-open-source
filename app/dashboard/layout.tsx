import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";
import { CvInfoProvider } from "@/lib/context/CvInfoContext";

// Define constant for header height
const HEADER_HEIGHT = 'mt-[60px]';

export default function DashboardLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    // Main container with background color and dark mode support
    <div className="flex bg-white dark:bg-dark_main_bg remove-bg remove-bg">
      {/* Wrap entire layout with CvInfoProvider for context */}
      <CvInfoProvider>
        {/* Sidebar component - visible on all pages */}
        <SideBar isInMobile={false} />
        
        {/* Main content area */}
        <div className="flex-1 lg:ml-[250px] w-screen">
          {/* Header component - fixed at the top */}
          <Header />
          
          {/* Content area - adjusted for header height and print styling */}
          <div className={`${HEADER_HEIGHT} when-print`}>
            {children}
          </div>
          
          {/* Toaster component for notifications */}
          <Toaster  />
        </div>
      </CvInfoProvider>
    </div>
  );
}
