import { mainApi as api } from './Api';

const save = async (data: object) => {
  try {
    const response = await api.post('/perfis', data);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Seu cadastro não pode ser finalizado' };
  }
};

const get = async (id: number) => {
  try {
    const response = await api.get(`/perfis/${id}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const find = async (filter: string) => {
  try {
    const args = [];
    if (filter) {
      args.push(`nome[$iLike]=%${filter.trim().replace(/\s/g, '+')}%`);
    }
    const response = await api.get(`/perfis?${args.join('&')}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const edit = async (id:number, data: object) => {
  try {
    const response = await api.patch(`/perfis/${id}`, data);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: error };
  }
};

const getPerfilByUserId = async (id: number) => {
  try {
    const response = await api.get(`/perfis/?userId=${id}`);

    return { data: response.data };
  } catch (error) {
    return error;
  }
};

export default {
  save,
  find,
  edit,
  get,
  getPerfilByUserId,
};
