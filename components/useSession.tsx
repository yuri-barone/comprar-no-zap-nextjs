import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { configureMainApi } from './services/Api';
import perfisService from './services/perfisService';

export const PDZToken = 'PDZT';
export const PDZUsername = 'PDZU';

export const keepSession = (username: string, token: string) => {
  localStorage.setItem(PDZToken, token);
  localStorage.setItem(PDZUsername, username);
  configureMainApi(token);
};

const useSession = (loginRequired?: boolean) => {
  const router = useRouter();
  const noop = () => {};
  const unauthenticatedState: any = {
    loadProfile: noop,
    isAutheticated: false,
    username: undefined,
    token: undefined,
    profile: { loaded: false },
  };
  const [session, setSession] = useState<any>(unauthenticatedState);

  const loadProfile = async (userId: number) => {
    const response = await perfisService.getPerfilByUserId(userId);
    setSession({
      ...session,
      isAutheticated: true,
      profile: { ...response.data.data[0], loaded: true },
    });
    return response.data.data[0];
  };

  const buildSession = () => {
    const token = localStorage.getItem(PDZToken);
    const username = localStorage.getItem(PDZUsername);
    if (!token && loginRequired) {
      router.push('/entrar');
    }
    if (!token) {
      setSession(unauthenticatedState);
      return;
    }
    const decoded: any = jwt_decode(token);
    const userId = decoded.sub;
    setSession({
      username,
      token,
      isAutheticated: true,
      profile: { loaded: false },
    });
    configureMainApi(token);
    loadProfile(userId);
  };

  const initializeSession = () => {
    if (!session.isAutheticated) {
      buildSession();
    }
  };

  useEffect(() => {
    initializeSession();
  }, [session]);

  return session;
};

export default useSession;
