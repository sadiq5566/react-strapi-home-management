import axios from "../axios";

let UpdateArticleList = (data) => {
  const {id} = data;
  return axios({
    method: "put",
    url: `/articles/${id}`,
    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default UpdateArticleList;
