# EF(이프) API 명세서 v1.0

> Base URL: `https://api.ef-app.io/v1`  
> Content-Type: `application/json` (파일 업로드 시 `multipart/form-data`)  
> 인증 방식: Bearer Token (JWT Access Token)  
> 토큰 전달: `Authorization: Bearer <access_token>`

---

## 공통 응답 포맷

### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "nextCursor": "cursor_string_or_null",
    "hasMore": true
  }
}
```

### 실패 응답
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "인증이 필요합니다.",
    "details": {}
  }
}
```

---

## 에러 코드 정의

| HTTP Status | 에러 코드 | 설명 |
|---|---|---|
| 400 | `VALIDATION_001` | 필수 필드 누락 |
| 400 | `VALIDATION_002` | 유효하지 않은 형식 (이메일, 전화번호 등) |
| 400 | `VALIDATION_003` | 유효하지 않은 Enum 값 |
| 400 | `VALIDATION_004` | 파일 크기 초과 (최대 10MB) |
| 400 | `VALIDATION_005` | 허용되지 않은 파일 형식 |
| 401 | `AUTH_001` | 인증 토큰 없음 |
| 401 | `AUTH_002` | 유효하지 않은 토큰 |
| 401 | `AUTH_003` | 만료된 Access Token |
| 401 | `AUTH_004` | 만료된 Refresh Token (재로그인 필요) |
| 401 | `AUTH_005` | 잘못된 비밀번호 |
| 401 | `AUTH_006` | 잘못된 보안코드 |
| 401 | `AUTH_007` | 보안코드 시도 횟수 초과 (5회) |
| 403 | `PERMISSION_001` | 리소스 접근 권한 없음 |
| 403 | `PERMISSION_002` | 성인인증 미완료 |
| 403 | `PERMISSION_003` | 정지된 계정 |
| 404 | `NOT_FOUND_001` | 리소스를 찾을 수 없음 |
| 409 | `CONFLICT_001` | 이미 사용 중인 아이디/닉네임 |
| 409 | `CONFLICT_002` | 이미 인증된 전화번호 |
| 409 | `CONFLICT_003` | 이미 투표한 게임 |
| 409 | `CONFLICT_004` | 이미 보낸 매칭 요청 |
| 429 | `RATE_LIMIT_001` | 요청 횟수 초과 |
| 500 | `SERVER_001` | 서버 내부 오류 |

---

## 커서 기반 페이지네이션

최신순 정렬 기준, `cursor`는 마지막으로 받은 항목의 `id` 또는 `createdAt` ISO 8601 문자열.

**Request Query Params:**
```
?cursor=<last_item_id>&limit=20
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "nextCursor": "01J8X9...",
    "hasMore": true
  }
}
```

---

---

# 1. 인증 (Auth)

---

## 1-1. 회원가입

### `POST /auth/register`

> 비밀번호는 서버에서 bcrypt (saltRounds: 12) 해시 후 저장

**Request Body:**
```json
{
  "loginId": "user123",
  "password": "P@ssw0rd!",
  "nickname": "노크차",
  "phone": "01012345678",
  "phoneVerificationToken": "eyJ...",
  "securityCode": "1234",
  "adultVerified": true,
  "adultVerificationToken": "eyJ...",
  "region": "서울",
  "birthDate": "1995-03-15",
  "gender": "FEMALE",
  "agreedTerms": true,
  "agreedPrivacy": true,
  "agreedMarketing": false
}
```

