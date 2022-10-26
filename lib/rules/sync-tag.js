const path = require("path");

const util = require("../util.js");

const PKG_ROOT = path.join(__dirname, "..", "..");
const CHECKSYNC_PATH = path.join(PKG_ROOT, "node_modules", ".bin", "checksync");

const UPDATE_REMINDER =
    "If necessary, check the sync-tag target and make relevant changes before updating the checksum.";

const processItem = (item, node, context, comments) => {
    if (item.sourceLine && item.message) {
        const line = item.sourceLine;
        const comment = comments.find(
            comment => comment.loc.start.line === line,
        );

        if (item.fix) {
            context.report({
                node: comment,
                message: `${item.message} ${UPDATE_REMINDER}`,
                fix(fixer) {
                    return fixer.replaceText(comment, item.fix.trim());
                },
            });
        } else {
            context.report({
                node: comment,
                message: item.message,
            });
        }
    } else if (item.message) {
        context.report({
            node: node,
            message: `${item.message} ${UPDATE_REMINDER}`,
        });
    } else {
        // eslint-disable-next-line no-console
        console.error(`Unknown item type ${item.type}`);
    }
};

const getCommandForFilename = (
    {configFile, ignoreFiles, rootDir},
    filename,
) => {
    const ignoreFilesArg = ignoreFiles ? `--ignore-files ${ignoreFiles}` : "";
    const configFileArg = configFile
        ? `--config ${path.join(rootDir, configFile)}`
        : "";

    return `${CHECKSYNC_PATH} ${filename} ${configFileArg} ${ignoreFilesArg} --json`;
};

module.exports = {
    meta: {
        docs: {
            description: "Ensure sync tags are valid",
        },
        schema: [
            {
                type: "object",
                properties: {
                    ignoreFiles: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                    rootDir: {
                        type: "string",
                    },
                    configFile: {
                        type: "string",
                    },
                },
            },
        ],
        fixable: "code",
    },

    create(context) {
        const configFile = context.options[0].configFile;
        const ignoreFiles = (context.options[0].ignoreFiles || []).join(",");
        const rootDir = context.options[0].rootDir;
        if (!rootDir) {
            throw new Error("rootDir must be set");
        }

        return {
            Program(node) {
                const syncStartComments = node.comments.filter(comment =>
                    comment.value.trim().startsWith("sync-start:"),
                );

                const shouldChecksync = syncStartComments.length > 0;

                if (shouldChecksync) {
                    const filename = path.relative(
                        rootDir,
                        context.getFilename(),
                    );

                    const command = getCommandForFilename(
                        {configFile, ignoreFiles, rootDir},
                        filename,
                    );
                    const stdout = util.execSync(command, {
                        cwd: rootDir,
                        encoding: "utf-8",
                    });

                    try {
                        const data = JSON.parse(stdout);
                        for (const item of data.items) {
                            processItem(item, node, context, syncStartComments);
                        }
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                        return;
                    }
                }
            },
        };
    },
};
