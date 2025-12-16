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
import { useEffect, useMemo, useState } from "react";

import { useTable, type BaseRecord, type CrudSort } from "@refinedev/core";
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
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  isDate?: boolean;
  visible?: boolean; // default: true - if false, column won't be rendered but can still be used for filtering/sorting
  render?: (record: T) => React.ReactNode;
  width?: string;
};

type DataTableProps<T extends BaseRecord> = {
  resource: string;
  parentModule?: string;
  columns: Column<T>[];
  pageSizeOptions?: number[];
};

export function DataTable<T extends BaseRecord>({
  resource,
  parentModule,
  columns,
  pageSizeOptions = [10, 20, 50],
}: DataTableProps<T>) {
  const {
    result,
    sorters,
    setSorters,
    setFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    pageCount,
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

  // Memoize visible columns (columns with visible !== false)
  const visibleColumns = useMemo(
    () => columns.filter((c) => c.visible !== false),
    [columns],
  );

  // Searchable fields include both visible and hidden columns
  const searchableFields = useMemo(
    () => columns.filter((c) => c.searchable).map((c) => String(c.key)),
    [columns],
  );

  const toggleSort = (field: string) => {
    const existing = sorters.find((s) => s.field === field);

    let next: CrudSort[];

    if (!existing) {
      next = [{ field, order: "asc" }];
    } else if (existing.order === "asc") {
      next = [{ field, order: "desc" }];
    } else {
      next = [];
    }

    setSorters(next);
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    const sorter = sorters.find((s) => s.field === field);
    if (!sorter) return <LuChevronsUpDown size={14} opacity={0.3} />;
    return sorter.order === "asc" ? (
      <LuChevronUp size={14} />
    ) : (
      <LuChevronDown size={14} />
    );
  };

  useEffect(() => {
    if (!searchableFields.length) return;

    if (!search.trim()) {
      // Only clear filters if there's actually something to clear
      setFilters([], "replace");
      return;
    }

    setFilters(
      searchableFields.map((field) => ({
        field,
        operator: "contains",
        value: search,
      })),
      "replace",
    );

    setCurrentPage(1);
  }, [search, setFilters, setCurrentPage]);

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

      <Table.Root size="sm" variant="outline" tableLayout={"fixed"}>
        <Table.Header>
          <Table.Row>
            {visibleColumns.map((col) => (
              <Table.ColumnHeader key={String(col.key)} width={col.width}>
                <HStack justify="space-between">
                  <Text lineClamp={1}>{col.header}</Text>

                  {col.sortable && (
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
          {result.data.map((record) => (
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
                  <Table.Cell key={String(col.key)}>
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
                      cellContent
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
        count={pageCount * pageSize}
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

            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
          <HStack>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={pageSize}
                onChange={(e) => {
                  console.log(e.currentTarget.value);
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
