import {
  Box,
  Button,
  Field,
  Flex,
  Group,
  Heading,
  IconButton,
  Input,
  Popover,
  Tabs,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CanAccess,
  useCreate,
  useDelete,
  useList,
  useTranslation,
} from "@refinedev/core";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Permission } from "../../features/permissions/permissions.model";
import {
  User,
  UserPermission,
  UserRole,
} from "../../features/users/users.model";

import { LuCirclePlus } from "react-icons/lu";
import { Role, RolePermission } from "../../features/roles/roles.model";
import { TanstackPermissionMatrix } from "../Common/Matrix";

// Zod schema for permission/resource creation
const permissionSchema = z.object({
  name: z
    .string()
    .min(1, "Permission name is required")
    .refine(
      (val) => {
        // If it contains ":", validate as permission (resource:action)
        if (val.includes(":")) {
          const parts = val.split(":");
          return (
            parts.length === 2 &&
            parts[0].trim().length > 0 &&
            parts[1].trim().length > 0
          );
        }
        // If no ":", validate as resource name (alphanumeric, underscore, hyphen)
        return /^[a-zA-Z0-9_-]+$/.test(val);
      },
      {
        message:
          "Must be either 'resource:action' format or a valid resource name (alphanumeric, underscore, hyphen)",
      },
    ),
});

type PermissionFormData = z.infer<typeof permissionSchema>;

export const Permissions = () => {
  const { translate: t } = useTranslation();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
  });

  const { result: permissions } = useList<Permission>({
    resource: "permissions",
    pagination: { pageSize: 1000 },
  });
  const { result: users } = useList<User>({ resource: "users" });
  const { result: userPermissions } = useList<UserPermission>({
    resource: "permissions",
    meta: { parentModule: "users" },
  });
  const { result: userRoles } = useList<UserRole>({
    resource: "roles",
    meta: { parentModule: "users" },
  });

  const { result: roles } = useList<Role>({ resource: "roles" });
  const { result: rolePermissions } = useList<RolePermission>({
    resource: "permissions",
    meta: { parentModule: "roles" },
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

  const onSubmit = async (data: PermissionFormData) => {
    const { name } = data;

    try {
      if (name.includes(":")) {
        // Create a single permission (resource:action format)
        await create({
          resource: "permissions",
          values: { name },
        });
      } else {
        // Create a new resource with default actions
        await create({
          resource: "permissions",
          values: { resource_name: name },
        });
      }
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create permission/resource:", error);
    }
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
              meta: { parentModule: "users" },
              values: { user_id: entityId, permission_id: permissionId },
            });
          } else if (isRole) {
            await create({
              resource: "permissions",
              meta: { parentModule: "roles" },
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
                  parentModule: "users",
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
                  parentModule: "roles",
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
        <Heading size="lg">{t("admin.permissions.title")}</Heading>
      </Flex>

      <Tabs.Root defaultValue="userpermissions">
        <Flex flex={1} gap={4} align="center" justify="space-between">
          <Tabs.List>
            <Tabs.Trigger value="userpermissions">
              {t("admin.permissions.userPermissions")}
            </Tabs.Trigger>
            <Tabs.Trigger value="rolepermissions">
              {t("admin.permissions.rolePermissions")}
            </Tabs.Trigger>
          </Tabs.List>
          <Flex gap={2} align="center">
            <CanAccess resource="permissions" action="create">
              <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Popover.Trigger
                  as={IconButton}
                  aria-label={t("admin.permissions.addPermission")}
                  onClick={() => setOpen(true)}
                  type="button"
                >
                  <LuCirclePlus />
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content p={4} bg="white" boxShadow="md">
                    <Popover.Arrow />
                    <Popover.Body>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Field.Root invalid={!!errors.name}>
                          <Group attached w="full">
                            <Input
                              {...register("name")}
                              placeholder={t(
                                "admin.permissions.permissionPlaceholder",
                              )}
                            />

                            <Button type="submit" colorScheme="blue">
                              {t("common.create")}
                            </Button>
                          </Group>
                          {errors.name && (
                            <Field.ErrorText>
                              {errors.name.message}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                      </form>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </CanAccess>
            <Input
              variant="flushed"
              placeholder={t("admin.permissions.searchPermissions")}
              value={permissionSearch}
              onChange={(e) => setPermissionSearch(e.target.value)}
            />
          </Flex>
        </Flex>

        <Tabs.Content value="userpermissions">
          <TanstackPermissionMatrix
            ressource="users"
            title={t("admin.permissions.usersPermissionsMatrix")}
            rows={users.data}
            rowKey="id"
            rowLabel={(u) => u.contact?.firstName + " " + u.contact?.lastName}
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
            ressource="roles"
            title={t("admin.permissions.rolesPermissionsMatrix")}
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
            {t("admin.permissions.unsavedChanges")}
          </Box>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={history.length === 0}
        >
          {t("admin.permissions.undo")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={saveHandler}
          disabled={!isDirty}
          loading={isSaving}
        >
          {t("admin.permissions.saveChanges")}
        </Button>
      </Flex>
    </Flex>
  );
};
