import axios from "../axios";

let DeleteChildcheckLsit = (data) => {
  const {id} = data;
  return axios({
    method: "delete",

    url : `/child-check-lists/${id}`,

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default DeleteChildcheckLsit;
