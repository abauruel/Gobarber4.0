import React, { createContext, useCallback, useContext, useState } from 'react';
import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  title: string;
  type: 'error' | 'success' | 'info';
  description: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid();
      const toast = {
        id,
        type,
        title,
        description,
      };
      setMessage(state => [...state, toast]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setMessage(state => state.filter(toast => toast.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={message} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  return context;
}

export { useToast, ToastProvider };
