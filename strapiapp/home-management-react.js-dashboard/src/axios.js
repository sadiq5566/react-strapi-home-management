import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_STRAPI,
  // baseURL: process.env.REACT_APP_API,
});


instance.interceptors.response.use(function (response) {
      if(response.data.success==false){
         localStorage.removeItem("admin_token")
      }
    return response;
  }, function (error) {
    return Promise.reject(error);
  });


export default instance
