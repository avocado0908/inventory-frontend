import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { useMenu } from "@refinedev/core";

export function Sidebar() {
  const { menuItems } = useMenu();

  return (
    <aside className="w-64 border-r bg-background p-4">
      <div className="mb-6 text-lg font-semibold">
        Stocktake
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.route ?? "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
