const onSuccess = (response:any) => response;

const onError = (error:any) => {
  if (error.response.status === 401) {
    window.location.replace('/entrar');
  } else {
    return Promise.reject(error);
  }
  return Promise.reject(error);
};

const addResponseErrorMidleware = (mainApi:any) => {
  mainApi.interceptors.response.use(onSuccess, onError);
};

export default addResponseErrorMidleware;
