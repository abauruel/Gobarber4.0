import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationError from '../../utils/getValidationErrors';

interface SignInFormData {
  email: string;
  password: string;
}
const Signin: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('email Obrigatorio')
            .email(' Digite um email valido'),
          password: Yup.string().required('Digite o password'),
        });
        await schema.validate(data, { abortEarly: false });
        await signIn({ email: data.email, password: data.password });
        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationError(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na autenticacao',
          description:
            'Ocorreu um erro ao fazer login verifique as credenciais',
        });
      }
    },
    [signIn, addToast, history],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Faça seu login</h1>
            <Input icon={FiMail} name="email" placeholder="e-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="e-mail"
            />
            <Button type="submit">Entrar</Button>
            <a href="forgot">Esqueci minha senha</a>
          </Form>
          <Link to="/signUp">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};
export default Signin;
