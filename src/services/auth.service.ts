import api from "./api";
import { LoginCredentials, RegisterData, User, AuthResponse } from "@/types/types";

// Auth Service Class
export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials, {
        withCredentials: true, // Important for cookies
      });
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
   * Logout user (client-side token removal)
   */
  static async logout(): Promise<void> {
    try {

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /**
   * Check if user is authenticated (client-side check)
   */
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token");
    return !!token;
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

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
    if (typeof window === "undefined") return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  /**
   * Verify token validity (you might want to add a backend endpoint for this)
   */
  static async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      // You can add a verify endpoint on your backend
      // const response = await api.get('/auth/verify', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return response.status === 200;

      // For now, just check if token exists
      return !!token;
    } catch {
      return false;
    }
  }
}

export default AuthService;