**Field Spec:**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `loginId` | string (4~20자, 영소문자+숫자) | Y | 로그인 아이디 |
| `password` | string (8~20자, 영문+숫자+특수문자) | Y | 비밀번호 |
| `nickname` | string (2~10자) | Y | 닉네임 |
| `phone` | string (숫자만, 11자리) | Y | 전화번호 |
| `phoneVerificationToken` | string (JWT) | Y | 전화번호 인증 완료 토큰 |
| `securityCode` | string (4~6자리 숫자) | Y | 앱 보안코드 |
| `adultVerified` | boolean | Y | 성인인증 여부 |
| `adultVerificationToken` | string (JWT) | Y | 성인인증 완료 토큰 |
| `region` | string | Y | 거주 지역 |
| `birthDate` | string (YYYY-MM-DD) | Y | 생년월일 |
| `gender` | enum: `MALE`, `FEMALE`, `OTHER` | Y | 성별 |
| `agreedTerms` | boolean | Y | 이용약관 동의 |
| `agreedPrivacy` | boolean | Y | 개인정보 동의 |
| `agreedMarketing` | boolean | N | 마케팅 동의 |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "usr_01J8X9ABCDEF",
      "loginId": "user123",
      "nickname": "노크차",
      "profileStatus": "ACTIVE"
    }
  }
}
```

---

## 1-2. 로그인

### `POST /auth/login`

**Request Body:**
```json
{
  "loginId": "user123",
  "password": "P@ssw0rd!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 3600,
    "user": {
      "id": "usr_01J8X9ABCDEF",
      "loginId": "user123",
      "nickname": "노크차",
      "profileStatus": "ACTIVE",
      "requiresSecurityCode": true
    }
  }
}
```

> `requiresSecurityCode: true`이면 클라이언트는 로그인 직후 보안코드 검증 화면으로 이동

---

## 1-3. 보안코드 검증 (앱 재진입 시)

### `POST /auth/security-code/verify`

**Request Body:**
```json
{
  "securityCode": "1234"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "attemptsRemaining": 4
  }
}
```

**Error 401 (AUTH_006):** 잘못된 보안코드  
**Error 401 (AUTH_007):** 5회 초과 → 계정 임시 잠금, 재로그인 필요

---

## 1-4. 보안코드 변경

### `PUT /auth/security-code`

**Request Body:**
```json
{
  "currentSecurityCode": "1234",
  "newSecurityCode": "5678"
}
```

**Response 200:**
```json
{ "success": true, "data": { "updated": true } }
```

---

## 1-5. 토큰 갱신

### `POST /auth/refresh`

> Refresh Token은 HTTP-only Cookie 또는 Request Body로 전달

**Request Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "expiresIn": 3600
  }
}
```

---

## 1-6. 로그아웃

### `POST /auth/logout`

> Refresh Token을 서버에서 무효화

**Request Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response 200:**
```json
{ "success": true, "data": { "loggedOut": true } }
```

---

## 1-7. 전화번호 인증 SMS 발송

### `POST /auth/phone/send`

**Request Body:**
```json
{
  "phone": "01012345678"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "expiresAt": "2026-04-12T10:05:00Z",
    "ttlSeconds": 300
  }
}
```

---

## 1-8. 전화번호 인증 코드 확인

### `POST /auth/phone/verify`

**Request Body:**
```json
{
  "phone": "01012345678",
  "code": "123456"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "phoneVerificationToken": "eyJ..."
  }
}
```

---

## 1-9. 성인인증

### `POST /auth/adult/verify`

**Request Body:**
```json
{
  "realName": "홍길동",
  "birthDate": "1995-03-15",
  "gender": "MALE",
  "phone": "01012345678",
  "phoneVerificationToken": "eyJ..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "adultVerified": true,
    "adultVerificationToken": "eyJ...",
    "age": 31
  }
}
```

**Error 403 (PERMISSION_002):** 만 19세 미만

---

## 1-10. 비밀번호 재설정 요청

### `POST /auth/password/reset-request`

**Request Body:**
```json
{
  "loginId": "user123",
  "phone": "01012345678"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "resetToken": "eyJ...",
    "expiresAt": "2026-04-12T10:15:00Z"
  }
}
```

---

## 1-11. 비밀번호 재설정 확인

### `PUT /auth/password/reset`

**Request Body:**
```json
{
  "resetToken": "eyJ...",
  "newPassword": "NewP@ss1!"
}
```

**Response 200:**
```json
{ "success": true, "data": { "updated": true } }
```

---

---

# 2. 사용자 (Users)

---

## 2-1. 내 프로필 요약 조회 (마이페이지)

