"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getAdminReports } from "@/services/admin.service";
import { IssueReport } from "@/types/issue";

/**
 * Module-level cache: keyed by "<adminArea>|<statusFilter>" so the same data
 * is shared across Dashboard, Analytics, and all list pages without extra
 * Firestore reads when navigating between them.
 *
 * Cleared on hard navigation / full reload automatically (module scope).
 */
const reportCache = new Map<string, IssueReport[]>();

/**
 * In-flight request deduplicator: ensures that if two components mount at the
 * same time with the same key, only one Firestore request goes out.
 */
const inFlight = new Map<string, Promise<IssueReport[]>>();

function makeCacheKey(adminArea: string | undefined, statusFilter: string | undefined): string {
  return `${adminArea ?? "__all__"}|${statusFilter ?? "__all__"}`;
}

interface UseAdminReportsOptions {
  /** Only fetch reports with this status. Omit (or pass undefined) to fetch all. */
  statusFilter?: string;
}

interface UseAdminReportsResult {
  reports: IssueReport[];
  loading: boolean;
  /** Force a fresh fetch, bypassing the cache (e.g. after a status update). */
  refresh: () => void;
}

/**
 * Cache-aware hook for fetching admin reports.
 *
 * Performance benefits over calling getAdminReports() directly:
 * 1. Module-level cache: navigating back to a page returns data instantly.
 * 2. In-flight deduplication: concurrent mounts share a single Firestore request.
 * 3. Consumers get the cached value synchronously on mount — no loading flicker.
 */
export function useAdminReports(options: UseAdminReportsOptions = {}): UseAdminReportsResult {
  const { profile } = useAuthContext();
  const { statusFilter } = options;

  const cacheKey = makeCacheKey(profile?.adminArea, statusFilter);

  // Initialise with whatever is already in cache — avoids loading flicker on re-visits.
  const [reports, setReports] = useState<IssueReport[]>(() => reportCache.get(cacheKey) ?? []);
  const [loading, setLoading] = useState<boolean>(() => !reportCache.has(cacheKey));

  // Track the latest cache key so stale responses from previous keys are discarded.
  const latestKeyRef = useRef<string>(cacheKey);

  const fetchReports = useCallback(
    async (bypassCache = false) => {
      if (!profile) return;

      const key = makeCacheKey(profile.adminArea, statusFilter);
      latestKeyRef.current = key;

      // Serve from cache unless caller explicitly bypasses it.
      if (!bypassCache && reportCache.has(key)) {
        setReports(reportCache.get(key)!);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Deduplicate concurrent requests for the same key.
        let request = inFlight.get(key);
        if (!request) {
          const filter = statusFilter && statusFilter !== "all" ? statusFilter : undefined;
          request = getAdminReports(profile.adminArea, filter);
          inFlight.set(key, request);
        }

        const data = await request;

        // Always invalidate the in-flight entry once settled.
        inFlight.delete(key);

        // Discard stale responses if the hook has already moved to a different key.
        if (latestKeyRef.current !== key) return;

        reportCache.set(key, data);
        setReports(data);
      } catch (error) {
        console.error("[useAdminReports] Failed to load reports:", error);
        inFlight.delete(key);
      } finally {
        if (latestKeyRef.current === key) {
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile?.adminArea, profile?.uid, statusFilter]
  );

  useEffect(() => {
    fetchReports(false);
  }, [fetchReports]);

  const refresh = useCallback(() => {
    if (!profile) return;
    const key = makeCacheKey(profile.adminArea, statusFilter);
    reportCache.delete(key);
    fetchReports(true);
  }, [fetchReports, profile, statusFilter]);

  return { reports, loading, refresh };
}

/**
 * Invalidate a specific cache entry after a mutation (approve/reject/resolve).
 * Call this from action handlers so other pages see fresh data on next visit.
 */
export function invalidateAdminReportsCache(adminArea?: string, statusFilter?: string): void {
  const key = makeCacheKey(adminArea, statusFilter);
  reportCache.delete(key);

  // Also nuke sibling keys that aggregate across statuses so the dashboard
  // "all reports" view reflects the change on next load.
  if (statusFilter) {
    const allKey = makeCacheKey(adminArea, undefined);
    reportCache.delete(allKey);
  }
}
