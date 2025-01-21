import React, { useState } from 'react'
import '../Signup/Signup.scss';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Signup = () => {
const email = localStorage.getItem('email');
console.log(email);

const navigate = useNavigate();
const [data,setData]=useState({
    email:email,
    username:"",
    password:"",
    cpassword:"",
    accounttype:""
})
const [checkPassword, setCheckPassword] = useState(false);
const [checkCPassword, setCheckCPassword] = useState(false);
const handleChange=(e)=>{
    console.log(e.target.value);
    setData((pre)=>({...pre,[e.target.name]:e.target.value}))
  }
  const handleSubmit= async(e)=>{
	if(checkCPassword&&checkPassword){

    e.preventDefault();
    console.log(data);
    const res = await axios.post("http://localhost:3000/api/signup",data,{headers:{"Content-Type":"application/json"}});
    console.log(res);
    if(res.status==201){
        alert("Sucess")
        localStorage.removeItem('email')
        navigate("/login")
    }
    else if(res.status==403){
        alert("error")
    }
  }
  else{
	alert("enter a strong password")
  }
}
  const handlePassword=(e)=>{
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (regex.test(e.target.value)) {
    setData((pre)=>({...pre,[e.target.name]:e.target.value}));
    if (e.target.name=="password") {
      setCheckPassword(true);
    }else if(e.target.name=="cpassword"){
      setCheckCPassword(true)
    }
  } else {
    if (e.target.name=="password") {
      setCheckPassword(false);
    }else if(e.target.name=="cpassword"){
      setCheckCPassword(false)
    }
  }
  }
  return (
    <div className='Signup'>
       <div className="cardss">
        <div className="cardx">

        
        <div className="card1">
            <div className="head">
            </div>
        </div>
            <div className="card">
                <div className="content">
                <h1>Signup</h1>
                    <form id="signup" onSubmit={handleSubmit}>
                        <input type="text" name="username" id='username' placeholder='Username' onChange={handleChange}/>      
                        <input type="password" name="password" id="password" className={checkPassword? "strong":"weak"} placeholder="" onChange={handlePassword}/>
                        <input type="password" name="cpassword" id="cpassword" placeholder=""  className={checkCPassword? "strong":"weak"} onChange={handlePassword}/>
                        <select name="accounttype" id="accounttype" className='login' onChange={handleChange}>
                            <option value="">Select one option</option>
                            <option value="Seller">Seller</option>
                            <option value="User">User</option>
                        </select>
                        <button className='button-24'>Sign Up</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Signup
