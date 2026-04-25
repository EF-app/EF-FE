/**
 * @file features/reports/hooks/useReports.ts
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchPostitPreview,
  fetchReportTarget,
  MOCK_POSTIT_PREVIEW,
  MOCK_POSTIT_PREVIEW_ANON,
  MOCK_REPORT_TARGET,
  submitReport,
} from '../api/reportsApi';
import { ReportPayload } from '../types';

export function useReportTarget(userId?: string) {
  return useQuery({
    queryKey: ['report-target', userId],
    queryFn: () => fetchReportTarget(userId ?? ''),
    placeholderData: MOCK_REPORT_TARGET,
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
}

export function usePostitPreview(letterId?: string, isAnonymous = false) {
  return useQuery({
    queryKey: ['postit-preview', letterId, isAnonymous],
    queryFn: () => fetchPostitPreview(letterId ?? '', isAnonymous),
    placeholderData: isAnonymous ? MOCK_POSTIT_PREVIEW_ANON : MOCK_POSTIT_PREVIEW,
    enabled: !!letterId,
    staleTime: 1000 * 60,
  });
}

export function useSubmitReport() {
  return useMutation({
    mutationFn: (payload: ReportPayload) => submitReport(payload),
  });
}
