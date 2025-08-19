import api from "./api";
import {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
} from "@/types/types";

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials, {
        withCredentials: true, // Important for cookies (optional for the login process)
      });
      this.saveUserData(response.data.token, response.data.user);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  /**
   * Admin creates HR user
   */
  static async createHRUser(userData: RegisterData): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found, please login first");
      }

      const response = await api.post("/auth/create-hr-user", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Creating HR user failed"
      );
    }
  }

  /**
   * Admin gets all HR users
   */
  static async getHRUsers(): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found, please login first");
      }

      const response = await api.get("/auth/hr-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch HR users"
      );
    }
  }

  /**
   * Admin gets single HR user
   */
  static async getHRUser(userId: string): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found, please login first");
      }

      const response = await api.get(`/auth/hr-users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch HR user"
      );
    }
  }

  /**
   * Admin updates HR user
   */
  static async updateHRUser(userId: string, userData: Partial<RegisterData & { avatarUrl?: string }>): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found, please login first");
      }

      const response = await api.put(`/auth/hr-users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update HR user"
      );
    }
  }

  /**
   * Admin deletes HR user
   */
  static async deleteHRUser(userId: string): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found, please login first");
      }

      const response = await api.delete(`/auth/hr-users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete HR user"
      );
    }
  }

  /**
   * Admin changes user role
   */
  static async changeUserRole(userId: string, newRole: string): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found, please login first");
      }

      const response = await api.patch(`/auth/users/${userId}/role`, { newRole }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to change user role"
      );
    }
  }

  /**
   * Logout user (client-side cleanup)
   */
  static logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true }); // This is optional
      this.clearAllAuthData(); // Clean up client-side storage (localStorage)
    } catch (error) {
      console.warn("Logout error:", error);
      this.clearAllAuthData(); // Ensure client-side data is cleared
    }
  };

  /**
   * Clear all authentication data (nuclear option)
   */
  static clearAllAuthData(): void {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken"); // If using refresh tokens

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  }

  /**
   * Check if user is authenticated (client-side check)
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Save user data to localStorage
   */
  static saveUserData(token: string, user: User): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Get stored token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post(
        "/auth/refresh",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.token && response.data.user) {
        this.saveUserData(response.data.token, response.data.user);
      }

      return response.data;
    } catch (error: any) {
      this.clearAllAuthData();
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  }

  /**
   * Check if token is expired (basic check)
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If parsing fails, assume expired
    }
  }
}

export default AuthService;