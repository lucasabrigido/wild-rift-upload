module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        jest: true
    },
    extends: 'eslint:recommended',
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        },
        sourceType: 'module'
    },
    plugins: ['import'],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'eol-last': ['error', 'always'],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore'
            }
        ],
        'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
        'no-multi-spaces': 'error',
        'no-trailing-spaces': 'error',
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 1 }],
        curly: 'error',
        camelcase: ['error', { properties: 'never' }],
        'keyword-spacing': 'error',
        'space-before-blocks': 'error',
        'brace-style': ['error', '1tbs'],
        'space-infix-ops': 'error',
        'no-console': 'off'
        // "import/order": ["error", {"groups": [["external", "builtin"], ["index", "sibling", "parent", "internal"]], "newlines-between": "always" }]
    }
};
