import React, { useState } from 'react'
import '../Email/Email.scss'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Email = () => {
const [email,setEmail] = useState({
    email:""
})
const navigate = useNavigate();
const handleChange=(e)=>{
    console.log(e.target.value);
    setEmail((pre)=>({
        ...pre,[e.target.name]:e.target.value
    }))
}
const handleSubmit= async(e)=>{
    e.preventDefault();
    const res = await axios.post("http://localhost:3000/api/verify",email,{headers:{"Content-Type":"application/json"}})
    console.log(res);
    if(res.status==201){
        console.log(res.data.email);
        localStorage.setItem('email',email.email)
        alert("success")
        navigate("/signup")
    }
    else{
        alert("failed")
    }
}
  return (
    <div>
        <div className="cards">
            <div className="card">
                <div className="content">
                <h1>Email Verification</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <input type="email" name="email" id='email' onChange={handleChange}/>
                        <button className='button-24'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Email
