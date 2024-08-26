"use client";

import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/my/header";
import { cn } from "@/lib/utils";
import { Provider } from "@/provider";
import { useEffect } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    setupServiceWorker();
  }, []);

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider>
          <div>
            <Header />
            <div className="relative px-4 pt-2">{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}

const setupServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
