import React, { Component, Fragment } from 'react';
import { render} from 'react-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import Header from "components/Headers/Header.js";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css'; 
import { Modal, FormGroup } from 'reactstrap';
import AddCategories from '../api/addCategories';
import childcategory from '../api/childcategory';
import CategoryList from '../api/categoryList';
import addchildcategory from '../api/addchildcategory';
import UpdateChildcategory_api from '../api/Updatechildcategory';
import Deletechildcategory from '../api/DeleteChildCategory';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ApiLoader from '../components/ApiLoader'
const CategorySchema = Yup.object().shape({
    super_category: Yup.string().required('Category is required'),
    name: Yup.string().required('Child category is required').min(3,"Minimum 3 letters are required"),
});


class Category extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: false,
            addCategoriesModal:false ,
            category: [],
            parentCategory:[],
            EditeaddCategoriesModal: false,
             editeRecords: [],
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
            length_menu: [ 10, 20, 50 ],
            button: {
                excel: true,
                csv: true
            }
        }  
    }

    editeDetails = (details) => {
        this.setState({ EditeaddCategoriesModal: true, editeRecords: details })
    }
 

    componentDidMount(){
        if(!localStorage.getItem("admin_token")){
            this.props.history.push("/auth/login")
            }else{
            CategoryList().then(res => {
                // console.log(res)
                this.setState({ parentCategory: res.data })
            }).catch(error => {
                console.log(error)
            })
            // ***************

            childcategory().then(res=>{
                
                let tableObject = res.data.map(data=>{
                                     return {
                        Category: data.super_category.name,
                        ChildCategory: data.name, 
                        id:data.id,
                        super_category: data.super_category.id,
                    }
                })
                

                this.setState({ category: tableObject})
                

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


    deleteCheckList = () => {
        let data = {
            id: this.state.editeRecords.id
        } 
        this.setState({ Deleteloading: true })
        Deletechildcategory(data).then(res => {
            let allList = this.state.category;
            let dataIndex = allList.findIndex(e => e.id === this.state.editeRecords.id)
            allList.splice(dataIndex, 1);
            console.log(allList)
            console.log("UpdateCheckLsit", res)
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
                            <h3 class="mb-0">Child Categories</h3>
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
                            initialValues={{ name: '', super_category:null}}
                            validationSchema={CategorySchema}
                             onSubmit={(values) => {
                                console.log("values" , values)
                           console.log("values id", values.super_category)
                           console.log("values childname", values.name)
                           const convert = parseInt(values.super_category)
                           values.super_category = convert
                                console.log("convert" , convert)
                                console.log("values" , values)
                                this.setState({ loading: true })
                                addchildcategory(values).then(res=>{
                                     this.setState({ loading: false })
                                console.log(res)
                                let resData = [res.data]
                                console.log("resdata " , res.data)
                                    let tableObject = resData.map(data => {
                                        return {
                                            Category:data.super_category.name,
                                            ChildCategory: data.name,
                                            id:data.id,
                                            super_category:data.super_category.id,
                                            
                                            
                                        }
                                    }) 
                                    this.setState({ category: [ ...this.state.category,tableObject[0]], addCategoriesModal:false})
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
                                            Select Category
                                        </label>
                                        <select className='form-control'
                                        onChange={(e)=>{
                                            setFieldValue("super_category",e.target.value,true)
                                        }}
                                        name="" id="">
                                            <option value="">Select Category</option>
                                            {this.state.parentCategory.map((data,index)=>{
                                                return(
                                                    <option value={data.id}>{data.name}</option>
                                                )
                                            })} 
                                        </select>
                                        
                                      </div>
                                    
                                    <small className='text-danger'> {errors.super_category && touched.super_category && errors.super_category}</small>
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
                                            name="name"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
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
                            Edite child Check Lsit
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
       
                            initialValues={{ name: this.state.editeRecords.ChildCategory, super_category: this.state.editeRecords.super_category }}
                            validationSchema={CategorySchema}
                            
                            onSubmit={(values) => {
                                console.log("initialValues", values)
                                console.log("editrecords",this.state.editeRecords)
                                console.log("super category",this.state.editeRecords.super_category)
                                console.log("values",values)
                                this.setState({ loading: true })
                                let data = {
                                    id: this.state.editeRecords.id,
                                    name: values.name,
                                    super_category: values.super_category
                                } 
                                UpdateChildcategory_api(data).then(res => {
                                
                                    console.log("res",res)  
                                    let allList = this.state.category; 
                                    let dataIndex =  allList.findIndex(e => e.id === this.state.editeRecords.id)
                                            console.log("res.data " , res.data)
                                            console.log("res.data super_categoty" , res.data.super_category);
                                            console.log("dataIndex" , dataIndex)
                                    let tableObject = { 
                                    
                                        // Category: res.data.updatedRecord.super_category.name,
                                        Category: res.data.super_category.name,
                                        ChildCategory: res.data.name,
                                        id: res.data.id,
                                        super_category: res.data.super_category.id,
                                    }

                                    allList[dataIndex] = tableObject
                                    console.log("tableObject", tableObject)
                                    console.log(allList)
                                    console.log("UpdateCheckLsit", res)
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
                                    {/* {JSON.stringify(this.state.editeRecords,null,2)} */}

                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Select Category
                                        </label>

                                        <select className='form-control'

                                            onChange={(e) => {
                                                setFieldValue("super_category", e.target.value, true)
                                            }}
                                            name="" id="">
                                            <option value={this.state.editeRecords.id}>{this.state.editeRecords.Category}</option>

                                            {this.state.parentCategory.map((data, index) => {

                                                if (data.id != this.state.editeRecords.super_category) {
                                                    return (
                                                        <option value={data.id}>{data.name}</option>
                                                    )
                                                }

                                            })}
                                        </select>

                                    </div>

                                    <small className='text-danger'> {errors.super_category && touched.super_category && errors.super_category}</small>
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