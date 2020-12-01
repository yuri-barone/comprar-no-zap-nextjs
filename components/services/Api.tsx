import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import addResponseErrorMidleware from './responseErrorMidleware';

const MINUTOS = 2;

axios.defaults.headers.common['Content-Type'] = 'application/json';
const cache = setupCache({ maxAge: MINUTOS * 60 * 1000 });

const create = (baseURL: string | undefined) => axios.create({
  baseURL,
  timeout: 50000,
  adapter: cache.adapter,
});

export const mainApi = create('http://localhost:3030');
addResponseErrorMidleware(mainApi);

export const configureMainApi = (token:string) => {
  mainApi.defaults.headers.common.Authorization = 'Bearer '.concat(token);
};
