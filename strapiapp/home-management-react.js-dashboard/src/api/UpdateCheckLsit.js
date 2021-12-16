import axios from "../axios";

let UpdateCheckLsit = (data) => {
  const {id} = data;

  return axios({
    method: "put",
    url: `/parent-check-lists/${id}`,

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default UpdateCheckLsit;
