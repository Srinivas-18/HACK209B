"use client"
import { CodeCrestSidebar } from '@/cards/SideBar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Search, User } from 'lucide-react'
import { VisuallyHidden } from '@/components/VisuallyHidden'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserButton } from '@clerk/nextjs'
export default function DashboardLayout({ children }) {

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50">
        <CodeCrestSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b bg-white px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Search className="h-5 w-5" />
                    <VisuallyHidden>Search</VisuallyHidden>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Search</DialogTitle>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <VisuallyHidden>Notifications</VisuallyHidden>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Notifications</DialogTitle>
                </DialogContent>
              </Dialog>
            <UserButton/>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
