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

var ruleTester = new RuleTester(parserOptions);
var errors = ['async functions are not allowed'];

ruleTester.run('no-async', rule, {
    valid: [
        { code: 'function foo() {}', options: ['always'] },
        { code: 'var foo = function() {}', options: ['always'] },
        { code: 'async function foo() {}', options: ['never'] },
        { code: 'var foo = async function() {}', options: ['never'] },
    ],
    invalid: [
        { code: 'async function foo() {}', options: ['always'], errors: errors },
        { code: 'var foo = async function() {}', options: ['always'], errors: errors },
    ],
});
