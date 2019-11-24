const t = require("@babel/types");

const isReactClassComponent = node => {
    if (t.isClassDeclaration(node)) {
        const {superClass} = node;
        if (t.isMemberExpression(superClass)) {
            const {object, property} = superClass;
            if (
                t.isIdentifier(object, {name: "React"}) &&
                t.isIdentifier(property, {name: "Component"})
            ) {
                return true;
            }
        }
    }
    return false;
};

const isReactFunctionalComponent = node => {
    if (t.isArrowFunctionExpression(node)) {
        if (
            node.params.length === 1 &&
            t.isIdentifier(node.params[0], {name: "props"})
        ) {
            return true;
        }
    }
};

const maybeReport = (node, props, typeAliases, context) => {
    if (t.isGenericTypeAnnotation(props)) {
        const {name} = props.id;
        const alias = typeAliases.get(name);
        if (alias && !alias.right.exact) {
            const sourceCode = context.getSource();
            context.report({
                fix(fixer) {
                    const right = alias.right;
                    const rightText = sourceCode.slice(
                        right.range[0] + 1,
                        right.range[1] - 1,
                    );
                    const replacementText = `{|${rightText}|}`;

                    return fixer.replaceText(alias.right, replacementText);
                },
                node: node,
                message: `"${name}" type should be exact`,
            });
        }
    }
};

module.exports = {
    meta: {
        docs: {
            description: "Prefer exact object type for react props",
            category: "flow",
            recommended: false,
        },
        fixable: "code",
    },

    create(context) {
        const configuration = context.options[0] || "never";
        const typeAliases = new Map();

        return {
            TypeAlias(node) {
                const ancestors = context.getAncestors();
                if (
                    t.isProgram(node.parent) &&
                    t.isObjectTypeAnnotation(node.right)
                ) {
                    typeAliases.set(node.id.name, node);
                }
            },
            ClassDeclaration(node) {
                if (isReactClassComponent(node)) {
                    const {superTypeParameters} = node;
                    if (t.isTypeParameterInstantiation(superTypeParameters)) {
                        const props = superTypeParameters.params[0];
                        maybeReport(node, props, typeAliases, context);
                    }
                }
            },
            ArrowFunctionExpression(node) {
                if (isReactFunctionalComponent(node)) {
                    const {typeAnnotation} = node.params[0];
                    if (t.isTypeAnnotation(typeAnnotation)) {
                        const props = typeAnnotation.typeAnnotation;
                        maybeReport(node, props, typeAliases, context);
                    }
                }
            },
        };
    },
};