### `GET /users/me`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "usr_01J8X9ABCDEF",
    "nickname": "노크차",
    "loginId": "user123",
    "profileStatus": "ACTIVE",
    "gender": "FEMALE",
    "birthDate": "1995-03-15",
    "age": 31,
    "region": "서울",
    "bio": "조용한 카페에서 책 읽기 좋아해요 ☕",
    "avatarEmoji": "🌿",
    "avatarBgColor": "#D1C4E9",
    "level": 5,
    "points": 1250,
    "adultVerified": true,
    "joinedAt": "2025-11-20T09:00:00Z",
    "badges": [
      { "id": "bdg_001", "label": "인기글 작성자", "variant": "expert", "earnedAt": "2026-01-10T00:00:00Z" }
    ],
    "stats": {
      "postCount": 12,
      "empathyCount": 87,
      "followerCount": 34,
      "followingCount": 21
    }
  }
}
```

---

## 2-2. 마이페이지 활동 요약 (원샷 API)

### `GET /users/me/summary`

> 마이페이지 활동 스트립(글, 댓글, 스크랩, 배지 개수)을 한 번에 반환

**Response 200:**
```json
{
  "success": true,
  "data": {
    "postCount": 12,
    "commentCount": 47,
    "scrapCount": 23,
    "badgeCount": 5,
    "letterCount": 8,
    "points": 1250,
    "level": 5
  }
}
```

---

## 2-3. 내 상세 프로필 조회

### `GET /users/me/profile`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "usr_01J8X9ABCDEF",
    "nickname": "노크차",
    "age": 31,
    "region": "서울",
    "job": "디자이너",
    "mbti": "INFJ",
    "mbtiDesc": "선의의 옹호자",
    "mbtiEmoji": "🌱",
    "bio": "조용한 카페에서 책 읽기 좋아해요 ☕",
    "interestBadge": "예술/문화",
    "profileCompletion": 82,
    "profileCompletionHint": "이상형을 입력하면 +10%",
    "photos": [
      {
        "id": "pht_001",
        "url": "https://s3.ap-northeast-2.amazonaws.com/ef-app/photos/usr_01J8X9ABCDEF/pht_001.jpg",
        "order": 1,
        "isMain": true
      }
    ],
    "keywords": [
      {
        "category": "LIFESTYLE",
        "title": "라이프스타일",
        "color": "purple",
        "chips": ["홈카페", "독서", "미술관"]
      },
      {
        "category": "HOBBY",
        "title": "취미",
        "color": "mint",
        "chips": ["사진찍기", "드로잉"]
      }
    ],
    "habits": {
      "drinking": "가끔",
      "smoking": "비흡연",
      "tattoo": "없음"
    },
    "styleTraits": ["온깁", "텍선호"],
    "idealType": {
      "priorities": ["성격", "유머감각", "외모"],
      "age": { "min": 25, "max": 35 },
      "region": "서울/경기",
      "mbti": ["ENTP", "ENFP"],
      "drinking": "가끔",
      "smoking": "상관없음"
    }
  }
}
```

---

## 2-4. 내 프로필 수정

### `PUT /users/me/profile`

**Request Body (Partial Update):**
```json
{
  "nickname": "노크차",
  "bio": "수정된 자기소개",
  "job": "개발자",
  "mbti": "INTJ",
  "region": "경기",
  "habits": {
    "drinking": "거의 안 마심",
    "smoking": "비흡연",
    "tattoo": "없음"
  },
  "styleTraits": ["온깁", "깁선호"],
  "keywords": [
    { "category": "LIFESTYLE", "chips": ["홈카페", "요가"] }
  ],
  "idealType": {
    "priorities": ["성격", "취미"],
    "age": { "min": 27, "max": 33 }
  }
}
```

**Response 200:**
```json
{ "success": true, "data": { "updated": true } }
```

---

## 2-5. 프로필 사진 업로드

### `POST /users/me/photos`

**Request:** `multipart/form-data`

| 필드 | 타입 | 설명 |
|---|---|---|
| `photo` | File (jpg/png/webp, max 10MB) | 이미지 파일 |
| `order` | number | 사진 순서 (1~5) |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "pht_002",
    "url": "https://s3.ap-northeast-2.amazonaws.com/ef-app/photos/usr_01J8X9ABCDEF/pht_002.jpg",
    "order": 2,
    "isMain": false
  }
}
```

---

## 2-6. 프로필 사진 삭제

### `DELETE /users/me/photos/:photoId`

**Response 200:**
```json
{ "success": true, "data": { "deleted": true } }
```

---

## 2-7. 다른 사용자 공개 프로필 조회

### `GET /users/:userId`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "usr_02J8X9XYZUVW",
    "nickname": "초록별",
    "age": 28,
    "region": "부산",
    "job": "회사원",
    "mbti": "ENFP",
    "bio": "새로운 사람 만나는 걸 좋아해요!",
    "avatarEmoji": "⭐",
    "avatarBgColor": "#C8E6C9",
    "keywords": [...],
    "styleTraits": ["온텍", "플라토닉"],
    "photos": [{ "url": "https://s3...", "order": 1, "isMain": true }],
    "badges": [...],
    "isMatched": false,
    "matchRequestStatus": null
  }
}
```

