import React, { useEffect, useState } from 'react'
import '../CatProd/CatProd.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'
const CatProd = ({ setUser, setLogin }) => {
    const {category} =useParams();
    console.log(category);
    const value = localStorage.getItem('Auth');
    const [products,getProducts] = useState([])
    useEffect(()=>{
        getProduct();
        getDetails();
    },[category])

    const getProduct = async()=>{
        const res = await axios.get(`http://localhost:3000/api/getcat/${category}`)
        if(res.status==201){
            getProducts(res.data)
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
                <div className="cardy">
                    <h1>Products</h1>
                    <div className="imagesd">
                        <img src={product.pimages[0]} alt="" />
                    </div>
                    <h2>{product.pname}</h2><hr />
                    <h2>{product.price} </h2><hr />
                    <h2>{product.brand}</h2><hr />
                </div>
                ))}
            </div>
      </div>
    </div>
  )
}

export default CatProd;