import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
 
import Category from './views/category' 
import ChildCategory from './views/ChildCategory' 
import Articals from './views/Articles' 
import CheckLsit from './views/CheckLsit' 
import ChildCheckList from './views/ChildCheckList' 
 


var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
    show:false
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: Icons,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/admin",
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin",
  // },

  {
  
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
     show:false
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
     show:false
  },
  {
    path: "/category",
    name: "Super Category",
    icon: "fa fa-th-large text-yellow",
    component: Category,
    layout: "/admin",
     show:true
  },
  {
    path: "/subcategory",
    name: "Child Category",
    icon: "fa fa-th-large text-yellow",
    component: ChildCategory,
    layout: "/admin",
     show:true
  },
  {
    path: "/checkList",
    name: "Parent Check List",
    icon: "fa fa-th-large text-yellow",
    component: CheckLsit,
    layout: "/admin",
     show:true
  },
  {
    path: "/childcategory",
    name: "Child Check list",
    icon: "fa fa-th-large text-yellow",
    component: ChildCheckList,
    layout: "/admin",
     show:true
  },
  {
    path: "/articles",
    name: "Articles",
    icon: "fa fa-th-large text-yellow",
    component: Articals,
    layout: "/admin",
     show:true
  } 
];
export default routes;
