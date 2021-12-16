import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import Header from "components/Headers/Header.js";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { Modal, FormGroup } from 'reactstrap';
import UpdatechildcheckLsit_api from '../api/UpdatechildcheckLsit_api';
import ChildcheckLsit_api from '../api/ChildcheckLsit_api';
import CheckLsit from '../api/CheckLsit';
import AddchildcheckLsit_api from '../api/AddchildcheckLsit_api';
import DeleteChildcheckLsit from '../api/DeleteChildcheckLsit';
import { Formik , form } from 'formik';
import * as Yup from 'yup';
import ApiLoader from '../components/ApiLoader'
const CategorySchema = Yup.object().shape({
    parent_check_list: Yup.string().required('Check list is required'),
    title: Yup.string().required('Child Check list is required').min(3, "Minimum 3 letters are required"),
    // type: Yup.string().required('Type is required') ,
});


const cchecklist=[
  {option:"QtY",value:"QtY"},
  {option:"Box",value:"Box"},
  {option:"Lbs",value:"Lbs"},
  {option:"Sheets",value:"Sheets"},
  {option:"Bag",value:"Bag"},     
]

class ChildCheckList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            addCategoriesModal: false,
            category: [],
            editeRecords: [],
            parentCategory: [],
            Deleteloading: false,
            DeletecheckLsit_api: false
        };

        this.columns = [
            {
                key: "Category",
                text: "Category",
                className: "category",
                align: "left",
                sortable: true,
            },
            {
                key: "ChildCategory",
                text: "Child-Category",
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
            length_menu: [10, 20, 50],
            button: {
                excel: true,
                csv: true
            }
        }
    }

    editeDetails = (details) => {
        this.setState({ EditeaddCategoriesModal: true, editeRecords: details })
    }


    deleteCheckList = () => {
        let data = {
            id: this.state.editeRecords.id
        }
        this.setState({ Deleteloading: true })
        DeleteChildcheckLsit(data).then(res => {
            let allList = this.state.category; 
            let dataIndex = allList.findIndex(e => e.id === this.state.editeRecords.id)
            allList.splice(dataIndex, 1);
            this.setState({ Deleteloading: false })
            this.setState({ category: allList, EditeaddCategoriesModal: false })
        }).catch(error => {
            console.log(error);
        })
    }



    componentDidMount() {
        if (!localStorage.getItem("admin_token")) {
            this.props.history.push("/auth/login")
        } else {
            CheckLsit().then(res => {
                    this.setState({ parentCategory: res.data })
            }).catch(error => {
                console.log(error)
            })
            // ***************

            ChildcheckLsit_api().then(res => {
let tableObject = res.data.map(data => {

                    return {
                        Category: data.parent_check_list.title,
                        ChildCategory: data.title,
                        id: data.id,
                        parent_check_list: data.parent_check_list.id,
                    }
                })
                this.setState({ category: tableObject })
            }).catch(error => {
                console.log(error)
            })
        }
    }
    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };




    render() {

        return (

            <>
                <Header />
                <div className="mt--7 container-fluid">
                    <div className="shadow card">
                        <div className="border-0 card-header d-flex justify-content-between align-items-center ">
                            <h3 class="mb-0">Child Check List</h3>
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
                            Add Child Checklist
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
                            initialValues={{ title: '', parent_check_list: "",type:"" }}
                            validationSchema={CategorySchema}
                            onSubmit={(values) => {
                             
                           const convert = parseInt(values.parent_check_list)
                           values.parent_check_list = convert
                             
                                this.setState({ loading: true })
                                AddchildcheckLsit_api(values).then(res => {
                                    this.setState({ loading: false })
                                    let resData = [res.data]
                                    let tableObject = resData.map(data => {
                                        return {
                                            Category: data.parent_check_list.title,
                                            ChildCategory: data.title,
                                            id: data.id,
                                            parent_check_list: data.parent_check_list.id,
                                        }
                                    })
                                    this.setState({ category: [tableObject[0], ...this.state.category], addCategoriesModal: false })
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
                                setFieldValue

                                /* and other goodies */
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    {/* {JSON.stringify(this.state.category,null,2)} */}

                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Select Check List
                                        </label>
                                        <select className='form-control'
                                            onChange={(e) => {
                                                setFieldValue("parent_check_list", e.target.value, true)
                                            }}
                                            title="" id="">
                                            <option value="">Select Check List</option>
                                            {this.state.parentCategory.map((data, index) => {
                                                return (
                                                    <option value={data.id}>{data.title}</option>
                                                )
                                            })}
                                        </select>

                                    </div>

                                    <small className='text-danger'> {errors.catagory_id && touched.catagory_id && errors.catagory_id}</small>
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Add Child Check List
                                        </label>  
                                        <input
                                            placeholder='Add Child Check List'
                                            type="text"
                                            name="title"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                        />
                                    </div>

                                    <small className='text-danger'> {errors.title && touched.title && errors.title}</small>
                                    <div >
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Type
                                        </label>
                                        <select className='form-control'
                                            onChange={(e) => {
                                                setFieldValue("type", e.target.value, true)
                                            }}
                                            name="" id="">
                                            <option value="">Select Type</option>
                                            {cchecklist.map((data, index) => {
                                                return (
                                                    <option value={data.value}>{data.option}</option>
                                                )
                                            })}
                                        </select>
                                        {/* <input
                                            placeholder='Add Type'
                                            type="text"
                                            name="type"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.type}
                                        /> */}
                                    </div>
                                    <small className='text-danger'> {errors.type && touched.type && errors.type}</small>


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
                            Edit child Check List
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
                        
              initialValues={{ title: this.state.editeRecords.ChildCategory, parent_check_list: this.state.editeRecords.parent_check_list }}
             
                            validationSchema={CategorySchema}
                            onSubmit={(values) => {

                                this.setState({ loading: true })
                                let data = {
                                    id: this.state.editeRecords.id,
                                    title: values.title,
                                    parent_check_list: values.parent_check_list
                                }

                                UpdatechildcheckLsit_api(data).then(res => {
                                    let dataIndex = null;
                                    let allList = this.state.category;
                                    allList.map((data, index) => {
                                        if (data.id == this.state.editeRecords.id) {
                                            dataIndex = index
                                        }
                                    })

                                    let tableObject = {
                                        Category: res.data.parent_check_list.title,
                                        ChildCategory: res.data.title,
                                        id: res.data.id,
                                        parent_check_list: res.data.parent_check_list.id,
                                    }
                                    

                                    allList[dataIndex] = tableObject
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
                                setFieldValue

                                /* and other goodies */
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Select Category
                                        </label>

                                        <select className='form-control'

                                            onChange={(e) => {
                                               
                                                setFieldValue("parent_check_list", e.target.value, true)
                                            }}
                                            name="parent_check_list" id="">
                                        
                                            <option value={this.state.editeRecords.parent_check_list}>{this.state.editeRecords.Category}</option>

                                            {this.state.parentCategory.map((data, index) => {
                                                    if (data.id != this.state.editeRecords.parent_check_list) {
                                                    return (
                                                
                                                        <option value={data.id}>{data.title}</option>
                                                    )
                                                }

                                            })}
                                        </select>

                                    </div>

                                    <small className='text-danger'> {errors.parent_check_list && touched.parent_check_list && errors.parent_check_list}</small>
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Add Child Category
                                        </label>
                                        <input
                                            placeholder='Add child category'
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

export default ChildCheckList;;