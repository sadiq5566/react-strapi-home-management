import axios from "../axios";

let Deletecategory_api = (data) => {

  const {id} = data;

  return axios({
    method: "delete",
    url: `/super-categories/${id}`,
    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
   },
  });
};

export default Deletecategory_api;
