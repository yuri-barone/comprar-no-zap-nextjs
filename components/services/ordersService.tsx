import { mainApi as api } from './Api';

const createOrder = async (order:any) => {
  try {
    const response = await api.post('/orders', order);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Seu pedido não pode ser finalizado' };
  }
};

const getOrderById = async (orderId:number) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return { data: response.data };
  } catch (error) {
    return error;
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

const getOrderByConsumerid = async (consumerid:number) => {
  try {
    const response = await api.get(`/orders_and_items?consumerid=${consumerid}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Seus itens não foram recuperados' };
  }
};

export default {
  createOrder,
  getOrder,
  getOrderItems,
  getOrderById,
  getOrderByConsumerid,
};
