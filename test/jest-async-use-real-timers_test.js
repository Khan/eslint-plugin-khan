const path = require("path");

const {rules} = require("../lib/index.js");
const RuleTester = require("eslint").RuleTester;

const parserOptions = {
    parser: "babel-eslint",
};

const ruleTester = new RuleTester(parserOptions);
const rule = rules["jest-async-use-real-timers"];

ruleTester.run("jest-real-timers", rule, {
    valid: [
        {
            code: `
describe("foo", () => {
    it("doesn't require real timers", () => {});
})`,
            options: ["always"],
        },
        {
            code: `
describe("foo", () => {
    it("requires real timers", async () => {
        jest.useRealTimers();
    });
})`,
            options: ["always"],
        },
        {
            code: `
describe("foo", () => {
    it("requires real timers", async function() {
        jest.useRealTimers();
    });
})`,
            options: ["always"],
        },
        {
            code: `
describe("foo", () => {
    beforeEach(() => {
        jest.useRealTimers();
    });

    it("requires real timers", async () => {});
})`,
            options: ["always"],
        },
        {
            code: `
describe("foo", () => {
    beforeEach(() => {
        jest.useRealTimers();
    });

    describe("bar", () => {
        it("requires real timers", async () => {});
    });
})`,
            options: ["always"],
        },
        {
            code: `
describe("foo", () => {
    describe("bar", () => {
        beforeEach(() => {
            jest.useRealTimers();
        });

        it("requires real timers", async () => {});
    });
})`,
            options: ["always"],
        },
        {
            code: `
describe("foo", () => {
    it("requires real timers", async () => {});
})`,
            options: ["never"],
            errors: [
                "Async tests require jest.useRealTimers().",
            ],
        },
    ],
    invalid: [
        {
            code: `
describe("foo", () => {
    it("requires real timers", async () => {});
})`,
            options: ["always"],
            errors: [
                "Async tests require jest.useRealTimers().",
            ],
        },
        {
            code: `
describe("foo", () => {
    it("requires real timers", async function() {});
})`,
            options: ["always"],
            errors: [
                "Async tests require jest.useRealTimers().",
            ],
        },
        {
            code: `
describe("foo", () => {
    beforeEach(() => {});

    it("requires real timers", async () => {});
})`,
            options: ["always"],
            errors: [
                "Async tests require jest.useRealTimers().",
            ],
        },
        {
            code: `
describe("foo", () => {
    beforeEach(() => {});

    describe("bar", () => {
        it("requires real timers", async () => {});
    });
})`,
            options: ["always"],
            errors: [
                "Async tests require jest.useRealTimers().",
            ],
        },
        {
            code: `
describe("foo", () => {
    describe("bar", () => {
        beforeEach(() => {});

        it("requires real timers", async () => {});
    });
})`,
            options: ["always"],
            errors: [
                "Async tests require jest.useRealTimers().",
            ],
        },
    ],
});
