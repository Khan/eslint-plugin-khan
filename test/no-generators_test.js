var rule = require('../lib/rules/no-generators');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
    ecmaVersion: 2015,
    parser: "babel-eslint",
    parserOptions: {
        sourceType: "module",
        allowImportExportEverywhere: false
    }
};

var ruleTester = new RuleTester();
var errors = ['generator functions are not allowed'];

ruleTester.run('no-generators', rule, {
    valid: [
        { code: 'function foo() {}', options: ['always'], parserOptions: parserOptions },
        { code: 'var foo = function() {}', options: ['always'], parserOptions: parserOptions },
        { code: 'function* foo() {}', options: ['never'], parserOptions: parserOptions },
        { code: 'var foo = function* () {}', options: ['never'], parserOptions: parserOptions },
    ],
    invalid: [
        { code: 'function* foo() {}', options: ['always'], parserOptions: parserOptions, errors: errors },
        { code: 'var foo = function* () {}', options: ['always'], parserOptions: parserOptions, errors: errors },
    ],
});
