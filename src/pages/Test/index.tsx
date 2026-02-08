import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Layers,
  Plus,
  Search,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  Database,
  Table,
} from "lucide-react";

const tables = [
  "branch_assignments",
  "branches",
  "categories",
  "monthly_inventory",
  "products",
  "suppliers",
  "uom",
];

const rows = [
  {
    id: 1,
    name: "Meat",
    description: "NULL",
    created_at: "2026-02-05 03:24:49.85",
    updated_at: "2026-02-05 03:24:49.85",
  },
  {
    id: 3,
    name: "Poultry",
    description: "NULL",
    created_at: "2026-02-06 05:39:20.43",
    updated_at: "2026-02-06 09:09:40.98",
  },
  {
    id: 5,
    name: "Seafood",
    description: "NULL",
    created_at: "2026-02-06 09:39:48.55",
    updated_at: "2026-02-07 04:59:38.44",
  },
  {
    id: 6,
    name: "Dairy",
    description: "NULL",
    created_at: "2026-02-07 06:17:38.49",
    updated_at: "2026-02-07 06:17:38.49",
  },
];

export default function TestPage() {
  return (
    <div className="h-screen w-full bg-[#f7f7f5] text-foreground">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white">
          <div className="p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Project
            </div>
            <nav className="mt-4 space-y-1 text-sm">
              {["Dashboard", "Branches", "Integrations", "Settings"].map((item) => (
                <div
                  key={item}
                  className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted"
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>
          <Separator />
          <div className="p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Branch
            </div>
            <div className="mt-3 rounded-md border bg-muted/40 px-3 py-2 text-sm">
              production
            </div>
            <nav className="mt-3 space-y-1 text-sm">
              {["Overview", "Monitoring", "SQL Editor", "Tables"].map((item) => (
                <div
                  key={item}
                  className={`rounded-md px-3 py-2 ${
                    item === "Tables" ? "bg-muted font-medium" : "text-muted-foreground"
                  }`}
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 text-xs text-muted-foreground">
            Feedback
          </div>
        </aside>

        {/* Left panel */}
        <section className="w-72 border-r bg-white">
          <div className="border-b p-4">
            <div className="text-xl font-semibold">Tables</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-3 w-3" /> production
            </div>
          </div>

          <div className="p-4">
            <div className="rounded-md border bg-white p-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Layers className="h-4 w-4" /> Database studio
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-md border bg-white px-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                className="h-8 border-0 bg-transparent text-sm focus-visible:ring-0"
                placeholder="Search..."
              />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-180px)] px-2 pb-4">
            <div className="space-y-1">
              {tables.map((t) => (
                <div
                  key={t}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    t === "categories"
                      ? "bg-muted font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Table className="h-4 w-4" />
                  {t}
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Main content */}
        <main className="flex-1 bg-white">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="ml-2 text-sm font-medium">categories</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
              <Button variant="outline" size="sm">
                <Columns className="mr-2 h-4 w-4" /> Columns
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add record
              </Button>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-5 gap-2 border-b pb-2 text-xs font-semibold uppercase text-muted-foreground">
              <div>id integer</div>
              <div>name varchar(255)</div>
              <div>description varchar(255)</div>
              <div>created_at timestamp</div>
              <div>updated_at timestamp</div>
            </div>
            <div className="divide-y">
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-5 gap-2 py-2 text-sm">
                  <div>{row.id}</div>
                  <div>{row.name}</div>
                  <div className="text-muted-foreground">{row.description}</div>
                  <div className="text-muted-foreground">{row.created_at}</div>
                  <div className="text-muted-foreground">{row.updated_at}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
