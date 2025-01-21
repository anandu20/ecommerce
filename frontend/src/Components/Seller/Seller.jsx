import React, { useEffect, useState } from 'react'
import '../Seller/Seller.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'
const Seller = ({setUser,setLogin}) => {
    const [data,getData]=useState({})
    const [seller,getSeller]=useState([])
    const [product, getProduct] = useState([{ _id: "" }]);
    const [categories, setCategories] = useState([]);
  
    const value = localStorage.getItem('Auth');
    useEffect(()=>{
        getDetails();
        getSellerD();
        getCategory();
        getProducts();
    },[])
    const getDetails = async () => {
        try {
          const res = await axios.get("http://localhost:3000/api/seller", { headers: { "Authorization": `Bearer ${value}` } });
          if (res.status === 201) {
            getData(res.data.seller);
            setUser(res.data.username);
            setLogin(res.data.accounttype);
          } else {
            alert("Error fetching seller details");
          }
        } catch (error) {
          console.error("Error fetching seller details", error);
          alert("Error fetching seller details");
        }
      };
    

const getSellerD = async()=>{
    try {
        const res = await axios.get("http://localhost:3000/api/getseller",{ headers: { "Authorization": `Bearer ${value}` } })
    console.log(res);
    if(res.status==201){
        getSeller(res.data)
    }
    else{
        alert("error fetching seller data")
    }   
    } catch (error) {
        console.error("Error fetching seller data", error);
        alert("Error fetching seller data");
    }  
};

const  getCategory =async()=>{
try {
    const res = await axios.get("http://localhost:3000/api/getcat", { headers: { "Authorization": `Bearer ${value}` } });
    if (res.status === 201 && Array.isArray(res.data)) {
      console.log(res.data);
      
      setCategories(res.data);
    } else {
      setCategories([]);
    }
} catch (error) {
    console.error("Error fetching categories", error);
    setCategories([]);
      alert("Error fetching categories");
}
};

const getProducts=async()=>{
    try {
        const res = await axios.get("http://localhost:3000/api/getproducts", { headers: { "Authorization": `Bearer ${value}` } });
        if(res.status=201){
            getProduct(res.data);
        }
        else{
            alert("Error fetching products");
        }

    } catch (error) {
        console.error("Error fetching products", error);
        alert("Error fetching products");
    }
}

  return (
    <div className='seller'>
      <div className="main">
        <div className="leftt">
            <div className="image">
                <img src="pic.jpg" alt="" />
            </div>
            <div className="content">
                <h2>Name:{seller.name}</h2>
                <h2>Place:{seller.location}</h2>
            </div>
            <div className='buttons'>
                <button className='button-3'>Delete</button>
                <Link to="/editseller"><button className='button-3'>Edit</button></Link>
            </div>
        </div>
        <div className="right">
            <div className="products">
            <Link to="/addproduct"><button className='button-9'>Add Product</button></Link>
                <h1 className='cat'>All Categories</h1>
                <div className="catm">
              {categories && categories.length > 0 ? (
                categories.map((cat, index) => (
                  <div key={cat._id || index} className="cat">
                    <Link to={`/catprod/${cat.category}`}>
                      <h3>{cat.category}</h3>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No categories available</p>
              )}
            </div>
                
            </div>
        </div>
      </div>
    </div>
  )
}

export default Seller