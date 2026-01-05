import { AuthProvider } from "@refinedev/core";
import { ApiResponse } from "../common/types/api";
import { httpClient } from "../utils/httpClient";
import users from "../features/users/users.mapper";
import { CreateUserRequest } from "../features/users/users.requests";
import { UserDTO } from "../features/users/users.responses";
import { resetPermissionCache } from "./access-control-provider";

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
        try {
          await httpClient.post(
            `/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
          );
          return {
            success: true,
            redirectTo: "/",
          };
        } catch (error: any) {
          return {
            success: false,
            error: {
              name: "LoginError",
              message: error.response?.data?.detail || "OTP verification failed",
            },
          };
        }
      }

      // Handle magic link login
      if (providerName === "magic") {
        const { token } = params;
        try {
          const response = await httpClient.post("/auth/magic-login", { token });
          const data = response.data;
          localStorage.setItem("access_token", data.access_token);

          return {
            success: true,
            redirectTo: "/",
          };
        } catch (error: any) {
          return {
            success: false,
            error: {
              name: "LoginError",
              message: error.response?.data?.detail || "Magic link login failed",
            },
          };
        }
      }

      await httpClient.post("/auth/login", { email, password });

      resetPermissionCache();

      return {
        success: true,
        redirectTo: "/",
        message: "Login successful",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.response?.data?.detail || "Login failed",
        },
      };
    }
  },

  register: async (params: CreateUserRequest) => {
    try {
      await httpClient.post("/auth/register", params);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message:
            error.response?.status === 400
              ? "Email is already registered"
              : error.response?.data?.detail || "An error occurred during registration",
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
      await httpClient.post("/auth/logout");
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
      const response = await httpClient.get("/users/me");
      const apiResponse: ApiResponse<UserDTO> = response.data;
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
