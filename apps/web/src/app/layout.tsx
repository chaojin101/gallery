"use client";

import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/my/header";
import { cn } from "@/lib/utils";
import { Provider } from "@/provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider>
          <div className="relative 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm xs:max-w-screen-xs mx-auto px-4">
            <Header />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
