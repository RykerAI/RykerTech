
"use client";

import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

// Create a client
const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // You can render a static loading state or null here
    // to avoid hydration mismatches related to localStorage or other client-side only logic
    // that might be in children or providers.
    return null; 
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
