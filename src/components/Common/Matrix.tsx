import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Box, Checkbox, Heading, Table } from "@chakra-ui/react";
import { useMemo } from "react";
import { Permission } from "../../features/permissions/permission.model";

type MatrixTableProps<T> = {
  title: string;
  rows: T[];
  rowKey: keyof T;
  rowLabel: (row: T) => string;
  groupedPermissions: Record<string, Permission[]>;
  isChecked: (row: T, permission: Permission) => boolean;
  onToggle: (rowId: string, permissionId: string, checked: boolean) => void;
  getChangeType: (
    entityId: string,
    permissionId: string,
  ) => "add" | "remove" | null;
  getUserPermissionSource?: (
    entityId: string,
    permissionId: string,
  ) => "role" | "direct" | "none";
  search?: string;
};

export function TanstackPermissionMatrix<T>({
  title,
  rows,
  rowKey,
  rowLabel,
  groupedPermissions,
  isChecked,
  onToggle,
  getChangeType,
  getUserPermissionSource,
  search,
}: MatrixTableProps<T>) {
  const filteredGroupedPermissions = useMemo(() => {
    const q = search?.toLowerCase().trim();

    if (!q) return groupedPermissions;

    const result: Record<string, Permission[]> = {};

    for (const [group, perms] of Object.entries(groupedPermissions)) {
      const matches = perms.filter((p) => p.name.toLowerCase().includes(q));

      if (matches.length) {
        result[group] = matches;
      }
    }

    return result;
  }, [groupedPermissions, search]);

  const columns = useMemo<ColumnDef<T>[]>(() => {
    const nameColumn: ColumnDef<T> = {
      id: "name",
      header: "Name",
      cell: ({ row }) => rowLabel(row.original),
    };

    const permissionColumns = Object.entries(filteredGroupedPermissions).map(
      ([group, perms]) => ({
        header: group,
        columns: perms.map(
          (perm): ColumnDef<T> => ({
            id: perm.id,
            header: perm.name.split(":")[1] ?? perm.name,
            cell: ({ row }) => {
              const entityId = String(row.original[rowKey]);
              const checked = Boolean(isChecked(row.original, perm));
              const source = getUserPermissionSource?.(entityId, perm.id);
              const inherited = source === "role";

              return (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h="40px"
                >
                  <Checkbox.Root
                    checked={checked}
                    disabled={inherited}
                    opacity={inherited ? 0.6 : 1}
                    onCheckedChange={(d) =>
                      onToggle(entityId, perm.id, d.checked === true)
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox.Root>
                </Box>
              );
            },
          }),
        ),
      }),
    );

    return [nameColumn, ...permissionColumns];
  }, [filteredGroupedPermissions, isChecked, onToggle, rowKey, rowLabel]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box
      overflow="auto"
      maxW="100%"
      maxH="70vh"
      borderWidth="1px"
      borderRadius="md"
    >
      <Heading size="sm" p={3}>
        {title}
      </Heading>

      <Table.Root size="sm" borderCollapse="separate" borderSpacing={0}>
        {/* HEADER */}
        <Table.Header>
          {table.getHeaderGroups().map((hg, hgIndex) => (
            <Table.Row
              key={hg.id}
              position="sticky"
              top={hgIndex === 0 ? "0px" : "40px"} // STACK HEADER ROWS
              bg="white"
              zIndex={hgIndex === 0 ? 40 : 30}
              boxShadow={hgIndex === 0 ? "0 2px 0 rgba(0,0,0,0.15)" : undefined}
              h="40px"
            >
              {hg.headers.map((header) => {
                const isName = header.column.id === "name";

                // Skip duplicate Name in second header row
                if (hgIndex === 1 && isName) return null;

                return (
                  <Table.ColumnHeader
                    key={header.id}
                    colSpan={header.colSpan}
                    rowSpan={isName && hgIndex === 0 ? 2 : 1}
                    borderWidth="1px"
                    borderColor="gray.200"
                    textAlign="center"
                    verticalAlign="middle"
                    h="40px"
                    whiteSpace="nowrap"
                    position={isName ? "sticky" : "static"}
                    left={isName ? 0 : undefined}
                    bg="white"
                    zIndex={isName ? 50 : 20}
                    boxShadow={isName ? "2px 0 0 rgba(0,0,0,0.25)" : undefined}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Table.ColumnHeader>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>

        {/* BODY */}
        <Table.Body>
          {table.getRowModel().rows.map((row) => {
            const entityId = String(row.original[rowKey]);

            return (
              <Table.Row key={row.id} h="40px">
                {row.getVisibleCells().map((cell, index) => {
                  const permissionId =
                    cell.column.id === "name" ? null : cell.column.id;

                  const change =
                    permissionId != null
                      ? getChangeType(entityId, permissionId)
                      : null;

                  return (
                    <Table.Cell
                      key={cell.id}
                      position={index === 0 ? "sticky" : "static"}
                      left={index === 0 ? 0 : undefined}
                      zIndex={index === 0 ? 5 : undefined}
                      boxShadow={
                        index === 0 ? "2px 0 0 rgba(0,0,0,0.15)" : undefined
                      }
                      bg={
                        change === "add"
                          ? "green.subtle"
                          : change === "remove"
                            ? "red.subtle"
                            : index === 0
                              ? "white"
                              : undefined
                      }
                      borderWidth="1px"
                      borderColor="gray.200"
                      h="40px"
                      textAlign="center"
                      whiteSpace="nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
