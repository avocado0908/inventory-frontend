import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useList } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Product, Branch, BranchAssignments, MonthlyInventory } from "@/types";
import { Database, Layers, Table } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BACKEND_BASE_URL } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinishButton } from "./components/finishButton";

type StockCountFormState = {
  product: Product;
  quantity: string;
};

export default function StockCountPage() {
  const [error, setError] = useState<string | null>(null);
  const [countDialogOpen, setCountDialogOpen] = useState(false);
  const [countState, setCountState] = useState<StockCountFormState | null>(null);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [statusTab, setStatusTab] = useState<"in progress" | "done">("in progress");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [mainTab, setMainTab] = useState<"uncounted" | "counted" | "count0">("uncounted");

  const countInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const branchAssignmentsIdParam = params.get("branchAssignmentsId") ?? "";

  const { query: productsQuery } = useList<Product>({
    resource: "products",
    pagination: { pageSize: 1000 },
  });

  const { query: branchQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 1000 },
  });
  const { query: assignmentsQuery } = useList<BranchAssignments>({
    resource: "branch-assignments",
    pagination: { pageSize: 1000 },
  });

  const selectedAssignment = useMemo(
    () =>
      assignmentsQuery.data?.data?.find(
        (a) => String(a.id) === String(branchAssignmentsIdParam)
      ),
    [branchAssignmentsIdParam, assignmentsQuery.data?.data]
  );

  const effectiveAssignmentId =
    branchAssignmentsIdParam ||
    (selectedAssignment?.id ? String(selectedAssignment.id) : "");

  const branch = useMemo(
    () =>
      branchQuery.data?.data?.find(
        (b) => String(b.id) === String(selectedAssignment?.branchId ?? "")
      ),
    [selectedAssignment?.branchId, branchQuery.data?.data]
  );

  const products = productsQuery.data?.data ?? [];
  const assignments = assignmentsQuery.data?.data ?? [];
  const filteredAssignments = assignments.filter((assignment) => {
    if (assignment.status !== statusTab) return false;
    if (branchFilter === "all") return true;
    return String(assignment.branchId) === branchFilter;
  });

  const filteredProducts = products.filter((product) => {
    const qty = counts[product.id];
    if (mainTab === "uncounted") return qty === undefined;
    if (mainTab === "count0") return qty === 0;
    return typeof qty === "number" && qty > 0;
  });

  useEffect(() => {
    if (!effectiveAssignmentId) {
      setCounts({});
      return;
    }
    fetch(`${BACKEND_BASE_URL}/monthly-inventory`)
      .then((res) => res.json())
      .then((data: { data?: MonthlyInventory[] }) => {
        const assignmentId = Number(effectiveAssignmentId);
        const map: Record<number, number> = {};
        (data.data ?? [])
          .filter(
            (row) =>
              Number(
                (row as unknown as { branchAssignmentsId?: number; branchAssignmentId?: number })
                  .branchAssignmentsId ??
                  (row as unknown as { branchAssignmentId?: number }).branchAssignmentId
              ) === assignmentId
          )
          .forEach((row) => {
            const pid = Number(row.productId);
            if (!Number.isNaN(pid)) {
              map[pid] = row.quantity;
            }
          });
        setCounts(map);
      })
      .catch(() => {
        setError("Failed to load stock counts.");
      });
  }, [effectiveAssignmentId]);


  useEffect(() => {
    if (countDialogOpen) {
      setTimeout(() => countInputRef.current?.focus(), 50);
    }
  }, [countDialogOpen]);

  const openCountDialog = (product: Product) => {
    setCountState({
      product,
      quantity: counts[product.id]?.toString() ?? "",
    });
    setCountDialogOpen(true);
    setError(null);
  };

  const saveCount = async () => {
    if (!countState || !effectiveAssignmentId) return;
    const quantity = Number(countState.quantity);
    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Enter a valid numeric count.");
      return;
    }

    const res = await fetch(`${BACKEND_BASE_URL}/monthly-inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branchAssignmentsId: Number(effectiveAssignmentId),
        productId: countState.product.id,
        quantity,
      }),
    });

    if (!res.ok) {
      const msg = await res.json().catch(() => null);
      setError(msg?.error ?? "Failed to save count.");
      return;
    }

    setCounts((prev) => ({ ...prev, [countState.product.id]: quantity }));
    setCountDialogOpen(false);
    setCountState(null);
  };

  return (
    <div className="h-screen w-full bg-[#f7f7f5] text-foreground">
      <div className="flex h-full">
        {/* Left panel */}
        <section className="w-72 border-r bg-white">
          <div className="border-b p-4">
            <div className="text-xl font-semibold">Stock Counts</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-3 w-3" /> assignments
            </div>
          </div>

          <div className="p-4">
            <div className="rounded-md border bg-white p-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Layers className="h-4 w-4" /> Assignment list
              </div>
            </div>
            <div className="mt-3">
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {branchQuery.data?.data?.map((branch) => (
                    <SelectItem key={branch.id} value={String(branch.id)}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex rounded-md border bg-white p-1">
              {["in progress", "done"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 text-xs font-semibold uppercase",
                    statusTab === tab ? "bg-muted text-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => setStatusTab(tab as "in progress" | "done")}
                >
                  {tab}
                </button>
              ))}
            </div>
            
          </div>

          <ScrollArea className="h-[calc(100%-140px)] px-2 pb-4">
            <div className="space-y-1">
              {filteredAssignments.map((assignment) => (
                <button
                  key={assignment.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                    effectiveAssignmentId === String(assignment.id)
                      ? "bg-muted font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={() =>
                    navigate(`/stockcount?branchAssignmentsId=${assignment.id}`)
                  }
                >
                  <Table className="h-4 w-4" />
                  {assignment.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Main content */}
        <main className="flex-1 bg-white">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="text-sm font-medium">
              {selectedAssignment
                ? `${branch?.name ?? "Unknown"} • ${
                    selectedAssignment?.assignedMonth?.slice(0, 7) || "Unknown"
                  }`
                : "Select a branch assignment"}
            </div>
            <FinishButton />
          </div>

          {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}

          {selectedAssignment ? (
            <div className="px-6 py-4">
              <div className="mb-4 flex items-center gap-2">
                {[
                  { key: "uncounted", label: "Uncounted" },
                  { key: "counted", label: "Counted" },
                  { key: "count0", label: "Count 0" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={cn(
                      "rounded-md border px-3 py-1 text-xs font-semibold uppercase",
                      mainTab === tab.key
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() =>
                      setMainTab(tab.key as "uncounted" | "counted" | "count0")
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 border-b pb-2 text-xs font-semibold uppercase text-muted-foreground">
                <div>Category</div>
                <div>Product</div>
                <div>Price</div>
                <div>Supplier</div>
                <div>Pkg</div>
                <div>UOM</div>
                <div>Count</div>
              </div>
              <div className="divide-y">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="grid grid-cols-7 gap-2 py-2 text-sm">
                    <div>{p.category?.name ?? "—"}</div>
                    <div>{p.name}</div>
                    <div>{p.price ? `$${p.price}` : "—"}</div>
                    <div>{p.supplier?.name ?? "—"}</div>
                    <div>{p.pkg}</div>
                    <div>{p.uom?.name ?? "—"}</div>
                    <div className="flex items-center gap-2">
                      <span className="min-w-10 text-right">
                        {counts[p.id] ?? "—"}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCountDialog(p)}
                      >
                        Count
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-[calc(100%-64px)] items-center justify-center text-sm text-muted-foreground">
              Choose a branch assignment to start counting.
            </div>
          )}
        </main>
      </div>

      <Dialog open={countDialogOpen} onOpenChange={setCountDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Count</DialogTitle>
          </DialogHeader>
          {countState && (
            <div className="space-y-3">
              <div className="text-sm">
                <div>
                  Product: <strong>{countState.product.name}</strong>
                </div>
                <div>
                  Location: <strong>{branch?.name ?? "Unknown"}</strong>
                </div>
                <div>
                  Month: <strong>{selectedAssignment?.assignedMonth?.slice(0, 7) || "Unknown"}</strong>
                </div>
              </div>
              <Input
                ref={countInputRef}
                type="number"
                min={0}
                value={countState.quantity}
                onChange={(e) =>
                  setCountState((prev) =>
                    prev ? { ...prev, quantity: e.target.value } : prev
                  )
                }
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCountDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveCount}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
