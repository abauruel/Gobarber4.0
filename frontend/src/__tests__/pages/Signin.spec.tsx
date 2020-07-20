import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import SignIn from '../../pages/signin';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
const mockedSigIn = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock('../../hooks/Auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSigIn,
    }),
  };
});
jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SigIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });
  it('it should be able to signin', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('e-mail');
    const passwordField = getByPlaceholderText('password');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('it should not be able to signin with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('e-mail');
    const passwordField = getByPlaceholderText('password');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not email valid' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('it should show error when login failed', async () => {
    mockedSigIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('e-mail');
    const passwordField = getByPlaceholderText('password');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
