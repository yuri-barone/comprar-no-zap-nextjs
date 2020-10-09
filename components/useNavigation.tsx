import * as yup from "yup";

const getUrlParams = () => {
    const url = new URL(window.location.href);
    var urlParams = new URLSearchParams(url.search);
    const params = {
      tipo: urlParams.get("tipo"),
      termo: urlParams.get("termo"),
      perfilId: urlParams.get("perfilId"),
    };
    return params;
  };

const generateQueryUrl = (tipo:string, termo?:string, perfilId?:string) => {
    const params = {
        tipo,
        termo,
        perfilId,
    }
    const query =  higienizeParams(params)
    return query
}

const higienizeParams = (params:any) => {
    const validator = yup.string().trim().required()
    if(validator.isValidSync(params.tipo) === false){
        delete params.tipo
    }
    if(validator.isValidSync(params.termo) === false){
        delete params.termo
    }
    if(validator.isValidSync(params.perfilId) === false){
        delete params.perfilId
    }
    return params
}

const useNavigation = () => {
    return {
        getUrlParams: getUrlParams,
        generateQueryUrl: generateQueryUrl,
    }
}

export default useNavigation