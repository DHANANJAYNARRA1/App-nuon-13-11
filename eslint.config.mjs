import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default [
  // Base JS recommendations
  eslint.configs.recommended,

  // Prettier integration (disables conflicting rules)
  prettierConfig,

  // Global ignores
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "prisma/migrations/**", "*.js"]
  },
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module"
      },
      globals: {
        // Node.js globals
        process: "readonly",
        global: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly"
      }
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"]
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,

      // Import rules
      "import/no-anonymous-default-export": "error", // Prevents anonymous default exports
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "never",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }
      ],

      // General code quality rules
      "array-callback-return": "error", // Ensures array methods like map/filter return values
      complexity: ["error", 14], // Limits cyclomatic complexity to 14
      "dot-notation": "error", // Enforces dot notation when possible
      eqeqeq: "error", // Requires === and !== instead of == and !=
      "id-length": [
        "error",
        { 
          min: 2, 
          exceptions: ["_", "t", "e", "i", "x", "y", "id"] 
        }
      ], // Enforces minimum identifier length
      "max-lines": ["error", 1000], // Limits file length to 400 lines max
      "max-depth": ["error", 4], // Limits nesting depth to 4 levels max
      "no-console": "warn", // Warns on console statements
      "no-else-return": "error", // Disallows unnecessary else after return
      "no-delete-var": "error", // Disallows delete operator on variables
      "no-dupe-class-members": "error", // Disallows duplicate class members
      "no-duplicate-imports": "error", // Disallows duplicate imports from same module
      "no-iterator": "error", // Disallows __iterator__ property
      "no-lone-blocks": "error", // Disallows unnecessary nested blocks
      "no-return-await": "error", // Disallows unnecessary return await
      "no-param-reassign": ["error", { props: false }], // Disallows parameter reassignment (allows object properties for NestJS patterns)
      "no-unneeded-ternary": "error", // Disallows unnecessary ternary expressions
      "no-unused-expressions": ["error", { allowTernary: true }], // Disallows unused expressions
      "no-unreachable": "error", // Disallows unreachable code after return/throw
      "no-useless-constructor": "off", // Turned off because NestJS uses constructors for DI
      "no-var": "error", // Disallows var declarations
      "object-shorthand": "error", // Enforces object shorthand syntax
      "prefer-const": "error", // Requires const for variables that are never reassigned
      "prefer-rest-params": "error", // Requires rest parameters instead of arguments
      "prefer-template": "error", // Requires template literals instead of string concatenation
      "prefer-arrow-callback": "error", // Requires arrow functions as callbacks

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ], // Disallows unused variables (allows _ prefix)
      "@typescript-eslint/no-shadow": "error", // Disallows variable shadowing
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true
        }
      ], // Requires explicit return types on functions
      "@typescript-eslint/explicit-module-boundary-types": "off", // Turned off for NestJS - decorators make types clear
      "@typescript-eslint/no-explicit-any": "error", // Disallows any type
      "@typescript-eslint/no-floating-promises": "error", // Requires proper handling of promises
      "@typescript-eslint/await-thenable": "error", // Disallows awaiting non-promise values
      "@typescript-eslint/no-misused-promises": "error", // Avoids common promise mistakes
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: false
          }
        },
        {
          selector: "class",
          format: ["PascalCase"]
        },
        {
          selector: "enum",
          format: ["PascalCase"]
        }
      ] // Enforces naming conventions
    }
  }
];

