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

const importBarModFlow = `
// @flow
import bar from "../package-2/bar.js";
`;

const importBarModNoflow = `
// @noflow
import bar from "../package-2/bar.js";
`;

const requireFooPkgFlow = `
// @flow
const foo = require("foo");
`;

const requireFooPkgNoflow = `
// @noflow
const foo = require("foo");
`;

const requireBarModFlow = `
// @flow
const bar = require("../package-2/bar.js");
`;

const requireBarModNoflow = `
// @noflow
const bar = require("../package-2/bar.js");
`;

ruleTester.run("imports-requiring-flow", rule, {
    valid: [
        {
            code: importFooPkgFlow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["foo"],
                },
            ],
        },
        {
            code: importBarModFlow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["src/package-2/bar.js"],
                },
            ],
        },
        {
            code: importFooPkgNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                },
            ],
        },
        {
            code: importBarModNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                },
            ],
        },
        {
            code: requireFooPkgNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                },
            ],
        },
        {
            code: requireBarModNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                },
            ],
        },
    ],
    invalid: [
        {
            code: importFooPkgNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["foo"],
                },
            ],
            errors: ['Importing "foo" requires using flow.'],
        },
        {
            code: importBarModNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["src/package-2/bar.js"],
                },
            ],
            errors: ['Importing "../package-2/bar.js" requires using flow.'],
        },
        {
            code: requireFooPkgNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["foo"],
                },
            ],
            errors: ['Importing "foo" requires using flow.'],
        },
        {
            code: requireBarModNoflow,
            filename: "src/package-1/foobar.js",
            options: [
                "always",
                {
                    modules: ["src/package-2/bar.js"],
                },
            ],
            errors: ['Importing "../package-2/bar.js" requires using flow.'],
        },
    ],
});
