import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useList } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Product, Branch, BranchAssignments, MonthlyInventory } from "@/types";
import {  PanelLeft, Database, Layers, Table } from "lucide-react";
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
import { BranchAssingmentAddButton } from "../branchAssingment/components/branchAssingmentAddButton";
import { Switch } from "@/components/ui/switch";
import { SmartSearchBar, matchesSmartSearch } from "@/components/smartSearchBar";

type StockCountFormState = {
  product: Product;
  quantity: string;
};

class StockCountErrorBoundary extends React.Component<
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
          Stock Count failed to render: {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

function StockCountContent() {
  // ===== UI state =====
  const [error, setError] = useState<string | null>(null);
  const [countDialogOpen, setCountDialogOpen] = useState(false);
  const [countState, setCountState] = useState<StockCountFormState | null>(null);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [previousCounts, setPreviousCounts] = useState<Record<number, number>>({});
  const [statusTab, setStatusTab] = useState<"in progress" | "done">("in progress");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [mainTab, setMainTab] = useState<"all" | "uncounted" | "counted" | "count0">("all");
  const [leftOpen, setLeftOpen] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [savingById, setSavingById] = useState<Record<number, boolean>>({});
  const [bulkDrafts, setBulkDrafts] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // ===== Routing (selected assignment from querystring) =====
  const countInputRef = useRef<HTMLInputElement>(null);
  const saveTimers = useRef<Record<number, number>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const branchAssignmentsIdParam = params.get("branchAssignmentsId") ?? "";

  // ===== Data fetching =====
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

  // ===== Derived selections =====
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

  // Previous month assignment (same branch)
  const previousAssignmentId = useMemo(() => {
    const assignmentId = Number(effectiveAssignmentId);
    const currentAssignment = assignments.find(
      (a) => Number(a.id) === assignmentId
    );
    if (!currentAssignment) return null;

    const parseMonth = (value?: string | null) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const currentMonth = parseMonth(currentAssignment.assignedMonth ?? null);
    if (!currentMonth) return null;

    const previous = assignments
      .filter(
        (a) =>
          a.branchId === currentAssignment.branchId &&
          parseMonth(a.assignedMonth) &&
          parseMonth(a.assignedMonth)!.getTime() < currentMonth.getTime()
      )
      .sort(
        (a, b) =>
          parseMonth(b.assignedMonth)!.getTime() -
          parseMonth(a.assignedMonth)!.getTime()
      )[0];

    return previous ? Number(previous.id) : null;
  }, [assignments, effectiveAssignmentId]);

  // ===== Counts data for the selected assignment =====
  const filteredProducts = products.filter((product) => {
    const qty = counts[product.id];
    if (mainTab === "all") return true;
    if (mainTab === "uncounted") return qty === undefined;
    if (mainTab === "count0") return qty === 0;
    return typeof qty === "number" && qty > 0;
  }).filter((product) => {
    return matchesSmartSearch(searchQuery, {
      name: product.name,
      barcode: product.barcode ?? "",
    });
  });

  // Load counts for the selected assignment + previous month assignment
  useEffect(() => {
    if (!effectiveAssignmentId) {
      setCounts({});
      setPreviousCounts({});
      return;
    }
    fetch(`${BACKEND_BASE_URL}/monthly-inventory`)
      .then((res) => res.json())
      .then((data: { data?: MonthlyInventory[] }) => {
        const assignmentId = Number(effectiveAssignmentId);

        const mapCurrent: Record<number, number> = {};
        const mapPrev: Record<number, number> = {};

        (data.data ?? []).forEach((row) => {
          const rowAssignmentId = Number(
            (row as unknown as { branchAssignmentsId?: number; branchAssignmentId?: number })
              .branchAssignmentsId ??
              (row as unknown as { branchAssignmentId?: number }).branchAssignmentId
          );
          const pid = Number(row.productId);
          if (Number.isNaN(pid)) return;
          if (rowAssignmentId === assignmentId) {
            mapCurrent[pid] = row.quantity;
          }
          if (previousAssignmentId && rowAssignmentId === previousAssignmentId) {
            mapPrev[pid] = row.quantity;
          }
        });

        setCounts(mapCurrent);
        setPreviousCounts(mapPrev);
      })
      .catch(() => {
        setError("Failed to load stock counts.");
      });
  }, [effectiveAssignmentId, previousAssignmentId]);


  // Auto-focus quantity input when the dialog opens
  useEffect(() => {
    if (countDialogOpen) {
      setTimeout(() => countInputRef.current?.focus(), 50);
    }
  }, [countDialogOpen]);

  // Open count dialog for a product
  const openCountDialog = (product: Product) => {
    setCountState({
      product,
      quantity: counts[product.id]?.toString() ?? "",
    });
    setCountDialogOpen(true);
    setError(null);
  };

  const focusSearch = () => {
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  // Save count (upsert) to monthly inventory
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
    focusSearch();
  };

  // Bulk save helper
  const saveCountForProduct = async (productId: number, quantity: number) => {
    if (!effectiveAssignmentId) return;
    setSavingById((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/monthly-inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchAssignmentsId: Number(effectiveAssignmentId),
          productId,
          quantity,
        }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => null);
        setError(msg?.error ?? "Failed to save count.");
        return;
      }
      setCounts((prev) => ({ ...prev, [productId]: quantity }));
    } finally {
      setSavingById((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Debounce auto-save per product
  const queueAutoSave = (productId: number, value: string) => {
    if (saveTimers.current[productId]) {
      window.clearTimeout(saveTimers.current[productId]);
    }
    const trimmed = value.trim();
    if (trimmed === "") {
      return;
    }
    const quantity = Number(trimmed);
    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Enter a valid numeric count.");
      return;
    }
    saveTimers.current[productId] = window.setTimeout(() => {
      saveCountForProduct(productId, quantity);
    }, 600);
  };

  const flushDraft = (productId: number) => {
    const value = bulkDrafts[productId];
    if (value === undefined || value.trim() === "") return;
    const quantity = Number(value);
    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Enter a valid numeric count.");
      return;
    }
    saveCountForProduct(productId, quantity);
  };

  const handleSearchKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") return;
    const query = searchQuery.trim();
    if (!query) return;

    const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, "");
    const exactBarcodeMatch = products.find((p) => {
      const barcode = (p.barcode ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return barcode && barcode === normalized;
    });

    if (exactBarcodeMatch) {
      openCountDialog(exactBarcodeMatch);
      setSearchQuery("");
      return;
    }

    if (filteredProducts.length === 1) {
      openCountDialog(filteredProducts[0]);
      setSearchQuery("");
    }
  };

  // ===== Render =====
  return (
    <div className="h-screen w-full bg-[#f7f7f5] text-foreground">
      <div className="flex h-full">
        {/* ===== Left panel (assignments) ===== */}
        <section
          className={cn(
            "border-r bg-white transition-all duration-200",
            leftOpen ? "w-72" : "w-12"
          )}
        >
          <div className="flex items-start justify-between border-b p-4">
            {leftOpen ? (
              <div>
                <div className="text-xl font-semibold">Stock Counts</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="h-3 w-3" /> assignments
                </div>
              </div>
            ) : (
              <div className="text-xs font-semibold text-muted-foreground">SC</div>
            )}
            {leftOpen && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setLeftOpen((prev) => !prev)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {leftOpen && (
            <>
              <div className="p-4">
                <div className="rounded-md border bg-white p-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Layers className="h-4 w-4" /> Assignment list
                  </div>
                </div>
                <div className="mt-3">
                  <BranchAssingmentAddButton />
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
            </>
          )}
        </section>

        {/* ===== Main content (products + count) ===== */}
        <main className="flex-1 bg-white">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              {!leftOpen ? (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setLeftOpen(true)}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              ) : null}
              <div className="text-sm font-medium">
                {selectedAssignment
                  ? `${branch?.name ?? "Unknown"} • ${
                      selectedAssignment?.assignedMonth?.slice(0, 7) || "Unknown"
                    }`
                  : "Select a branch assignment"}
              </div>
            </div>
            <FinishButton
              disabled={!selectedAssignment}
              assignmentId={selectedAssignment?.id}
              onFinished={() => assignmentsQuery.refetch()}
            />
          </div>

          {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}

          {selectedAssignment ? (
            <div className="px-6 py-4">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {[
                  { key: "all", label: "All" },
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
                      setMainTab(tab.key as "all" | "uncounted" | "counted" | "count0")
                    }
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="w-full sm:w-64">
                  <SmartSearchBar
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search name or barcode..."
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
                <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Bulk count mode</span>
                  <Switch
                    checked={bulkMode}
                    onCheckedChange={setBulkMode}
                    aria-label="Toggle bulk count mode"
                  />
                </div>
              </div>
              <div className="grid grid-cols-8 gap-2 border-b pb-2 text-xs font-semibold uppercase text-muted-foreground">
                <div>Category</div>
                <div>Product</div>
                <div>Price</div>
                <div>Supplier</div>
                <div>Pkg</div>
                <div>UOM</div>
                <div>Last Month</div>
                <div>Count</div>
              </div>
              <div className="divide-y">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="grid grid-cols-8 gap-2 py-2 text-sm">
                    <div>{p.category?.name ?? "—"}</div>
                    <div>{p.name}</div>
                    <div>{p.price ? `$${p.price}` : "—"}</div>
                    <div>{p.supplier?.name ?? "—"}</div>
                    <div>{p.pkg}</div>
                    <div>{p.uom?.name ?? "—"}</div>
                    <div className="text-muted-foreground">
                      {previousCounts[p.id] ?? "—"}
                    </div>
                    <div className="flex items-center gap-2">
                      {bulkMode ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            className="h-8 w-24"
                            value={bulkDrafts[p.id] ?? (counts[p.id] ?? "").toString()}
                            onChange={(e) => {
                              const next = e.target.value;
                              setBulkDrafts((prev) => ({ ...prev, [p.id]: next }));
                              queueAutoSave(p.id, next);
                            }}
                            onBlur={() => flushDraft(p.id)}
                          />
                          {savingById[p.id] ? (
                            <span className="text-xs text-muted-foreground">Saving…</span>
                          ) : null}
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveCount();
                  }
                }}
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

export default function StockCountPage() {
  return (
    <StockCountErrorBoundary>
      <StockCountContent />
    </StockCountErrorBoundary>
  );
}
