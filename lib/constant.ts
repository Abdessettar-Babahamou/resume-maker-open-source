import { FileText, Home, Settings } from "lucide-react";

export const nav_Links=[
    {
        title:'My Resume',
        url:'/dashboard',
        icon:Home
    },
    // {
    //     title:'My Resume',
    //     url:'/my-resume',
    //     icon:FileText
    // },
    {
        title:'Settings',
        url:'/dashboard/user-profile',
        icon:Settings
    }
]

export const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );
  