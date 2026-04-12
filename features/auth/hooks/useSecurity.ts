/**
 * @file features/auth/hooks/useSecurity.ts
 * @description 보안코드 검증·등록 TanStack Query 훅
 */

import { useMutation } from '@tanstack/react-query';
import { verifySecurityCode, registerSecurityCode } from '@/features/auth/api/securityApi';

/** 앱 진입 시 보안코드 검증 (로그인 상태 유지 사용자) */
export const useVerifySecurityCode = () =>
  useMutation({ mutationFn: verifySecurityCode });

/** 회원가입 완료 후 보안코드 신규 등록 */
export const useRegisterSecurityCode = () =>
  useMutation({ mutationFn: registerSecurityCode });
