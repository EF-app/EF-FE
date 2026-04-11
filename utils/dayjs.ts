import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 불러오기
import relativeTime from "dayjs/plugin/relativeTime";

// 1. 상대 시간 플러그인 활성화 (예: 3시간 전)
dayjs.extend(relativeTime);

// 2. 기본 언어를 한국어로 설정
dayjs.locale("ko");

export default dayjs;
