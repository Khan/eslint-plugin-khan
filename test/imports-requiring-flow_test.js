const path = require("path");

const rule = require("../lib/rules/imports-requiring-flow");
const RuleTester = require("eslint").RuleTester;

const parserOptions = {
    parser: "babel-eslint",
};

const ruleTester = new RuleTester(parserOptions);
const message = rule.__message;
const errors = [message];
const rootDir = "/Users/nyancat/project";

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
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["foo"],
                    rootDir,
                },
            ],
        },
        {
            code: importBarModFlow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["src/package-2/bar.js"],
                    rootDir,
                },
            ],
        },
        {
            code: importFooPkgNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                    rootDir,
                },
            ],
        },
        {
            code: importBarModNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                    rootDir,
                },
            ],
        },
        {
            code: requireFooPkgNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                    rootDir,
                },
            ],
        },
        {
            code: requireBarModNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["baz"], // isn't imported so it's okay
                    rootDir,
                },
            ],
        },
    ],
    invalid: [
        {
            code: importFooPkgNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["foo"],
                    rootDir,
                },
            ],
            errors: ['Importing "foo" requires using flow.'],
        },
        {
            code: importBarModNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["src/package-2/bar.js"],
                    rootDir,
                },
            ],
            errors: ['Importing "../package-2/bar.js" requires using flow.'],
        },
        {
            code: requireFooPkgNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["foo"],
                    rootDir,
                },
            ],
            errors: ['Importing "foo" requires using flow.'],
        },
        {
            code: requireBarModNoflow,
            filename: path.join(rootDir, "src/package-1/foobar.js"),
            options: [
                "always",
                {
                    modules: ["src/package-2/bar.js"],
                    rootDir,
                },
            ],
            errors: ['Importing "../package-2/bar.js" requires using flow.'],
        },
    ],
});
