module.exports = {
  plugins: ["react-native"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: { jsx: true }
  },
  rules: {
    "react-native/no-raw-text": "error"
  }
}
