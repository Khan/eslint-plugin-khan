var rule = require('../lib/rules/no-generators');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
    ecmaVersion: 2015,
    parser: "babel-eslint",
};

var ruleTester = new RuleTester(parserOptions);
var errors = ['generator functions are not allowed'];

ruleTester.run('no-generators', rule, {
    valid: [
        { code: 'function foo() {}', options: ['always'] },
        { code: 'var foo = function() {}', options: ['always'] },
        { code: 'function* foo() {}', options: ['never'] },
        { code: 'var foo = function* () {}', options: ['never'] },
    ],
    invalid: [
        { code: 'function* foo() {}', options: ['always'], errors: errors },
        { code: 'var foo = function* () {}', options: ['always'], errors: errors },
    ],
});
