import {
  Box,
  Button,
  Card,
  Flex,
  Group,
  Heading,
  IconButton,
  Input,
  Popover,
  Portal,
  Tabs,
} from "@chakra-ui/react";
import { CanAccess, useCreate, useList, useDelete } from "@refinedev/core";
import { useMemo, useRef, useState } from "react";
import { Permission } from "../../features/permissions/permissions.model";
import { useMask } from "@react-input/mask";
import {
  User,
  UserPermission,
  UserRole,
} from "../../features/users/users.model";

import { Role, RolePermission } from "../../features/roles/roles.model";
import { TanstackPermissionMatrix } from "../Common/Matrix";
import { LuCirclePlus } from "react-icons/lu";

export const Permissions = () => {
  const HISTORY_LIMIT = 20;

  const [changes, setChanges] = useState<{
    add: { entityId: string; permissionId: string }[];
    remove: { entityId: string; permissionId: string }[];
  }>({ add: [], remove: [] });

  const [history, setHistory] = useState<
    {
      add: { entityId: string; permissionId: string }[];
      remove: { entityId: string; permissionId: string }[];
    }[]
  >([]);

  const [permissionSearch, setPermissionSearch] = useState("");
  const isDirty = changes.add.length > 0 || changes.remove.length > 0;
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const { mutateAsync: create } = useCreate();

  const { mutateAsync: del } = useDelete();

  const { result: permissions } = useList<Permission>({
    resource: "permissions",
    pagination: { pageSize: 1000 },
  });
  const { result: users } = useList<User>({ resource: "users" });
  const { result: userPermissions } = useList<UserPermission>({
    resource: "permissions",
    meta: { parentmodule: "users" },
  });
  const { result: userRoles } = useList<UserRole>({
    resource: "roles",
    meta: { parentmodule: "users" },
  });

  const { result: roles } = useList<Role>({ resource: "roles" });
  const { result: rolePermissions } = useList<RolePermission>({
    resource: "permissions",
    meta: { parentmodule: "roles" },
    pagination: { pageSize: 1000 },
  });

  const groupedPermissions = useMemo(() => {
    return permissions.data.reduce<Record<string, Permission[]>>((acc, p) => {
      const group = p.name.split(":")[0] || "General";
      acc[group] ??= [];
      acc[group].push(p);
      return acc;
    }, {});
  }, [permissions]);

  const userPermissionSet = useMemo(() => {
    const set = new Set<string>();
    for (const up of userPermissions.data) {
      set.add(`${up.userId}|${up.permissionId}`);
    }
    return set;
  }, [userPermissions]);

  const rolePermissionSet = useMemo(() => {
    const set = new Set<string>();
    for (const rp of rolePermissions.data) {
      set.add(`${rp.roleId}|${rp.permissionId}`);
    }
    return set;
  }, [rolePermissions]);

  const addedSet = useMemo(() => {
    const set = new Set<string>();
    for (const c of changes.add) set.add(`${c.entityId}|${c.permissionId}`);
    return set;
  }, [changes.add]);

  const removedSet = useMemo(() => {
    const set = new Set<string>();
    for (const c of changes.remove) set.add(`${c.entityId}|${c.permissionId}`);
    return set;
  }, [changes.remove]);

  const getRoleIdsForUser = (userId: string): string[] => {
    return userRoles.data
      .filter((ur) => ur.userId === userId)
      .map((ur) => ur.roleId);
  };

  const getRoleGrantedPermissions = (userId: string): Set<string> => {
    const roleIds = getRoleIdsForUser(userId);

    return new Set(
      rolePermissions.data
        .filter((rp) => roleIds.includes(rp.roleId))
        .map((rp) => rp.permissionId),
    );
  };

  const getUserPermissionSource = (userId: string, permissionId: string) => {
    const rolePermissions = getRoleGrantedPermissions(userId);

    if (rolePermissions.has(permissionId)) return "role";

    if (userPermissionSet.has(`${userId}|${permissionId}`)) return "direct";

    return "none";
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    create({
      resource: "permissions",
      values: { name },
    });
    (e.target as HTMLFormElement).reset();
  };

  const handleUserToggle = (
    userId: string,
    permissionId: string,
    checked: boolean,
  ) => {
    const source = getUserPermissionSource(userId, permissionId);

    // Role based permissions are read-only in user view
    if (source === "role") return;

    const original = userPermissions.data.some(
      (p) => p.userId === userId && p.permissionId === permissionId,
    );

    setChanges((prev) => {
      setHistory((h) => {
        const last = h[h.length - 1];
        const same = JSON.stringify(last) === JSON.stringify(prev);
        if (same) return h;
        return [...h, prev].slice(-HISTORY_LIMIT);
      });

      return updateChangeState(prev, userId, permissionId, original, checked);
    });
  };

  const handleRoleToggle = (
    roleId: string,
    permissionId: string,
    checked: boolean,
  ) => {
    const original = rolePermissions.data.some(
      (p) => p.roleId === roleId && p.permissionId === permissionId,
    );

    setChanges((prev) => {
      setHistory((h) => {
        const last = h[h.length - 1];
        const same = JSON.stringify(last) === JSON.stringify(prev);

        if (same) return h;

        return [...h, prev].slice(-HISTORY_LIMIT);
      });

      return updateChangeState(prev, roleId, permissionId, original, checked);
    });
  };

  const isUserChecked = (u: User, p: Permission) => {
    const key = `${u.id}|${p.id}`;

    const rolePermissions = getRoleGrantedPermissions(u.id);
    const hasFromRole = rolePermissions.has(p.id);
    const hasDirect = userPermissionSet.has(key);

    if (addedSet.has(key)) return true;
    if (removedSet.has(key)) return false;

    return hasDirect || hasFromRole;
  };

  const isRoleChecked = (r: Role, p: Permission) => {
    const key = `${r.id}|${p.id}`;
    if (addedSet.has(key)) return true;
    if (removedSet.has(key)) return false;
    return rolePermissionSet.has(key);
  };

  function updateChangeState(
    prev: {
      add: { entityId: string; permissionId: string }[];
      remove: { entityId: string; permissionId: string }[];
    },
    entityId: string,
    permissionId: string,
    originalHasPermission: boolean,
    newValue: boolean,
  ) {
    let add = prev.add.filter(
      (c) => !(c.entityId === entityId && c.permissionId === permissionId),
    );
    let remove = prev.remove.filter(
      (c) => !(c.entityId === entityId && c.permissionId === permissionId),
    );

    // Back to original → no diff
    if (newValue === originalHasPermission) {
      return { add, remove };
    }

    if (newValue && !originalHasPermission) {
      add = [...add, { entityId, permissionId }];
    }

    if (!newValue && originalHasPermission) {
      remove = [...remove, { entityId, permissionId }];
    }

    return { add, remove };
  }

  const saveHandler = async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      // Apply ADDs
      await Promise.all(
        changes.add.map(async ({ entityId, permissionId }) => {
          if (!entityId) return;

          const isUser = users.data.some((u) => u.id === entityId);
          const isRole = roles.data.some((r) => r.id === entityId);

          if (isUser) {
            await create({
              resource: "permissions",
              meta: { parentmodule: "users" },
              values: { user_id: entityId, permission_id: permissionId },
            });
          } else if (isRole) {
            await create({
              resource: "permissions",
              meta: { parentmodule: "roles" },
              values: { role_id: entityId, permission_id: permissionId },
            });
          } else {
            console.warn("saveHandler: unknown entityId", entityId);
          }
        }),
      );

      // Apply REMOVEs
      await Promise.all(
        changes.remove.map(async ({ entityId, permissionId }) => {
          if (!entityId) return;

          const isUser = users.data.some((u) => u.id === entityId);
          const isRole = roles.data.some((r) => r.id === entityId);

          if (isUser) {
            const userPermission = userPermissions.data.find(
              (up) =>
                up.userId === entityId && up.permissionId === permissionId,
            );
            if (userPermission) {
              await del({
                resource: "permissions",
                meta: {
                  parentmodule: "users",
                  relation_ids: [entityId, permissionId],
                },
                id: "relation",
              });
            }
          } else if (isRole) {
            const rolePermission = rolePermissions.data.find(
              (rp) =>
                rp.roleId === entityId && rp.permissionId === permissionId,
            );
            if (rolePermission) {
              await del({
                resource: "permissions",
                meta: {
                  parentmodule: "roles",
                  relation_ids: [entityId, permissionId],
                },
                id: "relation",
              });
            }
          } else {
            console.warn("saveHandler: unknown entityId", entityId);
          }
        }),
      );

      // ✅ Now clear change set in one go
      setChanges({ add: [], remove: [] });
    } finally {
      setIsSaving(false);
    }
  };

  const getChangeType = (entityId: string, permissionId: string) => {
    const key = `${entityId}|${permissionId}`;
    if (addedSet.has(key)) return "add";
    if (removedSet.has(key)) return "remove";
    return null;
  };

  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;

      const last = h[h.length - 1];
      setChanges(last);

      return h.slice(0, -1); // drop last
    });
  };

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" align="center" justify="space-between">
        <Heading size="lg">Permissions</Heading>
      </Flex>

      <Tabs.Root defaultValue="userpermissions">
        <Flex flex={1} gap={4} align="center" justify="space-between">
          <Tabs.List>
            <Tabs.Trigger value="userpermissions">
              User Permissions
            </Tabs.Trigger>
            <Tabs.Trigger value="rolepermissions">
              Role Permissions
            </Tabs.Trigger>
          </Tabs.List>
          <Flex gap={2} align="center">
            <CanAccess resource="permissions" action="create">
              <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Popover.Trigger
                  as={IconButton}
                  aria-label="Add Permission"
                  onClick={() => setOpen(true)}
                  type="button"
                >
                  <LuCirclePlus />
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content p={4} bg="white" boxShadow="md">
                    <Popover.Arrow />
                    <Popover.Body>
                      <form onSubmit={submitHandler}>
                        <Group attached w="full">
                          <Input name="name" placeholder="resource:action" />

                          <Button type="submit" colorScheme="blue">
                            Create
                          </Button>
                        </Group>
                      </form>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </CanAccess>
            <Input
              variant="flushed"
              placeholder="Search permissions…"
              value={permissionSearch}
              onChange={(e) => setPermissionSearch(e.target.value)}
            />
          </Flex>
        </Flex>

        <Tabs.Content value="userpermissions">
          <TanstackPermissionMatrix
            title="Users × Permissions"
            rows={users.data}
            rowKey="id"
            rowLabel={(u) => u.fullName}
            groupedPermissions={groupedPermissions}
            isChecked={isUserChecked}
            onToggle={handleUserToggle}
            getChangeType={getChangeType}
            getUserPermissionSource={getUserPermissionSource}
            search={permissionSearch}
          />
        </Tabs.Content>

        <Tabs.Content value="rolepermissions">
          <TanstackPermissionMatrix
            title="Roles × Permissions"
            rows={roles.data}
            rowKey="id"
            rowLabel={(r) => r.name}
            groupedPermissions={groupedPermissions}
            isChecked={isRoleChecked}
            onToggle={handleRoleToggle}
            getChangeType={getChangeType}
            search={permissionSearch}
          />
        </Tabs.Content>
      </Tabs.Root>
      <Flex justify="flex-end" mt={4} gap={2} align="center">
        {isDirty && (
          <Box fontSize="sm" color="orange.500" mr="auto">
            You have unsaved changes
          </Box>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={history.length === 0}
        >
          Undo
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={saveHandler}
          disabled={!isDirty}
          loading={isSaving}
        >
          Save changes
        </Button>
      </Flex>
    </Flex>
  );
};
