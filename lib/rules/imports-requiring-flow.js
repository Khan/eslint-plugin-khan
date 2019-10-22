const path = require("path");

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
                    packages: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
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
        const packages = context.options[1].packages || [];
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
                    if (packages.includes(node.source.value)) {
                        const message = `Importing "${node.source.value}" requires using flow.`;
                        context.report({
                            node: node,
                            message: message,
                        });
                    }
                    for (const module of modules) {
                        if (!node.source.value.startsWith(".")) {
                            continue;
                        }
                        const absImportPath = path.join(
                            path.dirname(filename),
                            node.source.value,
                        );
                        if (module === absImportPath) {
                            const message = `Importing "${node.source.value}" requires using flow.`;
                            context.report({
                                node: node,
                                message: message,
                            });
                        }
                    }
                }
            },
        };
    },
};
