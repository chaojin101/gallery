import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/my/header";
import { serverInit } from "@/lib/server-init";
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
  serverInit();
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased dark",
          fontSans.variable
        )}
      >
        <Provider>
          <div className="outermost-wrapper mx-auto px-[10px] flex flex-col gap-2">
            <Header />
            <div className="relative">{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
