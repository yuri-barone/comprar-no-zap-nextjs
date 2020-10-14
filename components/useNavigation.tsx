import * as yup from 'yup';

const getUrlParams = () => {
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);
  const params = {
    tipo: urlParams.get('tipo'),
    termo: urlParams.get('termo'),
    perfilId: urlParams.get('perfilId'),
  };
  return params;
};

const higienizeParams = (params:any) => {
  const values:any = params;
  const validator = yup.string().trim().required();
  if (validator.isValidSync(values.tipo) === false) {
    delete values.tipo;
  }
  if (validator.isValidSync(values.termo) === false) {
    delete values.termo;
  }
  if (validator.isValidSync(values.perfilId) === false) {
    delete values.perfilId;
  }
  return values;
};

const generateQueryUrl = (tipo:string, termo?:string, perfilId?:string) => {
  const params = {
    tipo,
    termo,
    perfilId,
  };
  const query = higienizeParams(params);
  return query;
};

const useNavigation = () => ({
  getUrlParams,
  generateQueryUrl,
});

export default useNavigation;