---

## 2-8. 회원 탈퇴

### `DELETE /users/me`

**Request Body:**
```json
{
  "reason": "사용 빈도가 낮음",
  "password": "P@ssw0rd!"
}
```

**Response 200:**
```json
{ "success": true, "data": { "deactivated": true } }
```

---

---

# 3. 밸런스 게임 (Balance Game / 게시글)

---

## 3-1. 밸런스 게임 목록 조회

### `GET /balance-games`

**Query Params:**

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `cursor` | string | - | 커서 (마지막 항목 ID) |
| `limit` | number | 20 | 최대 20 |
| `sort` | enum: `latest`, `popular` | `latest` | 정렬 기준 |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bg_01J8X9001",
      "authorId": "usr_01J8X9ABCDEF",
      "authorNickname": "노크차",
      "authorAvatarEmoji": "🌿",
      "authorAvatarBgColor": "#D1C4E9",
      "question": "카페 갈 때 당신의 선택은?",
      "optionA": { "emoji": "☕", "label": "아메리카노", "votes": 124 },
      "optionB": { "emoji": "🍵", "label": "녹차라떼", "votes": 87 },
      "totalVotes": 211,
      "myVote": "A",
      "commentCount": 34,
      "participantCount": 211,
      "status": "ACTIVE",
      "createdAt": "2026-04-12T08:30:00Z"
    }
  ],
  "meta": { "nextCursor": "bg_01J8X8990", "hasMore": true }
}
```

---

## 3-2. 오늘의 밸런스 게임 조회 (홈 메인)

### `GET /balance-games/today`

**Response 200:** (단일 게임 객체, 3-1과 동일한 필드)

---

## 3-3. 밸런스 게임 단건 조회

### `GET /balance-games/:gameId`

**Response 200:** (3-1과 동일한 필드)

---

## 3-4. 밸런스 게임 작성

### `POST /balance-games`

**Request Body:**
```json
{
  "question": "주말 데이트 장소는?",
  "optionA": { "emoji": "🌿", "label": "자연/공원" },
  "optionB": { "emoji": "🏙️", "label": "시내/복합몰" }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "bg_01J8X9002",
    "question": "주말 데이트 장소는?",
    "status": "ACTIVE",
    "createdAt": "2026-04-12T09:00:00Z"
  }
}
```

---

## 3-5. 밸런스 게임 투표

### `POST /balance-games/:gameId/vote`

**Request Body:**
```json
{
  "choice": "A"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "gameId": "bg_01J8X9001",
    "choice": "A",
    "optionA": { "votes": 125, "percentage": 59 },
    "optionB": { "votes": 87, "percentage": 41 },
    "totalVotes": 212
  }
}
```

**Error 409 (CONFLICT_003):** 이미 투표한 게임

---

## 3-6. 밸런스 게임 삭제

### `DELETE /balance-games/:gameId`

**Response 200:**
```json
{ "success": true, "data": { "deleted": true } }
```

---

## 3-7. 댓글 목록 조회

### `GET /balance-games/:gameId/comments`

**Query Params:** `cursor`, `limit` (기본 20)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmt_01J8X9A01",
      "authorId": "usr_02J8X9XYZUVW",
      "authorNickname": "초록별",
      "authorAvatarEmoji": "⭐",
      "authorAvatarBgColor": "#C8E6C9",
      "text": "저도 아메리카노요! 진한 맛이 최고",
      "likeCount": 12,
      "isLiked": false,
      "isDeleted": false,
      "createdAt": "2026-04-12T08:45:00Z",
      "replies": [
        {
          "id": "rpl_01J8X9B01",
          "authorId": "usr_01J8X9ABCDEF",
          "authorNickname": "노크차",
          "authorAvatarEmoji": "🌿",
          "authorAvatarBgColor": "#D1C4E9",
          "text": "저도요!",
          "likeCount": 3,
          "isLiked": false,
          "isDeleted": false,
          "createdAt": "2026-04-12T08:50:00Z"
        }
      ]
    }
  ],
  "meta": { "nextCursor": "cmt_01J8X9A00", "hasMore": false }
}
```

