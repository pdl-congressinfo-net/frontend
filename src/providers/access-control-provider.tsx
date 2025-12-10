import { AccessControlProvider } from "@refinedev/core";

const PERMISSION_CACHE_KEY = "__permissions_v1";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

let permissionSet: Set<string> | null = null;
let loadingPromise: Promise<Set<string>> | null = null;

function loadFromCache(): Set<string> | null {
  try {
    const raw = sessionStorage.getItem(PERMISSION_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.perms || !parsed?.ts) return null;

    if (Date.now() - parsed.ts > CACHE_TTL) {
      sessionStorage.removeItem(PERMISSION_CACHE_KEY);
      return null;
    }

    return new Set(parsed.perms);
  } catch {
    sessionStorage.removeItem(PERMISSION_CACHE_KEY);
    return null;
  }
}

function saveToCache(list: string[]) {
  sessionStorage.setItem(
    PERMISSION_CACHE_KEY,
    JSON.stringify({
      perms: list,
      ts: Date.now(),
    }),
  );
}

async function fetchPermissions(): Promise<Set<string>> {
  const response = await fetch(
    "https://api.dpfurner.xyz/api/v1/auth/permissions",
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch permissions");
  }

  const data = await response.json();

  const permission_names: string[] = Array.isArray(data)
    ? data.map((perm: { name: string }) => perm.name)
    : [];

  const permissions = Array.isArray(data?.permissions)
    ? (data.permissions as string[])
    : permission_names.length > 0
      ? [...permission_names]
      : [];

  saveToCache(permissions);
  return new Set(permissions);
}

async function loadPermissions(): Promise<Set<string>> {
  if (permissionSet) return permissionSet;

  const cached = loadFromCache();
  if (cached) {
    permissionSet = cached;
    return permissionSet;
  }

  if (!loadingPromise) {
    loadingPromise = fetchPermissions().then((set) => {
      permissionSet = set;
      return set;
    });
  }

  return loadingPromise;
}

export function resetPermissionCache() {
  permissionSet = null;
  loadingPromise = null;
  sessionStorage.removeItem(PERMISSION_CACHE_KEY);
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    try {
      const perms = await loadPermissions();
      return { can: perms.has(`${resource}:${action}`) };
    } catch {
      return { can: false };
    }
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: false,
    },
  },
};
