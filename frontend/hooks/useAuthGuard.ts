'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Redirects to /login if not authenticated.
 * requireAdmin=true  → admin dashboard pages
 * requireAdmin=false → user flow pages (conversation, scoring, booking, crm)
 *
 * Waits for auth to finish loading from sessionStorage before redirecting,
 * so client-side navigation never causes false redirects.
 */
export function useAuthGuard(requireAdmin = false) {
  const { auth, isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't act until sessionStorage has been read
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (requireAdmin && !isAdmin) {
      // Regular user tried to hit an admin-only page
      router.replace('/login?tab=admin');
      return;
    }

    // Allow admins to test user pages without being forced out
    // if (!requireAdmin && isAdmin) {
    //   router.replace('/admin');
    // }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router]);

  return { auth, isAuthenticated, isAdmin, isLoading };
}