---

## 3-8. 댓글 작성

### `POST /balance-games/:gameId/comments`

**Request Body:**
```json
{ "text": "저는 녹차라떼파!" }
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "cmt_01J8X9A02",
    "text": "저는 녹차라떼파!",
    "createdAt": "2026-04-12T09:10:00Z"
  }
}
```

---

## 3-9. 댓글 삭제

### `DELETE /balance-games/:gameId/comments/:commentId`

**Response 200:**
```json
{ "success": true, "data": { "deleted": true } }
```

> 소프트 삭제: `isDeleted: true`로 변경, "삭제된 댓글입니다." 표시

---

## 3-10. 댓글 좋아요 토글

### `POST /balance-games/:gameId/comments/:commentId/like`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "commentId": "cmt_01J8X9A01",
    "isLiked": true,
    "likeCount": 13
  }
}
```

---

## 3-11. 대댓글 작성

### `POST /balance-games/:gameId/comments/:commentId/replies`

**Request Body:**
```json
{ "text": "공감해요!" }
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "rpl_01J8X9B02",
    "text": "공감해요!",
    "createdAt": "2026-04-12T09:15:00Z"
  }
}
```

---

---

# 4. 종이비행기 우체통 (Letters / PostIt)

---

## 4-1. 편지 목록 조회

### `GET /letters`

**Query Params:**

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `cursor` | string | - | 커서 |
| `limit` | number | 20 | 최대 20 |
| `scope` | enum: `NEIGHBORHOOD`, `SEOUL`, `NATIONWIDE` | - | 범위 필터 |
| `tag` | enum: `DAILY`, `WARM`, `SIMPLE`, `EMOTIONAL`, `CONCERN`, `EXCITING`, `RANDOM` | - | 태그 필터 |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ltr_01J8X9C01",
      "authorId": "usr_02J8X9XYZUVW",
      "isAnonymous": true,
      "displayNickname": "익명의 별",
      "displayAvatarEmoji": "🌙",
      "displayAvatarColor": "#EDE7F6",
      "scope": "NATIONWIDE",
      "tag": "WARM",
      "title": "오늘 하루도 수고했어요",
      "previewText": "요즘 많이 지치셨죠? 그래도 오늘 하루...",
      "likeCount": 28,
      "isLiked": false,
      "replyCount": 5,
      "stamp": "🌸",
      "createdAt": "2026-04-12T07:00:00Z"
    }
  ],
  "meta": { "nextCursor": "ltr_01J8X9C00", "hasMore": true }
}
```

---

## 4-2. 편지 단건 조회

