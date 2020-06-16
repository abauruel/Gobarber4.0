import React, { useEffect } from 'react';
import {
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
} from 'react-icons/fi';
import { Container } from './styles';
import { useToast, ToastMessage } from '../../../hooks/Toast';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const infos = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => clearImmediate(timer);
  }, [removeToast, message.id]);

  return (
    <Container
      key={message.id}
      hasdescription={Number(!!message.description)}
      type={message.type}
      style={style}
    >
      {infos[message.type]}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>
      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
