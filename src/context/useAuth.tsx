"use client"
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import AuthService from "../services/auth.service";
import { User, LoginCredentials, RegisterData } from "@/types/types";

// Auth Context Types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  refreshAuth: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Memoized checkAuth to prevent unnecessary re-renders
  const checkAuth = useCallback(() => {
    try {
      setLoading(true);

      // Get user from localStorage/cookies
      const savedUser = AuthService.getCurrentUser();
      const token = AuthService.getToken();

      if (savedUser && token) {
        // Check if token is expired
        if (AuthService.isTokenExpired(token)) {
          // Token expired, try to refresh
          refreshAuth().catch(() => {
            // If refresh fails, clear auth data
            setUser(null);
          });
        } else {
          setUser(savedUser);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh authentication
  const refreshAuth = useCallback(async () => {
    try {
      const result = await AuthService.refreshToken();
      
      if (result.token && result.user) {
        AuthService.saveUserData(result.token, result.user);
        setUser(result.user);
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear auth data and redirect to login
      await logout();
      throw error;
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const result = await AuthService.login(credentials);

      if (result.token && result.user) {
        AuthService.saveUserData(result.token, result.user);
        setUser(result.user);
        router.push("/dashboard");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const result = await AuthService.register(userData);

      if (result.user) {
        // Optionally auto-login after registration
        // For now, just redirect to login
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call AuthService logout (handles both client and server cleanup)
      await AuthService.logout();
      
      // Clear user state
      setUser(null);
      
      // Redirect to login
      router.push("/login");
      
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Even if logout fails, clear user state and redirect
      setUser(null);
      
      // Force clear all auth data as fallback
      AuthService.clearAllAuthData();
      
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!user) return;

    const token = AuthService.getToken();
    if (!token) return;

    // Set up token refresh interval (e.g., every 15 minutes)
    const refreshInterval = setInterval(async () => {
      try {
        // Only refresh if token will expire in next 5 minutes
        const willExpireSoon = AuthService.isTokenExpired(token);
        if (willExpireSoon) {
          await refreshAuth();
        }
      } catch (error) {
        console.error("Auto-refresh failed:", error);
        // If auto-refresh fails, user will be logged out on next interaction
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(refreshInterval);
  }, [user, refreshAuth]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}