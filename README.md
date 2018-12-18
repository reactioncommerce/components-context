# @reactioncommerce/components-context

![npm (scoped)](https://img.shields.io/npm/v/@reactioncommerce/components-context.svg)
 [![CircleCI](https://circleci.com/gh/reactioncommerce/components-context.svg?style=svg)](https://circleci.com/gh/reactioncommerce/components-context)

A system for injecting React components into other React components from a central components context.

This package allows your component to have all of its component dependencies injected without the user having to inject them everywhere the component is used.

## Install

```sh
npm install @reactioncommerce/components-context
```

## Usage

If you're using a component library that expects components context, then all you need to do is import `ComponentsProvider` from this package, wrap your entire React app with it, and pass your components object as the `value` prop. See `appComponents.js` and `App.js` below.

If you're creating a component that uses components from context, your component should expect a prop named `components` that is a map of component names to the components. This could be a string like "div" for a built-in DOM component, a React component class, or in some cases even a React component instance that your component will clone. Then import the `withComponents` HOC and wrap your component with it.

_SaveButton.js_

```jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withComponents } from "@reactioncommerce/components-context";

class SaveButton extends Component {
  static propTypes = {
    components: PropTypes.shape({
      Button: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    }).isRequired
  };

  render() {
    const { Button } = this.props.components;
    return <Button>Save</Button>;
  }
}

export default withComponents(SaveButton);
```

_MyPage.js_

```jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import SaveButton from "./SaveButton";

class MyPage extends Component {
  render() {
    return (
      <div>
        {/* other elements */}
        <SaveButton/>
      </div>
    );
  }
}

export default MyPage;
```

_appComponents.js_

```js
import Button from "@reactioncommerce/components/Button/v1";

export default {
  Button
};
```

_App.js_

```jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ComponentsProvider } from "@reactioncommerce/components-context";
import appComponents from "./appComponents";
import MyPage from "./MyPage";

class App extends Component {
  render() {
    return (
      <ComponentsProvider value={appComponents}>
        <MyPage />
      </ComponentsProvider
    );
  }
}

export default App;
```

### Component-Specific Overrides

If you want all instances of a certain component to receive a component that is different from the rest of your app, you can prefix the key in the components context with that component's name and an underscore.

For example, if you have an `AddressForm` component that uses the `Button` component from its `components` prop, it would normally get that from the `Button` property of the components context. However, if you want all instances of `AddressForm` to use a different button component, but the rest of your app to use the normal button component, you would set `{ AddressForm_Button: OtherButton }` in the components context and leave the `Button` property unchanged.

## Commit Messages

To ensure that all contributors follow the correct message convention, each time you commit your message will be validated with the [commitlint](https://www.npmjs.com/package/@commitlint/cli) package, enabled by the [husky](https://www.npmjs.com/package/husky) Git hooks manager.

Examples of commit messages: https://github.com/semantic-release/semantic-release

## Publication to NPM

The `@reactioncommerce/components-context` package is automatically published by CI when commits are merged or pushed to the `master` branch. This is done using [semantic-release](https://www.npmjs.com/package/semantic-release), which also determines version bumps based on conventional Git commit messages.

## License

Copyright 2018 Reaction Commerce

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
