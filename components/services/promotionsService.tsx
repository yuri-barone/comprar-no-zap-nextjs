import { mainApi as api } from './Api';

const createPromotion = async (promotion:any) => {
  try {
    const response = await api.post('/promotions', promotion);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Sua promoção não pode ser finalizada' };
  }
};

const findOptimized = async (status: boolean, position?:any, limit?:number) => {
  try {
    const args = [];
    args.push('optimized=true');
    if (position) {
      args.push(`lat=${position.latitude}`);
      args.push(`lng=${position.longitude}`);
    }
    if (limit) {
      args.push(`limit=${limit}`);
    }
    if (status) {
      args.push(`status=${status}`);
    }
    const response = await api.get(`/promotions?${args.join('&')}`);
    return { data: response.data.data };
  } catch (error) {
    return error;
  }
};

export default {
  createPromotion,
  findOptimized,
};
