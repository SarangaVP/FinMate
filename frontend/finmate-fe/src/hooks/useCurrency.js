import { useAuth } from '../context/AuthContext';

export const useCurrency = () => {
  const { user } = useAuth();
  return user?.currency || 'LKR';
};
