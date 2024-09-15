"use client";

import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from '@clerk/themes'

const UserProfilePage = () => {
  const { theme } = useTheme();

  return (
    <div className=" w-full flex items-center justify-center p-8">
      <UserProfile
        // appearance={{
        //   baseTheme: theme === "dark" ? dark : undefined,
        // }}
        path="/dashboard/user-profile"
      />
    </div>
  );
};

export default UserProfilePage;
