import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/app-providers';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Rss } from 'lucide-react'; // Placeholder for App Logo/Icon


export const metadata: Metadata = {
  title: 'RYK AI MediaSpark',
  description: 'AI-powered media tool for creative ideation and research.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          <SidebarProvider defaultOpen={true}>
            <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
              <SidebarHeader className="p-4">
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                  <Button variant="ghost" size="icon" className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    <Rss className="h-5 w-5" />
                  </Button>
                  <h1 className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">RYK AI MediaSpark</h1>
                </div>
              </SidebarHeader>
              <Separator className="my-0" />
              <SidebarContent className="p-2">
                <SidebarNav />
              </SidebarContent>
              <Separator className="my-0" />
              <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
                {/* Placeholder for potential footer items like settings or logout */}
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <div>{/* Page specific title could go here via a context or prop drilling */}</div>
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>UA</AvatarFallback>
                </Avatar>
              </header>
              <main className="flex-1 p-4 sm:p-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </AppProviders>
      </body>
    </html>
  );
}
