const rule = require('../lib/rules/react-no-subscriptions-before-mount');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
    ecmaVersion: 2015,
    parser: 'babel-eslint',
};

const ruleTester = new RuleTester(parserOptions);
const message = rule.__message;
const errors = [message];

const validBecauseNoSubs = `
class MyComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            yadda: 5,
        };
    }

    componentWillMount() {
        console.log('Will mount!');
    }
}`;

const invalidBecausePromiseInConstructor = `
class MyComponent extends Component {
    constructor(props) {
        super(props);

        load().then(components => {
            this.state = {
                yadda: 5,
            };
        });
    }
}`;

const invalidBecausePromiseInCWM = `
class MyComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            yadda: 5,
        };
    }

    componentWillMount() {
        const {load} = this.props;

        load().then(components => {
            this.setState({components});
        });
    }
}`;

const invalidBecauseEventListener = `
class MyComponent extends Component {
    componentWillMount() {
        window.addEventListener('scroll', function() {});
    }
}`;

const invalidBecauseSetTimeoutAsGlobal = `
class MyComponent extends Component {
    componentWillMount() {
        setTimeout(function() {}, 1000);
    }
}`;

const invalidBecauseSetTimeoutAsProperty = `
class MyComponent extends Component {
    componentWillMount() {
        window.setTimeout(function() {}, 1000);
    }
}`;

const invalidBecauseNestedSub = `
class MyComponent extends Component {
    componentWillMount() {
        if (this.whatever = 10) {
            window.addEventListener('scroll', function() {});
        }
    }
}`;

ruleTester.run('bind-react-methods', rule, {
    valid: [
        // validBecauseNoSubs
    ],

    invalid: [
        // invalidBecausePromiseInConstructor,
        // invalidBecausePromiseInCWM,
        // invalidBecauseEventListener,
        // invalidBecauseSetTimeoutAsGlobal,
        // invalidBecauseSetTimeoutAsProperty,
        invalidBecauseNestedSub,
    ].map(code => ({
        code,
        errors: [message],
    }))
});
