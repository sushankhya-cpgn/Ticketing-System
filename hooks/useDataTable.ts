// // import { useEffect, useMemo, useState } from "react";
// // import api from "../src/api/axiosClient";

// // interface UseDataTableOptions<T> {
// //   apiUrl: string;
// //   token?: string | null;
// //   searchableFields: (keyof T)[];
// //   defaultSearchField: keyof T;
// //   transformData?: (data: any) => T[];
// // }

// // export function useDataTable<T>({
// //   apiUrl,
// //   token,
// //   searchableFields,
// //   defaultSearchField,
// //   transformData
// // }: UseDataTableOptions<T>) {
  
// //   const [rows, setRows] = useState<T[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const [searchField, setSearchField] = useState<keyof T>(defaultSearchField);
// //   const [searchText, setSearchText] = useState("");
// //   const [searchSelect, setSearchSelect] = useState("");
  
// //   const [page, setPage] = useState(1);
// //   const [pageSize, setPageSize] = useState<number | "all">(100);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const res = await api.get(apiUrl, {
// //           headers: { Authorization: token ? `Bearer ${token}` : "" },
// //         });

// //         const apiData = res.data?.data ?? [];
// //         setRows(transformData ? transformData(apiData) : apiData);
// //       } catch (err) {
// //         console.error("Fetch error:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [apiUrl, token, transformData]);


// //   const selectOptions = useMemo(() => {
// //     return searchableFields.reduce((acc: any, field) => {
// //       const values = Array.from(new Set(rows.map((r: any) => String(r[field]))));
// //       acc[field as keyof T] = values.map((v) => ({ label: v, value: v }));
// //       return acc;
// //     }, {});
// //   }, [rows]);


// //   // const filteredRows = useMemo(() => {
// //   //   return rows.filter((row: any) => {
// //   //     if (typeof row[searchField] === "boolean") {
// //   //       if (searchSelect === "") return true;
// //   //       return row[searchField].toString() === searchSelect;
// //   //     }
// //   //     return (
// //   //       !searchText ||
// //   //       row[searchField]?.toString().toLowerCase().includes(searchText.toLowerCase())
// //   //     );
// //   //   });
// //   // }, [rows, searchField, searchText, searchSelect]);

// //   const filteredRows = useMemo(() => {
// //   return rows.filter((row: any) => {
// //     // if searchSelect is used (dropdown)
// //     if (searchSelect) {
// //       return row[searchField]?.toString() === searchSelect;
// //     }
// //     // if text search is used
// //     if (searchText) {
// //       return row[searchField]?.toString().toLowerCase().includes(searchText.toLowerCase());
// //     }
// //     return true;
// //   });
// // }, [rows, searchField, searchText, searchSelect]);


// //   const paginatedRows = useMemo(() => {
// //     if (pageSize === "all") return filteredRows;
// //     const start = (page - 1) * pageSize;
// //     return filteredRows.slice(start, start + pageSize);
// //   }, [filteredRows, page, pageSize]);

// //   return {
// //     loading, rows, filteredRows, paginatedRows,
// //     searchField, setSearchField,
// //     searchText, setSearchText,
// //     searchSelect, setSearchSelect,
// //     page, setPage,
// //     pageSize, setPageSize,
// //     selectOptions,
// //   };
// // }


// // src/hooks/useDataTable.ts
// import { useEffect, useState, useRef } from "react";
// import api from "../src/api/axiosClient";

// export interface UseDataTableResult<T> {
//   loading: boolean;
//   rows: T[];
//   totalCount: number;

//   page: number;
//   setPage: (p: number) => void;
//   pageSize: number;
//   setPageSize: (s: number | "all") => void;

//   searchTerm: string;
//   setSearchTerm: (t: string) => void;

//   orderBy: string;
//   setOrderBy: (o: string) => void;

//   columnFilters: Record<string, string>;
//   setColumnFilters: (f: Record<string, string>) => void;

//   refetch: () => Promise<void>;
// }

// interface Options {
//   apiUrl: string;
//   token?: string | null;
//   defaultPageSize?: number;
//   debounceMs?: number;
// }

// /**
//  * Server-driven table hook.
//  * - Expects backend parameters: PageNumber, PageSize, SearchTerm, OrderBy, ColumnFilters (JSON string)
//  */
// export function useDataTable<T>({
//   apiUrl,
//   token,
//   defaultPageSize = 10,
//   debounceMs = 300,
// }: Options): UseDataTableResult<T> {
//   const [rows, setRows] = useState<T[]>([]);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [page, setPage] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number | "all">(defaultPageSize);

//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [debouncedSearch, setDebouncedSearch] = useState<string>("");

//   const [orderBy, setOrderBy] = useState<string>(""); // e.g. "displayName asc"
//   const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

//   const cancelRef = useRef<number | null>(null);

//   // debounce searchTerm -> debouncedSearch
//   useEffect(() => {
//     if (cancelRef.current) {
//       window.clearTimeout(cancelRef.current);
//     }
//     cancelRef.current = window.setTimeout(() => {
//       setDebouncedSearch(searchTerm.trim());
//     }, debounceMs);

//     return () => {
//       if (cancelRef.current) {
//         window.clearTimeout(cancelRef.current);
//       }
//     };
//   }, [searchTerm, debounceMs]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const params: any = {
//         PageNumber: page,
//         PageSize: pageSize === "all" ? 0 : pageSize,
//       };

//       if (debouncedSearch) params.SearchTerm = debouncedSearch;
//       if (orderBy) params.OrderBy = orderBy;
//       if (Object.keys(columnFilters).length > 0) {
//         params.ColumnFilters = JSON.stringify(columnFilters);
//       }

//       const res = await api.get(apiUrl, {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//         params,
//       });

//       const data = res.data?.data ?? {};
//       setRows(data.items ?? []);
//       setTotalCount(data.totalCount ?? 0);
//     } catch (err) {
//       console.error("useDataTable fetch error:", err);
//       setRows([]);
//       setTotalCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // refetch whenever page / pageSize / debouncedSearch / orderBy / columnFilters change
//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, pageSize, debouncedSearch, orderBy, JSON.stringify(columnFilters)]);

//   return {
//     loading,
//     rows,
//     totalCount,
//     page,
//     setPage,
//     pageSize,
//     setPageSize: (s: number | "all") => {
//       if (s === "all") {
//         setPageSize("all");
//         setPage(1);
//       } else {
//         setPageSize(s);
//         setPage(1);
//       }
//     },
//     searchTerm,
//     setSearchTerm: (t: string) => {
//       setSearchTerm(t);
//       setPage(1);
//     },
//     orderBy,
//     setOrderBy: (o: string) => {
//       setOrderBy(o);
//       setPage(1);
//     },
//     columnFilters,
//     setColumnFilters: (f: Record<string, string>) => {
//       setColumnFilters(f);
//       setPage(1);
//     },
//     refetch: fetchData,
//   };
// }
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
