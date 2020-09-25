import {mainApi as api} from "./Api"

const save = async (data:object) => {
    try{
        const response = await api.post("/products", data);
        return { data: response.data }
    } catch(error){
        console.log(error)
    }
}

export default {
    save
}