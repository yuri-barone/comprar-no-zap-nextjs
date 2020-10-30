import { mainApi as api } from './Api';
import perfisService from './perfisService';

const login = async (data:object) => {
  try {
    const response = await api.post('/authentication', data);
    const perfil = await perfisService.getPerfilByUserId(response.data.user.id);
    return { ok: true, data: response.data.accessToken, perfil: perfil.data.data[0] };
  } catch (error) {
    return { ok: false, erro: 'Login ou senha inválido' };
  }
};

export default {
  login,
};
