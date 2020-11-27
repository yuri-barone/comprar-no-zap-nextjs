import { mainApi as api } from './Api';

const save = async (data: object) => {
  try {
    const response = await api.post('/products', data);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Não foi possível cadastrar seu produto' };
  }
};

const find = async (filter: string, perfilId?:number) => {
  try {
    const args = [];
    if (filter) {
      args.push(`titulo[$iLike]=%${filter.trim().replace(/\s/g, '+')}%`);
    }
    if (perfilId) { args.push(`perfilId=${perfilId}`); }
    const response = await api.get(`/products?${args.join('&')}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const findOptimized = async (filter: string, perfilId?:number, position?:any) => {
  try {
    const args = [];
    if (filter) {
      args.push(`termo=${filter.trim().replace(/\s/g, '+')}`);
    }
    if (perfilId) { args.push(`perfilId=${perfilId}`); }
    args.push('optimized=true');
    if (position) {
      args.push(`lat=${position.latitude}`);
      args.push(`lng=${position.longitude}`);
    }
    const response = await api.get(`/products?${args.join('&')}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const deleteProduct = async (id:number) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Não foi possível excluir seu produto' };
  }
};

const edit = async (id:number, data:any) => {
  try {
    const response = await api.patch(`/products/${id}`, data);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Não foi possível editar seu produto' };
  }
};

const getById = async (id: number) => {
  try {
    const response = await api.get(`/products/${id}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const getAllIds = async () => {
  try {
    const response = await api.get('/get-allproducts-id');
    return { data: response };
  } catch (error) {
    return error;
  }
};

export default {
  save,
  find,
  findOptimized,
  deleteProduct,
  edit,
  getById,
  getAllIds,
};
