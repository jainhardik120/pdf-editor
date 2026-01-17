import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import promise from 'eslint-plugin-promise';
import reactPreferFunctionComponent from 'eslint-plugin-react-prefer-function-component';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* eslint-disable no-magic-numbers -- ESLint configuration constants */
const MAX_NESTED_CALLBACKS = 3;
const MAX_STATEMENTS = 30;
const SONARJS_COGNITIVE_COMPLEXITY = 15;
const SONARJS_MAX_SWITCH_CASES = 10;
/* eslint-enable no-magic-numbers */

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'postcss.config.mjs']),
  {
    plugins: {
      'prefer-arrow-functions': preferArrowFunctions,
      sonarjs: fixupPluginRules(sonarjs),
      security: fixupPluginRules(security),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      promise: fixupPluginRules(promise),
      'react-prefer-function-component': fixupPluginRules(reactPreferFunctionComponent),
    },
    extends: fixupConfigRules(
      compat.extends(
        'plugin:sonarjs/recommended-legacy',
        'plugin:security/recommended-legacy',
        'plugin:promise/recommended',
        'plugin:react-prefer-function-component/recommended',
      ),
    ),
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'warn',
        {
          allowNullableObject: false,
          allowNumber: false,
          allowString: false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      complexity: [
        'off',
        {
          max: 10,
        },
      ],
      curly: ['error', 'all'],
      eqeqeq: [
        'error',
        'always',
        {
          null: 'ignore',
        },
      ],
      'func-style': ['error', 'expression'],
      'import/extensions': [
        'error',
        'never',
        {
          css: 'always',
          json: 'always',
          scss: 'always',
        },
      ],
      'import/first': 'error',
      'import/max-dependencies': [
        'error',
        {
          max: 20,
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-anonymous-default-export': 'error',
      'import/no-cycle': 'off',
      'import/no-deprecated': 'warn',
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-import-module-exports': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-default': 'error',
      'import/no-relative-packages': 'error',
      'import/no-self-import': 'error',
      'import/no-unassigned-import': [
        'error',
        {
          allow: ['**/*.css', '**/*.scss'],
        },
      ],
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],
      'import/no-webpack-loader-syntax': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: ['builtin', 'external', 'internal', ['sibling', 'index'], 'type', 'object'],
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'external',
              pattern: 'react',
              position: 'before',
            },
            {
              group: 'external',
              pattern: 'next/**',
              position: 'before',
            },
            {
              group: 'internal',
              pattern: '@/**',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
        },
      ],
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'key-spacing': [
        'error',
        {
          afterColon: true,
          beforeColon: false,
        },
      ],
      'keyword-spacing': [
        'error',
        {
          after: true,
          before: true,
        },
      ],
      'max-depth': [
        'error',
        {
          max: 4,
        },
      ],
      'max-lines': [
        'off',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines-per-function': [
        'off',
        {
          IIFEs: true,
          max: 80,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-nested-callbacks': ['error', MAX_NESTED_CALLBACKS],
      'max-params': [
        'warn',
        {
          max: 5,
        },
      ],
      'max-statements': ['error', MAX_STATEMENTS],
      'max-statements-per-line': [
        'error',
        {
          max: 1,
        },
      ],
      'no-console': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': [
        'error',
        {
          allowElseIf: false,
        },
      ],
      'no-lonely-if': 'error',
      'no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
        },
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      'no-nested-ternary': 'error',
      'no-param-reassign': 'error',
      'no-return-await': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
      'prefer-const': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],
      'prefer-object-spread': 'error',
      'prefer-template': 'error',
      'promise/always-return': 'error',
      'promise/avoid-new': 'off',
      'promise/catch-or-return': 'error',
      'promise/no-callback-in-promise': 'error',
      'promise/no-nesting': 'error',
      'promise/no-new-statics': 'error',
      'promise/no-promise-in-callback': 'error',
      'promise/no-return-in-finally': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/valid-params': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/refs': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          children: 'never',
          props: 'never',
        },
      ],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: true,
        },
      ],
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
      'react/jsx-pascal-case': 'error',
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          reservedFirst: true,
        },
      ],
      'react/no-array-index-key': 'error',
      'react/no-danger': 'warn',
      'react/no-unsafe': 'error',
      'react/no-unstable-nested-components': 'warn',
      'react/prop-types': 'warn',
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-object-injection': 'off',
      'security/detect-unsafe-regex': 'error',
      semi: ['error', 'always'],
      'sonarjs/cognitive-complexity': ['off', SONARJS_COGNITIVE_COMPLEXITY],
      'sonarjs/different-types-comparison': 'warn',
      'sonarjs/function-return-type': 'warn',
      'sonarjs/max-switch-cases': ['warn', SONARJS_MAX_SWITCH_CASES],
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-commented-code': 'warn',
      'sonarjs/no-duplicate-string': [
        'warn',
        {
          threshold: 3,
        },
      ],
      'sonarjs/no-duplicated-branches': 'warn',
      'sonarjs/no-identical-conditions': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-inverted-boolean-check': 'warn',
      'sonarjs/no-nested-conditional': 'warn',
      'sonarjs/no-nested-functions': 'warn',
      'sonarjs/no-os-command-from-path': 'warn',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/no-small-switch': 'warn',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/prefer-object-literal': 'warn',
      'sonarjs/prefer-read-only-props': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',
      'sonarjs/pseudo-random': 'warn',
      'sonarjs/table-header': 'warn',
      'space-before-blocks': ['error', 'always'],
      'spaced-comment': [
        'error',
        'always',
        {
          markers: ['/'],
        },
      ],
      yoda: 'error',
    },
  },
]);

export default eslintConfig;
