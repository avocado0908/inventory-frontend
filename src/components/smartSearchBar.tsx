import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SmartSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export const SmartSearchBar = React.forwardRef<HTMLInputElement, SmartSearchBarProps>(
  ({ value, onChange, placeholder = "Search...", onKeyDown }, ref) => {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-white px-2">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className="h-8 border-0 px-0 focus-visible:ring-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
});
SmartSearchBar.displayName = "SmartSearchBar";

export function matchesSmartSearch(query: string, target: { name?: string; barcode?: string }) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const name = target.name?.toLowerCase() ?? "";
  const barcode = target.barcode?.toLowerCase() ?? "";
  if (name.includes(q) || barcode.includes(q)) return true;

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const normalizedQuery = normalize(q);
  if (!normalizedQuery) return true;

  const normalizedName = normalize(name);
  const normalizedBarcode = normalize(barcode);
  if (normalizedName.includes(normalizedQuery) || normalizedBarcode.includes(normalizedQuery)) {
    return true;
  }

  // Fuzzy match for common typing errors (small edit distance)
  const maxDistance = normalizedQuery.length > 6 ? 2 : 1;
  const levenshtein = (a: string, b: string) => {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[a.length][b.length];
  };

  if (normalizedQuery.length >= 3) {
    if (levenshtein(normalizedQuery, normalizedName) <= maxDistance) return true;
    if (normalizedBarcode && levenshtein(normalizedQuery, normalizedBarcode) <= maxDistance) {
      return true;
    }
  }

  return false;
}
