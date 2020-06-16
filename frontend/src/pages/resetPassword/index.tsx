import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logo from '../../assets/logo.svg';

import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationError from '../../utils/getValidationErrors';

interface ResetpassworData {
  password: string;
  password_confirmation: string;
}
const Signin: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetpassworData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Digite o password'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Password does not match',
          ),
        });
        await schema.validate(data, { abortEarly: false });
        const token = location.search.replace('?token=', '');
        const { password, password_confirmation } = data;
        if (!token) {
          throw new Error();
        }

        await api.post('password/reset', {
          password,
          password_confirmation,
          token,
        });
        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationError(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar a senha, tente novamente',
        });
      }
    },
    [addToast, history, location.search],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Alterar senha</h1>

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="password"
            />
            <Input
              icon={FiLock}
              name="password_confirmation"
              type="password"
              placeholder="Confirmação de senha"
            />
            <Button type="submit">Salvar</Button>
          </Form>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};
export default Signin;
