/**
 * @file features/auth/api/securityApi.ts
 * @description 보안코드 검증·등록 Mock API
 *
 * 실제 서비스에서는 서버에서 유저별 암호화된 값과 비교합니다.
 * 현재 테스트용 더미 코드: '1234'
 */

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** 테스트 더미 코드 (실제 서비스에서는 서버 검증) */
const MOCK_CODE = '1234';

export const verifySecurityCode = async (code: string): Promise<{ success: boolean }> => {
  await delay(300);
  return { success: code === MOCK_CODE };
};

export const registerSecurityCode = async (code: string): Promise<{ success: boolean }> => {
  await delay(300);
  // 실제 서비스: 암호화 후 서버에 저장
  return { success: true };
};
