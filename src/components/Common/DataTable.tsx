import {
  ButtonGroup,
  Highlight,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  Pagination,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  GetListResponse,
  HttpError,
  useTable,
  type BaseRecord,
  type CrudFilters,
  type CrudSort,
} from "@refinedev/core";
import { QueryObserverResult } from "@tanstack/query-core";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsUpDown,
  LuChevronUp,
} from "react-icons/lu";
import { formatDate } from "../../utils/helpers";

type Column<T> = {
  key: keyof T | string;
  header: React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  sortSearchTranslation?: (record: T) => string; // Function to translate ID to searchable text (for client-side filtering)
  isDate?: boolean;
  visible?: boolean;
  render?: (record: T) => React.ReactNode;
  width?: string;
  textAlign?: "left" | "center" | "right";
};

type DataTableProps<T extends BaseRecord> = {
  resource: string;
  parentModule?: string;
  columns: Column<T>[];
  defaultPageSizeOptions?: number[];
  interactive?: boolean;
  onDataChange?: (data: T[], total: number) => void;
  onQuery?: (query: QueryObserverResult<GetListResponse<T>, HttpError>) => void;
  globalFilters?: CrudFilters;
  caption?: React.ReactNode;
};

export function DataTable<T extends BaseRecord>({
  resource,
  parentModule,
  columns,
  defaultPageSizeOptions = [10, 20, 50],
  interactive = true,
  onDataChange,
  onQuery,
  globalFilters = [],
  caption,
}: DataTableProps<T>) {
  const {
    result,
    sorters,
    setSorters,
    setFilters,
    filters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    tableQuery,
  } = useTable<T>({
    resource,
    pagination: {
      mode: "server",
    },
    meta: {
      parentModule: parentModule || undefined,
    },
    sorters: {
      mode: "server",
    },
    filters: {
      mode: "server",
    },
  });

  const [search, setSearch] = useState("");

  // Restore search input from URL-synced filters when navigating back/forward
  useEffect(() => {
    // Find first 'contains' filter value and use it as search text if all search filters share same value
    const containsFilters = (filters ?? []).filter(
      (f) => f.operator === "contains" && typeof f.value === "string",
    );
    if (containsFilters.length > 0) {
      const firstVal = String(containsFilters[0].value);
      const allSame = containsFilters.every(
        (f) => String(f.value) === firstVal,
      );
      if (allSame && firstVal !== search) {
        setSearch(firstVal);
      }
    } else if (search) {
      // If no search-related filters present, clear input
      setSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Notify parent component when data changes; avoid function and query identity loops
  useEffect(() => {
    if (onDataChange && result.data) {
      onDataChange(result.data, result.total ?? 0);
    }
    if (onQuery) {
      onQuery(tableQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data, result.total]);

  // Memoize default page size options to prevent recreating on every render
  const pageSizeOptionsMemo = useMemo(
    () => defaultPageSizeOptions,
    [defaultPageSizeOptions.join(",")],
  );

  // Calculate page size options based on total results
  const pageSizeOptions = useMemo(() => {
    if (result?.total && result.total < pageSizeOptionsMemo[0]) {
      return [result.total];
    }
    return pageSizeOptionsMemo;
  }, [result?.total, pageSizeOptionsMemo]);

  // Adjust page size dynamically based on total results (fallback to current data length)
  useEffect(() => {
    const total = (result?.total ?? 0) as number;

    if (
      total >= pageSizeOptionsMemo[0] &&
      !pageSizeOptionsMemo.includes(pageSize)
    ) {
      setPageSize(pageSizeOptionsMemo[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.total]);

  // Clamp current page when results fit in a single page or shrink
  useEffect(() => {
    const total = (result?.total ?? 0) as number;
    if (total <= pageSize && currentPage !== 1) {
      setCurrentPage(1);
    } else {
      const maxPage = Math.max(1, Math.ceil(total / pageSize));
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.total, pageSize]);

  // Memoize visible columns (columns with visible !== false)
  const visibleColumns = useMemo(
    () => columns.filter((c) => c.visible !== false),
    [columns],
  );

  // Searchable fields include both visible and hidden columns
  // Exclude columns with sortSearchTranslation (they use client-side filtering)
  const searchableFields = useMemo(
    () =>
      columns
        .filter((c) => c.searchable && !c.sortSearchTranslation)
        .map((c) => String(c.key)),
    [columns],
  );

  const toggleSort = (columnKey: string, multiSort: boolean = false) => {
    const field = columnKey;

    const existing = sorters.find((s) => s.field === field);

    let next: CrudSort[];

    if (multiSort) {
      // Multi-sort mode: Shift+Click to add/modify additional sorts
      if (!existing) {
        // Add new sort to existing sorts
        next = [...sorters, { field, order: "asc" }];
      } else if (existing.order === "asc") {
        // Change to desc
        next = sorters.map((s) =>
          s.field === field ? { field, order: "desc" } : s,
        );
      } else {
        // Remove this sort
        next = sorters.filter((s) => s.field !== field);
      }
    } else {
      // Single sort mode: Replace all sorts
      if (!existing) {
        next = [{ field, order: "asc" }];
      } else if (existing.order === "asc") {
        next = [{ field, order: "desc" }];
      } else {
        next = [];
      }
    }

    setSorters(next);
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey: string) => {
    const field = columnKey;

    const sorterIndex = sorters.findIndex((s) => s.field === field);
    if (sorterIndex === -1) return <LuChevronsUpDown size={14} opacity={0.3} />;

    const sorter = sorters[sorterIndex];
    return sorter.order === "asc" ? (
      <LuChevronUp size={14} />
    ) : (
      <LuChevronDown size={14} />
    );
  };

  useEffect(() => {
    // Debounce search to avoid rapid setFilters calls
    const timer = setTimeout(() => {
      const makeKey = (filters: CrudFilters) =>
        JSON.stringify(filters.map((f) => ({ ...f, value: f.value })));

      const nextFilters: CrudFilters = (() => {
        if (!searchableFields.length) {
          return globalFilters;
        }
        if (!search.trim()) {
          return globalFilters;
        }
        const searchFilters: CrudFilters = searchableFields.map((field) => ({
          field,
          operator: "contains",
          value: search,
        }));
        return [...globalFilters, ...searchFilters];
      })();

      const key = makeKey(nextFilters);
      if (key !== lastFiltersKeyRef.current) {
        setFilters(nextFilters, "replace");
        lastFiltersKeyRef.current = key;
        // Only reset to page 1 when search text changes meaningfully
        if (prevSearchRef.current !== search.trim()) {
          setCurrentPage(1);
          prevSearchRef.current = search.trim();
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search, searchableFields, globalFilters, setFilters, setCurrentPage]);

  // Track last applied filters to avoid update loops
  const lastFiltersKeyRef = useRef<string>("__init__");
  const prevSearchRef = useRef<string>("");

  // Note: initial/global filter application is handled in the debounced search effect
  // to avoid racing effects that cause rapid updates and refetches.

  return (
    <>
      {searchableFields.length > 0 && (
        <HStack mb={4}>
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="300px"
          />
        </HStack>
      )}

      <Table.Root
        size="sm"
        variant="outline"
        tableLayout={"fixed"}
        interactive={interactive}
      >
        {caption && <Table.Caption mt={"1vh"}>{caption}</Table.Caption>}
        <Table.Header>
          <Table.Row>
            {visibleColumns.map((col) => (
              <Table.ColumnHeader key={String(col.key)} width={col.width}>
                <HStack
                  justify={
                    col.sortable
                      ? col.textAlign === "right"
                        ? "flex-end"
                        : col.textAlign === "center"
                          ? "center"
                          : "space-between"
                      : col.textAlign === "right"
                        ? "flex-end"
                        : col.textAlign === "center"
                          ? "center"
                          : "flex-start"
                  }
                  gap={1}
                >
                  {col.sortable && col.textAlign === "right" && (
                    <IconButton
                      size="xs"
                      variant="ghost"
                      aria-label="Sort column"
                      onClick={() => toggleSort(String(col.key))}
                      minW="20px"
                    >
                      {getSortIcon(String(col.key))}
                    </IconButton>
                  )}
                  <Text lineClamp={1}>{col.header}</Text>
                  {col.sortable && col.textAlign !== "right" && (
                    <IconButton
                      size="xs"
                      variant="ghost"
                      aria-label="Sort column"
                      onClick={() => toggleSort(String(col.key))}
                      minW="20px"
                    >
                      {getSortIcon(String(col.key))}
                    </IconButton>
                  )}
                </HStack>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result.data
            .filter((record) => {
              // Apply client-side filtering for columns with sortSearchTranslation
              if (!search) return true;

              const translatedColumns = columns.filter(
                (c) => c.searchable && c.sortSearchTranslation,
              );
              if (translatedColumns.length === 0) return true;

              return translatedColumns.some((col) => {
                const translated = col.sortSearchTranslation!(record);
                return translated.toLowerCase().includes(search.toLowerCase());
              });
            })
            .map((record) => (
              <Table.Row key={record.id}>
                {visibleColumns.map((col) => {
                  const cellContent = col.render
                    ? col.render(record)
                    : col.isDate
                      ? formatDate(record[col.key as keyof T])
                      : record[col.key as keyof T];

                  // Only use Highlight for string content and when search is active
                  const shouldHighlight =
                    search && col.searchable && typeof cellContent === "string"
                      ? true
                      : false;

                  return (
                    <Table.Cell
                      key={String(col.key)}
                      textAlign={col.textAlign || "left"}
                    >
                      {shouldHighlight ? (
                        <Highlight
                          query={search}
                          ignoreCase
                          styles={{
                            bg: "orange.subtle",
                            color: "orange.fg",
                          }}
                        >
                          {cellContent as string}
                        </Highlight>
                      ) : (
                        <HStack
                          justify={
                            col.textAlign === "right"
                              ? "flex-end"
                              : col.textAlign === "center"
                                ? "center"
                                : "flex-start"
                          }
                        >
                          {cellContent}
                        </HStack>
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      <Pagination.Root
        count={result.total ?? result.data.length ?? 0}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(e) => setCurrentPage(e.page)}
      >
        <HStack justifyContent="space-between" mb={2} mt={4}>
          <Pagination.PageText format="long" />
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            {(result.total ?? result.data.length ?? 0) > pageSize && (
              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                  </IconButton>
                )}
              />
            )}

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
          <HStack>
            <NativeSelect.Root
              disabled={(result?.total ?? result?.data.length ?? 0) <= pageSize}
            >
              <NativeSelect.Field
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.currentTarget.value));
                }}
              >
                {pageSizeOptions.map((size: number) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </HStack>
        </HStack>
      </Pagination.Root>
    </>
  );
}
