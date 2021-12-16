import axios from "../axios";

let AddCategories = (data) => {
  return axios({
    method: "post",
    url: "/super-categories",
    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default AddCategories;
