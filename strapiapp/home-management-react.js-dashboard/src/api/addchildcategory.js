import axios from "../axios";

let addchildcategory = (data) => {
  console.log("data" , data)
  return axios({
    method: "post",
    url : "/child-categories",

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default addchildcategory;
