import React, { useEffect, useState } from 'react'
import '../EditSeller/EditSeller.scss'
import axios from 'axios';
const EditSeller = ({setUser,setLogin}) => {

    const value = localStorage.getItem('Auth')
    console.log(value);
    const [data,setData]=useState({
        sellerId:"",
        name:"",
        location:""
    })
    useEffect(()=>{
        getDetails();
    },[])
    const getDetails=async()=>{
        const res = await axios.get("http://localhost:3000/api/seller", { headers: { "Authorization": `Bearer ${value}` } })
        console.log(res);
        if(res.status==201){
            setData(res.data.seller)
            setUser(res.data.username);
            setLogin(res.data.accounttype);  
        }
        else{
            alert("error")
        }
        
    }
    console.log(data);

    const handleChange=(e)=>{
        console.log(e.target.value);
        setData((pre)=>({
            ...pre,[e.target.name]:e.target.value
        }))
    }
    
    const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log(data);
    const res = await axios.post("http://localhost:3000/api/editseller",data,{ headers: { "Authorization": `Bearer ${value}` } })
    console.log(res);
    if(res.status==201){
      alert("Success")
    }
    else{
      alert(res.data.msg)
    }
}
 
    
  return (
    <div className='edit'>
      <div className="mains">
        <div className="main">
            <h1>Edit Seller</h1>
            <form onSubmit={handleSubmit}>
                <input type="text"  placeholder='Name' id='name' name='name' onChange={handleChange}/>
                <input type="text"  placeholder="Location" id='location' name="location" onChange={handleChange}/>
                <div className="buttons">
                    <button className='button-3'>Submit</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default EditSeller
