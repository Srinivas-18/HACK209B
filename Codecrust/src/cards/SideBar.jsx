'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Code2, VideoIcon, BookOpen, Settings, LogOut, ChevronDown, BrainCircuit 
} from 'lucide-react'
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, 
} from '@/components/ui/sidebar'
import { 
  Collapsible, CollapsibleContent, CollapsibleTrigger, 
} from "@/components/ui/collapsible"
import { SignInButton, SignOutButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"

export function CodeCrestSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">CodeCrest</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <Collapsible defaultOpen>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Code2 className="h-4 w-4" />
                  <span>Practice</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/practice/array">Arrays</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/practice/linked list">Linked Lists</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/practice/tree">Trees</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/practice/graph">Graphs</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/results" className="flex items-center">
                <VideoIcon className="h-4 w-4" />
                <span> Your Results</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="https://stack-overflow-nextjs-wgbn.vercel.app/" className="flex items-center">
                <BookOpen className="h-4 w-4" />
                <span>Community</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/test" className="flex items-center">
                <BrainCircuit className="h-4 w-4" />
                <span>Test Your Knowledge</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto border-t">
        <SidebarMenu>
          <SignedOut>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <SignInButton>
                  <button className="flex w-full items-center">
                    <span>Log In</span>
                  </button>
                </SignInButton>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <SignUpButton>
                  <button className="flex w-full items-center">
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SignedOut>
          <SignedIn>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <SignOutButton/>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SignedIn>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
