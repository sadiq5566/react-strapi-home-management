import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import Header from "components/Headers/Header.js";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { Modal, FormGroup } from 'reactstrap';
import AddCategories from '../api/addCategories';
import CategoryList from '../api/categoryList';
import Deletecategory_api from '../api/Deletecategory';
import Updatecategory_api from '../api/Updatecategory';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ApiLoader from '../components/ApiLoader'
const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Category is required').min(3, "Minimum 3 letters are required"),

});


class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            addCategoriesModal: false,
            category: [],
            editeRecords: [],
            EditeaddCategoriesModal: false,
        };

        this.columns = [
            {
                key: "name",
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


    componentDidMount() {
        if (!localStorage.getItem("admin_token")) {
            this.props.history.push("/auth/login")
        } else {
            CategoryList().then(res => {
        
                let tableObject = res.data.map(data=>{
                    return {
                        id:data.id,
                        name: data.name
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

    deleteCheckList = () => {
        let data = {
            id: this.state.editeRecords.id
        }
        this.setState({ Deleteloading: true })
        Deletecategory_api(data).then(res => { 
            console.log("delete api data" , data)
            let allList = this.state.category;
            let  dataIndex = allList.findIndex(e => e.id === this.state.editeRecords.id)
            allList.splice(dataIndex, 1);  
            this.setState({ Deleteloading: false })
            this.setState({ category: allList, EditeaddCategoriesModal: false })
        }).catch(error => {
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
                            <h3 class="mb-0">Categories</h3>
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
                            Add Category
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
                            initialValues={{ name: '' }}
                            validationSchema={CategorySchema}
                            onSubmit={(values) => {
                                                                    console.log(values)
                                this.setState({ loading: true })
                                AddCategories(values).then(res => {
                                    console.log(res)
                                    console.log(values)
                                    console.log(this.state.category)
                                    this.setState({ loading: false })
                                    this.setState({ category: [res.data, ...this.state.category], addCategoriesModal: false })
                                    console.log(this.state.category)

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
                                            Add category
                                        </label>
                                        <input
                                            placeholder='Add category'
                                            type="text"
                                            name="name"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.category}
                                        />
                                    </div>

                                    <small className='text-danger'> {errors.name && touched.name && errors.name}</small>


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
                            Edite Categories
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
                                name: this.state.editeRecords.name

                            }}
                            validationSchema={CategorySchema}
                            onSubmit={(values) => {
                                console.log("values" , values)
                                console.log("id" , this.state.editeRecords.id)
                                let data = {
                                    name: values.name,
                                    id: this.state.editeRecords.id
                                }
                                    console.log("before updata" , data)
                                this.setState({  loading: true })
                                Updatecategory_api(data).then(res => { 
                                    
                                    let allList = this.state.category
                                    
                                    
                                    let dataIndex =  allList.findIndex((e)=>{
                                        return(
                                        e.id === this.state.editeRecords.id
                                        )
                                    })
                                    
                                    
                                    allList[dataIndex].id = res.data.id
                                    allList[dataIndex].name = res.data.name
                                    
                                    this.setState({ category: allList, EditeaddCategoriesModal: false  , loading: false})
                                   
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
                                            Edite categories name
                                        </label>
                                        <input
                                            placeholder='list title'
                                            type="text"
                                            name="name"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                        />
                                    </div>

                                    <small className='text-danger'> {errors.name && touched.name && errors.name}</small>


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

export default Category;;