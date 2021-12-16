import axios from "../axios";

let DeletecheckLsit_api = (data) => {
  const {id} = data;

  return axios({
    method: "delete",
    url: `/parent-check-lists/${id}`,

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default DeletecheckLsit_api;
