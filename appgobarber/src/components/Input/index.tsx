import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';
import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
}
interface InputValueReference {
  value: string;
}
interface InputRef {
  focus(): void;
}
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);
  const { registerField, defaultValue = '', error, fieldName } = useField(name);
  const inputvalueRef = useRef<InputValueReference>({ value: defaultValue });
  const [isFocused, setIsfocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsfocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsfocused(false);

    setIsFilled(!!inputvalueRef.current.value);
  }, []);
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));
  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputvalueRef.current,
      path: 'value',
      // setValue(ref: any, value) {
      //   inputvalueRef.current.value = value;
      //   inputElementRef.current.setNativeProps({ text: value });
      // },
      // clearValue() {
      //   inputvalueRef.current.value = '';
      //   inputElementRef.current.clear();
      // },
    });
  }, [fieldName, registerField]);
  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        onChangeText={value => {
          inputvalueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
