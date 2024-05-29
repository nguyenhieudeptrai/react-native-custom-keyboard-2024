import { TextInputProps } from 'react-native';

export type CustomNativeModule = {
    CustomKeyboard: {
        install: () => void,
        uninstall: () => void,
        insertText: () => void,
        backSpace: () => void,
        doDelete: () => void,
        moveLeft: () => void,
        moveRight: () => void,
        switchSystemKeyboard: () => void,
    }
}

export type CustomKeyboardProps = TextInputProps & {
    customKeyboardType?: boolean
}