"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
const queryClient = new QueryClient();
