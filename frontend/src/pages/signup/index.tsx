import React, { useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { FiUser, FiArrowLeft, FiMail, FiLock } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationError from '../../utils/getValidationErrors';

interface DataProps {
  email: string;
  name: string;
  password: string;
}
const Signup: React.FC = () => {
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
          password: Yup.string().min(6, 'No minimo 6 digitos'),
        });
        await schema.validate(data, { abortEarly: false });

        await api.post('users', {
          name: data.name,
          email: data.email,
          password: data.password,
        });

        addToast({
          type: 'success',
          title: 'Cadastro realizado com sucesso!',
          description: 'Seu cadastro foi efetuado com sucesso, realize o logon',
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
          title: 'Falhar ao realizar cadastro',
          description: 'Nao foi possivel realizar o cadastro, tente novamente',
        });
      }
    },
    [addToast, history],
  );
  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Faça seu Cadastro</h1>
            <Input icon={FiUser} name="name" placeholder="nome" />
            <Input icon={FiMail} name="email" placeholder="e-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="password"
            />
            <Button type="submit">Entrar</Button>
            <a href="forgot">Esqueci minha senha</a>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para Login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Signup;
