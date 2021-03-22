import { mainApi as api } from './Api';

type LikeTypeStore = {
  storeId: number;
};

type LikeTypeProduct = {
  productId: number;
};

type LikeType = LikeTypeStore | LikeTypeProduct;

type ResponseSuccess = {
  data: any
};

type ResponseError = {
  erro: string
};

export type Response = {
  ok: boolean
} & (ResponseSuccess | ResponseError);

const giveLike = async (like:LikeType):Promise<Response> => {
  try {
    const response = await api.post('/likes', like);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Algo deu errado ao curtir.' };
  }
};

const deleteLike = async (params:Record<string, string>):Promise<Response> => {
  // eslint-disable-next-line consistent-return
  const url = '/delete-like';
  const paramsString = new URLSearchParams(params).toString();
  try {
    const response = await api.get(`${url}?${paramsString}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, erro: 'Algo deu errado ao deletar curtida.' };
  }
};

export default {
  giveLike,
  deleteLike,
};
