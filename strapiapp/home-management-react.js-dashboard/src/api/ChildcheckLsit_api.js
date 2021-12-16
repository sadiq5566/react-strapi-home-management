import axios from "../axios";

let ChildcheckLsit_api = () => {
  return axios({
    method: "get",
    url : "/child-check-lists",


    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default ChildcheckLsit_api;
