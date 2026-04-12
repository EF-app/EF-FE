module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Reanimated 플러그인은 반드시 마지막에 위치해야 함
      "react-native-reanimated/plugin",
    ],
  };
};
