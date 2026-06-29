"use client"

import {
  BrainIcon,
  FileTextIcon,
  LightbulbIcon,
  ListTodoIcon,
  MessageCircleIcon,
  UploadIcon,
  SearchIcon,
  SparklesIcon,
  NetworkIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/shared/mode-toggle"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", href: "/", icon: BrainIcon },
  { title: "Notes", href: "/notes", icon: FileTextIcon },
  { title: "Chat", href: "/chat", icon: MessageCircleIcon },
  { title: "Documents", href: "/documents", icon: UploadIcon },
  { title: "Tasks", href: "/tasks", icon: ListTodoIcon },
  { title: "Insights", href: "/insights", icon: LightbulbIcon },
  { title: "Graph", href: "/graph", icon: NetworkIcon },
  { title: "Search", href: "/search", icon: SearchIcon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20">
            <BrainIcon className="size-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">Second Brain</span>
            <span className="text-[10px] text-muted-foreground">AI Knowledge Engine</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Navigate
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <SparklesIcon className="size-3" />
            <span>Powered by Lemma</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
