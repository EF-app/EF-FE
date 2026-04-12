/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./common/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── 배경 ───────────────────────────────────────────────────────────
        "ef-bg":       "#F5F3F1",
        "ef-surface":  "#FFFFFF",
        "ef-surface2": "#EDEAE7",

        // ─── 브랜드 (보라 계열) ──────────────────────────────────────────────
        "ef-primary":        "#9686BF",
        "ef-primary-mid":    "#7E6BAD",
        "ef-primary-deep":   "#6A579A",
        "ef-primary-tint":   "rgba(150,134,191,0.10)",
        "ef-primary-soft":   "rgba(150,134,191,0.18)",
        "ef-primary-light":  "#EDE9F6",
        "ef-primary-border": "rgba(150,134,191,0.22)",

        // ─── 텍스트 ──────────────────────────────────────────────────────────
        "ef-text":      "#1C1A1F",
        "ef-text-sub":  "#6B6670",
        "ef-text-muted":"#ADA8B2",

        // ─── 구분선 ──────────────────────────────────────────────────────────
        "ef-divider": "#EAE7E3",
        "ef-border":  "#E8E4DF",

        // ─── 에러 / 위험 ─────────────────────────────────────────────────────
        "ef-danger":         "#BF9696",
        "ef-danger-bg":      "#F5ECEC",
        "ef-border-invalid": "#D4A9A9",

        // ─── 성공 ────────────────────────────────────────────────────────────
        "ef-green":        "#8BBFA8",
        "ef-green-bg":     "#EAF4EF",
        "ef-success-tint": "rgba(150,134,191,0.12)",

        // ─── 기타 ────────────────────────────────────────────────────────────
        "ef-amber":       "#C4885A",
        "ef-green-vivid": "#5BB98C",
        "ef-red":         "#D4655A",
      },
      fontFamily: {
        light:     ["NanumSquareNeo-aLt"],
        sans:      ["NanumSquareNeo-bRg"],
        bold:      ["NanumSquareNeo-cBd"],
        extrabold: ["NanumSquareNeo-dEb"],
        heavy:     ["NanumSquareNeo-eHv"],
      },
    },
  },
  plugins: [],
};
