import styled from 'styled-components/native';

import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;
export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';

  margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
`;
export const UserAvatarImage = styled.Image`
  height: 186px;
  width: 186px;
  border-radius: 93px;

  align-self: center;
`;

export const ContainerHeader = styled.View`
  margin-top: 40px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const BackButton = styled.TouchableOpacity``;

export const LogoutButton = styled.TouchableOpacity`
  margin-right: 24px;
`;
