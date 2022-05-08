import { Button, Layout, Menu, Input, Select, InputNumber } from 'antd';

import React from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Table,Modal} from 'antd';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
    productsList: [],
    productsListConstant:[],
    addProductModal:false,
    price:null,
    name:"",
    image:"",
    deleteProductModal:false,
    deleteProductId: null,
    updateProductModal:false,
    updateProductId:null,
    errorList:[],
    search:"",
  };

  async componentDidMount(){
    this.getAllProducts();
  }

  getAllProducts = async() =>{

    let array = []
    await axios({
      method: "get",
      url: "http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/getAllProducts.php",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>{

        array = response.data;
       
      })
      .catch((response) =>{
        //handle error
        console.log(response);
      });
     this.setState({productsList:array})
     this.setState({productsListConstant:array})


  }

  addProducts = async() =>{

    let payload = {
      name: this.state.name,
      image: this.state.image,
      price: this.state.price
    }
let array = []
    if(this.state.name===""){
      array.push("please enter name")
    }
    if(!this.state.price){
      array.push("please enter price")
    }
    if(this.state.image==""){
      array.push("please upload the image")
    }

    this.setState({errorList:array});
    if(array.length==0){
    await axios({
      method: "post",
      url: "http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/createProduct.php",
      data: payload,
      headers: { "Content-Type": "application/json" },
    })
      .then((response)=> {
       window.location.reload();
      })
      .catch( (response) =>{
        console.log(response);
      });
    }
  }

  handleSearch=(e)=>{
    let array  = this.state.productsListConstant.filter(data => data.name.includes(e.target.value))
    this.setState({productsList:array,search:e.target.value})
  }

  getBase64=(file) =>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handleFile=(e)=>{
    this.getBase64(e.target.files[0]).then(
      data =>this.setState({image:data})
    );

  }

  showDoctorModal=()=>{
    this.setState({
      image:"",
      name:"",
      price:null,
      addProductModal:true,
      errorList:[]
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
 handleChange=(e,inputs)=>{
 if(inputs === 'name') {
   this.setState({
     name:e.target.value
   })
 }
 if(inputs === 'price') {
  this.setState({
    price:parseFloat(e)
  })
}

 }

 handleReset=()=>{
   this.setState({
     search:"",
     productsList:this.state.productsListConstant
   })
 }

 handleDelete=(e,record)=>{
  this.setState({deleteProductId:record.id,deleteProductModal:true})
}

handleUpdate=(e,record)=>{
  this.setState({updateProductId:record.id,image:record.image,name:record.name,price:record.price,updateProductModal:true,errorList:[]})
}

deleteProduct=async()=>{
  await axios({
    method: "delete",
    url: `http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/deleteProduct.php/${this.state.deleteProductId}`,
    headers: { "Content-Type": "application/json" },
  })
    .then((response)=> {
    this.getAllProducts();
    this.setState({deleteProductModal:false})
    })
    .catch( (response) =>{
      console.log(response);
    });
}

updateProducts = async () =>{

  let array=[];

  if(this.state.name===""){
    array.push("please enter name")
  }
  if(!this.state.price){
    array.push("please enter price")
  }
  
  if(this.state.image==""){
    array.push("please upload the image")
  }
  this.setState({errorList:array});

  if(array.length==0){
  await axios({
    method: "put",
    data:{
     name: this.state.name,
     price: this.state.price,
     image: this.state.image
    },
    url: `http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/updateProduct.php/${this.state.updateProductId}`,
    headers: { "Content-Type": "application/json" },
  })
    .then((response)=> {
    window.location.reload();
    })
    .catch( (response) =>{
      console.log(response);
    });
  }
}
  render() {
    

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        responsive: ['md'],
        render:(text, record)=>(
         <img src={record.image} style={{width:"100px",width:"100px"}}/>
        )
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'Type',
        responsive: ['lg'],
      },
      {
        title: 'Actions',
        render: (text, record) => (
          <>
          <Button onClick={(e)=>this.handleUpdate(e,record)}>
            {"Update"}
          </Button> &ensp;
          <Button onClick={(e)=>this.handleDelete(e,record)}>
            {"Delete"}
          </Button>
          </>
         ),
      },
    ];

   
    return (

     
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'Products',
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
             Manage Products
             <br></br>
             <br></br>
             <Button onClick={this.showDoctorModal}>+ Add Product</Button>
             <br></br>
             <br></br>
             <Input placeholder='search by name' value={this.state.search} onChange={this.handleSearch}></Input> <br></br><br></br> <Button onClick={this.handleReset}>Reset Search</Button>    <br></br><br></br>
            <Table columns={columns} dataSource={this.state.productsList} />
            <Modal title="Add Products" visible={this.state.addProductModal} onOk={this.addProducts} onCancel={()=>this.setState({addProductModal:false})} >
            <div>
              {this.state.errorList.map((data)=>{

                return(
                  <>
                  <span style={{color:"red"}}>{data}</span><br></br>
                  </>
                )

              })}

            </div>
            <br></br>
              <label>Name</label> : &ensp;<Input value={this.state.name} onChange={(e)=>this.handleChange(e,"name")}></Input> <br></br><br></br>
              <label>Price</label> : &ensp;<InputNumber min={1} value={this.state.price} onChange={(e)=>this.handleChange(e,"price")}></InputNumber> <br></br><br></br>

              <label>Image</label> <input type={"file"} onChange={this.handleFile}/>
           </Modal>

           <Modal title="Delete Product" visible={this.state.deleteProductModal} onOk={this.deleteProduct} onCancel={()=>this.setState({deleteProductModal:false})} >
              Are You sure Want to Delete
           </Modal>


           <Modal title="update product" visible={this.state.updateProductModal} onOk={this.updateProducts} onCancel={()=>this.setState({updateProductModal:false})} >
           <div>
              {this.state.errorList.map((data)=>{

                return(
                  <>
                  <span style={{color:"red"}}>{data}</span><br></br>
                  </>
                )

              })}

            </div>
            <br></br>
              <label>Name</label> : &ensp;<Input value={this.state.name} onChange={(e)=>this.handleChange(e,"name")}></Input> <br></br><br></br>
             
              <label>Price</label> : &ensp;<InputNumber min={1} value={this.state.price} onChange={(e)=>this.handleChange(e,"price")}></InputNumber> <br></br><br></br>
              current Image : <img src ={this.state.image} style={{height:"100px",width:"100px"}}/><br></br><br></br>

              <label>Image</label> <input type={"file"} onChange={this.handleFile}/>
           </Modal>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default () => <SiderDemo />;