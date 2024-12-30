import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Login/_Login.scss'
import axios from 'axios'


const Login = () => {
    const navigate = useNavigate();
    const [data,setData] = useState({
        email:"",
        password:""
    })
    const handleChange=(e)=>{
        console.log(e.target.value);
        setData((pre)=>({
            ...pre,[e.target.name]:e.target.value
        }))
    }
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const res = await axios.post("http://localhost:3000/api/signin",data,{headers:{"Content-Type":"application/json"}})
        console.log(res);
        if(res.status==201){
            localStorage.setItem('Auth',res.data.token)
            alert("Success")
            navigate("/")
        } 
        else{
            alert("Failed")
        }  
    }
  return (
         <div className='Login'>
        <div className="cards">
            <div className="card">
                <div className="content">
                <h1>Login</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <input type="email" name="email" id='email' placeholder='Email' onChange={handleChange}/>      
                        <input type="password" name="password" id='password' placeholder='Password' onChange={handleChange}/>
                        {/* <Link to="/email">Verify Mail</Link> */}
                        <button className='button-24'>Login In</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

  )
}

export default Login
