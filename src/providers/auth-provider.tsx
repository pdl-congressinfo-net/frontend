import { AuthProvider } from "@refinedev/core";
import users from "../features/users/users.mapper";
import { ApiResponse } from "../common/types/api";
import { UserDTO } from "../features/users/users.responses";
import { resetPermissionCache } from "./access-control-provider";

const API_URL = "https://api.dpfurner.xyz/api/v1";

/**
 * Check out the Auth Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/auth-provider/
 **/
export const authProvider: AuthProvider = {
  login: async (params) => {
    const { email, password, providerName } = params;

    try {
      // Handle OTP login
      if (providerName === "otp") {
        const { otp } = params;
        const response = await fetch(
          `${API_URL}/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
          {
            method: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          const error = await response.json();
          return {
            success: false,
            error: {
              name: "LoginError",
              message: error.detail || "OTP verification failed",
            },
          };
        }
        return {
          success: true,
          redirectTo: "/",
        };
      }

      // Handle magic link login
      if (providerName === "magic") {
        const { token } = params;
        const response = await fetch(`${API_URL}/auth/magic-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ token }),
          credentials: "include",
        });

        if (!response.ok) {
          const error = await response.json();
          return {
            success: false,
            error: {
              name: "LoginError",
              message: error.detail || "Magic link login failed",
            },
          };
        }

        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: {
            name: "LoginError",
            message: error.detail || "Login failed",
          },
        };
      }

      const data = await response.json();
      resetPermissionCache();

      return {
        success: true,
        redirectTo: "/",
        message: "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An error occurred during login",
        },
      };
    }
  },

  register: async (params) => {
    const { full_name, email, password } = params;

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: {
            name: "RegisterError",
            message:
              response.status === 400
                ? "Email is already registered"
                : error.detail || "An error occurred during registration",
          },
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "An error occurred during registration",
        },
      };
    }
  },

  check: async () => {
    // Token is valid if it exists (cookies are automatically sent)
    // If backend returns 401, the user will be redirected via onError
    return {
      authenticated: true,
    };
  },

  logout: async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
    }
    resetPermissionCache();

    return {
      success: true,
      redirectTo: "/",
    };
  },

  forgotPassword: async (params) => {
    console.log("forgotPassword", params);

    // TODO: send request to the API to forgot password

    return {
      success: true, // or false if the forgot password is not successful
      redirectTo: "/update-password",
    };
  },

  updatePassword: async (params) => {
    console.log("updatePassword", params);

    // TODO: send request to the API to update password

    return {
      success: true, // or false if the update password is not successful
      redirectTo: "/login",
    };
  },

  getPermissions: async (params) => {
    console.log("getPermissions", params);

    // TODO: send request to the API to get permissions

    return {
      permissions: [],
    };
  },

  getIdentity: async () => {
    try {
      // Assuming you have a /users/me endpoint or similar
      const res = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });

      if (!res.ok) {
        return null;
      }

      const apiResponse: ApiResponse<UserDTO> = await res.json();
      const user = users.users(apiResponse.data);

      return user;
    } catch (error) {
      return null;
    }
  },

  onError: async (params) => {
    console.log("onError", params);

    // TODO: do something with the error

    return {
      logout: false, // or false if you want to continue
    };
  },
};
