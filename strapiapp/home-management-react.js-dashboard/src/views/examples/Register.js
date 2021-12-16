/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import axios from "axios";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

// const Register = () => {
  class Register extends React.Component {


  state={
    username:"",
    email:"",
    password:"",
    apiLoading:false,
    errMsg:"",
    errors: {
        username:"",
        email:"",
        password: ''
    },
    specField: false,
    loginbtn:false,
    mode:"local"
  }
  isemail=(val)=> {
    let regemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(regemail.test(val)){
      return true
    }else{
        return false
    }
}
componentDidMount() {
  window.scrollTo(0, 0)
  let token=localStorage.getItem("admin_token")
  if(token){
   this.props.history.push("/")
  } 
}
handleChange = (event) => {
  event.preventDefault();
  const { name, value } = event.target;
  let errors = this.state.errors;

  switch (name) {
    case 'username':
      errors.username =
          value.length < 3
              ? 'username must be at least 3 characters long!'
              : '';
      break;
    case 'email':
          errors.identifier =
                this.isemail(value)
                  ? ''
                  : 'email must be valid!';
          break;
      case 'password':
          errors.password =
              value.length < 6
                  ? 'Password must be at least 6 characters long!'
                  : '';
          break;
      default:
          break;
  }

  this.setState({ errors, [name]: value });
}
handleSubmit = async (event) => {
  event.preventDefault()
  let {username,email,password,captcha}=this.state
  this.setState({
      specField: false,
      userExistErr:false,
      errMsg:"",
      captchaErr:false
     })

  let data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
  }

if(!username ||!email || !password){
 this.setState({
  specField: true,
 })
}


else{    
  if (validateForm(this.state.errors)) {
      this.setState({apiLoading:true})
      let _this = this
      // await axios.post(`${process.env.REACT_APP_API}/auth/adminLogin`, data).then(res => {
        await axios.post(`http://localhost:1337/auth/local/register`, data).then(res => {   
          console.log("res data" , res)
      if (res.status == "200" || res.statusText == "ok") {

              if (res.data.jwt) {
                console.log("here" )
                  localStorage.setItem('admin_token', res.data.jwt)                  
              }
              this.props.history.push('/auth/login') 

          }
          else if(res.data.Error==true){
              this.setState({
                  userExistErr:true,
                  errMsg:res.data.Msg,
               })
          }
          this.setState({apiLoading:false})

      }).catch(e => {
          console.log(e)
      }

      )     
  }    
}
}






  // return (
    render(){
      let { errors,specField,userExistErr ,captchaErr} = this.state

    return (
      <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/github.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>

          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign up with credentials</small>
              {specField ? <p style={{ textAlign: "center", color: "red" }}>Please enter username , email and password</p> : ""}
                                            {userExistErr ? <p style={{ textAlign: "center", color: "red" }}>Invalid email or Password</p> : ""}
                                            {captchaErr ? (
                                           <p style={{ textAlign: "center", color: "red" }}>
                                              Please Fill Captcha
                                               </p>
                                                    ) : (
                                                   ""
                                                 )}


            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                     value={this.state.username}
                     name="username"
                     onChange={this.handleChange}
                      placeholder="username"
                      type="text"
                      // autoComplete="username"
                    />                </InputGroup>
                    {errors.username.length > 0 && 
                                                                        <span className='error'>{errors.username}</span>}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                     value={this.state.email}
                     name="email"
                     onChange={this.handleChange}
                      placeholder="email"
                      type="email"
                      // autoComplete="new-identifier"
                    />
                </InputGroup>
                {errors.email.length > 0 && 
                                                                        <span className='error'>{errors.email}</span>}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                      value={this.state.password}
                      name="password"
                      onChange={this.handleChange}
                      placeholder="Password"
                      type="password"
                      // autoComplete="new-password"
                    />
                     {errors.password.length > 0 &&
                                                            <span className='error'>{errors.password}</span>}
                </InputGroup>
              </FormGroup>
              <div className="text-muted font-italic">
                <small>
                  password strength:{" "}
                  <span className="text-success font-weight-700">strong</span>
                </small>
              </div>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
              <Button onClick={this.handleSubmit} className="my-4" color="primary" type="button">
                    Create Account
                  </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
   
      
      </>
        )    };
};

export default Register;
