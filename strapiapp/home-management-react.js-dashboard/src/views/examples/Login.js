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


class Login extends React.Component {
  state={
    identifier:"",
    password:"",
    apiLoading:false,
    errMsg:"",
    errors: {
        identifier: '',
        password: ''
    },
    specField: false,
    loginbtn:false,
    mode:"local"
  }
  isidentifier=(val)=> {
    let regidentifier = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(regidentifier.test(val)){
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
      case 'identifier':
          errors.identifier =
                this.isidentifier(value)
                  ? ''
                  : 'identifier must be valid!';
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
  let {identifier,password,captcha}=this.state
  this.setState({
      specField: false,
      userExistErr:false,
      errMsg:"",
      captchaErr:false
     })

  let data = {
      identifier: this.state.identifier,
      password: this.state.password
  }

if(!identifier || !password){
 this.setState({
  specField: true,
 })
}


else{    
  if (validateForm(this.state.errors)) {
      this.setState({apiLoading:true})
      let _this = this
      // await axios.post(`${process.env.REACT_APP_API}/auth/adminLogin`, data).then(res => {
        await axios.post(`http://localhost:1337/auth/local`, data).then(res => {   
          console.log("res data" , res)
      if (res.status == "200" || res.statusText == "ok") {

              if (res.data.jwt) {
                console.log("here" )
                  localStorage.setItem('admin_token', res.data.jwt)                  
              }
              this.props.history.push('/') 

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
  render(){
    let { errors,specField,userExistErr ,captchaErr} = this.state

    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
                {specField ? <p style={{ textAlign: "center", color: "red" }}>Please enter identifier and password</p> : ""}
                                            {userExistErr ? <p style={{ textAlign: "center", color: "red" }}>Invalid identifier or Password</p> : ""}
                                            {captchaErr ? (
                                           <p style={{ textAlign: "center", color: "red" }}>
                                              Please Fill Captcha
                                               </p>
                                                    ) : (
                                                   ""
                                                 )}
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-identifier-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                     value={this.state.identifier}
                     name="identifier"
                     onChange={this.handleChange}
                      placeholder="identifier"
                      type="email"
                      autoComplete="new-email"
                    />
                   
                  </InputGroup>
                  {errors.identifier.length > 0 && 
                                                                        <span className='error'>{errors.identifier}</span>}
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
                      autoComplete="new-password"
                    />
                     {errors.password.length > 0 &&
                                                            <span className='error'>{errors.password}</span>}
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button onClick={this.handleSubmit} className="my-4" color="primary" type="button">
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row>
        </Col>

      </>
        );
  }


};

export default Login;
