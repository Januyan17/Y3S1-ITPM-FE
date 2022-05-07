import React,{useEffect, useState} from "react";
import axios from "axios";
import { Button, DatePicker, Input, Modal, Table } from "antd";
import moment from "moment";


const Users  = () =>{

const [name,setName]  = useState("");
const [address,setAddress]  = useState("");
const [errorList,setErrorList]  = useState([]);

const [mobile,setMobile]  = useState("");
const [date,setDate] = useState(null)
const [time,setTime] = useState("6:am")
const [problem,setProblem] = useState("");
const [doctor,setDoctorId] = useState("null")
const [docotrsList,setDoctorsList] = useState([]);
const [appointmentModal,setAppointmentModal] = useState(false)
const [appointmentList,setAppointmentList] = useState([])
const [editAppointmentModal,setEditAppointmentModal] = useState(false)
const [editId,setEditId] = useState(null)
const [deleteId,setDeleteId] = useState(null)
const [deleteModal,setDeleteModal] = useState(false)




useEffect(() =>{
  const fetchData = async () => {
    await axios({
      method: "get",
      url: "http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/getAllDoctors.php",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>{

      setDoctorsList(response.data)   
      })
      .catch((response) =>{
        //handle error
        console.log(response);
      });
  }

  // call the function
  fetchData()
    // make sure to catch any error
    .catch(console.error);

    fetchAppointments()
    

},[])


const fetchAppointments = async() =>{

  await axios({
    method: "get",
    url: "http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/listAppointments.php",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) =>{

   setAppointmentList(response.data) 
    })
    .catch((response) =>{
      //handle error
      console.log(response);
    });
}


const openAppointmentModal =(e,id)=>{

  setErrorList([])
  setAppointmentModal(true);
  setAddress("")
  setName("")
  setTime("6:am")
  setProblem("")
  setMobile("")
  setDate("")
  setDoctorId(parseInt(id));

}

const handleInput=(e,name)=>{

  if(name==="name"){
    setName(e.target.value)
  }
  if(name==="mobile"){
    setMobile(e.target.value)
  }
  if(name==="address"){
    setAddress(e.target.value)
  }
  if(name==="problem"){
    setProblem(e.target.value)
  }
  if(name==="time"){
    setTime(e.target.value)
  }
}

const handleDate =(date)=>{
  console.log(moment(date._d).format("YYYY-MM-DD"))
setDate(moment(date._d).format("YYYY-MM-DD"));
}


const makeAppointment=async()=>{

//  setErrorList([...new Set(errorList)])

let array = []
  if(!date){
    
    array.push("please specify date")
  }
  if(name===""){
    array.push("please specify name")
 

  }
  if(address===""){
    
    array.push("please specify address")

  }
  if(problem===""){
      array.push("please specify your problem")
    

  }
  if(mobile===""){
    array.push("please enter your contact number")

  }
  if(!/^\d+$/.test(mobile)){
    array.push("please enter only number for mobile")
  }
  if(mobile.length!==10){
    array.push("contact number should contain 10 digits")
  }
  setErrorList(array);
let payload={
  name:name,
  address:address,
  mobile:mobile,
  time: time,
  problem:problem,
  date: date,
  doctorId: doctor
}

if(array.length==0){
await axios({
  method: "post",
  url: "http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/createAppointments.php",
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

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    key: 'mobile',
    
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    
  },
  {
    title: 'Problem',
    dataIndex: 'problem',
    key: 'Type',
    responsive: ['lg'],
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'Type',
    responsive: ['lg'],
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    responsive: ['lg'],
  },
  {
    title: 'Doctor',
    dataIndex: 'doctorName',
    key: 'doctorName',
    responsive: ['lg'],
  },
  {
    title: 'Actions',
    render: (text, record) => (
      <>
      <Button onClick={(e)=>handleUpdate(e,record)}>
        {"Update"}
      </Button> &ensp;
      <Button onClick={(e)=>handleDelete(e,record)}>
        {"Delete"}
      </Button>
      </>
     ),
  },
];


const handleDelete = (e,record) =>{
  setDeleteId(record.id);
  setDeleteModal(true)

}

const handleUpdate = (e,record) =>{

  setAddress(record.address)
  setName(record.name)
  setTime(record.time)
  setProblem(record.problem)
  setMobile(record.mobile)
  setDate(record.date)
  setEditAppointmentModal(true)
  setEditId(record.id)
  setErrorList([])


}

const editAppointment = async()=>{


  let array = []
  if(!date){
    
    array.push("please specify date")
  }
  if(name===""){
    array.push("please specify name")
 

  }
  if(address===""){
    
    array.push("please specify address")

  }
  if(problem===""){
      array.push("please specify your problem")
    

  }
  if(mobile===""){
    array.push("please enter your contact number")

  }
  if(!((/^\d+$/).test(mobile))){
    array.push("please enter only number for mobile")
  }
  if(mobile.length!==10){
    array.push("contact number should contain 10 digits")
  }
  setErrorList(array);
  let payload={
    name:name,
    address:address,
    mobile:mobile,
    time: time,
    problem:problem,
    date: date,
  }
  if(array.length==0){
  await axios({
    method: "put",
    url: `http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/updateAppointments.php/${editId}`,
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
const deleteAppointment=async()=>{
  await axios({
    method: "delete",
    url: `http://127.0.0.1:80/Y3S1-ITPM/Admin/Backend/deleteAppointments.php/${deleteId}`,
    headers: { "Content-Type": "application/json" },
  })
    .then((response)=> {
      fetchAppointments()
      setDeleteModal(false)
    })
    .catch( (response) =>{
      console.log(response);
    });
  

}


return(
 <>
<div>
  <h2 style={{textAlign:"center"}}><b>List of Doctors to make an Appointment</b></h2> <br></br>
  {docotrsList && docotrsList.map((data)=> {

    return (
     <div style={{width:"500px",height:"500px",float:"left",marginLeft:"50px",marginTop:"30px"}}>

     <img src={data.image}  style={{height:"200px",width:"200px"}}/><br></br><br></br>
     <b><label>Name:</label> &ensp; {data.name}</b><br></br>
     <b><label>Type:</label> &ensp; {data.Type}</b><br></br><br></br>
     <Button onClick={(e)=>openAppointmentModal(e,data.id)}>Make an Appointment</Button>
     </div>



    )



  })}

</div>
{/* <div style={{marginTop:"150px"}}> */}
  <Table columns={columns} dataSource={appointmentList} />
  {/* </div> */}
 
 <Modal visible={appointmentModal} onOk ={makeAppointment} onCancel={()=>setAppointmentModal(false)}>
   <div>
     {errorList.map((data)=>{

       return(
         <>
         <span style={{color:"red"}}>{data}</span><br></br>
         </>
       )

     })}

   </div>
   <br></br>
  Name: <Input onChange={(e)=>handleInput(e,"name")}></Input> <br></br>
  Mobile: <Input onChange={(e)=>handleInput(e,"mobile")} ></Input> <br></br>
  Address: <Input onChange={(e)=>handleInput(e,"address")}></Input> <br></br><br></br>
  Date: <DatePicker  value={date?moment(date): null} onChange={handleDate}/> <br></br><br></br><br></br>
  Time: 
  <select onChange={(e)=>handleInput(e,"time")}><option value = "6:am">6:am</option>
  <option value = "7:am">7:am</option>
  <option value = "8:am">8:am</option>
  <option value = "9:am">9:am</option> </select><br></br><br></br>
 your Problem <br></br><textarea onChange={(e)=>handleInput(e,"problem")} style={{width:"400px"}}></textarea>
 </Modal>

 <Modal visible={deleteModal} onOk ={deleteAppointment} onCancel={()=>setDeleteModal(false)}>
   Are you sure you want to delete
</Modal>



 <Modal visible={editAppointmentModal} onOk ={editAppointment} onCancel={()=>setEditAppointmentModal(false)}>
 <div>
     {errorList.map((data)=>{

       return(
         <>
         <span style={{color:"red"}}>{data}</span><br></br>
         </>
       )

     })}

   </div>
   <br></br>
  Name: <Input value ={name} onChange={(e)=>handleInput(e,"name")}></Input> <br></br>
  Mobile: <Input value ={mobile}onChange={(e)=>handleInput(e,"mobile")} ></Input> <br></br>
  Address: <Input value = {address} onChange={(e)=>handleInput(e,"address")}></Input> <br></br><br></br>
  Date: <DatePicker  value={date?moment(date): null} onChange={handleDate}/> <br></br><br></br><br></br>
  Time: 
  <select value = {time} onChange={(e)=>handleInput(e,"time")}><option value = "6:am">6:am</option>
  <option value = "7:am">7:am</option>
  <option value = "8:am">8:am</option>
  <option value = "9:am">9:am</option> </select><br></br><br></br>
 your Problem <br></br><textarea value = {problem} onChange={(e)=>handleInput(e,"problem")} style={{width:"400px"}}></textarea>
 </Modal>
 
 </>

)


}




export default Users