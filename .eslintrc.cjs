module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    "node/no-unpublished-require": "off",
    "import/no-extraneous-dependencies": "off",
    "object-shorthand": "off",
    "block-scoped-var": "off",
    "padded-blocks": "off",
    "no-underscore-dangle": "off",
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "MemberExpression": "off"
      }
    ],
    "comma-dangle": ["error", "never"],
    "linebreak-style": ["error", "unix"],
    "no-debugger": "error",
    "arrow-body-style": [
      "off",
      "as-needed",
      {
        "requireReturnForObjectLiteral": true
      }
    ],
    "func-names": ["warn", "always"],
    "no-console": "warn",
    "no-alert": "warn",
    "no-shadow": "warn",
    "max-lines": ["warn", 400],
    "max-statements": ["warn", 25],
    "max-params": ["warn", 4],
    "no-invalid-this": "warn",
    "camelcase": "warn",
    "func-name-matching": ["warn", "always"],
    "curly": ["warn", "all"],
    "no-warning-comments": [
      "warn",
      {
        "terms": ["todo", "fixme", "fix me"],
        "location": "anywhere"
      }
    ]
  },
}
