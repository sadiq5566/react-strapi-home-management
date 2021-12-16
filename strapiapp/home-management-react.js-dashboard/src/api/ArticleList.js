import axios from "../axios";

let ArticleList = () => {
  return axios({

    method: "get",
    url : "/articles",

    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default ArticleList;
