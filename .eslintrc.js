module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'xo',
    'xo-space',
    'xo-react/space',
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  globals: {},
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {jsx: true},
    ecmaVersion: 2018
  },
  plugins: [
    'react'
  ],
  rules: {
    // Limit maximum of props on a single line in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
    'react/jsx-max-props-per-line': ['error', {
      maximum: 1,
      when: 'multiline'
    }],

    // Validate closing bracket location in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],

    // Validate closing tag location in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
    'react/jsx-closing-tag-location': 'error',

    // Prevent missing parentheses around multilines JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-wrap-multilines.md
    'react/jsx-wrap-multilines': ['error', {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line'
    }],

    // Require that the first prop in a JSX element be on a new line when the element is multiline
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],

    // Enforce consistent line breaks inside braces
    // https://eslint.org/docs/rules/object-curly-newline
    'object-curly-newline': ['error', {
      ObjectExpression: {
        multiline: true,
        minProperties: 8
      },
      ObjectPattern: {
        multiline: true,
        minProperties: 8
      },
      ImportDeclaration: 'never',
      ExportDeclaration: 'never'
    }],

    // Enforce placing object properties on separate lines
    // https://eslint.org/docs/rules/object-property-newline
    'object-property-newline': ['error'],

    // Enforces a maximum line length to increase code readability and maintainability.
    // https://eslint.org/docs/rules/max-len
    'max-len': ['warn', {
      code: 150,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignorePattern: '^.*minutes.*\\[.*\\].*' // For datetime picker clock data, e.g. minutes: [n, n+1, ...]
    }],

    // Enforce or disallow capitalization of the first letter of a comment
    // https://eslint.org/docs/rules/capitalized-comments
    'capitalized-comments': 'off',

    // Disallow Null Comparisons
    // https://eslint.org/docs/rules/no-eq-null
    'no-eq-null': 0,

    // Enforce a maximum number of parameters in function definitions (max-params)
    // https://eslint.org/docs/rules/max-params
    'max-params': ['warn', 5],

    // https://github.com/yannickcr/eslint-plugin-react/issues/2396#issuecomment-539184761
    // Default props in functional component should be defined with ES6 standard using object destructure
    'react/require-default-props': ['error', {ignoreFunctionalComponents: true}],

    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
    // Prevent missing displayName in a React component definition
    'react/display-name': 0,

    eqeqeq: ['error', 'always', {null: 'ignore'}],
    'valid-jsdoc': ['error', {
      requireParamDescription: false,
      requireReturnDescription: false
    }],
    complexity: 0
  }
};
