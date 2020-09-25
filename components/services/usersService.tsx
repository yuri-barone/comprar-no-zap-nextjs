import {mainApi as api} from "./Api"

const login = async (data:object) => {
    try{
        const response = await api.post("/authentication", data);
        return { token: response.data.accessToken }
    } catch(error){
        console.log(error)
    }
}

export default {
    login
}