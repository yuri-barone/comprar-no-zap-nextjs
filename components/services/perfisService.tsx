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

const getAllDomains = async () => {
  try {
    const response = await api.get('/all-domains');
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const checkDomain = async (domain:string) => {
  try {
    const response = await api.get(`/get-domain-owner/${domain}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const checkZap = async (zap:string) => {
  try {
    const response = await api.get(`/get-already-existed-zap/${zap}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const find = async (filter: string) => {
  try {
    const args = [];
    if (filter) {
      args.push(`termo=${filter.trim().replace(/\s/g, '+')}`);
    }
    args.push('optimized=true');
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

const getPerfilByDomain = async (domain: string) => {
  try {
    const response = await api.get(`/perfis/?domain=${domain}`);
    return { data: response.data.data[0] };
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
  getAllDomains,
  getPerfilByDomain,
  checkDomain,
  checkZap,
};
