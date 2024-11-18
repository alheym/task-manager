import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"


/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ["**/*.{js,mjs,cjs,ts}"]},
	{languageOptions: { globals: {...globals.browser, ...globals.node} }},
	{
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error",
			semi: ["error", "never"],
			indent: ["error", "tab"],
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
]