### `GET /letters/:letterId`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "ltr_01J8X9C01",
    "authorId": "usr_02J8X9XYZUVW",
    "isAnonymous": true,
    "displayNickname": "익명의 별",
    "displayAvatarEmoji": "🌙",
    "displayAvatarColor": "#EDE7F6",
    "age": 28,
    "region": "서울",
    "scope": "NATIONWIDE",
    "tag": "WARM",
    "title": "오늘 하루도 수고했어요",
    "body": "요즘 많이 지치셨죠? 그래도 오늘 하루도 잘 버텨내셨네요...",
    "stamp": "🌸",
    "likeCount": 28,
    "isLiked": false,
    "replyCount": 5,
    "createdAt": "2026-04-12T07:00:00Z"
  }
}
```

---

## 4-3. 편지 작성

### `POST /letters`

**Request Body:**
```json
{
  "title": "봄날의 편지",
  "body": "오늘 벚꽃이 정말 예쁘게 폈어요...",
  "stamp": "🌸",
  "tag": "EMOTIONAL",
  "scope": "SEOUL",
  "isAnonymous": false
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "ltr_01J8X9C02",
    "createdAt": "2026-04-12T09:20:00Z"
  }
}
```

---

## 4-4. 편지 좋아요 토글

### `POST /letters/:letterId/like`

**Response 200:**
```json
{
  "success": true,
  "data": { "isLiked": true, "likeCount": 29 }
}
```

---

## 4-5. 편지 답장 목록 조회

### `GET /letters/:letterId/replies`

**Query Params:** `cursor`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lrp_01J8X9D01",
      "authorId": "usr_01J8X9ABCDEF",
      "isAnonymous": false,
      "displayNickname": "노크차",
      "displayAvatarEmoji": "🌿",
      "displayAvatarColor": "#D1C4E9",
      "body": "저도 오늘 벚꽃 봤어요! 정말 예쁘더라고요 🌸",
      "likeCount": 5,
      "isLiked": false,
      "createdAt": "2026-04-12T10:00:00Z"
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

---

## 4-6. 편지 답장 작성

### `POST /letters/:letterId/replies`

**Request Body:**
```json
{
  "body": "저도 오늘 벚꽃 봤어요!",
  "isAnonymous": false
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "lrp_01J8X9D02", "createdAt": "2026-04-12T10:05:00Z" }
}
```

---

---

# 5. 매칭 (Hi)

---

## 5-1. 스와이프용 프로필 목록 조회

### `GET /hi/profiles`

**Query Params:**

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `matchType` | enum: `interest`, `ideal`, `attraction`, `random` | - | 매칭 타입 필터 |
| `limit` | number | 10 | 한 번에 가져올 프로필 수 |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "usr_02J8X9XYZUVW",
      "matchType": "interest",
      "nickname": "초록별",
      "age": 28,
      "region": "부산",
      "mbti": "ENFP",
      "avatarEmoji": "⭐",
      "avatarBgColor": "#C8E6C9",
      "tags": ["독서", "캠핑", "사진"],
      "bio": "새로운 사람 만나는 걸 좋아해요!",
      "matchScore": 87,
      "photos": [
        { "url": "https://s3...", "order": 1 }
      ]
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

---

## 5-2. 매칭 요청 보내기 (메시지와 함께)

### `POST /hi/requests`

> 한쪽이 메시지를 먼저 보내면, 상대방이 수락/거절하는 방식

**Request Body:**
```json
{
  "targetUserId": "usr_02J8X9XYZUVW",
  "message": "안녕하세요! 독서 취미가 저랑 같아서 말 걸어봐요 😊"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "requestId": "mreq_01J8X9E01",
    "targetUserId": "usr_02J8X9XYZUVW",
    "status": "PENDING",
    "message": "안녕하세요! 독서 취미가 저랑 같아서 말 걸어봐요 😊",
    "createdAt": "2026-04-12T10:10:00Z"
  }
}
```

**Error 409 (CONFLICT_004):** 이미 보낸 요청

---

## 5-3. 받은 매칭 요청 목록 조회

### `GET /hi/requests/received`

**Query Params:** `cursor`, `limit`, `status` (PENDING / ACCEPTED / REJECTED)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "requestId": "mreq_01J8X9E02",
      "fromUser": {
        "id": "usr_03J8X9MNOPQR",
        "nickname": "달빛토끼",
        "age": 26,
        "region": "서울",
        "avatarEmoji": "🐰",
        "avatarBgColor": "#F8BBD0",
        "mbti": "ISFP",
        "tags": ["그림", "음악", "카페"],
        "matchScore": 92
      },
      "message": "그림 그리기 좋아하신다고 봤어요!",
      "status": "PENDING",
      "createdAt": "2026-04-12T09:30:00Z"
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

---

## 5-4. 보낸 매칭 요청 목록 조회

### `GET /hi/requests/sent`

**Response 200:** (5-3과 유사 구조, fromUser 대신 toUser)

---

## 5-5. 매칭 요청 수락

### `PUT /hi/requests/:requestId/accept`

> 수락 시 자동으로 채팅방이 생성됨

**Response 200:**
```json
{
  "success": true,
  "data": {
    "requestId": "mreq_01J8X9E02",
    "status": "ACCEPTED",
    "chatRoomId": "chat_01J8X9F01",
    "matchId": "mtch_01J8X9G01"
  }
}
```

---

## 5-6. 매칭 요청 거절

### `PUT /hi/requests/:requestId/reject`

**Response 200:**
```json
{
  "success": true,
  "data": { "requestId": "mreq_01J8X9E02", "status": "REJECTED" }
}
```

---

## 5-7. 매칭된 사용자 목록 조회

### `GET /hi/matches`

**Query Params:** `cursor`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "matchId": "mtch_01J8X9G01",
      "chatRoomId": "chat_01J8X9F01",
      "matchedUser": {
        "id": "usr_03J8X9MNOPQR",
        "nickname": "달빛토끼",
        "avatarEmoji": "🐰",
        "avatarBgColor": "#F8BBD0"
      },
      "matchedAt": "2026-04-11T15:00:00Z"
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

---

---

# 6. 채팅 (Chat)

---

## 6-1. 채팅방 목록 조회

### `GET /chats`

**Query Params:** `tab` (all / unread / liked), `search`, `cursor`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "chatRoomId": "chat_01J8X9F01",
      "partner": {
        "id": "usr_03J8X9MNOPQR",
        "nickname": "달빛토끼",
        "avatarEmoji": "🐰",
        "avatarBgColor": "#F8BBD0",
        "isOnline": true
      },
      "lastMessage": {
        "text": "오늘 시간 돼요?",
        "sentAt": "2026-04-12T10:00:00Z",
        "isFromMe": false
      },
      "unreadCount": 2,
      "isLiked": false,
      "memo": null,
      "memoUpdatedAt": null,
      "createdAt": "2026-04-11T15:00:00Z"
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

---

## 6-2. 채팅방 메시지 목록 조회

### `GET /chats/:chatRoomId/messages`

**Query Params:** `cursor`, `limit` (기본 50)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_01J8X9H01",
      "chatRoomId": "chat_01J8X9F01",
      "senderId": "usr_03J8X9MNOPQR",
      "isFromMe": false,
      "type": "TEXT",
      "text": "안녕하세요! 잘 지내셨나요?",
      "sentAt": "2026-04-11T15:05:00Z",
      "isRead": true
    },
    {
      "id": "msg_01J8X9H02",
      "chatRoomId": "chat_01J8X9F01",
      "senderId": "usr_01J8X9ABCDEF",
      "isFromMe": true,
      "type": "TEXT",
      "text": "안녕하세요! 네, 잘 지냈어요 😊",
      "sentAt": "2026-04-11T15:07:00Z",
      "isRead": true
    }
  ],
  "meta": { "nextCursor": "msg_01J8X9H00", "hasMore": true }
}
```

