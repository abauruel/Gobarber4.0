import React, { useRef, useCallback } from 'react';
import ImagePicker from 'react-native-image-picker';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';
import getValidationError from '../../utils/getValidationError';
import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatarImage,
  BackButton,
  LogoutButton,
  ContainerHeader,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  old_password: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const inputOldPasswordRef = useRef<TextInput>(null);
  const inputNewPasswordRef = useRef<TextInput>(null);
  const inputConfirmPasswordRef = useRef<TextInput>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('nome obrigatorio'),
          email: Yup.string()
            .required('email Obrigatorio')
            .email(' Digite um email valido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.lenght,
            then: Yup.string().min(6).required('Campo obrigatorio'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Password does not match',
          ),
        });
        await schema.validate(data, { abortEarly: false });
        const {
          name,
          email,
          password,
          password_confirmation,
          old_password,
        } = data;
        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };
        const response = await api.put('/profile', formData);

        updateUser(response.data);
        Alert.alert('Cadastro realizado com sucesso');

        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationError(error);
          formRef.current?.setErrors(errors);
        }
        Alert.alert('Erro no Cadastro');
      }
    },
    [navigation, updateUser],
  );
  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar a camera',
        chooseWhichLibraryTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Error ao atualizar seu avatar');
          return;
        }

        const source = { uri: response.uri };
        const data = new FormData();
        data.append('avatar', {
          type: 'image/jpeg',
          name: `user.id.jpg`,
          uri: response.uri,
        });

        api.patch('users', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      },
    );
  }, [updateUser]);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <ContainerHeader>
              <BackButton onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>
              <LogoutButton onPress={handleLogout}>
                <Icon name="log-out" size={24} color="#ff9000" />
              </LogoutButton>
            </ContainerHeader>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatarImage source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <Form ref={formRef} initialData={user} onSubmit={handleSignUp}>
              <View>
                <Title>Meu Perfil</Title>
              </View>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputEmailRef.current?.focus();
                }}
              />
              <Input
                ref={inputEmailRef}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputOldPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={inputOldPasswordRef}
                name="old_password"
                icon="lock"
                placeholder="Senha Atual"
                containerStyle={{ marginTop: 16 }}
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputNewPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={inputNewPasswordRef}
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputConfirmPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={inputConfirmPasswordRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
