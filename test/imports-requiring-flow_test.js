const rule = require("../lib/rules/imports-requiring-flow");
const RuleTester = require("eslint").RuleTester;

const parserOptions = {
    parser: "babel-eslint",
};

const ruleTester = new RuleTester(parserOptions);
const message = rule.__message;
const errors = [message];

const importFooPkgFlow = `
// @flow
import foo from "foo";
`;

const importFooPkgNoflow = `
// @noflow
import foo from "foo";
`;

const importModuleBFlow = `
// @flow
import foo from "../package-2/module-b.js";
`;

const importModuleBNoflow = `
// @noflow
import foo from "../package-2/module-b.js";
`;

ruleTester.run("imports-requiring-flow", rule, {
    valid: [
        {
            code: importFooPkgFlow,
            filename: "src/package-1/module-a.js",
            options: [
                "always",
                {
                    packages: ["foo"],
                },
            ],
        },
        {
            code: importFooPkgNoflow,
            filename: "src/package-1/module-a.js",
            options: [
                "always",
                {
                    packages: ["bar"],
                },
            ],
        },
        {
            code: importModuleBFlow,
            filename: "src/package-1/module-a.js",
            options: [
                "always",
                {
                    modules: ["src/package-2/module-b.js"],
                },
            ],
        },
    ],
    invalid: [
        {
            code: importFooPkgNoflow,
            filename: "src/package-1/module-a.js",
            options: [
                "always",
                {
                    packages: ["foo"],
                },
            ],
            errors: ['Importing "foo" requires using flow.'],
        },
        {
            code: importModuleBNoflow,
            filename: "src/package-1/module-a.js",
            options: [
                "always",
                {
                    modules: ["src/package-2/module-b.js"],
                },
            ],
            errors: [
                'Importing "../package-2/module-b.js" requires using flow.',
            ],
        },
    ],
});
