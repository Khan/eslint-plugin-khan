module.exports = {
    meta: {
        docs: {
            description: 'Disallow use of async/await',
            category: 'ES2015+ features',
            recommended: false
        },
        schema: [{
            enum: ['always', 'never']
        }]
    },

    create: function (context) {

        var configuration = context.options[0] || 'never';
        var message = 'async functions are not allowed';

        return {
            FunctionDeclaration: function(node) {
                if (node.async && configuration === 'always') {
                    context.report({
                        node: node,
                        message: message,
                    });
                }
            },
            FunctionExpression: function(node) {
                if (node.async && configuration === 'always') {
                    context.report({
                        node: node,
                        message: message,
                    });
                }
            }
        };
    }
};
