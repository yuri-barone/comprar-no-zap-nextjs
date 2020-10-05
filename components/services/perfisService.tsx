import {mainApi as api} from "./Api"

const save = async (data:object) => {
    try{
        const response = await api.post("/perfis", data);
        return { data: response.data }
    } catch(error){
        console.log(error)
    }
}

const find = async (filter:string) => {
    try {
      const response = await api.get(`/perfis?nome[$iLike]=%${filter.trim().replace(/\s/g, "+")}%`);
      return { data: response.data };
    } catch (error) {
      console.log(error);
    }
  };

export default {
    save,
    find
}