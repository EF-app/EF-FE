# EF(이프) DB 설계서 v1.0

> DBMS: PostgreSQL 16  
> 문자셋: UTF-8  
> 타임존: UTC (저장), 클라이언트에서 KST 변환  
> ID 전략: ULID (시간순 정렬 가능한 UUID 변형, 예: `usr_01J8X9ABCDEF`)  
> Soft Delete: `deleted_at TIMESTAMPTZ NULL` (NULL이면 활성 상태)

---

## ERD 관계 요약

```
users ──────────────────────────────────────────────────────────────┐
  │                                                                  │
  ├─< user_photos (1:N)                                             │
  ├─< user_interests (1:N) >── interests (N:M)                     │
  ├─< user_lifestyle (1:1)                                          │
  ├─< user_style_traits (1:N)                                       │
  ├─< user_ideal_types (1:1)                                        │
  │                                                                  │
  ├─< balance_games (1:N, author)                                   │
  │     └─< balance_game_votes (1:N)                                │
  │     └─< comments (1:N)                                          │
  │           └─< comment_replies (1:N)                             │
  │           └─< comment_likes (1:N)                               │
  │                                                                  │
  ├─< letters (1:N, author)                                         │
  │     └─< letter_likes (1:N)                                      │
  │     └─< letter_replies (1:N)                                    │
  │           └─< letter_reply_likes (1:N)                          │
  │                                                                  │
  ├─< match_requests (1:N, from_user / to_user)                    │
  ├─< matches (1:N, user_a / user_b)                                │
  │                                                                  │
  ├─< chat_room_members (N:M) >── chat_rooms                        │
  │     └─< messages (1:N)                                          │
  │     └─< chat_memos (1:N)                                        │
  │     └─< chat_room_likes (1:N)                                   │
  │                                                                  │
  ├─< user_badges (N:M) >── badges                                  │
  ├─< notifications (1:N)                                           │
  ├─< point_transactions (1:N)                                      │
  └─< refresh_tokens (1:N)                                          │
                                                                     │
adult_verifications ──────────────────────────────────────────────┘
phone_verifications
notices (admin)
```

---

---

## 1. 인증 & 사용자

---

