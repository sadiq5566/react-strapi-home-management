import axios from "../axios";

let AddcheckLsit = (data) => {
  console.log("data api", data)
  return axios({
    method: "post",
    url: "/parent-check-lists",

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default AddcheckLsit;
