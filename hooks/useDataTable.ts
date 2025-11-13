import { useEffect, useMemo, useState } from "react";
import api from "../src/api/axiosClient";

interface UseDataTableOptions<T> {
  apiUrl: string;
  token?: string | null;
  searchableFields: (keyof T)[];
  defaultSearchField: keyof T;
  transformData?: (data: any) => T[];
}

export function useDataTable<T>({
  apiUrl,
  token,
  searchableFields,
  defaultSearchField,
  transformData
}: UseDataTableOptions<T>) {
  
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchField, setSearchField] = useState<keyof T>(defaultSearchField);
  const [searchText, setSearchText] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(apiUrl, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        const apiData = res.data?.data ?? [];
        setRows(transformData ? transformData(apiData) : apiData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, token, transformData]);


  const selectOptions = useMemo(() => {
    return searchableFields.reduce((acc: any, field) => {
      const values = Array.from(new Set(rows.map((r: any) => String(r[field]))));
      acc[field as keyof T] = values.map((v) => ({ label: v, value: v }));
      return acc;
    }, {});
  }, [rows]);


  // const filteredRows = useMemo(() => {
  //   return rows.filter((row: any) => {
  //     if (typeof row[searchField] === "boolean") {
  //       if (searchSelect === "") return true;
  //       return row[searchField].toString() === searchSelect;
  //     }
  //     return (
  //       !searchText ||
  //       row[searchField]?.toString().toLowerCase().includes(searchText.toLowerCase())
  //     );
  //   });
  // }, [rows, searchField, searchText, searchSelect]);

  const filteredRows = useMemo(() => {
  return rows.filter((row: any) => {
    // if searchSelect is used (dropdown)
    if (searchSelect) {
      return row[searchField]?.toString() === searchSelect;
    }
    // if text search is used
    if (searchText) {
      return row[searchField]?.toString().toLowerCase().includes(searchText.toLowerCase());
    }
    return true;
  });
}, [rows, searchField, searchText, searchSelect]);


  const paginatedRows = useMemo(() => {
    if (pageSize === "all") return filteredRows;
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  return {
    loading, rows, filteredRows, paginatedRows,
    searchField, setSearchField,
    searchText, setSearchText,
    searchSelect, setSearchSelect,
    page, setPage,
    pageSize, setPageSize,
    selectOptions,
  };
}
