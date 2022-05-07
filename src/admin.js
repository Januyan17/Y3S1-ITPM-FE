import { Button, Layout, Menu, Input, Select } from 'antd';

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
    doctorsList: [],
    addDcotorModal:false,
    type:"Physician",
    name:"",
    image:"",
    deleteDoctorModal:false,
    deleteDoctorId: null,
    updateDoctorModal:false,
    updateDoctorId:null,
    errorList:[],

  };

  async componentDidMount(){
    this.getAllDoctors();
  }

  getAllDoctors = async() =>{

    let array = []
    await axios({
      method: "get",
      url: "http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/getAllDoctors.php",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>{

        array = response.data;
       
      })
      .catch((response) =>{
        //handle error
        console.log(response);
      });
     this.setState({doctorsList:array})
     console.log(array,"array")

  }

  addDoctors = async() =>{

    let payload = {
      name: this.state.name,
      image: this.state.image,
      Type: this.state.type
    }
let array = []
    if(this.state.name===""){
      array.push("please enter name")
    }
    if(this.state.type===""){
      array.push("please enter type")
    }
    if(this.state.image==""){
      array.push("please upload the image")
    }

    this.setState({errorList:array});
    if(array.length==0){
    await axios({
      method: "post",
      url: "http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/createDoctor.php",
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
      type:"Physician",
      addDcotorModal:true,
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
 if(inputs === 'type') {
  this.setState({
    type:e.target.value
  })
}

 }

 handleDelete=(e,record)=>{
  this.setState({deleteDoctorId:record.id,deleteDoctorModal:true})
}

handleUpdate=(e,record)=>{
  this.setState({updateDoctorId:record.id,image:record.image,name:record.name,type:record.Type,updateDoctorModal:true,errorList:[]})
}

deleteDoctor=async()=>{
  await axios({
    method: "delete",
    url: `http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/deleteDoctor.php/${this.state.deleteDoctorId}`,
    headers: { "Content-Type": "application/json" },
  })
    .then((response)=> {
    this.getAllDoctors();
    this.setState({deleteDoctorModal:false})
    })
    .catch( (response) =>{
      console.log(response);
    });
}

updateDoctors = async () =>{

  let array=[];

  if(this.state.name===""){
    array.push("please enter name")
  }
  if(this.state.type===""){
    array.push("please enter type")
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
     Type: this.state.type,
     image: this.state.image
    },
    url: `http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/updateDoctor.php/${this.state.updateDoctorId}`,
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
        title: 'Type',
        dataIndex: 'Type',
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
                label: 'Doctors',
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
             Manage Doctors
             <br></br>
             <br></br>
             <Button onClick={this.showDoctorModal}>+ Add Dcotor</Button>
             <br></br>
             <br></br>
            <Table columns={columns} dataSource={this.state.doctorsList} />
            <Modal title="Add Doctors" visible={this.state.addDcotorModal} onOk={this.addDoctors} onCancel={()=>this.setState({addDcotorModal:false})} >
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
              <label>Type</label> : &ensp;
              <select onChange={(e)=>this.handleChange(e,"type")} value={this.state.type}>
                <option value = {"Physician"}>Physician</option>
                <option value = {"Pediatrician"}>Pediatrician</option>
                <option value = {"Surgeon"}>Surgeon</option>
                </select> <br></br><br></br>
              <label>Image</label> <input type={"file"} onChange={this.handleFile}/>
           </Modal>

           <Modal title="Delete Doctor" visible={this.state.deleteDoctorModal} onOk={this.deleteDoctor} onCancel={()=>this.setState({deleteDoctorModal:false})} >
              Are You sure Want to Delete
           </Modal>


           <Modal title="updateDcotor" visible={this.state.updateDoctorModal} onOk={this.updateDoctors} onCancel={()=>this.setState({updateDoctorModal:false})} >
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
              <label>Type</label> : &ensp;
              <select onChange={(e)=>this.handleChange(e,"type")} value={this.state.type}>
                <option value = {"Physician"}>Physician</option>
                <option value = {"Pediatrician"}>Pediatrician</option>
                <option value = {"Surgeon"}>Surgeon</option>
                </select> <br></br><br></br>
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