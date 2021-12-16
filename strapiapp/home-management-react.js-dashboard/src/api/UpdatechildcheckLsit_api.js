import axios from "../axios";

let UpdatechildcheckLsit_api = (data) => {
  const {id} = data;
  return axios({
    method: "put",
    url: `/child-check-lists/${id}`,

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default UpdatechildcheckLsit_api;
