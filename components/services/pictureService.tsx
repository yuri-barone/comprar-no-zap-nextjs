import { mainApi as api } from './Api';

const get = async (id: number) => {
  try {
    const response = await api.get(`/pictures/${id}`);
    return { data: response.data };
  } catch (error) {
    return error;
  }
};

export default {
  get,
};
