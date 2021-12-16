import axios from "../axios";

let CheckLsit = () => {
  return axios({
    method: "get",

    url : "/parent-check-lists",

    headers:{
      authorization: "Bearer "+localStorage.getItem("admin_token"),

    },
  });
};

export default CheckLsit;
