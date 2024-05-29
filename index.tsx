
import React, { Component } from 'react';

import {
  NativeModules,
  TextInput,
  findNodeHandle,
  AppRegistry,
  TextInputProps
} from 'react-native';

export type CustomNativeModule = {
  install: (tag: any, type: any) => void,
  uninstall: (tag: any) => void,
  insertText: (tag: any, text: string | number) => void,
  backSpace: (tag: any) => void,
  doDelete: (tag: any) => void,
  moveLeft: (tag: any) => void,
  moveRight: (tag: any) => void,
  switchSystemKeyboard: (tag: any) => void,
}

export type CustomKeyboardProps = TextInputProps & {
  customKeyboardType?: boolean
}

const { CustomKeyboard } = NativeModules as {
  CustomKeyboard: CustomNativeModule
};

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
    return <Comp tag={tag} />;
  }
}

AppRegistry.registerComponent("CustomKeyboard", () => CustomKeyboardContainer);

export class CustomTextInput extends Component<CustomKeyboardProps, {}> {
  inputRef = React.createRef<TextInput>();
  timeoutId: NodeJS.Timeout | null = null;
  componentDidMount() {
    this.installCustomKeyboard(this.inputRef.current, this.props.customKeyboardType);
  }

  componentDidUpdate(prevProps: CustomKeyboardProps) {
    if (prevProps.customKeyboardType !== this.props.customKeyboardType) {
      this.installCustomKeyboard(this.inputRef.current, this.props.customKeyboardType);
    }
  }

  installCustomKeyboard(textInput: TextInput | null, customKeyboardType: string = "") {
    this.timeoutId = setTimeout(() => {
      install(findNodeHandle(textInput), customKeyboardType);
    }, 200);
  }

  render() {
    const { customKeyboardType, ...others } = this.props;
    return <TextInput {...others} ref={this.inputRef} />;
  }
}