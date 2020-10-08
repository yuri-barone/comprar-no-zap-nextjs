import {mainApi as api} from "./Api"

const login = async (data:object) => {
    try{
        const response = await api.post("/authentication", data);
        return { ok: true, data: response.data.accessToken }
    } catch(error){
        return {ok:false, erro: "Login ou senha inválido"}

    }
}

export default {
    login
}