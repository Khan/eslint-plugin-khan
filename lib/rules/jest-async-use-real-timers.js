const t = require("@babel/types");

const findBeforeEach = describeCall => {
    const funcExpr = describeCall.arguments[1];
    if (funcExpr) {
        for (const stmt of funcExpr.body.body) {
            if (t.isExpressionStatement(stmt)) {
                const expr = stmt.expression;
                if (t.isCallExpression(expr) && t.isIdentifier(expr.callee, {name: "beforeEach"})) {
                    return expr;
                }
            }
        }
    }
    return null;
}

const usesRealTimers1 = (beforeEachCall) => {
    if (beforeEachCall == null) {
        return false;
    }
    const funcExpr = beforeEachCall.arguments[0];

    if (funcExpr) {
        for (const stmt of funcExpr.body.body) {
            if (t.isExpressionStatement(stmt)) {
                const expr = stmt.expression;
                if (t.isCallExpression(expr) && t.isMemberExpression(expr.callee)) {
                    const {object, property} = expr.callee;
                    if (t.isIdentifier(object, {name: "jest"}) && t.isIdentifier(property, {name: "useRealTimers"}));
                    return true;
                }
            }
        }
    }
    return false;
}

const usesRealTimers2 = (itCall) => {
    if (itCall == null) {
        return false;
    }
    const funcExpr = itCall.arguments[1];

    if (funcExpr) {
        for (const stmt of funcExpr.body.body) {
            if (t.isExpressionStatement(stmt)) {
                const expr = stmt.expression;
                if (t.isCallExpression(expr) && t.isMemberExpression(expr.callee)) {
                    const {object, property} = expr.callee;
                    if (t.isIdentifier(object, {name: "jest"}) && t.isIdentifier(property, {name: "useRealTimers"}));
                    return true;
                }
            }
        }
    }
    return false;
}

const isAsync = itCall => {
    return t.isArrowFunctionExpression(itCall.arguments[1], {async: true}) ||
        t.isFunctionExpression(itCall.arguments[1], {async: true});
}

module.exports = {
    meta: {
        docs: {
            description: "Ensure that SVG paths don't use too many decimal places",
            category: "react",
            recommended: false,
        },
        // fixable: "code",
        // schema: [
        //     {
        //         type: "object",
        //         properties: {
        //             precision: {
        //                 type: "number"
        //             }
        //         },
        //         additionalProperties: false
        //     },
        // ],
    },

    create(context) {
        const stack = [];
        let isUsingRealTimers = false;
        
        return {
            CallExpression(node) {
                if (t.isIdentifier(node.callee, {name: "describe"})) {
                    stack.push(usesRealTimers1(findBeforeEach(node)));
                } else if (t.isIdentifier(node.callee, {name: "it"}) && isAsync(node)) {
                    if (stack.length > 0) {
                        if (!stack.some(Boolean) && !usesRealTimers2(node)) {
                            context.report({
                                node,
                                message: "Async tests require jest.useRealTimers()."
                            })
                        }
                    }
                }
            },

            "CallExpression:exit"(node) {
                if (t.isIdentifier(node.callee, {name: "describe"})) {
                    stack.pop();
                }
            }


            // JSXAttribute(node) {
            //     if (t.isJSXAttribute(node) && t.isJSXIdentifier(node.name, {name: "d"})) {
            //         if (t.isJSXOpeningElement(node.parent) && t.isJSXIdentifier(node.parent.name, {name: "path"})) {
            //             const d = node.value.value;

            //             if (regex.test(d)) {
            //                 context.report({
            //                     fix(fixer) {
            //                         const replacementText = d.replace(
            //                             regex, 
            //                             (match) => parseFloat(match).toFixed(precision),
            //                         );
        
            //                         return fixer.replaceText(node.value, replacementText);
            //                     },
            //                     node,
            //                     message:
            //                         "This path contains numbers with too many decimal places.",
            //                 });
            //             }
            //         }
            //     }
            // },
        };
    },
};
