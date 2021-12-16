import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './assets/css/argon-dashboard-react.css'
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import './style.css'

let Page404 = ()=>{
  return (
    <div className='d-flex  justify-content-center align-items-center' style={{height:"100vh"}}>
      <h3>404 page found</h3>
    </div>
  )
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      {/* <Route render={()=><Page404/>}/> */}
      <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
       
      <Redirect from="/" to="/admin/index" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
