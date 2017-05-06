/**
 * @fileoverview Rule to disallow subscriptions or other async work in React
 * components before mount (eg. the constructor, or in `componentWillMount`
 * lifecycle method)
 * @author Joshua Comeau
 */
const { get } = require('lodash');
const { generateMatcher } = require('../utils/traversal');

const message =
    'Subscriptions (eg. event listeners) should not be set before the ' +
    'component has mounted. This is to avoid firing them on the server, ' +
    'as well as to ensure compatibility with React 16.';

//------------------------------------------------------------------------------
// Helper Methods
//------------------------------------------------------------------------------
const runsBeforeMount = node => {
    switch (node.key.name) {
        case 'constructor':
        case 'componentWillMount':
            return true;
        default:
            return false;
    }
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
    meta: {
        docs: {
            description: "enforce that React components don't do async work before mount",
            category: 'Best Practices',
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        return {
            MethodDefinition(node) {
                // TODO: Support deep checking (eg. if componentWillMount calls
                // a method like 'fetchData', also check fetchData for subs).
                if (!runsBeforeMount(node)) {
                    return;
                }

                const matcher = generateMatcher(node => {
                    const subscriptionNames = [
                        'then',
                        'addEventListener',
                        'setTimeout',
                        'setInterval',
                    ];

                    const name = get(node, 'expression.callee.name');
                    const propName = get(
                        node,
                        'expression.callee.property.name'
                    );

                    return (
                        subscriptionNames.includes(name) ||
                        subscriptionNames.includes(propName)
                    );
                });

                if (matcher(node)) {
                    return context.report({
                        node,
                        message,
                    });
                }
            },
        };
    },
    __message: message,
};
