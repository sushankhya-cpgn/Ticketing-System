// src/hooks/useDataTable.ts
import { useEffect, useState, useRef } from "react";
import api from "../src/api/axiosClient";

// ------------------------
// Corrected return interface
// ------------------------
export interface UseDataTableResult<T> {
  loading: boolean;
  rows: T[];
  totalCount: number;

  page: number;
  setPage: (p: number) => void;

  pageSize: number | "all"; // ✅ FIXED
  setPageSize: (s: number | "all") => void;

  searchTerm: string;
  setSearchTerm: (t: string) => void;

  orderBy: string;
  setOrderBy: (o: string) => void;

  columnFilters: Record<string, string>;
  setColumnFilters: (f: Record<string, string>) => void;

  refetch: () => Promise<void>;
}

interface Options {
  apiUrl: string;
  token?: string | null;
  defaultPageSize?: number;
  debounceMs?: number;
}

// ------------------------
// useDataTable Hook
// ------------------------
export function useDataTable<T>({
  apiUrl,
  token,
  defaultPageSize = 10,
  debounceMs = 300,
}: Options): UseDataTableResult<T> {
  
  const [rows, setRows] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number | "all">(defaultPageSize); // ✅ FIXED

  const [searchTerm, setSearchTermState] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [orderBy, setOrderByState] = useState<string>("");
  const [columnFilters, setColumnFiltersState] = useState<Record<string, string>>({});

  const debounceRef = useRef<number | null>(null);

  // ------------------------
  // Search debounce
  // ------------------------
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, debounceMs);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm, debounceMs]);


  // ------------------------
  // Fetch Data from API
  // ------------------------
  const fetchData = async () => {
    setLoading(true);

    try {
      const params: any = {
        PageNumber: page,
        PageSize: pageSize === "all" ? 0 : pageSize,
      };

      if (debouncedSearch) params.SearchTerm = debouncedSearch;
      if (orderBy) params.OrderBy = orderBy;

      if (Object.keys(columnFilters).length > 0) {
        params.ColumnFilters = JSON.stringify(columnFilters);
      }

      const res = await api.get(apiUrl, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        params,
      });

      const data = res.data?.data ?? {};

      setRows(data.items ?? data ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (err) {
      console.error("useDataTable fetch error:", err);
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Refetch on dependencies
  // ------------------------
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch, orderBy, JSON.stringify(columnFilters)]);

  // ------------------------
  // Return Hook values
  // ------------------------
  return {
    loading,
    rows,
    totalCount,

    page,
    setPage,

    pageSize, // now correctly typed
    setPageSize: (size: number | "all") => {
      setPageSizeState(size);
      setPage(1);
    },

    searchTerm,
    setSearchTerm: (t) => {
      setSearchTermState(t);
      setPage(1);
    },

    orderBy,
    setOrderBy: (o) => {
      setOrderByState(o);
      setPage(1);
    },

    columnFilters,
    setColumnFilters: (f) => {
      setColumnFiltersState(f);
      setPage(1);
    },

    refetch: fetchData,
  };
}
