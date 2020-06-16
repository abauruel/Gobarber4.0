import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { FiUser, FiLock, FiMail, FiCamera, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Content, AvatarInput } from './styles';

import api from '../../services/api';
import { useToast } from '../../hooks/Toast';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationError from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/Auth';

interface DataProps {
  email: string;
  name: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}
const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const handleSubmit = useCallback(
    async (data: DataProps) => {
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
        const response = await api.put('profile', formData);
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso!',
          description: 'Seu perfil foi atualizado com sucesso!',
        });
        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationError(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Falhar ao atualizar o perfil',
          description: 'Nao foi possivel atualizar o perfil, tente novamente',
        });
      }
    },
    [addToast, history],
  );
  const handleUpdateAvatar = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const data = new FormData();
      if (event.target.files) {
        data.append('avatar', event.target.files[0]);
      }
      api.patch('users', data).then(response => {
        updateUser(response.data);
      });
    },
    [updateUser],
  );
  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <AvatarInput>
          <img src={user.avatar_url} alt={user.name} />
          <label htmlFor="avatar">
            <FiCamera />
            <input type="file" id="avatar" onChange={handleUpdateAvatar} />
          </label>
        </AvatarInput>
        <Form
          onSubmit={handleSubmit}
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <h1>Meu perfil</h1>
          <Input icon={FiUser} name="name" placeholder="nome" />
          <Input icon={FiMail} name="email" placeholder="e-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Senha atual"
          />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Nova senha"
          />
          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="password"
          />
          <Button type="submit">Confirmar alterações</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