---

## 6-3. 메시지 전송

### `POST /chats/:chatRoomId/messages`

**Request Body:**
```json
{
  "type": "TEXT",
  "text": "오늘 저녁에 시간 있으세요?"
}
```

**Message Type Enum:** `TEXT`, `IMAGE`, `EMOJI`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "msg_01J8X9H03",
    "type": "TEXT",
    "text": "오늘 저녁에 시간 있으세요?",
    "sentAt": "2026-04-12T10:20:00Z"
  }
}
```

---

## 6-4. 채팅방 메모 업데이트

### `PUT /chats/:chatRoomId/memo`

**Request Body:**
```json
{
  "memo": "금요일 약속 있음"
}
```

> `memo: null`이면 메모 삭제

**Response 200:**
```json
{
  "success": true,
  "data": { "memo": "금요일 약속 있음", "memoUpdatedAt": "2026-04-12T10:25:00Z" }
}
```

---

## 6-5. 채팅방 좋아요 토글 (💜 즐겨찾기)

### `PUT /chats/:chatRoomId/like`

**Response 200:**
```json
{ "success": true, "data": { "isLiked": true } }
```

---

## 6-6. 메시지 읽음 처리

### `PUT /chats/:chatRoomId/read`

**Response 200:**
```json
{ "success": true, "data": { "readAt": "2026-04-12T10:26:00Z" } }
```

---

---

# 7. 알림 (Notifications)

---

## 7-1. 알림 목록 조회

### `GET /notifications`

**Query Params:** `cursor`, `limit`, `type` (ALL / MATCH / COMMENT / LIKE / SYSTEM)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "noti_01J8X9I01",
      "type": "MATCH_REQUEST",
      "title": "새 Hi 요청",
      "body": "달빛토끼님이 메시지를 보냈어요!",
      "isRead": false,
      "actionType": "MATCH_REQUEST",
      "actionId": "mreq_01J8X9E02",
      "createdAt": "2026-04-12T09:30:00Z"
    },
    {
      "id": "noti_01J8X9I02",
      "type": "COMMENT",
      "title": "새 댓글",
      "body": "초록별님이 내 게임에 댓글을 달았어요",
      "isRead": true,
      "actionType": "BALANCE_GAME",
      "actionId": "bg_01J8X9001",
      "createdAt": "2026-04-12T08:45:00Z"
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

**Notification Type Enum:**
`MATCH_REQUEST`, `MATCH_ACCEPTED`, `COMMENT`, `REPLY`, `LIKE`, `LETTER_REPLY`, `SYSTEM`, `BADGE_EARNED`

---

## 7-2. 알림 읽음 처리

### `PUT /notifications/:notifId/read`

**Response 200:**
```json
{ "success": true, "data": { "isRead": true } }
```

---

## 7-3. 전체 알림 읽음 처리

### `PUT /notifications/read-all`

**Response 200:**
```json
{ "success": true, "data": { "updatedCount": 5 } }
```

---

## 7-4. 공지사항 목록 조회

### `GET /notices`

**Query Params:** `cursor`, `limit`, `tag` (notice / update / event / hot)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ntc_01J8X9J01",
      "tag": "update",
      "title": "v2.4 업데이트 안내",
      "preview": "더 빠르고 안정적인 이프가 되었어요!",
      "body": "이번 업데이트에서는...",
      "publishedAt": "2026-04-10T09:00:00Z"
    }
  ],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

---

---

# 8. 배지 (Badges)

---

## 8-1. 전체 배지 정의 목록

### `GET /badges`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bdg_001",
      "label": "인기글 작성자",
      "description": "100표 이상 받은 밸런스 게임 작성",
      "variant": "expert",
      "iconEmoji": "✍️",
      "condition": "BALANCE_GAME_VOTES_100"
    },
    {
      "id": "bdg_002",
      "label": "인기 상위 3%",
      "description": "이번 주 좋아요 상위 3%",
      "variant": "hot",
      "iconEmoji": "🔥",
      "condition": "WEEKLY_TOP_3_PERCENT"
    }
  ]
}
```

