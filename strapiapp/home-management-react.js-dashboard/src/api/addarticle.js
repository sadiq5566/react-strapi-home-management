import axios from "../axios";

let addarticle = (data) => {
  return axios({
    method: "post",
    url: "/articles",

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default addarticle;
