const path = require("path");

const checkImport = (context, rootDir, importPath, node) => {
    const modules = context.options[0].modules || [];

    for (const mod of modules) {
        if (importPath.startsWith(".")) {
            const filename = context.getFilename();
            const absImportPath = path.join(path.dirname(filename), importPath);
            const absModPath = path.join(rootDir, mod);
            if (absModPath === absImportPath) {
                const message = `Importing "${importPath}" requires using flow.`;
                context.report({
                    node: node,
                    message: message,
                });
                break;
            }
        } else {
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
                type: "object",
                properties: {
                    modules: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                    rootDir: {
                        type: "string",
                    },
                },
            },
        ],
    },

    create(context) {
        const modules = context.options[0].modules || [];
        const rootDir = context.options[0].rootDir;
        if (!rootDir) {
            throw new Error("rootDir must be set");
        }
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
                if (!usingFlow) {
                    const importPath = node.source.value;
                    checkImport(context, rootDir, importPath, node);
                }
            },
            CallExpression(node) {
                const {callee, arguments: args} = node;
                if (callee.type === "Identifier" && callee.name === "require") {
                    if (args[0] && args[0].type === "Literal") {
                        const importPath = args[0].value;
                        checkImport(context, rootDir, importPath, node);
                    }
                }
            },
        };
    },
};
