"use client";
import React from "react";
import Logo from "./Logo";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import NavLinks from "./NavLinks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import AddResume from "./AddResume";
import { cn } from "@/lib/utils";

function SideBar({ isInMobile }: { isInMobile: boolean | undefined }) {
  const { setTheme } = useTheme();
  return (
    <div 
      className={cn(
        `hidden lg:flex flex-col gap-4 w-[250px] h-screen bg-primary dark:bg-dark_sec_bg
  shadow-sm  no-print-area fixed`,
        { "flex relative": isInMobile }
      )}
    >
      {/* logo */}
      <div className="flex flex-col items-center justify-between gap-1 h-[60px]">
        <Logo />
        <Separator className="bg-white dark:bg-primary " />
      </div>

      {/* sideBar body */}
      <div className="flex flex-col gap-8 p-4 flex-1">
        <AddResume
          triggerComponent={
            <Button className=" p-2 text-white bg-green-400 hover:bg-green-400/95 hover:text-white dark:bg-primary dark:text-white capitalize">
              Create new resume
            </Button>
          }
        />

        <NavLinks />
      </div>
      <div className="p-4 ">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full flex gap-4 justify-between items-center
          bg-white dark:bg-dark_main_bg p-2 rounded-md
          focus-visible:ring-0 focus-visible:ring-offset-0
          "
          aria-label="Theme selection" // Add aria-label for accessibility
          >
            <div className="flex gap-4">
              <Palette />
              <h3>Theme</h3>
            </div>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="hidden dark:flex h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("dark")}
            >
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("light")}
            >
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("system")}
            >
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default SideBar;