### `users` — 사용자 기본 정보

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (usr_XXXX) |
| `login_id` | VARCHAR(20) | NOT NULL, UNIQUE | 로그인 아이디 |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt 해시 (saltRounds: 12) |
| `security_code_hash` | VARCHAR(255) | NOT NULL | bcrypt 해시 (보안코드) |
| `security_code_attempts` | SMALLINT | NOT NULL, DEFAULT 0 | 보안코드 틀린 횟수 |
| `security_code_locked_until` | TIMESTAMPTZ | NULL | 임시 잠금 해제 시각 |
| `nickname` | VARCHAR(10) | NOT NULL, UNIQUE | 닉네임 |
| `phone` | VARCHAR(20) | NOT NULL, UNIQUE | 전화번호 (암호화 저장) |
| `birth_date` | DATE | NOT NULL | 생년월일 |
| `gender` | VARCHAR(10) | NOT NULL | ENUM: MALE, FEMALE, OTHER |
| `region` | VARCHAR(30) | NOT NULL | 거주 지역 |
| `bio` | VARCHAR(200) | NULL | 자기소개 |
| `avatar_emoji` | VARCHAR(10) | NOT NULL, DEFAULT '🌿' | 기본 아바타 이모지 |
| `avatar_bg_color` | VARCHAR(10) | NOT NULL, DEFAULT '#D1C4E9' | 아바타 배경색 HEX |
| `profile_status` | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ENUM: ACTIVE, PENDING, SUSPENDED, DELETED |
| `adult_verified` | BOOLEAN | NOT NULL, DEFAULT FALSE | 성인인증 완료 여부 |
| `adult_verified_at` | TIMESTAMPTZ | NULL | 성인인증 완료 시각 |
| `agreed_marketing` | BOOLEAN | NOT NULL, DEFAULT FALSE | 마케팅 동의 |
| `level` | SMALLINT | NOT NULL, DEFAULT 1 | 사용자 레벨 |
| `point_balance` | INTEGER | NOT NULL, DEFAULT 0 | 포인트 잔액 |
| `last_login_at` | TIMESTAMPTZ | NULL | 마지막 로그인 시각 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 가입 일시 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정 일시 |
| `deleted_at` | TIMESTAMPTZ | NULL | 탈퇴 일시 (Soft Delete) |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_users_login_id ON users(login_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_users_nickname ON users(nickname) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_region ON users(region);
CREATE INDEX idx_users_gender ON users(gender);
CREATE INDEX idx_users_birth_date ON users(birth_date);
CREATE INDEX idx_users_profile_status ON users(profile_status);
```

---

### `refresh_tokens` — JWT Refresh Token 관리

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `token_hash` | VARCHAR(255) | NOT NULL, UNIQUE | Refresh Token SHA-256 해시 |
| `device_info` | VARCHAR(255) | NULL | 디바이스 정보 (UA) |
| `ip_address` | VARCHAR(45) | NULL | 발급 IP |
| `expires_at` | TIMESTAMPTZ | NOT NULL | 만료 일시 (14일) |
| `revoked_at` | TIMESTAMPTZ | NULL | 폐기 일시 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성 일시 |

**Index:**
```sql
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

---

### `phone_verifications` — 전화번호 인증 코드

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID |
| `phone` | VARCHAR(20) | NOT NULL | 전화번호 |
| `code` | VARCHAR(6) | NOT NULL | 인증 코드 (6자리) |
| `purpose` | VARCHAR(20) | NOT NULL | ENUM: SIGNUP, PASSWORD_RESET, ADULT_VERIFY |
| `attempts` | SMALLINT | NOT NULL, DEFAULT 0 | 인증 시도 횟수 |
| `verified_at` | TIMESTAMPTZ | NULL | 인증 완료 시각 |
| `verification_token` | VARCHAR(255) | NULL | 발급된 인증 토큰 (JWT) |
| `expires_at` | TIMESTAMPTZ | NOT NULL | 만료 (5분) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성 일시 |

---

### `adult_verifications` — 성인인증 이력

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID |
| `user_id` | VARCHAR(30) | NULL, FK → users.id | 사용자 ID (가입 전 NULL 가능) |
| `real_name` | VARCHAR(50) | NOT NULL | 실명 (암호화 저장) |
| `birth_date` | DATE | NOT NULL | 생년월일 |
| `gender` | VARCHAR(10) | NOT NULL | MALE / FEMALE |
| `phone` | VARCHAR(20) | NOT NULL | 인증에 사용된 전화번호 |
| `is_adult` | BOOLEAN | NOT NULL | 만 19세 이상 여부 |
| `verification_token` | VARCHAR(255) | NULL | 발급된 성인인증 토큰 |
| `verified_at` | TIMESTAMPTZ | NOT NULL | 인증 완료 시각 |

---

---

## 2. 프로필

---

### `user_photos` — 프로필 사진

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (pht_XXXX) |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `url` | VARCHAR(500) | NOT NULL | S3 URL (https://s3.ap-northeast-2.amazonaws.com/ef-app/photos/...) |
| `s3_key` | VARCHAR(300) | NOT NULL | S3 Object Key |
| `order` | SMALLINT | NOT NULL | 사진 순서 (1~5) |
| `is_main` | BOOLEAN | NOT NULL, DEFAULT FALSE | 대표 사진 여부 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 업로드 일시 |
| `deleted_at` | TIMESTAMPTZ | NULL | 삭제 일시 |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_user_photos_order ON user_photos(user_id, order) WHERE deleted_at IS NULL;
```

---

### `interests` — 관심사 마스터 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | 정수 ID |
| `name` | VARCHAR(30) | NOT NULL, UNIQUE | 관심사 이름 (예: 독서, 캠핑) |
| `category` | VARCHAR(20) | NOT NULL | ENUM: LIFESTYLE, HOBBY, OUTDOOR, MUSIC, CUSTOM |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | 노출 여부 |

---

### `user_interests` — 사용자 ↔ 관심사 (N:M)

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `interest_id` | INTEGER | NOT NULL, FK → interests.id | 관심사 ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 추가 일시 |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_user_interests_unique ON user_interests(user_id, interest_id);
```

---

### `user_lifestyle` — 라이프스타일 습관 (1:1)

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `user_id` | VARCHAR(30) PK | NOT NULL, FK → users.id | 사용자 ID |
| `drinking` | VARCHAR(20) | NULL | ENUM: NONE, RARELY, SOMETIMES, OFTEN |
| `smoking` | VARCHAR(20) | NULL | ENUM: NONE, SOMETIMES, DAILY |
| `tattoo` | VARCHAR(20) | NULL | ENUM: NONE, SMALL, LARGE |
| `mbti` | VARCHAR(4) | NULL | MBTI (예: INFJ) |
| `job` | VARCHAR(50) | NULL | 직업 |
| `job_category` | VARCHAR(30) | NULL | 직군 카테고리 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정 일시 |

---

### `user_style_traits` — 스타일 성향

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `trait` | VARCHAR(20) | NOT NULL | ENUM: ONLINE_WARM, WARM_PREFERRED, TEXT_PREFERRED, ONLINE_TEXT, PLATONIC |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_user_style_traits_unique ON user_style_traits(user_id, trait);
```

---

### `user_ideal_types` — 이상형 정보 (1:1)

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `user_id` | VARCHAR(30) PK | NOT NULL, FK → users.id | 사용자 ID |
| `age_min` | SMALLINT | NULL | 이상형 최소 나이 |
| `age_max` | SMALLINT | NULL | 이상형 최대 나이 |
| `region_preference` | VARCHAR(30) | NULL | 선호 지역 |
| `mbti_preferences` | VARCHAR(50)[] | NULL | 선호 MBTI 배열 |
| `drinking_preference` | VARCHAR(20) | NULL | 음주 선호 |
| `smoking_preference` | VARCHAR(20) | NULL | 흡연 선호 |
| `priority_1` | VARCHAR(20) | NULL | 이상형 우선순위 1 |
| `priority_2` | VARCHAR(20) | NULL | 이상형 우선순위 2 |
| `priority_3` | VARCHAR(20) | NULL | 이상형 우선순위 3 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정 일시 |

---

---

## 3. 콘텐츠

---

### `balance_games` — 밸런스 게임 (게시글)

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (bg_XXXX) |
| `author_id` | VARCHAR(30) | NOT NULL, FK → users.id | 작성자 ID |
| `question` | VARCHAR(100) | NOT NULL | 질문 |
| `option_a_emoji` | VARCHAR(10) | NOT NULL | 선택지 A 이모지 |
| `option_a_label` | VARCHAR(30) | NOT NULL | 선택지 A 텍스트 |
| `option_b_emoji` | VARCHAR(10) | NOT NULL | 선택지 B 이모지 |
| `option_b_label` | VARCHAR(30) | NOT NULL | 선택지 B 텍스트 |
| `vote_a_count` | INTEGER | NOT NULL, DEFAULT 0 | A 투표 수 |
| `vote_b_count` | INTEGER | NOT NULL, DEFAULT 0 | B 투표 수 |
| `comment_count` | INTEGER | NOT NULL, DEFAULT 0 | 댓글 수 (캐시) |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ENUM: ACTIVE, CLOSED, DELETED |
| `is_featured` | BOOLEAN | NOT NULL, DEFAULT FALSE | 오늘의 게임 여부 |
| `featured_at` | TIMESTAMPTZ | NULL | 추천 게임 지정 일시 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 작성 일시 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정 일시 |
| `deleted_at` | TIMESTAMPTZ | NULL | 삭제 일시 |

**Indexes:**
```sql
CREATE INDEX idx_balance_games_author ON balance_games(author_id);
CREATE INDEX idx_balance_games_created ON balance_games(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_balance_games_featured ON balance_games(is_featured, featured_at DESC);
```

---

### `balance_game_votes` — 투표 기록

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `game_id` | VARCHAR(30) | NOT NULL, FK → balance_games.id | 게임 ID |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 투표자 ID |
| `choice` | VARCHAR(1) | NOT NULL | 'A' 또는 'B' |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 투표 일시 |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_votes_unique ON balance_game_votes(game_id, user_id);
```

---

### `comments` — 댓글

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (cmt_XXXX) |
| `game_id` | VARCHAR(30) | NOT NULL, FK → balance_games.id | 게임 ID |
| `author_id` | VARCHAR(30) | NOT NULL, FK → users.id | 작성자 ID |
| `text` | VARCHAR(300) | NOT NULL | 댓글 내용 |
| `like_count` | INTEGER | NOT NULL, DEFAULT 0 | 좋아요 수 (캐시) |
| `reply_count` | INTEGER | NOT NULL, DEFAULT 0 | 대댓글 수 (캐시) |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 소프트 삭제 여부 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 작성 일시 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정 일시 |

**Index:**
```sql
CREATE INDEX idx_comments_game ON comments(game_id, created_at DESC);
```

---

### `comment_replies` — 대댓글

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (rpl_XXXX) |
| `comment_id` | VARCHAR(30) | NOT NULL, FK → comments.id | 부모 댓글 ID |
| `author_id` | VARCHAR(30) | NOT NULL, FK → users.id | 작성자 ID |
| `text` | VARCHAR(300) | NOT NULL | 내용 |
| `like_count` | INTEGER | NOT NULL, DEFAULT 0 | 좋아요 수 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 소프트 삭제 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 작성 일시 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정 일시 |

---

### `comment_likes` — 댓글 좋아요

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `comment_id` | VARCHAR(30) | NOT NULL, FK → comments.id | 댓글 ID |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_comment_likes_unique ON comment_likes(comment_id, user_id);
```

---

---

## 4. 종이비행기 우체통 (Letters)

---

### `letters` — 편지

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (ltr_XXXX) |
| `author_id` | VARCHAR(30) | NOT NULL, FK → users.id | 작성자 ID |
| `title` | VARCHAR(50) | NOT NULL | 제목 |
| `body` | VARCHAR(1000) | NOT NULL | 본문 |
| `stamp` | VARCHAR(10) | NOT NULL | 우표 이모지 |
| `tag` | VARCHAR(20) | NOT NULL | ENUM: DAILY, WARM, SIMPLE, EMOTIONAL, CONCERN, EXCITING, RANDOM |
| `scope` | VARCHAR(20) | NOT NULL | ENUM: NEIGHBORHOOD, SEOUL, NATIONWIDE |
| `is_anonymous` | BOOLEAN | NOT NULL, DEFAULT FALSE | 익명 여부 |
| `anonymous_nickname` | VARCHAR(20) | NULL | 익명 시 표시 닉네임 |
| `anonymous_emoji` | VARCHAR(10) | NULL | 익명 시 아바타 이모지 |
| `anonymous_bg_color` | VARCHAR(10) | NULL | 익명 시 배경색 |
| `like_count` | INTEGER | NOT NULL, DEFAULT 0 | 좋아요 수 (캐시) |
| `reply_count` | INTEGER | NOT NULL, DEFAULT 0 | 답장 수 (캐시) |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ENUM: ACTIVE, DELETED |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 작성 일시 |
| `deleted_at` | TIMESTAMPTZ | NULL | 삭제 일시 |

**Indexes:**
```sql
CREATE INDEX idx_letters_created ON letters(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_letters_scope ON letters(scope, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_letters_tag ON letters(tag, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_letters_author ON letters(author_id);
```

---

### `letter_likes` — 편지 좋아요

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `letter_id` | VARCHAR(30) | NOT NULL, FK → letters.id | 편지 ID |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_letter_likes_unique ON letter_likes(letter_id, user_id);
```

---

### `letter_replies` — 편지 답장

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (lrp_XXXX) |
| `letter_id` | VARCHAR(30) | NOT NULL, FK → letters.id | 편지 ID |
| `author_id` | VARCHAR(30) | NOT NULL, FK → users.id | 답장 작성자 ID |
| `body` | VARCHAR(500) | NOT NULL | 답장 내용 |
| `is_anonymous` | BOOLEAN | NOT NULL, DEFAULT FALSE | 익명 여부 |
| `like_count` | INTEGER | NOT NULL, DEFAULT 0 | 좋아요 수 |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 소프트 삭제 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 작성 일시 |

---

---

## 5. 매칭 (Hi)

---

### `match_requests` — 매칭 요청

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (mreq_XXXX) |
| `from_user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 요청 보낸 사용자 |
| `to_user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 요청 받은 사용자 |
| `message` | VARCHAR(200) | NOT NULL | 첫 메시지 |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | ENUM: PENDING, ACCEPTED, REJECTED, CANCELLED |
| `responded_at` | TIMESTAMPTZ | NULL | 수락/거절 일시 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 요청 일시 |
| `expires_at` | TIMESTAMPTZ | NOT NULL | 만료 일시 (7일 후 자동 CANCELLED) |

**Constraints:**
```sql
-- 같은 방향으로 중복 요청 방지 (PENDING 상태에서만)
CREATE UNIQUE INDEX idx_match_requests_pending ON match_requests(from_user_id, to_user_id)
  WHERE status = 'PENDING';

-- 방향 무관 중복 매칭 방지
ALTER TABLE match_requests ADD CONSTRAINT chk_no_self_match CHECK (from_user_id != to_user_id);
```

**Indexes:**
```sql
CREATE INDEX idx_match_requests_to_user ON match_requests(to_user_id, status, created_at DESC);
CREATE INDEX idx_match_requests_from_user ON match_requests(from_user_id, status, created_at DESC);
```

---

### `matches` — 성사된 매칭

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (mtch_XXXX) |
| `request_id` | VARCHAR(30) | NOT NULL, FK → match_requests.id | 원본 요청 ID |
| `user_a_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 A |
| `user_b_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 B |
| `chat_room_id` | VARCHAR(30) | NOT NULL, FK → chat_rooms.id | 생성된 채팅방 |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ENUM: ACTIVE, ENDED |
| `matched_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 매칭 성사 일시 |
| `ended_at` | TIMESTAMPTZ | NULL | 매칭 종료 일시 |

**Index:**
```sql
CREATE INDEX idx_matches_user_a ON matches(user_a_id, matched_at DESC);
CREATE INDEX idx_matches_user_b ON matches(user_b_id, matched_at DESC);
```

---

---

## 6. 채팅

---

### `chat_rooms` — 채팅방

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (chat_XXXX) |
| `type` | VARCHAR(20) | NOT NULL, DEFAULT 'DIRECT' | ENUM: DIRECT (1:1만 지원) |
| `last_message_id` | VARCHAR(30) | NULL, FK → messages.id | 마지막 메시지 |
| `last_message_at` | TIMESTAMPTZ | NULL | 마지막 메시지 시각 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성 일시 |

---

### `chat_room_members` — 채팅방 멤버

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `chat_room_id` | VARCHAR(30) | NOT NULL, FK → chat_rooms.id | 채팅방 ID |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `last_read_message_id` | VARCHAR(30) | NULL, FK → messages.id | 마지막으로 읽은 메시지 ID |
| `last_read_at` | TIMESTAMPTZ | NULL | 마지막 읽음 시각 |
| `is_liked` | BOOLEAN | NOT NULL, DEFAULT FALSE | 💜 즐겨찾기 여부 |
| `memo` | VARCHAR(200) | NULL | 개인 메모 |
| `memo_updated_at` | TIMESTAMPTZ | NULL | 메모 수정 일시 |
| `joined_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 입장 일시 |
| `left_at` | TIMESTAMPTZ | NULL | 나간 일시 |

**Constraints:**
```sql
CREATE UNIQUE INDEX idx_chat_members_unique ON chat_room_members(chat_room_id, user_id);
```

**Index:**
```sql
CREATE INDEX idx_chat_members_user ON chat_room_members(user_id, last_message_at DESC);
```

---

### `messages` — 메시지

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (msg_XXXX) |
| `chat_room_id` | VARCHAR(30) | NOT NULL, FK → chat_rooms.id | 채팅방 ID |
| `sender_id` | VARCHAR(30) | NOT NULL, FK → users.id | 발신자 ID |
| `type` | VARCHAR(20) | NOT NULL, DEFAULT 'TEXT' | ENUM: TEXT, IMAGE, EMOJI |
| `text` | VARCHAR(1000) | NULL | 텍스트 내용 (type=TEXT) |
| `image_url` | VARCHAR(500) | NULL | S3 이미지 URL (type=IMAGE) |
| `image_s3_key` | VARCHAR(300) | NULL | S3 Object Key |
| `is_deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | 삭제 여부 |
| `sent_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 발송 일시 |

**Indexes:**
```sql
CREATE INDEX idx_messages_chat_room ON messages(chat_room_id, sent_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
```

---

---

## 7. 배지 & 포인트

---

### `badges` — 배지 정의

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (bdg_XXXX) |
| `label` | VARCHAR(30) | NOT NULL | 배지 이름 |
| `description` | VARCHAR(100) | NOT NULL | 획득 조건 설명 |
| `variant` | VARCHAR(20) | NOT NULL | ENUM: expert, level, hot |
| `icon_emoji` | VARCHAR(10) | NOT NULL | 아이콘 이모지 |
| `condition` | VARCHAR(50) | NOT NULL | 조건 코드 (서버 로직 참조) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | 활성 여부 |

**Condition Enum 예시:**
- `BALANCE_GAME_VOTES_100` — 100표 이상 게임 작성
- `WEEKLY_TOP_3_PERCENT` — 이번 주 좋아요 상위 3%
- `MATCH_COUNT_10` — 매칭 10회 달성
- `LETTER_LIKED_50` — 편지 누적 좋아요 50

---

### `user_badges` — 사용자 배지 수여

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `badge_id` | VARCHAR(30) | NOT NULL, FK → badges.id | 배지 ID |
| `earned_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 획득 일시 |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_user_badges_unique ON user_badges(user_id, badge_id);
```

---

### `point_transactions` — 포인트 거래 내역 (향후 확장)

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (pt_XXXX) |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `type` | VARCHAR(20) | NOT NULL | ENUM: EARNED, SPENT, REFUNDED, CHARGED |
| `amount` | INTEGER | NOT NULL | 금액 (양수=획득, 음수=사용) |
| `balance_after` | INTEGER | NOT NULL | 거래 후 잔액 |
| `reason` | VARCHAR(100) | NOT NULL | 사유 설명 |
| `reference_type` | VARCHAR(30) | NULL | 연관 엔티티 타입 |
| `reference_id` | VARCHAR(30) | NULL | 연관 엔티티 ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 거래 일시 |

**Index:**
```sql
CREATE INDEX idx_point_tx_user ON point_transactions(user_id, created_at DESC);
```

---

---

## 8. 알림 & 공지

---

### `notifications` — 인앱 알림

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (noti_XXXX) |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 수신자 ID |
| `type` | VARCHAR(30) | NOT NULL | ENUM: MATCH_REQUEST, MATCH_ACCEPTED, COMMENT, REPLY, LIKE, LETTER_REPLY, SYSTEM, BADGE_EARNED |
| `title` | VARCHAR(50) | NOT NULL | 알림 제목 |
| `body` | VARCHAR(200) | NOT NULL | 알림 내용 |
| `action_type` | VARCHAR(30) | NULL | 클릭 시 이동 타입 |
| `action_id` | VARCHAR(30) | NULL | 이동 대상 ID |
| `is_read` | BOOLEAN | NOT NULL, DEFAULT FALSE | 읽음 여부 |
| `read_at` | TIMESTAMPTZ | NULL | 읽은 일시 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성 일시 |
| `deleted_at` | TIMESTAMPTZ | NULL | 삭제 일시 |

**Index:**
```sql
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE AND deleted_at IS NULL;
```

---

### `notices` — 공지사항 (관리자)

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID (ntc_XXXX) |
| `tag` | VARCHAR(20) | NOT NULL | ENUM: notice, update, event, hot |
| `title` | VARCHAR(100) | NOT NULL | 공지 제목 |
| `preview` | VARCHAR(200) | NOT NULL | 미리보기 텍스트 |
| `body` | TEXT | NOT NULL | 본문 (Markdown) |
| `is_pinned` | BOOLEAN | NOT NULL, DEFAULT FALSE | 상단 고정 여부 |
| `published_at` | TIMESTAMPTZ | NOT NULL | 발행 일시 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 생성 일시 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 수정 일시 |
| `deleted_at` | TIMESTAMPTZ | NULL | 삭제 일시 |

---

---

## 9. 스크랩 (향후 확장)

---

### `scraps` — 스크랩

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | SERIAL PK | NOT NULL | |
| `user_id` | VARCHAR(30) | NOT NULL, FK → users.id | 사용자 ID |
| `target_type` | VARCHAR(20) | NOT NULL | ENUM: BALANCE_GAME, LETTER |
| `target_id` | VARCHAR(30) | NOT NULL | 스크랩 대상 ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 스크랩 일시 |

**Constraint:**
```sql
CREATE UNIQUE INDEX idx_scraps_unique ON scraps(user_id, target_type, target_id);
```

---

---

## 10. 신고 (향후 확장)

---

### `reports` — 신고

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | VARCHAR(30) PK | NOT NULL | ULID |
| `reporter_id` | VARCHAR(30) | NOT NULL, FK → users.id | 신고자 ID |
| `target_type` | VARCHAR(20) | NOT NULL | ENUM: USER, BALANCE_GAME, COMMENT, LETTER, MESSAGE |
| `target_id` | VARCHAR(30) | NOT NULL | 신고 대상 ID |
| `reason` | VARCHAR(50) | NOT NULL | 신고 사유 |
| `detail` | VARCHAR(300) | NULL | 상세 내용 |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | ENUM: PENDING, RESOLVED, DISMISSED |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 신고 일시 |

---

---

## 매칭 알고리즘 데이터 흐름

매칭 점수(`match_score`)는 다음 요소를 기반으로 서버에서 실시간 계산:

```
match_score = 
  (공통 관심사 수 / 전체 관심사 수) × 40%   -- user_interests
  + MBTI 궁합 점수 × 30%                    -- user_lifestyle.mbti
  + 나이 범위 적합도 × 15%                  -- users.birth_date, user_ideal_types
  + 지역 일치 여부 × 10%                    -- users.region
  + 스타일 성향 일치도 × 5%                 -- user_style_traits
```

**히 탭 프로필 필터링 쿼리 예시:**
```sql
SELECT u.id, u.nickname, u.birth_date, u.region, ul.mbti,
       ARRAY_AGG(i.name) as interests
FROM users u
LEFT JOIN user_lifestyle ul ON u.id = ul.user_id
LEFT JOIN user_interests ui ON u.id = ui.user_id
LEFT JOIN interests i ON ui.interest_id = i.id
WHERE u.id != :current_user_id
  AND u.adult_verified = TRUE
  AND u.profile_status = 'ACTIVE'
  AND u.deleted_at IS NULL
  -- 이미 요청 보냈거나 매칭된 사용자 제외
  AND u.id NOT IN (
    SELECT to_user_id FROM match_requests
    WHERE from_user_id = :current_user_id AND status = 'PENDING'
  )
  AND u.id NOT IN (
    SELECT CASE WHEN user_a_id = :current_user_id THEN user_b_id ELSE user_a_id END
    FROM matches WHERE (user_a_id = :current_user_id OR user_b_id = :current_user_id)
    AND status = 'ACTIVE'
  )
GROUP BY u.id, ul.mbti
ORDER BY RANDOM()  -- 또는 match_score DESC
LIMIT 10;
```

---

## S3 파일 경로 규칙

```
ef-app/
├── photos/
│   └── {user_id}/
│       └── {photo_id}.{ext}          # 프로필 사진
├── chat/
│   └── {chat_room_id}/
│       └── {message_id}.{ext}        # 채팅 이미지
└── temp/
    └── {upload_token}.{ext}          # 업로드 임시 파일
```

**URL 패턴:**
```
https://s3.ap-northeast-2.amazonaws.com/ef-app/photos/{user_id}/{photo_id}.jpg
또는 CloudFront CDN:
https://cdn.ef-app.io/photos/{user_id}/{photo_id}.jpg
```
