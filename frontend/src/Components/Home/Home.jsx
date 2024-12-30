import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';




const Home = ({setUser,setLogin}) => {
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  useEffect(()=>{
    getUser();
  },[])
  const getUser=async()=>{
    if(value){
      const res = await axios.get("http://localhost:3000/api/home",{headers:{"Authorization":`Bearer ${value}`}})
    if(res.status==200){
      console.log(res);
      alert("successs")
      setUser(res.data.username);
      setLogin(res.data.accounttype);
    }
    else{
      alert("failed")
    }
  }
  else{
    navigate("/login")
  }
    
  }
    
  return (
    <div>
      <h1 style={{margin:"auto"}}>DATAS</h1>
    </div>
  )
}

export default Home
