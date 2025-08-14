// components/guards/withGuard.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/useAuth'; 

// Guard configuration options
interface GuardOptions {
  redirectTo?: string;
  unauthorizedRedirect?: string; // New option for 401 redirect
  allowedRoles?: string[];
  showLoadingComponent?: boolean;
  fallbackComponent?: React.ComponentType;
  redirect401?: boolean; // Whether to redirect to 401 page or show inline component
}

// Default guard options
const defaultOptions: GuardOptions = {
  redirectTo: '/login',
  unauthorizedRedirect: '/401',
  allowedRoles: undefined, 
  showLoadingComponent: true,
  redirect401: true, // Default to redirecting to 401 page
};

// Loading component
const DefaultLoadingComponent = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col items-center justify-center">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
    </div>
    <p className="mt-6 text-slate-300 text-lg">Verifying access...</p>
  </div>
);

// Unauthorized component (for inline display when redirect401: false)
const DefaultUnauthorizedComponent = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col items-center justify-center p-6">
    <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-red-400">Access Denied</h1>
      <p className="text-slate-300 mb-6">You don't have permission to access this page.</p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Higher-order component for route protection
export function withGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: GuardOptions = {}
) {
  const config = { ...defaultOptions, ...options };
  
  const GuardedComponent = (props: P) => {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const checkAccess = () => {
        // Wait for auth loading to complete
        if (loading) {
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          router.push(config.redirectTo!);
          return;
        }

        // Check role-based access
        if (config.allowedRoles && config.allowedRoles.length > 0) {
          if (!config.allowedRoles.includes(user.role)) {
            setHasAccess(false);
            setIsChecking(false);
            
            // Redirect to 401 page if configured
            if (config.redirect401) {
              router.push(config.unauthorizedRedirect!);
            }
            return;
          }
        }

        // All checks passed
        setHasAccess(true);
        setIsChecking(false);
      };

      checkAccess();
    }, [user, isAuthenticated, loading, router]);

    // Show loading while checking auth
    if (loading || isChecking) {
      if (!config.showLoadingComponent) {
        return null;
      }
      return config.fallbackComponent ? <config.fallbackComponent /> : <DefaultLoadingComponent />;
    }

    // Show unauthorized - either redirect or show inline component
    if (!hasAccess) {
      // If redirect401 is false, show inline component
      if (!config.redirect401) {
        return <DefaultUnauthorizedComponent />;
      }
      // Otherwise, the redirect should have happened in useEffect
      return null;
    }

    // Render the protected component
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  GuardedComponent.displayName = `withGuard(${WrappedComponent.displayName || WrappedComponent.name})`;

  return GuardedComponent;
}

// Updated convenience guards for common use cases
export const withAuthGuard = <P extends object>(Component: React.ComponentType<P>) =>
  withGuard(Component, {
    redirectTo: '/login'
  });

export const withAdminGuard = <P extends object>(Component: React.ComponentType<P>) =>
  withGuard(Component, {
    redirectTo: '/login',
    allowedRoles: ['ADMIN'],
    unauthorizedRedirect: '/401'
  });
 
export const withHRGuard = <P extends object>(Component: React.ComponentType<P>) =>
  withGuard(Component, {
    redirectTo: '/login',
    allowedRoles: ['HR', 'ADMIN'],
    unauthorizedRedirect: '/401'
  });

export const withAdminOnlyGuard = <P extends object>(Component: React.ComponentType<P>) =>
  withGuard(Component, {
    redirectTo: '/login',
    allowedRoles: ['ADMIN'],
    unauthorizedRedirect: '/401' // Changed from '/dashboard' to '/401'
  });

// New guard that shows inline unauthorized message instead of redirecting
export const withInlineGuard = <P extends object>(Component: React.ComponentType<P>, allowedRoles?: string[]) =>
  withGuard(Component, {
    redirectTo: '/login',
    allowedRoles: allowedRoles,
    redirect401: false // Show inline component instead of redirecting
  });

// Hook for checking permissions within components
export function useGuard(options: GuardOptions = {}) {
  const { user, isAuthenticated, loading } = useAuth();
  const config = { ...defaultOptions, ...options };

  const checkAccess = () => {
    if (loading) return { hasAccess: false, isLoading: true };
    if (!isAuthenticated || !user) return { hasAccess: false, isLoading: false };

    // Check role-based access
    if (config.allowedRoles && config.allowedRoles.length > 0) {
      if (!config.allowedRoles.includes(user.role)) {
        return { hasAccess: false, isLoading: false };
      }
    }

    return { hasAccess: true, isLoading: false };
  };

  return checkAccess();
}

// Component-based guard for conditional rendering
interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  allowedRoles?: string[];
  requireAuthentication?: boolean;
}

export function Guard({ 
  children, 
  fallback = null, 
  allowedRoles,
  requireAuthentication = true 
}: GuardProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <DefaultLoadingComponent />;
  }

  // Check authentication
  if (requireAuthentication && (!isAuthenticated || !user)) {
    return <>{fallback}</>;
  }

  // Check role access
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Route permission checker utility
export const checkRoutePermission = (
  user: any, 
  route: string, 
  permissions: { [key: string]: GuardOptions } = {}
) => {
  const routeConfig = permissions[route];
  if (!routeConfig) return true; // No restrictions by default

  // Check role access
  if (routeConfig.allowedRoles && routeConfig.allowedRoles.length > 0) {
    if (!routeConfig.allowedRoles.includes(user?.role)) {
      return false;
    }
  }

  return true;
};