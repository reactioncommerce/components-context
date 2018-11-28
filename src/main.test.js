import React, { Component } from "react";
import renderer from "react-test-renderer";
import { ComponentsProvider, withComponents } from "./main";

class MyComponent extends Component {
  static someStaticProp = "foo";
  static displayName = "MyComponent";

  render() {
    return JSON.stringify(this.props.components);
  }
}

const MyWrappedComponent = withComponents(MyComponent);

test("passes components from context in components prop", () => {
  const contextComponents = { foo: "bar" };
  const component = renderer.create(<ComponentsProvider value={contextComponents}><MyWrappedComponent /></ComponentsProvider>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("merges components from context with components prop", () => {
  const contextComponents = { abc: "123" };
  const instanceComponents = { xyz: "321" };
  const component = renderer.create(<ComponentsProvider value={contextComponents}><MyWrappedComponent components={instanceComponents} /></ComponentsProvider>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("components prop key overwrites context key", () => {
  const contextComponents = { Button: "div" };
  const instanceComponents = { Button: "p" };
  const component = renderer.create(<ComponentsProvider value={contextComponents}><MyWrappedComponent components={instanceComponents} /></ComponentsProvider>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("prefixed key overwrites main context key", () => {
  const contextComponents = { Button: "div", MyComponent_Button: "p" }; /* eslint-disable-line camelcase */
  const component = renderer.create(<ComponentsProvider value={contextComponents}><MyWrappedComponent /></ComponentsProvider>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("no errors when components context is missing", () => {
  const instanceComponents = { Button: "p" };
  const component = renderer.create(<MyWrappedComponent components={instanceComponents} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("no errors and `components` prop is null when all components are missing", () => {
  const component = renderer.create(<MyWrappedComponent />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("preserves non-React static properties", () => {
  expect(MyWrappedComponent.someStaticProp).toBe("foo");
});

test("wraps display name", () => {
  expect(MyWrappedComponent.displayName).toBe("WithComponents(MyComponent)");
});