---

## 8-2. 내 배지 목록

### `GET /users/me/badges`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bdg_001",
      "label": "인기글 작성자",
      "variant": "expert",
      "iconEmoji": "✍️",
      "earnedAt": "2026-01-10T00:00:00Z"
    }
  ]
}
```

---

---

# 9. 프로필 검색 (향후 확장)

---

## 9-1. 사용자 검색

### `GET /search/users`

**Query Params:**

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `cursor` | string | 커서 |
| `limit` | number | 최대 20 |
| `mbti` | string[] | MBTI 필터 (쉼표 구분) |
| `region` | string | 지역 |
| `ageMin` | number | 최소 나이 |
| `ageMax` | number | 최대 나이 |
| `interests` | string[] | 관심사 키워드 |

**Response 200:**
```json
{
  "success": true,
  "data": [...],
  "meta": { "nextCursor": null, "hasMore": false }
}
```

---

---

# 10. 포인트 (향후 확장)

---

## 10-1. 포인트 잔액 및 내역 조회

### `GET /users/me/points`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "balance": 1250,
    "history": [
      {
        "id": "pt_01",
        "type": "EARNED",
        "amount": 100,
        "reason": "밸런스 게임 참여",
        "createdAt": "2026-04-11T00:00:00Z"
      },
      {
        "id": "pt_02",
        "type": "SPENT",
        "amount": -50,
        "reason": "Hi 메시지 발송",
        "createdAt": "2026-04-10T00:00:00Z"
      }
    ]
  }
}
```

---

---

# Axios 인스턴스 설정 예시

```typescript
// api/client.ts
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';

const apiClient = axios.create({
  baseURL: 'https://api.ef-app.io/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: AccessToken 자동 주입
apiClient.interceptors.request.use((config) => {
  const token = useUserStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor: 401 → 토큰 갱신 → 재시도
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 &&
        error.response?.data?.error?.code === 'AUTH_003' &&
        !original._retry) {
      original._retry = true;
      try {
        const refreshToken = useUserStore.getState().refreshToken;
        const { data } = await axios.post('/auth/refresh', { refreshToken });
        useUserStore.getState().setAccessToken(data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(original);
      } catch {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```
