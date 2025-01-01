import React, { useEffect, useState } from 'react'
import '../CatProd/CatProd.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const CatProd = ({ setUser, setLogin }) => {
    const {category} =useParams();
    const value = localStorage.getItem('Auth');
    const [products,setProducts] = useState([])
    useEffect(()=>{
        getProduct();
        getDetails();
    },[category])

    const getProduct = async()=>{
      
        const res = await axios.get(`http://localhost:3000/api/getpcat/${category}`)
        if(res.status==201){
            setProducts([...res.data])
        }
        else{
            alert("error")
        }
        
    }
    const getDetails = async () => {
        try {
          const res = await axios.get("http://localhost:3000/api/seller", { headers: { "Authorization": `Bearer ${value}` } });
          if (res.status === 201) {  
            setUser(res.data.username);
            setLogin(res.data.accounttype);
          } else {
            alert("Error fetching seller details");
          }
        } catch (error) {
          console.error("Error fetching seller details", error);
          alert("Failed to fetch seller details");
        }
      };
    
  return (
    <div className='catprod'>
        <div className="main">
            
            <div className="cardz">
                {products.map((product,index)=>(
                <div className="cardy" key={index}>
                    {/* <h1>Products</h1> */}
                    <h1></h1>
                    <div className="imagesd">
                        {/* <img src={product.pimages[0]} alt="" /> */}
                    </div>
                    <br />
                    <h2>{product.pname}</h2>
                    <h3 className='cash'>${product.price} </h3>
                    <h3>{product.brand}</h3>
                    <div className="buttons">
                      <Link to={`/editproduct/${product._id}`}><button className='button-3'>Edit</button></Link>
                      <button className='button-4' onClick={()=>deleteProduct(product._id)}>Delete</button>
                      <h1></h1>
                    </div>
                </div>
                ))}
            </div>
      </div>
    </div>
  )
}

export default CatProd;