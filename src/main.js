import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

/**
 * @see https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
 * @param {Object} HOC The higher-order component
 * @param {Object} WrappedComponent The wrapped component
 * @returns {undefined}
 */
function wrapDisplayName(HOC, WrappedComponent) {
  const innerDisplayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
  HOC.displayName = `WithComponents(${innerDisplayName})`;
}

const ComponentsContext = React.createContext();

export const ComponentsProvider = ComponentsContext.Provider;

/**
 * @name withComponents
 * @method
 * @param {React.Component} Component A React component class
 * @param {String} [prefix] A prefix to look for on keys of the components object, to
 *   override the primary component. Default is `Component.name`
 * @returns {React.Component} A new React component that wraps the passed in component,
 *   passing it a `components` prop from the nearest `ComponentsProvider`. If the
 *   `components` prop is provided already, the two objects are merged with
 *   the prop overriding the context.
 */
export function withComponents(Component, prefix = Component.name) {
  const WithComponents = React.forwardRef((props, ref) => (
    <ComponentsContext.Consumer>
      {(componentsFromContext) => {
        const { components: componentsFromProps, ...otherProps } = props;

        let components = null;
        if (componentsFromContext || componentsFromProps) {
          components = {
            ...(componentsFromContext || {}),
            ...(componentsFromProps || {})
          };

          // Look for prefix overrides. For example, wrapping a component named
          // ContactForm that uses the `Button` component, it would look for
          // `ContactForm_Button` component and pass that as the `components.Button` instead
          // if found.
          if (prefix) {
            Object.keys(componentsFromContext || {}).forEach((name) => {
              const namePieces = name.split("_");
              if (namePieces[0] === prefix) {
                components[namePieces[1]] = componentsFromContext[name];
              }
            });
          }
        }

        return <Component ref={ref} {...otherProps} components={components} />;
      }}
    </ComponentsContext.Consumer>
  ));

  // https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
  hoistNonReactStatics(WithComponents, Component);

  // https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
  wrapDisplayName(WithComponents, Component);

  return WithComponents;
}
