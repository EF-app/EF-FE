import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api-url.com", // 나중에 서버 주소로 변경
  timeout: 5000,
});

export default api;
