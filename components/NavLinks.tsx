"use client";

import { nav_Links } from "@/lib/constant";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLinks() {
  const pathName = usePathname();
  return (
    <div className="w-full flex flex-col gap-8">
      {nav_Links.map((link) => {
        const Icon = link.icon;
        // console.log(link.url.slice(10));
        // console.log(pathName)
        // console.log(pathName.startsWith(`${link.url.slice(10)}`, 10))
        return (
          <Link
            key={link.title}
            href={link.url}
            className={cn(
              `p-2 rounded-sm transition-all ease-in-out  text-white
              hover:dark:bg-dark_main_bg hover:bg-main_gry_color hover:text-black hover:dark:text-white`,
              {
                "bg-white dark:bg-primary text-black dark:text-white":
                // pathName==link.url 
                link.url.includes('/dashboard/user-profile')  ?  pathName.startsWith(link.url) : pathName==link.url,
                // pathName.startsWith(`${link.url.slice(10)}`, 10),
              }
            )}
          >
            <div className="flex gap-4">
              <Icon />
              <h3>{link.title}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default NavLinks;
