import { mainApi as api } from './Api';

const createOrder = async (order:any) => {
  try {
    const response = await api.post('/orders', order);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Seu pedido não pode ser finalizado' };
  }
};

const getOrder = async (codigo:string) => {
  try {
    const response = await api.get(`/orders?codigo=${codigo}`);
    return { ok: true, data: response.data.data };
  } catch (error) {
    return { ok: false, erro: 'Seu pedido não pode ser recuperado' };
  }
};

const getOrderItems = async (ordersId:number) => {
  try {
    const response = await api.get(`/orders-items?ordersId=${ordersId}`);
    return { ok: true, data: response.data.data };
  } catch (error) {
    return { ok: false, erro: 'Seus itens não foram recuperados' };
  }
};

export default {
  createOrder,
  getOrder,
  getOrderItems,
};
