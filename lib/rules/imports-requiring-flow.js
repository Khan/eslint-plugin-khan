const path = require("path");

const checkImport = (context, importPath, node) => {
    const modules = context.options[1].modules || [];
    const filename = context.getFilename();

    for (const mod of modules) {
        if (importPath.startsWith(".")) {
            const absImportPath = path.join(path.dirname(filename), importPath);
            if (mod === absImportPath) {
                const message = `Importing "${importPath}" requires using flow.`;
                context.report({
                    node: node,
                    message: message,
                });
                break;
            }
        } else {
            console.log(`mod = ${mod}, importPath = ${importPath}`);
            if (mod === importPath) {
                const message = `Importing "${importPath}" requires using flow.`;
                context.report({
                    node: node,
                    message: message,
                });
                break;
            }
        }
    }
};

module.exports = {
    meta: {
        docs: {
            description: "Require flow when using certain imports",
            category: "flow",
            recommended: false,
        },
        schema: [
            {
                enum: ["always", "never"],
            },
            {
                type: "object",
                properties: {
                    modules: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
            },
        ],
    },

    create(context) {
        const configuration = context.options[0] || "never";
        const modules = context.options[1].modules || [];
        const source = context.getSource();
        const filename = context.getFilename();

        let usingFlow = false;

        return {
            Program(node) {
                usingFlow = node.comments.some(
                    comment => comment.value.trim() === "@flow",
                );
            },
            ImportDeclaration(node) {
                if (configuration === "always" && !usingFlow) {
                    const importPath = node.source.value;
                    checkImport(context, importPath, node);
                }
            },
            CallExpression(node) {
                const {callee, arguments: args} = node;
                if (callee.type === "Identifier" && callee.name === "require") {
                    if (args[0] && args[0].type === "Literal") {
                        const importPath = args[0].value;
                        checkImport(context, importPath, node);
                    }
                }
            },
        };
    },
};
