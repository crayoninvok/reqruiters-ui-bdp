import api from "./api";
import { LoginCredentials, RegisterData, User, AuthResponse } from "@/types/types";

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
   * Logout user (client-side cleanup)
   */
  static logout = async () => {
    try {
      // Optional: Call server-side logout endpoint if needed
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
      // Clear localStorage (remove all auth-related items)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken"); // If using refresh tokens
      
      // Clear sessionStorage (optional, if you're using sessionStorage as well)
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
    return !!token; // If token exists in localStorage, return true, else false
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
      return null; // If parsing fails, return null
    }
  }

  /**
   * Save user data to localStorage
   */
  static saveUserData(token: string, user: User): void {
    localStorage.setItem("token", token); // Store token in localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Store user object in localStorage
  }

  /**
   * Get stored token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem("token"); // Only retrieving from localStorage
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/refresh", {}, {
        withCredentials: true,
      });
      
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If parsing fails, assume expired
    }
  }
}

export default AuthService;
