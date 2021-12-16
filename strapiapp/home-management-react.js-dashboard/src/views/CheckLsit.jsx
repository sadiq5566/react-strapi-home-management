import React, { Component, Fragment } from 'react';
import { render} from 'react-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import Header from "components/Headers/Header.js";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css'; 
import { Modal, FormGroup } from 'reactstrap';
 
import { Formik } from 'formik';
import * as Yup from 'yup';
import ApiLoader from '../components/ApiLoader';

import AddcheckLsit from 'api/AddcheckLsit';
import CheckLsitapi from 'api/CheckLsit';
import UpdateCheckLsit from 'api/UpdateCheckLsit';
import DeletecheckLsit_api from 'api/DeletecheckLsit';

const CategorySchema = Yup.object().shape({
    title: Yup.string().required('Check lsit title is required').min(3,"Minimum 3 letters are required"),
  
});


class CheckLsit extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: false,
            addCategoriesModal:false ,
            EditeaddCategoriesModal:false ,
            Deleteloading:false,
            category: [],
            editeRecords:[]
            };

        this.columns = [
            {
                key: "title",
                text: "Category",
                className: "category",
                align: "left",
                sortable: true,
            },
            
            {
                key: "action",
                text: "Listings",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => { 
                    return (
                        <>
                        <Fragment>
                                <button onClick={() => this.editeDetails(record)}
                                className="btn btn-danger btn-sm" >
                                    <i class="fas fa-pen"></i>
                            </button>
                        </Fragment>
                        </>
                    );
                }
            }  
 
       
        ];
        
        this.config = {
            page_size: 10,
            length_menu: [ 10, 20, 50 ],
            button: {
                excel: true,
                csv: true
            }
        }  
    }

    editeDetails=(details)=>{
        this.setState({ EditeaddCategoriesModal: true, editeRecords:details})
    }

 

    componentDidMount(){
        if(!localStorage.getItem("admin_token")){
            this.props.history.push("/auth/login")
            }else{
            CheckLsitapi().then(res=>{
                
                let tableObject = res.data.map(data=>{
                    return {
                        id:data.id,
                        title:data.title
                    }
                })
                this.setState({ category: tableObject })
                
            }).catch(error=>{
                console.log(error)
            })
            } 
   }
    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    deleteCheckList = ()=>{
        let data = {
            id:this.state.editeRecords.id
        }
        this.setState({ Deleteloading:true})
        DeletecheckLsit_api(data).then(res=>{
            console.log("res",res)
            let dataIndex = null;
            let allList = this.state.category;
            allList.map((data, index) => {
                if (data.id == this.state.editeRecords.id) {
                    dataIndex = index
                }
            })

            allList.splice(dataIndex, 1); 
            console.log(allList)
            console.log("UpdateCheckLsit", res)
            this.setState({ Deleteloading: false })
            this.setState({ category: allList, EditeaddCategoriesModal: false })
        }).catch(error=>{
            console.log(error);
        })
    }
   
 
 
  
    render() {
       
        return (

                <>
            <Header />
                <div className="mt--7 container-fluid">
                    <div className="shadow card">
                        <div className="border-0 card-header d-flex justify-content-between align-items-center ">
                            <h3 class="mb-0">Check List</h3>
                            <button className='btn btn-primary' 
                                onClick={() => this.toggleModal("addCategoriesModal")}
                            >Add +</button>
                        </div>
                        <ReactDatatable
                            config={this.config}
                            records={this.state.category}
                            columns={this.columns}
                            extraButtons={this.extraButtons}
                        />
                    </div>
                </div>


                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.addCategoriesModal}
                    toggle={() => this.toggleModal("addCategoriesModal")}
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Add Check Lsit
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("addCategoriesModal")}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body pt-0">
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                        <Formik
                            initialValues={{ title: ''}}
                            validationSchema={CategorySchema}
                            onSubmit={(values) => {
                                console.log("values" ,values)
                                this.setState({loading:true})
                                AddcheckLsit(values).then(res=>{
                                console.log("res",res)
                                    this.setState({ loading: false })
                                    this.setState({ category: [ ...this.state.category,res.data], addCategoriesModal:false})
                                    console.log(this.state.category)

                                }).catch(error=>{
                                    console.log(error)
                                })
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                 
                                /* and other goodies */
                            }) => (
                                <form onSubmit={handleSubmit}>

                                    
                                      <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Add check list title
                                        </label>
                                        <input
                                            placeholder='list title'
                                            type="text"
                                            name="title"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                        />
                                      </div>
                                    
                                    <small className='text-danger'> {errors.title && touched.title && errors.title}</small>

                                  
                                    <div className='d-flex justify-content-end my-2'>
                                        <button type="submit" className='btn btn-primary text-right' 
                                            disabled={this.state.loading}
                                        >
                                            
                                            {this.state.loading && <ApiLoader />}
                                            {!this.state.loading && "Submit"}
                                           
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                    </div>
                      </Modal>
               
               {/* edite modal */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.EditeaddCategoriesModal}
                    toggle={() => this.toggleModal("EditeaddCategoriesModal")}
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Edite Check Lsit
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("EditeaddCategoriesModal")}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body pt-0">
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                        <Formik
                            initialValues={{
                                 title: this.state.editeRecords.title

                                 }}
                            validationSchema={CategorySchema}
                            onSubmit={(values) => {
                                let data = {
                                    title:values.title,
                                    id: this.state.editeRecords.id
                                }
                                 
                                // this.setState({ loading: true })
                                UpdateCheckLsit(data).then(res => {
                                    let allList = this.state.category;
                                    let dataIndex =    allList.findIndex(e => e.id === this.state.editeRecords.id)
                                    allList[dataIndex] = res.data
                                    this.setState({ loading: false })
                                    this.setState({ category: allList, EditeaddCategoriesModal: false })
                                }).catch(error => {
                                    console.log(error)
                                })
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,

                                /* and other goodies */
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Edite check list title
                                        </label>
                                        <input
                                            placeholder='list title'
                                            type="text"
                                            name="title"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                        />
                                    </div>

                                    <small className='text-danger'> {errors.title && touched.title && errors.title}</small>


                                    <div className='d-flex justify-content-end my-2'>
                                        {!this.state.loading && (<button type="button"
                                            onClick={() => this.deleteCheckList()}
                                            className='btn btn-danger text-right'
                                            disabled={this.state.Deleteloading}
                                        >

                                            {this.state.Deleteloading && <ApiLoader />}
                                            {!this.state.Deleteloading && "Delete"}

                                        </button>)}
                                      
                                        {!this.state.Deleteloading && (<button type="submit" className='btn btn-primary text-right'
                                            disabled={this.state.loading}
                                        >

                                            {this.state.loading && <ApiLoader />}
                                            {!this.state.loading && "Update"}

                                        </button>)}

                                       
                                    </div>
                                </form>
                            )}
                        </Formik>
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                    </div>
                </Modal>

                   </>
                

        )
    }
}

export default CheckLsit;;