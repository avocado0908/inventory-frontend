import { useEffect, useMemo, useRef, useState } from "react";
import { useList } from "@refinedev/core";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product, Branch, MonthlyInventory } from "@/types";
import { Link } from "react-router";
import { Search, ScanLine } from "lucide-react";

type StockCountFormState = {
  product: Product;
  quantity: string;
};

function normalizeMonth(input: string) {
  if (!input) return "";
  if (/^\d{4}-\d{2}$/.test(input)) return `${input}-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  return "";
}

export default function StockCountPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [countDialogOpen, setCountDialogOpen] = useState(false);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [countState, setCountState] = useState<StockCountFormState | null>(null);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [months, setMonths] = useState<string[]>([]);

  const barcodeRef = useRef<HTMLInputElement>(null);
  const countInputRef = useRef<HTMLInputElement>(null);

  const params = new URLSearchParams(window.location.search);
  const branchIdParam = params.get("branchId") ?? "";
  const monthParam = params.get("month") ?? "";
  const month = normalizeMonth(monthParam);

  const { query: productsQuery } = useList<Product>({
    resource: "products",
    pagination: { pageSize: 1000 },
  });

  const { query: branchQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 1000 },
  });

  const branch = useMemo(
    () => branchQuery.data?.data?.find((b) => String(b.id) === String(branchIdParam)),
    [branchIdParam, branchQuery.data?.data]
  );

  const products = productsQuery.data?.data ?? [];

  useEffect(() => {
    if (!branchIdParam || !month) return;
    fetch(`/api/stockcount?branchId=${branchIdParam}&month=${month}`)
      .then((res) => res.json())
      .then((data: { data?: MonthlyInventory[] }) => {
        const map: Record<number, number> = {};
        (data.data ?? []).forEach((row) => {
          map[row.productId] = row.quantity;
        });
        setCounts(map);
      })
      .catch(() => {
        setError("Failed to load stock counts.");
      });
  }, [branchIdParam, month]);

  useEffect(() => {
    if (!branchIdParam) return;
    fetch(`/api/stockcount/months?branchId=${branchIdParam}`)
      .then((res) => res.json())
      .then((data: { data?: { month: string }[] }) => {
        setMonths((data.data ?? []).map((row) => row.month));
      })
      .catch(() => {
        setMonths([]);
      });
  }, [branchIdParam]);

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

  const handleBarcodeSubmit = () => {
    const code = barcode.trim();
    if (!code) return;
    const product = products.find((p) => p.barcode === code);
    if (!product) {
      setError("Product not found for this location.");
      return;
    }
    openCountDialog(product);
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const matches = products.filter((p) => p.name.toLowerCase().includes(q));
    if (matches.length === 0) {
      setError("Product not found for this location.");
      return;
    }
    if (matches.length === 1) {
      openCountDialog(matches[0]);
      return;
    }
    setSelectionOpen(true);
  };

  const saveCount = async () => {
    if (!countState || !branchIdParam || !month) return;
    const quantity = Number(countState.quantity);
    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Enter a valid numeric count.");
      return;
    }

    await fetch("/api/stockcount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branchId: Number(branchIdParam),
        productId: countState.product.id,
        month,
        quantity,
      }),
    });

    setCounts((prev) => ({ ...prev, [countState.product.id]: quantity }));
    setCountDialogOpen(false);
    setCountState(null);
    setBarcode("");
    setSearchQuery("");
    setTimeout(() => barcodeRef.current?.focus(), 50);
  };

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Stock Count</h1>

      <div className="intro-row">
        <p>
          Location: <strong>{branch?.name ?? "Unknown"}</strong> • Month:{" "}
          <strong>{monthParam || "Unknown"}</strong>
        </p>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 shrink-0 rounded-md border bg-background p-4">
          <h2 className="text-sm font-semibold">Stock Count Lists</h2>
          <div className="mt-3 space-y-2">
            {months.length === 0 && (
              <p className="text-xs text-muted-foreground">No previous counts.</p>
            )}
            {months.map((m) => {
              const label = m.slice(0, 7);
              const isActive = monthParam.startsWith(label);
              return (
                <Link
                  key={m}
                  to={`/stockcount?branchId=${branchIdParam}&month=${label}`}
                  className={`block rounded-md px-3 py-2 text-sm ${
                    isActive ? "bg-muted font-medium" : "hover:bg-muted"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="flex-1">
          <div className="actions-row">
            <div className="search-field">
              <ScanLine className="search-icon" />
              <Input
                ref={barcodeRef}
                type="text"
                placeholder="Scan barcode..."
                className="pl-10 w-full"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBarcodeSubmit()}
              />
              <Button type="button" onClick={handleBarcodeSubmit}>
                Scan
              </Button>
            </div>
            <div className="search-field">
              <Search className="search-icon" />
              <Input
                type="text"
                placeholder="Search product..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              />
              <Button type="button" onClick={handleSearchSubmit}>
                Search
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-4 rounded-md border">
            <div className="grid grid-cols-7 gap-2 p-3 text-sm font-medium">
              <span>Category</span>
              <span>Product</span>
              <span>Price</span>
              <span>Supplier</span>
              <span>Pkg</span>
              <span>UOM</span>
              <span>Count</span>
            </div>
            <div className="divide-y">
              {products.map((p) => (
                <div key={p.id} className="grid grid-cols-7 gap-2 p-3 text-sm">
                  <span>{p.category?.name ?? "—"}</span>
                  <span>{p.name}</span>
                  <span>{p.price ? `$${p.price}` : "—"}</span>
                  <span>{p.supplier?.name ?? "—"}</span>
                  <span>{p.pkg}</span>
                  <span>{p.uom?.name ?? "—"}</span>
                  <div className="flex items-center gap-2">
                    <span className="min-w-10 text-right">
                      {counts[p.id] ?? "—"}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => openCountDialog(p)}>
                      Count
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={selectionOpen} onOpenChange={setSelectionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {products
              .filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
              .map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectionOpen(false);
                    openCountDialog(p);
                  }}
                >
                  {p.name}
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>

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
                  Month: <strong>{monthParam || "Unknown"}</strong>
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
    </ListView>
  );
}
