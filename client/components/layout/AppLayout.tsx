import { Outlet, Link, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Compass,
  Map,
  GraduationCap,
  Calendar,
  Settings,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500" />
      <span className="font-bold tracking-tight text-slate-800">EduNav AI</span>
    </Link>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Career Quiz", href: "/quiz", icon: Compass },
    { label: "Course Maps", href: "/courses", icon: Map },
    { label: "College Finder", href: "/colleges", icon: GraduationCap },
    { label: "Timeline", href: "/timeline", icon: Calendar },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-3 py-3">
            <Logo />
          </div>

          {/* Profile summary in sidebar */}
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://i.pravatar.cc/100?img=12" alt="Alex Morgan" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">Alex Morgan</div>
              <div className="text-xs text-muted-foreground">Student</div>
              <div className="mt-2">
                <div className="text-xs text-slate-600">Profile: <span className="font-medium">72%</span></div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: "72%" }} />
                </div>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={path === item.href}>
                      <Link to={item.href} className="flex items-center gap-2">
                        <item.icon className="text-slate-600" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-xs text-sidebar-foreground/70 px-2">© {new Date().getFullYear()} EduNav</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <Logo />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="hidden sm:inline-flex">Upgrade</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-full px-2 py-1.5 hover:bg-accent">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium leading-tight">Alex Morgan</div>
                      <div className="text-xs text-muted-foreground leading-tight">Student</div>
                    </div>
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                      <AvatarImage src="https://i.pravatar.cc/100?img=12" alt="Profile" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10")}>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
