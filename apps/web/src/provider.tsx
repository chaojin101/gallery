"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/useAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ClientInit } from "./components/my/client-int";
import { queryClient } from "./lib/queryClient";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
        <ClientInit />
      </AuthProvider>
    </QueryClientProvider>
  );
}
