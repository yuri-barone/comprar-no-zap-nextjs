import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import PerfilScreen from '../components/PerfilScreen/PerfilScreen';
import perfisService from '../components/services/perfisService';
import useSession from '../components/useSession';

const editPerfil = () => {
  const [perfil, setPerfil] = useState<any>();
  const Router = useRouter();

  const getPerfil = async (userId?: number) => {
    try {
      const response = await perfisService.getPerfilByUserId(userId);
      setPerfil(response.data.data[0]);
    } catch (error) {
      Router.push('/');
    }
  };

  const searchPerfil = () => {
    const token = localStorage.getItem('PDZT');
    if (token) {
      const decoded: any = jwt_decode(token);
      const userId = decoded.sub;
      getPerfil(userId);
    }
  };

  useSession(true);
  useEffect(() => {
    searchPerfil();
  }, []);

  return (
    <>
      {perfil && (
        <PerfilScreen
          src={perfil['picture.imgBase64']}
          zap={perfil.zap}
          nome={perfil.nome}
          endereco={perfil.endereco}
          id={perfil.id}
          searchNewPerfil={searchPerfil}
          seller={perfil.seller}
          userId={perfil.userId}
          delivery={perfil.delivery}
        />
      )}
    </>
  );
};

export default editPerfil;
