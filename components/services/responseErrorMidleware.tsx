import { useRouter } from "next/router";

  const onSuccess = (response:any) => {
    debugger
     return response
    }

  const onError = (error:any) => {
    debugger
    if (401 === error.response.status) {
      window.location.replace("/entrar")
    } else {
        return Promise.reject(error);
    }
    return Promise.reject(error);
  }

  const addResponseErrorMidleware = (mainApi:any) => {
    mainApi.interceptors.response.use(onSuccess, onError)
  }

export default addResponseErrorMidleware