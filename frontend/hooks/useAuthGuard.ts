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
      router.replace('/conversation');
      return;
    }

    if (!requireAdmin && isAdmin) {
      // Admin tried to hit a user-only page
      router.replace('/admin');
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router]);

  return { auth, isAuthenticated, isAdmin, isLoading };
}
