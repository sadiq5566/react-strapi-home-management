import axios from "../axios";

let AddchildcheckLsit = (data) => {
  console.log("data" , data)

  return axios({
    method: "post",
    url : "/child-check-lists",

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default AddchildcheckLsit;
