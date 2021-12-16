import axios from "../axios";

let CategoryList =  (data) => {
  return axios({
    method: "get",
    url : "/super-categories",
    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),

  },
  });
};

export default CategoryList;
