import axios from "../axios";

let Updatecategory_api = (data) => {
  const {id} = data;

  return axios({
    method: "put",
    url: `/super-categories/${id}`,
    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default Updatecategory_api;
