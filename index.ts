
import React, { Component } from 'react';

import {
  NativeModules,
  TextInput,
  findNodeHandle,
  AppRegistry,
} from 'react-native';

import { CustomNativeModule } from './type';

const { CustomKeyboard, CustomKeyboardProps }: CustomNativeModule = NativeModules;

const {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
} = CustomKeyboard;

export {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
};

const keyboardTypeRegistry: {
  [key: string]: any
} = {};

export function register(type: string, factory: any) {
  keyboardTypeRegistry[type] = factory;
}

class CustomKeyboardContainer extends Component<{
  tag: any,
  type: string,
}> {
  render() {
    const { tag, type } = this.props;
    const factory = keyboardTypeRegistry[type];
    if (!factory) {
      console.warn(`Custom keyboard type ${type} not registered.`);
      return null;
    }
    const Comp = factory();
    return <Comp tag={ tag } />;
  }
}

AppRegistry.registerComponent("CustomKeyboard", () => CustomKeyboardContainer);

export class CustomTextInput extends Component<CustomKeyboardProps, {}> {
  componentDidMount() {
    install(findNodeHandle(this.input), this.props.customKeyboardType);
  }
  componentWillReceiveProps(newProps: any) {
    if (newProps.customKeyboardType !== this.props.customKeyboardType) {
      install(findNodeHandle(this.input), newProps.customKeyboardType);
    }
  }
  onRef = (ref: any) => {
    this.input = ref;
  };

  render() {
    const { customKeyboardType, ...others } = this.props;
    return <TextInput { ...others } ref = { this.onRef } />;
  }
}