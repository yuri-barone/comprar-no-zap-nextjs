import { mainApi as api } from "./Api";

const save = async (data: object) => {
  try {
    const response = await api.post("/products", data);
    return {ok:true , data: response.data };
  } catch (error) {
    return {ok:false, erro: "Não foi possível cadastrar seu produto"}
  }
};

const find = async (filter: string, id?:number) => {
  try {
    let args = []
    if (!!filter) {
      args.push(`titulo[$iLike]=%${filter.trim().replace(/\s/g, "+")}%`)
    }
    if (!!id) {args.push(`perfilId=${id}`)}
    const response = await api.get(`/products?${args.join("&")}`);
    return { data: response.data };
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (id:number) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return {ok: true, data: response.data}
  } catch (error) {
    return {ok:false, erro:"Não foi possível excluir seu produto"}
  }
}

const edit = async (id:number, data:any) => {
  try {
    const response = await api.patch(`/products/${id}`, data)
    return {ok: true, data: response.data}
  } catch (error) {
    return {ok:false, erro:"Não foi possível editar seu produto"}
  }
}

export default {
  save,
  find,
  deleteProduct,
  edit,
};
