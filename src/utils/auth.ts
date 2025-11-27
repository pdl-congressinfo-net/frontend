const API_URL = "https://api.dpfurner.xyz/api/v1";

/**
 * Request an OTP to be sent to the user's email
 */
export async function requestOTP(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/request-otp?email=${encodeURIComponent(email)}`, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.detail || "Failed to send OTP",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while requesting OTP",
    };
  }
}

/**
 * Refresh the access token using the refresh token cookie
 */
export async function refreshAccessToken(): Promise<{ success: boolean; accessToken?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      return { success: true, accessToken: data.access_token };
    }

    return { success: false };
  } catch (error) {
    return { success: false };
  }
}
