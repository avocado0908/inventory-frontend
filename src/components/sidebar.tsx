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

export function Sidebar() {
  const { menuItems } = useMenu();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [val, setVal] = useState(pathname ?? "/");

  const items = menuItems.map((item) => ({
    href: item.route ?? "/",
    title: String(item.label),
    icon: (item.icon ?? <span className="h-4 w-4" />) as JSX.Element,
  }));

  const handleSelect = (e: string) => {
    setVal(e);
    navigate(e);
  };

  return (
    <aside className="w-64 border-r bg-background p-4">
      <div className="mb-6 text-lg font-semibold">Stocktake</div>

      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Navigation" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
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

      <ScrollArea
        type="always"
        className="hidden w-full min-w-40 bg-background px-1 py-2 md:block"
      >
        <nav className={cn("flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0")}>
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost" }),
                  isActive
                    ? "bg-muted hover:bg-accent"
                    : "hover:bg-accent hover:underline",
                  "justify-start"
                )
              }
            >
              <span className="me-2">{item.icon}</span>
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
