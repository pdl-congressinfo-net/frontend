import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  Input,
  Separator,
  Table,
  Tabs,
} from "@chakra-ui/react";
import { CanAccess, useCreate, useList, useDelete } from "@refinedev/core";
import { useMemo, useState } from "react";
import { PermissionDTO } from "../../features/permissions/permission.responses";
import {
  UserDTO,
  UserPermissionDTO,
  UserRoleDTO,
} from "../../features/users/user.responses";
import {
  RoleDTO,
  RolePermissionDTO,
} from "../../features/roles/role.responses";
import { Permission } from "../../features/permissions/permission.model";
import { mapPermission } from "../../features/permissions/permission.mapper";
import {
  User,
  UserPermission,
  UserRole,
} from "../../features/users/user.model";
import {
  mapUser,
  mapUserPermission,
  mapUserRole,
} from "../../features/users/user.mapper";
import { Role, RolePermission } from "../../features/roles/role.model";
import { mapRole, mapRolePermission } from "../../features/roles/role.mapper";
import { TanstackPermissionMatrix } from "../Common/Matrix";

export const AdminTemp = () => {
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

  const { mutateAsync: create } = useCreate();

  const { mutateAsync: del } = useDelete();

  const { result: permissionsDto } = useList<PermissionDTO>({
    resource: "permissions",
    pagination: { pageSize: 1000 },
  });
  const { result: usersDto } = useList<UserDTO>({ resource: "users" });
  const { result: userPermissionsDto } = useList<UserPermissionDTO>({
    resource: "permissions",
    meta: { parentmodule: "users" },
  });
  const { result: userRolesDto } = useList<UserRoleDTO>({
    resource: "roles",
    meta: { parentmodule: "users" },
  });

  const { result: rolesDto } = useList<RoleDTO>({ resource: "roles" });
  const { result: rolePermissionsDto } = useList<RolePermissionDTO>({
    resource: "permissions",
    meta: { parentmodule: "roles" },
    pagination: { pageSize: 1000 },
  });

  const permissions: Permission[] = Array.isArray(permissionsDto?.data)
    ? (permissionsDto?.data).map(mapPermission)
    : [];
  const users: User[] = Array.isArray(usersDto?.data)
    ? (usersDto?.data).map(mapUser)
    : [];

  const userPermissions: UserPermission[] = Array.isArray(
    userPermissionsDto?.data,
  )
    ? (userPermissionsDto?.data).map(mapUserPermission)
    : [];

  const userRoles: UserRole[] = Array.isArray(userRolesDto?.data)
    ? (userRolesDto?.data).map(mapUserRole)
    : [];

  const roles: Role[] = Array.isArray(rolesDto?.data)
    ? (rolesDto?.data).map(mapRole)
    : [];

  const rolePermissions: RolePermission[] = Array.isArray(
    rolePermissionsDto?.data,
  )
    ? (rolePermissionsDto?.data).map(mapRolePermission)
    : [];

  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
      const group = p.name.split(":")[0] || "General";
      acc[group] ??= [];
      acc[group].push(p);
      return acc;
    }, {});
  }, [permissions]);

  const userPermissionSet = useMemo(() => {
    const set = new Set<string>();
    for (const up of userPermissions) {
      set.add(`${up.userId}|${up.permissionId}`);
    }
    return set;
  }, [userPermissions]);

  const rolePermissionSet = useMemo(() => {
    const set = new Set<string>();
    for (const rp of rolePermissions) {
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
    return userRoles
      .filter((ur) => ur.userId === userId)
      .map((ur) => ur.roleId);
  };

  const getRoleGrantedPermissions = (userId: string): Set<string> => {
    const roleIds = getRoleIdsForUser(userId);

    return new Set(
      rolePermissions
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

    const original = userPermissions.some(
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
    const original = rolePermissions.some(
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

          const isUser = users.some((u) => u.id === entityId);
          const isRole = roles.some((r) => r.id === entityId);

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

          const isUser = users.some((u) => u.id === entityId);
          const isRole = roles.some((r) => r.id === entityId);

          if (isUser) {
            const userPermission = userPermissions.find(
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
            const rolePermission = rolePermissions.find(
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
    <Card.Root p={4}>
      <Flex direction="column" gap={6}>
        <Heading size="lg">Admin Area</Heading>

        <Box>
          <Heading size="sm">Create Permission</Heading>
          <Separator my={2} />
          <CanAccess resource="permissions" action="create">
            <form onSubmit={submitHandler}>
              <Flex gap={2}>
                <Input name="name" placeholder="Permission name" />
                <Button type="submit">Create</Button>
              </Flex>
            </form>
          </CanAccess>
        </Box>
        <Box maxW="300px">
          <Input
            placeholder="Search permissions…"
            value={permissionSearch}
            onChange={(e) => setPermissionSearch(e.target.value)}
            size="sm"
          />
        </Box>

        <Tabs.Root defaultValue="users">
          <Tabs.List>
            <Tabs.Trigger value="users">User Permissions</Tabs.Trigger>
            <Tabs.Trigger value="roles">Role Permissions</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="users">
            <TanstackPermissionMatrix
              title="Users × Permissions"
              rows={users}
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

          <Tabs.Content value="roles">
            <TanstackPermissionMatrix
              title="Roles × Permissions"
              rows={roles}
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
    </Card.Root>
  );
};
