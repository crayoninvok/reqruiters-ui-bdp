// services/auth.service.ts
import api from "./api";
import {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
} from "@/types/types";
import Cookies from "js-cookie";

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
   * Logout user (client-side and server-side cleanup)
   */
  static logout = async () => {
    try {
      // Optional: Call server-side logout endpoint first
      // This can invalidate the token on the server and clear httpOnly cookies
      try {
        await api.post("/auth/logout", {}, { withCredentials: true });
      } catch (error) {
        // Don't throw if server logout fails - still clean up client-side
        console.warn("Server logout failed:", error);
      }

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken'); // if you store refresh token locally
      
      // Clear sessionStorage as well (if used)
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      
      // Clear cookies - try different path/domain combinations if needed
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
      
      // If cookies were set with specific options, match them:
      Cookies.remove('token', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('user', { path: '/' });
      
      // If you have domain-specific cookies:
      // Cookies.remove('token', { path: '/', domain: '.yourdomain.com' });
      
    } catch (error) {
      console.error('Logout cleanup failed:', error);
      // Still attempt to clear what we can
      this.clearAllAuthData();
    }
  };

  /**
   * Clear all authentication data (nuclear option)
   */
  static clearAllAuthData(): void {
    try {
      // Clear all localStorage auth-related items
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Clear sessionStorage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      
      // Clear cookies with different path combinations
      const cookieNames = ['token', 'refreshToken', 'user', 'authToken', 'sessionId'];
      cookieNames.forEach(name => {
        Cookies.remove(name);
        Cookies.remove(name, { path: '/' });
        Cookies.remove(name, { path: '/', domain: window.location.hostname });
        // Add domain if you have specific domain cookies
        // Cookies.remove(name, { path: '/', domain: '.yourdomain.com' });
      });
      
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  /**
   * Check if user is authenticated (client-side check)
   */
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token") || Cookies.get("token");
    return !!token;
  }

  /**
   * Get current user from localStorage or cookies
   */
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    // Try localStorage first
    let userStr = localStorage.getItem("user");
    
    // Fallback to cookies if not in localStorage
    if (!userStr) {
      userStr = Cookies.get("user") || null;
    }

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
    
    // Optionally also save to cookies as backup
    // Cookies.set("token", token, { expires: 7, secure: true, sameSite: 'strict' });
    // Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
  }

  /**
   * Get stored token from localStorage or cookies
   */
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    
    // Try localStorage first
    let token = localStorage.getItem("token");
    
    // Fallback to cookies if not in localStorage
    if (!token) {
      token = Cookies.get("token") || null;
    }
    
    return token;
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
      // If refresh fails, clear all auth data
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
      return true; // If we can't parse, assume expired
    }
  }
}

export default AuthService;