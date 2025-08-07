"use client";

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
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
  checkAuth: () => Promise<void>;
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

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      setLoading(true);

      // Get user from localStorage
      const savedUser = AuthService.getCurrentUser();
      const token = AuthService.getToken();

      if (savedUser && token) {
        // Verify token is still valid (if you have a verify endpoint)
        const isValid = await AuthService.verifyToken();
        if (isValid) {
          setUser(savedUser);
        } else {
          // Token is invalid, clear auth data
          await logout();
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
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const result = await AuthService.login(credentials);

      if (result.token && result.user) {
        AuthService.saveUserData(result.token, result.user);
        setUser(result.user);
        router.push("/dashboard"); // Redirect to dashboard or desired page
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
        // Or redirect to login page
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
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

// Higher-order component for protected routes
export function withAuth<T extends Record<string, any>>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, loading, router]);

    // Show loading while checking auth
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Don't render component if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Hook for role-based access
export function useRole() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isHR = user?.role === "HR";

  const hasRole = (role: "ADMIN" | "HR") => user?.role === role;
  const hasAnyRole = (roles: ("ADMIN" | "HR")[]) =>
    user ? roles.includes(user.role) : false;

  return {
    isAdmin,
    isHR,
    hasRole,
    hasAnyRole,
    userRole: user?.role,
  };
}

export default useAuth;
