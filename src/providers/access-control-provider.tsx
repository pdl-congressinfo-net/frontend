import { AccessControlProvider } from "@refinedev/core";

/**
 * Check out the Access Control Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/accessControl-provider
 **/
export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    try {
      const response = await fetch(
        `https://api.dpfurner.xyz/api/v1/auth/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            name: `${resource}:${action}`,
          }),
          credentials: "include",
        },
      );
      const data = await response.json();
      return { can: data ?? false };
    } catch (error) {
      return { can: false };
    }

    return { can: true };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: false,
    },
  },
};
