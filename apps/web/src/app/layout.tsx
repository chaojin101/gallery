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
          <div>
            <Header />
            <div className="relative px-4 pt-2">{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
