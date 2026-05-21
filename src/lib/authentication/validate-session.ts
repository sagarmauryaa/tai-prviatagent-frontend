import { checkSession } from "@/utils/backend-endpoints";
import Cookies from "js-cookie";
import { AuthUser } from "@/components/auth/auth-context";

/**
 * Validates the current session token by calling the auth/session endpoint.
 * Automatically uses the Bearer token from cookies via axios interceptor.
 * Token is the only cookie stored - user data is kept in React state.
 * 
 * @returns {Promise<AuthUser | null>} The validated user data, or null if session is invalid
 * @throws {Error} If validation fails due to network error
 */
export async function validateSessionToken(): Promise<AuthUser | null> {
  const token = Cookies.get("access_token");

  if (!token) {
    return null;
  }

  try {
    // Call auth/session GET endpoint (token is added via axios interceptor)
    const response = await checkSession();

    if (response.data.success && response.data.data.user) {
      return response.data.data.user;
    }

    // If response doesn't contain user data, return null
    return null;
  } catch (error: any) {
    const status = error?.response?.status;

    // Log the error for debugging
    console.error("[Session Validation] Error validating session:", error);

    // For 401 (Unauthorized) or 403 (Forbidden), token is invalid/expired
    if (status === 401 || status === 403) {
      console.debug("[Session Validation] Token is invalid or expired (status: " + status + ")");
      // Clear invalid token (only token is stored in cookies now)
      Cookies.remove("access_token");
      return null;
    }

    // For other errors, re-throw to be handled by the caller
    throw error;
  }
}
