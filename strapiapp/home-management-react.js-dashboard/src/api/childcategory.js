import axios from "../axios";

let childcategory = () => {
  return axios({
    method: "get",
    url : "/child-categories",

    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default childcategory;
