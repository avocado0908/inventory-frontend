import { Outlet } from "react-router";
import { Sidebar } from "@/components/sidebar";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
