const path = require("path");

const rule = require("../lib/index.js").rules["react-no-method-jsx-attribute"];
const RuleTester = require("eslint").RuleTester;

const parserOptions = {
    parser: "babel-eslint",
};

const ruleTester = new RuleTester(parserOptions);

ruleTester.run("react-no-method-jsx-attribute", rule, {
    valid: [
        {
            code: `
class Foo {
    constructor() {
        this.handleClick = () => {};
    }

    render() {
        return <div onClick={this.handleClick} />
    }
}`,
            options: [],
        },
        {
            code: `
class Foo {
    handleClick = () => {}

    render() {
        return <div onClick={this.handleClick} />
    }
}`,
            options: [],
        },
        {
            code: `
class Foo {
    handleClick = () => {}

    render() {
        return <div onClick={this.handleClick} />
    }
}

class Bar {
    handleClick() {}

    render() {
        return <div onClick={() => this.handleClick()} />
    }
}`,
            options: [],
        },
    ],
    invalid: [
        {
            code: `
class Foo {
    handleClick() {}

    render() {
        return <div onClick={this.handleClick} />
    }
}`,
            options: [],
            errors: [
                "Methods cannot be passed as props, use a class property instead.",
            ],
        },
        {
            code: `
class Foo {
    handleClick() {}

    render() {
        return <div onClick={this.handleClick} />
    }
}

class Bar {
    handleClick() {}

    render() {
        return <div onClick={this.handleClick} />
    }
}`,
            options: [],
            errors: [
                "Methods cannot be passed as props, use a class property instead.",
                "Methods cannot be passed as props, use a class property instead.",
            ],
        },
    ],
});
