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
    // invalid: [
    //     {
    //         code: "type foo = { bar: [number] }",
    //         options: ["always"],
    //         errors: errors,
    //         output: "type foo = { bar: Array<number> }",
    //     },
    //     {
    //         code: "type foo = { bar: [[number]] }",
    //         options: ["always"],
    //         // Two errors are reported because there are two one-tuples,
    //         // they just happen to be nested.
    //         errors: [message, message],
    //         // This is a partial fix.  Multiple runs of eslint --fix are needed
    //         // to fix nested 1-tuples completely.
    //         output: "type foo = { bar: Array<[number]> }",
    //     },
    // ],
});
