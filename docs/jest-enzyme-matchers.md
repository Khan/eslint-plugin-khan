# Require the use of enzyme matchers when possible (jest-enzyme-matchers)

[jest-enzyme](https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-enzyme#readme)
provides a number of matchers that useful when writing enzyme tests.  Using these
matchers providers better error messages when there are test failures.  This rule
supporters auto-fixing.

## Rule Details

The following are considered warnings:

```js
expect(wrapper.first().prop("foo")).toEqual("bar");
```

```js
expect(wrapper.first().state("foo")).toEqual("bar");
```

```js
expect(wrapper.find(".foo")).toHaveLength(2);
```

```js
expect(wrapper.find(".foo").text()).toEqual("bar");
```

```js
expect(wrapper.find(".foo").html()).toEqual("<p>bar</p>");
```

```js
expect(wrapper.find(".foo").exists()).toBeTrue();
```

```js
expect(wrapper.exists(".foo")).toBeTrue();
```

```js
expect(wrapper.find(".foo").exists()).toBeFalse();
```

```js
expect(wrapper.exists(".foo")).toBeFalse();
```

The following are not considered warnings:

```js
expect(wrapper).toHaveProp("foo", "bar");
```

```js
expect(wrapper).toHaveState("foo", "bar");
```

```js
expect(wrapper).toContainMatchingElements(2, ".foo");
```

```js
expect(wrapper.find(".foo")).toHaveText("bar");
```

```js
expect(wrapper.find(".foo")).toHaveHTML("<p>bar</p>");
```

```js
expect(wrapper.find(".foo")).toExist();
```

```js
expect(wrapper).toContainMatchingElement(".foo");
```
