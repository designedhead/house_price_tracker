module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:firebase/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ["firebase"],
  rules: {},
};
