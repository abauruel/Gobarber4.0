import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  width: auto;
  height: 60px;
  border-radius: 10px;
  background: #ff9000;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
`;
export const ButtonText = styled.Text`
  font-size: 18px;
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
`;
