import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "@/components/sidebar";

class LayoutErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-sm text-red-600">
          Page failed to render: {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <LayoutErrorBoundary>{children ?? <Outlet />}</LayoutErrorBoundary>
      </main>
    </div>
  );
}
