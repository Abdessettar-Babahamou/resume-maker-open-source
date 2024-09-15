'use client'
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import React from 'react'

function AuthProviders({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { theme } = useTheme();
  return (
    <ClerkProvider
    afterSignOutUrl={'/sign-in'}
    appearance={{
      variables: {
        colorPrimary: "#8576FF",
      },
      elements: {
        formButtonPrimary: "text-white",
        navbar: "!bg-red-500",
        userButtonPopoverMain :''
      },
      baseTheme: theme === "dark" ? dark : undefined,
    // userProfile:{ baseTheme: theme === "dark" ? dark : undefined,}
    }}
    >
    {children}    
    </ClerkProvider>
  )
}

export default AuthProviders
