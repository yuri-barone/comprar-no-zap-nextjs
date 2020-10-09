import { useRouter } from "next/router";

  const onSucces = (response:any) => response

  const onError = (error:any) => {
    const router = useRouter()
    if (error === 401){
        router.push("/entrar")
    }
    return Promise.reject(error);
  }

  const addResponseErrorMidleware = (api:any) => {
    api.interceptors.response.use(onSucces, onError)
}
export default addResponseErrorMidleware