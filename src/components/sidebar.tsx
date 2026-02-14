import { useState, type JSX } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useMenu } from "@refinedev/core";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard } from "lucide-react";

const GENERAL_TITLES = new Set(["home", "stock count"]);
const MANAGE_TITLES = new Set(["products", "categories", "suppliers", "branches"]);

type SidebarProps = {
  collapsed?: boolean;
};

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { menuItems } = useMenu();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [val, setVal] = useState(pathname ?? "/");

  const items = menuItems.map((item) => ({
    href: item.route ?? "/",
    title: String(item.label),
    icon: (item.icon ?? <span className="h-4 w-4" />) as JSX.Element,
  }));

  const generalItems = items.filter((item) =>
    GENERAL_TITLES.has(item.title.toLowerCase()),
  );
  const manageItems = items.filter((item) =>
    MANAGE_TITLES.has(item.title.toLowerCase()),
  );
  const otherItems = items.filter(
    (item) =>
      !GENERAL_TITLES.has(item.title.toLowerCase()) &&
      !MANAGE_TITLES.has(item.title.toLowerCase()),
  );

  const handleSelect = (e: string) => {
    if (e.startsWith("__")) return;
    setVal(e);
    navigate(e);
  };

  return (
    <aside
      className={cn(
        "border-r bg-background p-4 transition-all",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="relative h-20 border-b border-gray-100 px-2">
        <div
          className={cn(
            "relative h-full flex items-center",
            collapsed ? "justify-center" : "justify-start",
          )}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-lg font-bold text-gray-900 tracking-tight">Stocktake</div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                AUT Commercial
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Navigation" />
          </SelectTrigger>
          <SelectContent>
            {generalItems.length > 0 && (
              <SelectItem value="__general" disabled>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  General
                </span>
              </SelectItem>
            )}
            {generalItems.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
            {manageItems.length > 0 && (
              <SelectItem value="__manage" disabled>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Manage
                </span>
              </SelectItem>
            )}
            {manageItems.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
            {otherItems.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea type="always" className="hidden w-full bg-background px-1 py-2 md:block">
        <nav className="flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0">
          {generalItems.length > 0 && !collapsed && (
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              General
            </div>
          )}
          {generalItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost" }),
                  isActive ? "bg-muted hover:bg-accent" : "hover:bg-accent hover:underline",
                  collapsed ? "justify-center px-2" : "justify-start",
                )
              }
            >
              <span className={cn(!collapsed && "me-2")}>{item.icon}</span>
              {!collapsed && item.title}
            </NavLink>
          ))}

          {manageItems.length > 0 && !collapsed && (
            <div className="mt-3 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Manage
            </div>
          )}
          {manageItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost" }),
                  isActive ? "bg-muted hover:bg-accent" : "hover:bg-accent hover:underline",
                  collapsed ? "justify-center px-2" : "justify-start",
                )
              }
            >
              <span className={cn(!collapsed && "me-2")}>{item.icon}</span>
              {!collapsed && item.title}
            </NavLink>
          ))}

          {otherItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost" }),
                  isActive ? "bg-muted hover:bg-accent" : "hover:bg-accent hover:underline",
                  collapsed ? "justify-center px-2" : "justify-start",
                )
              }
            >
              <span className={cn(!collapsed && "me-2")}>{item.icon}</span>
              {!collapsed && item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
