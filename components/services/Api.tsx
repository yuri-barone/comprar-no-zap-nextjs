import axios from 'axios';
import addResponseErrorMidleware from './responseErrorMidleware';

axios.defaults.headers.common['Content-Type'] = 'application/json';

const create = (baseURL: string | undefined) => axios.create({
  baseURL,
  timeout: 50000,
});

export const mainApi = create('http://ec2-3-134-79-148.us-east-2.compute.amazonaws.com');
addResponseErrorMidleware(mainApi);

export const configureMainApi = (token:string) => {
  mainApi.defaults.headers.common.Authorization = 'Bearer '.concat(token);
};
