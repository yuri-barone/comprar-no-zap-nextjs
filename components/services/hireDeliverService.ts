import { mainApi as api } from './Api';

const save = async (hireDeliverData:any) => {
  try {
    const response = await api.post('/hire-delivery', hireDeliverData);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Sua requisição de delivery não pode ser finalizada' };
  }
};

const getById = async (id:number) => {
  try {
    const response = await api.get(`/hire-delivery/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Sua requisição não pode ser finalizada' };
  }
};

const getHireByOrderId = async (orderId:number) => {
  try {
    const response = await api.get(`/hire-delivery?ordersId=${orderId}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Sua requisição não pode ser finalizada' };
  }
};

const getHireByDeliverId = async (deliverId:number) => {
  try {
    const response = await api.get(`/hire-delivery?deliverId=${deliverId}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Sua requisição não pode ser finalizada' };
  }
};

const deleteHireDelivery = async (id:number) => {
  try {
    const response = await api.delete(`/hire-delivery/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Sua requisição não pode ser finalizada' };
  }
};

const findOptimized = async (position?:any) => {
  try {
    const args = [];
    if (position) {
      args.push(`lat=${position.latitude}`);
      args.push(`lng=${position.longitude}`);
    }
    args.push('optimized=true');
    const response = await api.get(`/hire-delivery?${args.join('&')}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

const editHireDelivery = async (hireDeliverData:any, id:number) => {
  try {
    const response = await api.patch(`/hire-delivery/${id}`, hireDeliverData);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Sua requisição de deliver não pode ser finalizada' };
  }
};

export default {
  save,
  getHireByOrderId,
  deleteHireDelivery,
  findOptimized,
  editHireDelivery,
  getById,
  getHireByDeliverId,
};
