
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Lightbulb, Globe, Image as ImageIcon, Folder, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/idea-spark', label: 'Idea Spark', icon: Sparkles },
  { href: '/web-insight', label: 'Web Insight', icon: Globe },
  { href: '/mood-board', label: 'Mood Board', icon: ImageIcon },
  { href: '/projects', label: 'Projects', icon: Folder },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden"}}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
