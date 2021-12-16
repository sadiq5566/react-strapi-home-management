import axios from "../axios";

let Deletechildcategory = (data) => {
  const {id} = data;
  return axios({
    method: "delete",
    url : `/child-categories/${id}`,

    data,
    headers:{
    authorization: "Bearer "+localStorage.getItem("admin_token"),
  },
  });
};

export default Deletechildcategory;
