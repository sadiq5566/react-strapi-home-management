import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import Header from "components/Headers/Header.js";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { Modal, FormGroup } from 'reactstrap';
import addarticle from '../api/addarticle';
import ArticleList from '../api/ArticleList';
import UpdateArticleList from '../api/UpdateArticleList';
import axios from "../axios";

import categoryList from '../api/categoryList';
import deletearticle from '../api/deletearticle';

import childcategory from '../api/childcategory';
import CheckLsit from '../api/CheckLsit';
import ChildcheckLsit_api from '../api/ChildcheckLsit_api';

import { Formik, FieldArray, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import ApiLoader from '../components/ApiLoader';
import ArticalDropdown from '../components/articals/ArticalDropdown'
import { MultiSelect } from "react-multi-select-component";
import { data } from 'jquery';
import moment from 'moment';
import parse from 'html-react-parser'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const CategorySchema = Yup.object().shape({
    title: Yup.string().required('Title is required.').min(3, "Minimum 3 letters are required."),
    description: Yup.string().required('Description is required.').min(3, "Minimum 3 letters are required."),
    category_id: Yup.string().required('Category is required.'),
    childcategory_id: Yup.string().required('Child category is required.'),
    // images: Yup.string().required('Image is required.'),

});

// checklist: [
//     {
//         checklistid: '',
//         childchecklistid: [],
//         Allchildchecklistid: [],
//     },
// ],



class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            addCategoriesModal: false,
            deleteModal: false,
            category: [],
            parentCategory: [],
            EditeFrom: false,
            CloneState: false,
            maltiSelct: true,
            editeRecords: [],
            showRecords: [],
            // images: null,
            images: [],

            categoryList: [],
            childcategory: [],
            childcategoryfilterd: [],
            CheckLsit: [],
            ChildcheckLsit_api: [],
            ChildcheckLsit_apiFilterd: [],

            addonsChildCheckList: [],

            showDetailsFrom: false,
            Deleteid: "",

            customFilter: false,


        };




        this.columns = [
            {
                key: "id",
                text: "id",
                className: "title",
                align: "left",
                sortable: true,
            },
            {
                key: "title",
                text: "Title",
                className: "title",
                align: "left",
                sortable: true,
            },
            {
                key: "category_id",
                text: "Super Category",
                className: "description",
                align: "left",
                sortable: true,
            },
            {
                key: "childcategory_id",
                text: "Child Category",
                className: "description",
                align: "left",
                sortable: true,
            },
            {
                key: "created_at",
                text: "Created_at",
                className: "description",
                align: "left",
                sortable: true,
            },
            {
                key: "state",
                text: "State",
                className: "change_style",
                align: "left",
                sortable: true,
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    return (
                        <div className='d-flex  '>
                            <div> <button onClick={() => {

                                this.setState({ CloneState: true })
                                this.editeFrom(record)
                            }}
                                className="btn  btn-sm" >
                                <i class="far fa-copy"></i>
                            </button></div>
                            <div className="d-flex">
                                <button onClick={() => {
                                    this.setState({ CloneState: false })
                                    this.editeFrom(record)
                                }}
                                    className="btn mx-1  btn-sm" >
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button onClick={() => this.showDeleteModal(record.id)}
                                    className="btn mx-1  btn-sm" >
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    );
                }
            },



        ];

        this.config = {
            page_size: 10,
            // length_menu: [10, 20, 50],
            // button: {
            //     excel: true,
            //     csv: true
            // }
        }
    }
    deleteFrom = (record) => {
        let data = {
            id: record
        }
        deletearticle(data).then((res) => {
            if (res.status == 200 || res.statusText == "ok") {
                this.setState({
                    deleteModal: false
                })
                this.getAllArticals()
            }
        })
    }

    editeFrom = data => {
        let EditeFrom = { ...data.otherDetails };
        let objectOption = null
        let checklist = EditeFrom.checklist.map(data => {
            if (data) {
                objectOption =
                {
                    value: data,
                }


                return {
                    checklistid: data.checklistid,
                    childchecklistid: data.childchecklistid,
                    value: 12,
                    type: data.type,
                    childchecklistidArray: [data.childchecklistidArray],
                    malticheck: true,
                }
            }
        })

        EditeFrom.checklist = checklist
        let filterd = this.state.childcategory.filter(data => {
            return data.super_category.id == EditeFrom.category_id
        })

        this.setState({ editeRecords: EditeFrom, EditeFrom: true, childcategoryfilterd: filterd })


    }

    showDetailsFrom = data => {
        this.setState({ showDetailsFrom: true, showRecords: data.otherDetails })
    }

    showDeleteModal = data => {
        this.setState({ deleteModal: true, Deleteid: data })
    }

    componentWillMount() {
        if (!localStorage.getItem("admin_token")) {
            this.props.history.push("/auth/login")
        } else {


            categoryList().then(res => {

                this.setState({ categoryList: res.data })
            }).catch(error => {
                console.log(error)
            })
            childcategory().then(res => {

                this.setState({ childcategory: res.data })
            }).catch(error => {
                console.log(error)
            })
            CheckLsit().then(res => {
                // console.log(res)
                this.setState({ CheckLsit: res.data })
            }).catch(error => {
                console.log(error)
            })
            ChildcheckLsit_api().then(res => {
                // console.log(res)
                this.setState({ ChildcheckLsit_api: res.data })
            }).catch(error => {
                console.log(error)
            })
        }
        // ***************
    }

    componentDidMount() {
        this.getAllArticals()
    }

    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };
    toggleDeleteModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };

    getAllArticals = () => {

        ArticleList().then(res => {
            let tableObject = res.data.map(data => {
                let catid = parseInt(data.category_id)
                let super_name =

                    this.state.categoryList.filter(data => parseInt(data.id) == catid)

                let child_catid = parseInt(data.childcategory_id)
                let child_name = this.state.childcategory.filter(data => parseInt(data.id) == child_catid)
                return {
                    id: data.id,
                    // category_id: data.category_id,

                    category_id: super_name[0].name,
                    childcategory_id: child_name[0].name,
                    created_at: moment(data.createdAt).format("ddd,MMM,YY"),
                    title: data.title,
                    state: parse(`<p>success</p>`),
                    description: data.description,
                    otherDetails: data
                }
            })
            this.setState({ category: tableObject })

            this.setState({ loading: false, EditeFrom: false })
        }).catch(error => {
            console.log(error)
        })
    }

    getOptionView = (id) => {
        let returns = {}

        let object = this.state.CheckLsit.filter((datas, index) => {
            return id == datas.id
            // if (){
            //     return (<option value={data.id}>aaaa</option>)
            // }

        })
        if (object.length) {
            returns.id = object[0].id
            returns.title = object[0].title

        }
        return returns
    }

    getchildCheckListOption = (id) => {
        let filterdObject = this.state.ChildcheckLsit_api.filter(data => {
            return data.checklistid.id == id
        })
        let filterdObjects = filterdObject.map(data => {
            return { label: data.title, value: data.id }
        })
        return filterdObjects
    }

    decQuantity = (item) => {
        if (item.value > 1) {
            return { ...item, value: item.value - 1 };

        }
        else {
            return { ...item }
        }

    }
    incQuantity = (item) => {

        return { ...item, value: item.value + 1 };
    }


    ShowFilter = () => {
        this.setState({
            customFilter: !this.state.customFilter
        })
    }

    render() {

        return (

            <>
                <Header />
                <div className="mt--7 container-fluid">
                    <div className="shadow card">
                        <div className="border-0 card-header d-flex justify-content-between align-items-center ">
                            <div className="custom_head">
                                <h3 class="mb-0">Articles</h3>
                                <p className="entries_found">4 entries found</p>
                            </div>
                            <button className='btn btn-primary set_btn_head'
                                onClick={() => this.toggleModal("addCategoriesModal")}
                            > <i className=" fa fa-plus" /> Add New Articles</button>
                        </div>
                        {/* {JSON.stringify(this.state.category,null,2)} */}

                        <div className="datatable_head">
                            <div className="filers_btn_main">
                                <button type="button" className="filters_btn" onClick={this.ShowFilter}> <i class="fa fa-filter"></i> Filters</button>
                            </div>


                            {this.state.customFilter ?

                                <div className="filters_showed">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="main_filter_show">
                                                <label htmlFor="">Super Category</label>
                                                <select name="" id="">
                                                    <option value="">Super Category</option>
                                                    <option value="">Super Category</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="main_filter_show">
                                                <label htmlFor="">Child Category</label>
                                                <select name="" id="">
                                                    <option value="">Child Category</option>
                                                    <option value="">Super Category</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="main_filter_show">
                                                <label htmlFor="">Author</label>
                                                <select name="" id="">
                                                    <option value="">Author</option>
                                                    <option value="">Super Category</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="main_filter_show">
                                                <label htmlFor=""> Create At</label>
                                                <input type="date" name="" id="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                ''
                            }
                        </div>

                        <div className="custom_filters">
                            <ReactDatatable
                                config={this.config}
                                records={this.state.category}
                                columns={this.columns}
                                extraButtons={this.extraButtons}
                            />
                        </div>
                    </div>
                </div>


                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.addCategoriesModal}
                    toggle={() => this.toggleModal("addCategoriesModal")}
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Add Article
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

                            initialValues={{
                                title: '',
                                description: '',
                                // image: null,
                                images: [],


                                category_id: '',
                                childcategory_id: '',
                                checklist: [
                                    {
                                        checklistid: '',
                                        childchecklistid: '',
                                        childchecklistidArray: [],
                                        value: 0,
                                        qty: ''
                                    },
                                ],
                            }}

                            validationSchema={CategorySchema}



                            onSubmit={(values) => {

                                addarticle(values).then(res => {
                                    let catid = parseInt(res.data.category_id)

                                    let child_catid = parseInt(res.data.childcategory_id)

                                    let tableObject = {
                                        id: res.data.id,
                                        category_id: (this.state.categoryList.filter((data) => parseInt(data.id) == catid))[0].name,
                                        childcategory_id: (this.state.childcategory.filter((data) => parseInt(data.id) == child_catid))[0].name,
                                        created_at: moment(new Date()).format("ddd,MMM,YY"),
                                        title: res.data.title,
                                        state: parse(`<p>success</p>`),
                                        description: res.data.description,
                                        otherDetails: res.data
                                    }

                                    this.setState({
                                        category: [...this.state.category, tableObject],
                                        loading: false,
                                        addCategoriesModal: false,
                                    })

                                }).catch(error => {
                                    console.log(error)
                                })
                            
                                const imgData = new FormData();
                                Array.from(this.state.images).forEach(image => {
                                    imgData.append('files', image);
                                });


                                (axios.post(`http://localhost:1337/upload`, imgData, {
                                    headers: { 'Content-Type': 'multipart/form-data' },
                                })
                                    .then(res => {
                            
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                )

                                let allvalues = { ...values }

                                this.setState({ loading: true })


                                // { <pre>  {JSON.stringify(formData,null,2)}</pre> }
                                // console.log("formmm" , JSON.stringify(formData,null,2)) 


                            }}


                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                setFieldValue,

                                /* and other goodies */
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    {/* <pre>  {JSON.stringify(values,null,2)}</pre> */}
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Add Title
                                        </label>
                                        <input
                                            placeholder='Add Title'
                                            type="text"
                                            name="title"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                        />
                                    </div>

                                    <small className='text-danger'> {errors.title && touched.title && errors.title}</small>


                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >

                                            Image
                                        </label>
                                        {/* <input multiple type="file" className='form-control' onChange={(event) => { setFieldValue("image", event.currentTarget.files); }} name='image' accept="image/*" /> */}
                                        <input
                                            className='form-control'
                                            type="file"
                                            name="images"
                                            onChange={(e) => {

                                                this.setState({
                                                    images: e.target.files,
                                                });
                                            }}
                                            alt="image"
                                        />

                                    </div>
                                    <small className='text-danger'> {errors.images && touched.images && errors.images}</small>
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Add Description
                                        </label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{ removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'], }}
                                            data={values.description}
                                            onInit={(editor) => { }}
                                            onChange={(event, editor) => { let data = editor.getData(); setFieldValue("description", data) }}
                                        />

                                    </div>

                                    <small className='text-danger'> {errors.description && touched.description && errors.description}</small>


                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Select Category
                                        </label>
                                        <select className='form-control'
                                            onChange={(e) => {
                                                setFieldValue("category_id", e.target.value, true);

                                                let filterd = this.state.childcategory.filter(data => {

                                                    return data.super_category.id == e.target.value
                                                })

                                                this.setState({ childcategoryfilterd: filterd })
                                            }}
                                            name="category_id" id="">
                                            <option value="">Select Super Category</option>
                                            {this.state.categoryList.map((data, index) => {
                                                return (
                                                    <option value={data.id}>{data.name}</option>
                                                )
                                            })}
                                        </select>

                                    </div>
                                    <small className='text-danger'> {errors.category_id && touched.category_id && errors.category_id}</small>
                                    {/* {JSON.stringify(this.state.childcategoryfilterd,null,2)} */}
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Select Child Category
                                        </label>

                                        <select className='form-control'
                                            onChange={(e) => {

                                                setFieldValue("childcategory_id", e.target.value, true)
                                            }}
                                            name="childcategory_id" id="">
                                            <option value="">Select child Category</option>

                                            {
                                                this.state.childcategory.map((data, index) => {
                                                    return (
                                                        <option value={data.id}>{data.name}</option>
                                                    )
                                                })}
                                        </select>

                                    </div>
                                    <small className='text-danger'> {errors.childcategory_id && touched.childcategory_id && errors.childcategory_id}</small>
                                    <FieldArray name="checklist">
                                        {({ insert, remove, push, replace }) => (
                                            <div>

                                                {values.checklist.length > 0 &&
                                                    values.checklist.map((checklist, index) => (
                                                        <div className="row border mt-2 py-1 my-1" key={index}>
                                                            <div className="col-12">
                                                                <div className='d-flex justify-content-between'>
                                                                    <div>    <label htmlFor={`checklist.${index}.name`}>  Select Check list

                                                                    </label></div>

                                                                    <div>  ({(Number(index) + 1)})
                                                                        {index !== 0 && (<button
                                                                            type="button"
                                                                            className="btn btn-primary float-right btn-sm ml-2"
                                                                            onClick={() => remove(index)}
                                                                        >

                                                                            X
                                                                        </button>)}

                                                                    </div>
                                                                </div>

                                                                <select className='form-control'
                                                                    onChange={(e) => {

                                                                        setFieldValue(`checklist.${index}.childchecklistid`, "", true)
                                                                        setFieldValue(`checklist.${index}.qty`, [], true)

                                                                        let filterdObject = this.state.ChildcheckLsit_api.filter(data => {
                                                                            return data.parent_check_list.id == e.target.value
                                                                        })

                                                                        setFieldValue(`checklist.${index}.checklistid`, e.target.value, true)
                                                                        setFieldValue(`checklist.${index}.childchecklistidArray`, filterdObject, true)
                                                                    }}>

                                                                    <option value="">Select check list</option>
                                                                    {this.state.CheckLsit.map((data, index) => {

                                                                        return (
                                                                            <option value={data.id}>{data.title}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                                <ErrorMessage
                                                                    name={`checklist.${index}.checklistid`}
                                                                    component="small"
                                                                    className="text-danger"
                                                                />
                                                            </div>
                                                            {values.checklist[index].childchecklistidArray && values.checklist[index].childchecklistidArray.length > 0 && (
                                                                <>
                                                                    <div className="col-12">
                                                                        <label htmlFor={`checklist.${index}.name`}>  Select child Check list

                                                                        </label>

                                                                        <select className='form-control'
                                                                            onChange={(e) => {
                                                                                let filterdObject = values.checklist[index].childchecklistidArray.filter(data => {
                                                                                    return data.id == e.target.value
                                                                                })
                                                                                setFieldValue(`checklist.${index}.type`, filterdObject[0].type, true)
                                                                                setFieldValue(`checklist.${index}.childchecklistid`, e.target.value, true)
                                                                            }}  >
                                                                            <option value="">Select child check list</option>
                                                                            {values.checklist[index].childchecklistidArray.map((data, index) => {
                                                                                return (
                                                                                    <option value={data.id}>{data.title}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                        <ErrorMessage
                                                                            name={`checklist.${index}.checklistid`}
                                                                            component="small"
                                                                            className="text-danger"
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {values.checklist[index].childchecklistid && values.checklist[index].childchecklistid.length > 0 && (
                                                                <>
                                                                    <div className='col-8 pr-0'>
                                                                        <div>
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="example-text-input"
                                                                            >
                                                                                Add {values.checklist[index].type}
                                                                            </label>
                                                                            {/* {JSON.stringify(values.checklist[index], null, 2)} */}
                                                                            <div className="checklist-quantity">
                                                                                <button onClick={(e) => { e.preventDefault(); replace(index, this.incQuantity(values.checklist[index])) }} className="btn-primary">+</button>
                                                                                <input
                                                                                    type="text"
                                                                                    name="quantity"
                                                                                    className='form-control'
                                                                                    onBlur={handleBlur}
                                                                                    value={values.checklist[index].value}
                                                                                    disabled
                                                                                />
                                                                                <button onClick={(e) => { e.preventDefault(); replace(index, this.decQuantity(values.checklist[index])) }} className="btn-danger">-</button>
                                                                            </div>
                                                                            {/* <input
                                                                                placeholder='Add Qty'
                                                                                type="number"
                                                                                className='form-control'

                                                                                name={`checklist.${index}.value`}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.checklist[index].value}
                                                                            /> */}
                                                                        </div>

                                                                        <small className='text-danger'>  <ErrorMessage
                                                                            name={`checklist.${index}.value`}
                                                                            component="small"
                                                                            className="text-danger"
                                                                        /></small>
                                                                    </div>
                                                                    <div className="col-4 pl-1">
                                                                        <div>
                                                                            <label
                                                                                className="form-control-label"
                                                                                htmlFor="example-text-input"
                                                                            >
                                                                                Type
                                                                            </label>
                                                                            <input
                                                                                placeholder='Type'
                                                                                type="text"
                                                                                className='form-control'
                                                                                disabled
                                                                                value={values.checklist[index].type}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}

                                                {/* <pre>{JSON.stringify(values.checklist,null,2)}</pre> */}

                                                <div className='d-flex justify-content-end my-2'>
                                                    <button type="button" className='btn btn-sm btn-primary text-right'
                                                        onClick={() => { push({ checklistid: '', childchecklistid: "", childchecklistidArray: [], value: 0 }) }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>




                                    <div className=' my-2'>
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


                {/* edite from  */}


                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.EditeFrom}
                    toggle={() => this.toggleModal("EditeFrom")}
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {
                                this.state.CloneState ? (<p>Clone Article</p>) : (<p>Edit Articles</p>)

                            }
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("EditeFrom")}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body pt-0">
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}

                        <Formik

                            initialValues={{
                                title: this.state.editeRecords.title,
                                description: this.state.editeRecords.description,
                                images: [],
                                // images:null/,
                                category_id: this.state.editeRecords.category_id,
                                childcategory_id: this.state.editeRecords.childcategory_id,
                                checklist: [
                                    // {
                                    //     checklistid: '',
                                    //     childchecklistid: [],
                                    //     childchecklistidArray: [],
                                    //     value: 0,
                                    //     qty: ''
                                    // },
                                ],
                                id: this.state.editeRecords.id

                            }}


                            onSubmit={(values) => {

                                let dataObject = []
                                if (this.state.editeRecords.checklist.length > 0) {
                                    this.state.editeRecords.checklist.map((data) => {
                                        return (dataObject = {
                                            checklistid: data.checklistid,
                                            childchecklistid: data.childchecklistid,
                                            childchecklistidArray: data.childchecklistidArray,
                                            type: data.type,
                                            value: data.value
                                        })
                                    })

                                }

                                let dataArray = null

                                if (values.checklist == []) {
                                    values.checklist.push(dataObject)

                                }

                                else {
                                    values.checklist.push(dataObject)
                                }



                                const imgData = new FormData();
                                Array.from(this.state.images).forEach(image => {
                                    imgData.append('files', image);
                                });


                                (axios.post(`http://localhost:1337/upload`, imgData, {
                                    headers: { 'Content-Type': 'multipart/form-data' },
                                })
                                    .then(res => {
                                        console.log("img res", res);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                )





                                this.state.CloneState != true
                                    ?

                                    // this.setState({ loading: true }
                                    UpdateArticleList(values).then(res => {

                                        this.getAllArticals()
                                        this.setState({
                                            loading: false,
                                            addCategoriesModal: false,
                                        })

                                    }).catch(error => {
                                        console.log(error)
                                    })



                                    :
                                    addarticle(values).then(res => {
                                        let dta = [res.data]

                                        let tableObject = dta.map(data => {
                                            let catid = parseInt(data.category_id)
                                            let super_name = this.state.categoryList.filter(data => parseInt(data.id) == catid)
                                            let child_catid = parseInt(data.childcategory_id)
                                            let child_name = this.state.childcategory.filter(data => parseInt(data.id) == child_catid)

                                            return {


                                                id: data.id,
                                                // category_id: data.category_id,
                                                category_id: super_name[0].name,
                                                childcategory_id: child_name[0].name,
                                                created_at: moment(new Date()).format("ddd,MMM,YY"),
                                                title: data.title,
                                                state: parse(`<p>success</p>`),
                                                description: data.description,
                                                otherDetails: data
                                            }
                                        })

                                        this.setState({
                                            category: [...this.state.category, tableObject[0]],
                                            loading: false,
                                            addCategoriesModal: false,
                                        })
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
                                    {/* <pre> {JSON.stringify(values, null, 2)}</pre> */}
                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Add Title
                                        </label>
                                        <input
                                            placeholder='Add Title'
                                            type="text"
                                            name="title"
                                            className='form-control'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                        />
                                    </div>

                                    <small className='text-danger'> {errors.title && touched.title && errors.title}</small>


                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Image
                                        </label>
                                        {/* <input multiple type="file" className='form-control' onChange={(event) => { setFieldValue("image", event.currentTarget.files); }} name='image' accept="image/*" /> */}
                                        <input
                                            type="file"
                                            className='form-control'
                                            name="images"
                                            onChange={(e) => {

                                                this.setState({
                                                    images: e.target.files,
                                                });
                                            }}
                                            alt="image"
                                        />
                                    </div>
                                    <small className='text-danger'> {errors.images && touched.images && errors.images}</small>

                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Add Description
                                        </label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{ removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'], }}
                                            data={values.description}
                                            onInit={(editor) => { }}
                                            onChange={(event, editor) => { let data = editor.getData(); setFieldValue("Description", data) }}
                                        />
                                    </div>

                                    <small className='text-danger'> {errors.description && touched.description && errors.description}</small>

                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Select Category
                                        </label>
                                        <select className='form-control'
                                            onChange={(e) => {
                                                setFieldValue("category_id", e.target.value, true);
                                                let filterd = this.state.childcategory.filter(data => {
                                                    return data.super_category.id == e.target.value
                                                })
                                                this.setState({ childcategoryfilterd: filterd })
                                            }}
                                            name="" id="">

                                            <option value={this.state.editeRecords.category_id}>

                                                {this.state.editeRecords.category_id && this.state.categoryList.filter((data) => data.id == this.state.editeRecords.category_id)[0].name ? this.state.categoryList.filter((data) => data.id == this.state.editeRecords.category_id)[0].name : "Select Super Category"}</option>
                                            {this.state.categoryList.map((data, index) => {

                                                if (data.id != this.state.editeRecords.category_id) {
                                                    return (
                                                        <option value={data.id}>{data.name}</option>
                                                    )
                                                }

                                            })}
                                        </select>

                                    </div>
                                    <small className='text-danger'> {errors.category_id && touched.category_id && errors.category_id}</small>

                                    <div>
                                        <label
                                            className="form-control-label"
                                            htmlFor="example-text-input"
                                        >
                                            Select Child Category
                                        </label>

                                        <select className='form-control'
                                            onChange={(e) => {
                                                setFieldValue("childcategory_id", e.target.value, true)

                                            }}
                                            name="" id="">

                                            <option value={this.state.editeRecords.childcategory_id ? this.state.editeRecords.childcategory_id : ""}>{this.state.editeRecords.childcategory_id ? this.state.childcategory.filter((data) => data.id == this.state.editeRecords.childcategory_id)[0].name : "Select child Category"}</option>
                                            {this.state.childcategoryfilterd.map((data, index) => {
                                                if (data.id != this.state.editeRecords.childcategory_id) {
                                                    return (
                                                        <option value={data.id}>{data.name}</option>
                                                    )
                                                }

                                            })}
                                        </select>
                                        <div>
                                            {this.state.editeRecords.checklist.length > 0 &&
                                                this.state.editeRecords.checklist.map((checklist, index) => (
                                                    <div className="row border mt-2 py-1 my-1" key={index}>
                                                        <div className="col-12">
                                                            <div className='d-flex justify-content-between'>
                                                                <div>    <label htmlFor={`checklist.${index}.name`}>  Select Check list

                                                                </label></div>
                                                                <div>  ({(Number(index) + 1)})

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary float-right btn-sm ml-2"

                                                                        onClick={() => {
                                                                            let a = []; let dataArr = this.state.editeRecords.checklist;
                                                                            dataArr.map((data, i) => {

                                                                                if (i != index) {
                                                                                    a.push(data)
                                                                                }
                                                                            })
                                                                            this.setState(prevState => ({
                                                                                editeRecords: {
                                                                                    ...prevState.editeRecords,
                                                                                    checklist: a
                                                                                }
                                                                            }))
                                                                        }}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <select disabled className='form-control'

                                                                onChange={(e) => {
                                                                    setFieldValue(`checklist.${index}.childchecklistid`, [], true)
                                                                    setFieldValue(`checklist.${index}.Qty`, [], true)
                                                                    let filterdObject = this.state.ChildcheckLsit_api.filter(data => {

                                                                        return data.parent_check_list.id == e.target.value
                                                                    })


                                                                    setFieldValue(`checklist.${index}.checklistid`, e.target.value, true)
                                                                    setFieldValue(`checklist.${index}.childchecklistidArray`, filterdObject, true)
                                                                }}>

                                                                <option value={checklist.checklistid}>{checklist.checklistid ? (this.state.CheckLsit.filter(data => data.id == checklist.checklistid))[0].title : "Select check list"}</option>
                                                                {this.state.CheckLsit.map((data, index) => {
                                                                    if (checklist.checklistid != data.id) {
                                                                        return (
                                                                            <option value={data.id}>{data.title}</option>
                                                                        )
                                                                    }

                                                                })}
                                                            </select>
                                                            <ErrorMessage
                                                                name={`checklist.${index}.checklistid`}
                                                                component="small"
                                                                className="text-danger"
                                                            />
                                                        </div>


                                                        <>
                                                            <div className="col-12">
                                                                <label htmlFor={`checklist.${index}.name`}>  Select child Check list
                                                                </label>



                                                                <select disabled className='form-control'
                                                                    onChange={(e) => {
                                                                        let filterdObject = this.state.editeRecords.checklist[index].childchecklistidArray.filter(data => {
                                                                            return data.id == e.target.value
                                                                        })
                                                                        setFieldValue(`checklist.${index}.type`, filterdObject[0].type, true)
                                                                        setFieldValue(`checklist.${index}.childchecklistid`, e.target.value, true)
                                                                    }}  >
                                                                    <option value={checklist.childchecklistid}>{checklist.childchecklistid && checklist.childchecklistid[0] ? ((this.state.ChildcheckLsit_api.filter((data) => data.id == checklist.childchecklistid))[0].title) : "Select child check list"}</option>

                                                                    {this.state.ChildcheckLsit_api.map((data, index) => {

                                                                        if ((data.id != checklist.childchecklistid) && (data.checklistid == checklist.checklistid)) {

                                                                            return (
                                                                                <option value={data.id}>{data.title}</option>
                                                                            )
                                                                        }

                                                                    })}
                                                                </select>

                                                                <ErrorMessage
                                                                    name={`checklist.${index}.checklistid`}
                                                                    component="small"
                                                                    className="text-danger"
                                                                />
                                                            </div>
                                                        </>


                                                        <>
                                                            <div className='col-8 pr-0'>
                                                                <div>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="example-text-input"
                                                                    >
                                                                        Add {checklist && checklist.value.type}
                                                                    </label>
                                                                    {/* {JSON.stringify(values.checklist[index], null, 2)} */}
                                                                    <input
                                                                        disabled
                                                                        placeholder='Add Qty'
                                                                        type="text"
                                                                        className='form-control'
                                                                        name={checklist && checklist.value}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={checklist && checklist.value}
                                                                    />
                                                                </div>

                                                                <small className='text-danger'>  <ErrorMessage
                                                                    name={`checklist.${index}.value`}
                                                                    component="small"
                                                                    className="text-danger"
                                                                /></small>
                                                            </div>
                                                            <div className="col-4 pl-1">
                                                                <div>
                                                                    <label
                                                                        className="form-control-label"
                                                                        htmlFor="example-text-input"
                                                                    >
                                                                        Type
                                                                    </label>
                                                                    <input
                                                                        placeholder='Type'
                                                                        type="text"
                                                                        className='form-control'
                                                                        disabled
                                                                        value={checklist && checklist.type}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    </div>
                                                ))}


                                        </div>

                                        <FieldArray name="checklist">
                                            {({ insert, remove, push, replace }) => (
                                                <div>
                                                    {values.checklist.length > 0 &&
                                                        values.checklist.map((checklist, index) => (
                                                            <div className="row border mt-2 py-1 my-1" key={index}>
                                                                <div className="col-12">
                                                                    <div className='d-flex justify-content-between'>
                                                                        <div>    <label htmlFor={`checklist.${index}.name`}>  Select Check list

                                                                        </label></div>
                                                                        <div>  ({Number(index) + 1})
                                                                            {Number(index) !== 0 && (<button
                                                                                type="button"
                                                                                className="btn btn-primary float-right btn-sm ml-2"
                                                                                onClick={() => remove(index)}
                                                                            >
                                                                                X
                                                                            </button>)}
                                                                        </div>
                                                                    </div>

                                                                    <select className='form-control'
                                                                        onChange={(e) => {
                                                                            setFieldValue(`checklist.${index}.childchecklistid`, "", true)
                                                                            setFieldValue(`checklist.${index}.qty`, [], true)

                                                                            let filterdObject = this.state.ChildcheckLsit_api.filter(data => {
                                                                                return data.parent_check_list.id == e.target.value

                                                                            })

                                                                            setFieldValue(`checklist.${index}.checklistid`, e.target.value, true)
                                                                            setFieldValue(`checklist.${index}.childchecklistidArray`, filterdObject, true)
                                                                        }}>
                                                                        <option value="">Select check list</option>
                                                                        {this.state.CheckLsit.map((data, index) => {
                                                                            return (
                                                                                <option value={data.id}>{data.title}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                    <ErrorMessage
                                                                        name={`checklist.${index}.checklistid`}
                                                                        component="small"
                                                                        className="text-danger"
                                                                    />
                                                                </div>

                                                                {values.checklist[index].childchecklistidArray && values.checklist[index].childchecklistidArray.length > 0 && (

                                                                    <>
                                                                        <div className="col-12">
                                                                            <label htmlFor={`checklist.${index}.name`}>  Select child Check list

                                                                            </label>

                                                                            <select className='form-control'
                                                                                onChange={(e) => {

                                                                                    let filterdObject = values.checklist[index].childchecklistidArray.filter(data => {
                                                                                        return data.id == e.target.value
                                                                                    })
                                                                                    setFieldValue(`checklist.${index}.type`, filterdObject[0].type, true)
                                                                                    setFieldValue(`checklist.${index}.childchecklistid`, e.target.value, true)
                                                                                }}  >
                                                                                <option value="">Select child check list</option>
                                                                                {values.checklist[index].childchecklistidArray.map((data, index) => {
                                                                                    console.log("last data", data)
                                                                                    return (
                                                                                        <option value={data.id}>{data.title}</option>
                                                                                    )
                                                                                })}
                                                                            </select>
                                                                            <ErrorMessage
                                                                                name={`checklist.${index}.checklistid`}
                                                                                component="small"
                                                                                className="text-danger"
                                                                            />
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {values.checklist[index].childchecklistid && values.checklist[index].childchecklistid.length > 0 && (
                                                                    <>
                                                                        <div className='col-8 pr-0'>
                                                                            <div>
                                                                                <label
                                                                                    className="form-control-label"
                                                                                    htmlFor="example-text-input"
                                                                                >
                                                                                    Add {values.checklist[index].type}
                                                                                </label>
                                                                                {/* {JSON.stringify(values.checklist[index], null, 2)} */}
                                                                                <div className="checklist-quantity">
                                                                                    <button onClick={(e) => { e.preventDefault(); replace(index, this.incQuantity(values.checklist[index])) }} className="btn-primary">+</button>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="quantity"
                                                                                        className='form-control'
                                                                                        onBlur={handleBlur}
                                                                                        value={values.checklist[index].value}
                                                                                        disabled
                                                                                    />
                                                                                    <button onClick={(e) => { e.preventDefault(); replace(index, this.decQuantity(values.checklist[index])) }} className="btn-danger">-</button>
                                                                                </div>

                                                                            </div>

                                                                            <small className='text-danger'>  <ErrorMessage
                                                                                name={`checklist.${index}.value`}
                                                                                component="small"
                                                                                className="text-danger"
                                                                            /></small>
                                                                        </div>
                                                                        <div className="col-4 pl-1">
                                                                            <div>
                                                                                <label
                                                                                    className="form-control-label"
                                                                                    htmlFor="example-text-input"
                                                                                >
                                                                                    Type
                                                                                </label>
                                                                                <input
                                                                                    placeholder='Type'
                                                                                    type="text"
                                                                                    className='form-control'
                                                                                    disabled
                                                                                    value={values.checklist[index].type}
                                                                                />
                                                                            </div>


                                                                        </div>

                                                                    </>
                                                                )}


                                                            </div>
                                                        ))}

                                                    {/* <pre>{JSON.stringify(values.checklist,null,2)}</pre> */}

                                                    <div className='d-flex justify-content-end my-2'>
                                                        <button type="button" className='btn btn-sm btn-primary text-right'
                                                            onClick={() => push({ checklistid: '', childchecklistid: '', childchecklistidArray: [], value: 0 })}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </FieldArray>




                                    </div>
                                    <small className='text-danger'> {errors.childcategory_id && touched.childcategory_id && errors.childcategory_id}</small>
                                    <div className=' my-2'>
                                        <button type="submit" className='btn btn-primary text-right'
                                            disabled={this.state.loading}
                                            onClick={() => this.toggleModal("EditeFrom")}
                                        >
                                            {this.state.loading && <ApiLoader />}
                                            {!this.state.loading && "Submit"}
                                        </button>
                                    </div>

                                </form>
                            )}
                        </Formik>
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                    </div>
                </Modal>

                {/* showDetailsFrom */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.showDetailsFrom}
                    toggle={() => this.toggleModal("showDetailsFrom")}
                >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Articles Details
                        </h5>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.toggleModal("showDetailsFrom")}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body pt-0">
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                        <p><b>Title:</b> {this.state.showRecords.title}</p>
                        <p><b>Description:</b> {this.state.showRecords.Description}</p>
                        <p><b>Supper Category:</b> {this.state.showRecords.category_id && this.state.showRecords.category_id.name}</p>
                        <p><b>Child Category:</b> {this.state.showRecords.childcategory_id && this.state.showRecords.childcategory_id.name}</p>
                        {/* <pre>{JSON.stringify(this.state.showRecords.checklist && this.state.showRecords.checklist[0] && this.state.showRecords.checklist[0].childchecklistid, null, 2)}</pre> */}
                        {this.state.showRecords.checklist &&
                            this.state.showRecords.checklist.map(data => {
                                return (
                                    <div className='border p-2 my-1'>
                                        <p className='mb-0 pb-0'><b>Parent check list :</b> {data.checklistid.name}</p>
                                        {/* {JSON.stringify(data.childchecklistid,null,2)} */}
                                        <div className='d-flex justify-content-between'>
                                            <div>  <span className='mr-2'> child check list: </span></div>
                                            <div className='flex-grow-1'>
                                                {data.childchecklistid.map(datas => {
                                                    return <button className='btn m-1 btn-sm bg-success '>{datas.childName}</button>
                                                })}
                                            </div>
                                        </div>


                                    </div>
                                )
                            })}
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                    </div>
                </Modal>
                {/* delete modal */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={this.state.deleteModal}
                    toggle={() => this.setState({ deleteModal: false })}
                >
                    <div className="modal-header">

                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => this.setState({ deleteModal: false })}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body pt-0">
                        {/* &&&&&&&&&&&&&&&&&&&&&&&&& */}
                        <h4>Are You Sure You Want To Delete This Article?</h4>
                        <div className="d-flex justify-content-end mt-4 ">
                            <button onClick={() => this.deleteFrom(this.state.Deleteid)} className="btn mx-1 btn-danger" >Delete</button>
                            <button onClick={() => this.setState({ deleteModal: false })} className="btn mx-1 btn-danger">Cancel</button>
                        </div>

                    </div>
                </Modal>




            </>


        )
    }
}

export default Articles;