import Axios from 'axios';

Axios.defaults.headers.common['Content-Type'] = 'application/json';

const create = (baseURL: string | undefined) =>
  Axios.create({
    baseURL,
    timeout: 50000,
  });

  export const mainApi = create('http://localhost:3030');

  export const configureMainApi = (token:string) => {
    mainApi.defaults.headers.common['Authorization'] = 'Bearer '.concat(token);
  };