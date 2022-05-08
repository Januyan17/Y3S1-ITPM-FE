import React,{useEffect, useState} from "react";
import axios from "axios";
import { Button, DatePicker, Input, InputNumber, Modal, Table } from "antd";
import moment from "moment";


const Users  = () =>{
const [productId,setProductId] =useState(null)
const [unitPrice,setUnitPrice] =useState(null)
const [quantity,setQuantity]  = useState(null);
const [errorList,setErrorList]  = useState([]);
const [productList,setProductList] = useState([]);
const [cartModal,setCartModal] = useState(false)
const [cartList,setCartList] = useState([])
const [editCartModal,setEditCartModal] = useState(false)
const [editId,setEditId] = useState(null)
const [deleteId,setDeleteId] = useState(null)
const [deleteModal,setDeleteModal] = useState(false)
const [total,setTotal] = useState(null)



useEffect(() =>{
  const fetchData = async () => {
    await axios({
      method: "get",
      url: "http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/getAllProducts.php",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>{

      setProductList(response.data)
      
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
    url: "http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/listCart.php",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) =>{
      let total = 0;
      response.data.map((val)=>{
        total = total+val.totalPrice
        console.log(val.totalPrice,"totalPrice")
      });
      setTotal(total)

   setCartList(response.data) 
    })
    .catch((response) =>{
      //handle error
      console.log(response);
    });
}


const opencartModal =(e,id,price)=>{

 
  setQuantity(null)
  setCartModal(true);
  setProductId(parseFloat(id))
  setUnitPrice(parseFloat(price))
  setErrorList([])

}

const handleInput=(e)=>{

    setQuantity(parseFloat(e))
  
  
}




const createCart=async()=>{

//  setErrorList([...new Set(errorList)])

let array = []
  
  if(!quantity){
    array.push("please enter quantity")
  }

  if(!(cartList.filter(data =>data.productId === productId)).length==0){
    array.push("you have  already added  this product in your cart ..you can update")
  }
  setErrorList(array);
let payload={
  quantity:quantity,
  productId:productId,
  totalPrice:quantity * unitPrice
}

if(array.length==0){
await axios({
  method: "post",
  url: "http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/createCart.php",
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
    title: 'Product Image',
    dataIndex: 'image',
    key: 'productImage',
    render:(text, record)=>(
      <img src={record.image} style={{width:"100px",width:"100px"}}/>
     )
  },
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'mobile',
    
  },
  {
    title: 'Price ',
    dataIndex: 'price',
    key: 'date',
    
  },
  {
    title: 'Qauntity ',
    dataIndex: 'quantity',
    key: 'date',
    
  },
  {
    title: 'Total  Price',
    dataIndex: 'totalPrice',
    key: 'Type',
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

  
  setEditCartModal(true)
  setEditId(record.id)
  setUnitPrice(parseFloat(record.price))
  setErrorList([])
  setQuantity(record.quantity)


}

const editCart = async()=>{
  let array = []

  if(!quantity) {
    array.push("please enter quantity")

  }
  setErrorList(array);
  let payload={
    quantity:quantity,
    totalPrice: quantity*unitPrice
  }
  if(array.length==0){
  await axios({
    method: "put",
    url: `http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/updateCart.php/${editId}`,
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
const deleteCart=async()=>{
  await axios({
    method: "delete",
    url: `http://127.0.0.1:80/Y3S1-ITPM-pharmacy/Admin/Backend/deleteCart.php/${deleteId}`,
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
  <h2 style={{textAlign:"center"}}><b>List of Products</b></h2> <br></br>
  {productList && productList.map((data)=> {

    return (
     <div style={{width:"500px",height:"500px",float:"left",marginLeft:"50px",marginTop:"30px"}}>

     <img src={data.image}  style={{height:"200px",width:"200px"}}/><br></br><br></br>
     <b><label>Name:</label> &ensp; {data.name}</b><br></br>
     <b><label>Price:</label> &ensp; {data.price}</b><br></br><br></br>
     <Button onClick={(e)=>opencartModal(e,data.id,data.price)}>Add to cart</Button>
     </div>



    )



  })}

</div>
<br></br>
  <Table columns={columns} dataSource={cartList} />

 
 <Modal visible={cartModal} onOk ={createCart} onCancel={()=>setCartModal(false)}>
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
  Quantity: <InputNumber onChange={handleInput} min={1} value={quantity}></InputNumber> <br></br>
 </Modal>

 <Modal visible={deleteModal} onOk ={deleteCart} onCancel={()=>setDeleteModal(false)}>
   Are you sure you want to delete
</Modal>



 <Modal visible={editCartModal} onOk ={editCart} onCancel={()=>setEditCartModal(false)}>
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
   Quantity: <InputNumber value = {quantity} min={1} onChange={(e)=>handleInput(e,"qty")}></InputNumber> <br></br>
 </Modal>
 <br></br>
 <h1>Gross total : {total}</h1> 

 
 </>

)


}




export default Users