import axios from "../axios";

let UpdateChildcategory_api = (data) => {
  const {id} = data;

  return axios({
    method: "put",

    url: `/child-categories/${id}`,

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default UpdateChildcategory_api;
