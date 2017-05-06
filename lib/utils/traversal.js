const {get} = require('lodash');


const generateMatcher = matcher => {
    return function findMatch(node) {
        console.log('Checking', node)
        // Check for a match on this node
        if (matcher(node)) {
            return true;
        }

        // Check for any children to traverse through.
        // If there are no children, and this node doesn't match, return false.
        const body =
            node.body ||
            node.consequent ||
            (node.value && node.value.body);

        if (!body) {
            return false;
        }

        // Nodes can have 1 or several children. Let's standardize it by
        // wrapping single children in an array.
        const singleChild = body && !Array.isArray(body);
        const children = singleChild ? [body] : body;

        // We want to return true if any of the children return true.
        return children.find(findMatch);
    };
};

module.exports = {
    generateMatcher,
};
