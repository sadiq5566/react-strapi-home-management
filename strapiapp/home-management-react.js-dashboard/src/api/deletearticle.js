import axios from "../axios";

let deletearticle = (data) => {
  const {id} = data;

  return axios({
    method: "delete",
    url: `/articles/${id}`,

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default deletearticle;
