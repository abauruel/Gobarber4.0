import React, { useRef, useCallback, useState } from 'react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logo from '../../assets/logo.svg';

import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationError from '../../utils/getValidationErrors';

interface ForgotPasswordData {
  email: string;
}
const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('email Obrigatorio')
            .email(' Digite um email valido'),
        });
        await schema.validate(data, { abortEarly: false });

        const response = await api.post('password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Recuperação de senha',
          description: 'E-mail de recuperação de senha enviado com sucesso',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationError(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'E-mail obrigatorio',
          description: 'Por favor insira um e-mail valido',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Recuperação de senha</h1>
            <Input icon={FiMail} name="email" placeholder="e-mail" />
            <Button loading={loading} type="submit">
              Enviar
            </Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};
export default ForgotPassword;
