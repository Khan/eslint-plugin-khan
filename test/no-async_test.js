var rule = require('../lib/rules/no-async');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
    ecmaVersion: 2017,
    parser: "babel-eslint",
    parserOptions: {
        sourceType: "module",
        allowImportExportEverywhere: false
    }
};

var ruleTester = new RuleTester();
var errors = ['async functions are not allowed'];

ruleTester.run('no-async', rule, {
    valid: [
        { code: 'function foo() {}', options: ['always'], parserOptions: parserOptions },
        { code: 'var foo = function() {}', options: ['always'], parserOptions: parserOptions },
        { code: 'async function foo() {}', options: ['never'], parserOptions: parserOptions },
        { code: 'var foo = async function() {}', options: ['never'], parserOptions: parserOptions },
    ],
    invalid: [
        { code: 'async function foo() {}', options: ['always'], parserOptions: parserOptions, errors: errors },
        { code: 'var foo = async function() {}', options: ['always'], parserOptions: parserOptions, errors: errors },
    ],
});
