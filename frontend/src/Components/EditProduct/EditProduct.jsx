import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { FiPlus } from 'react-icons/fi'; // Import the plus icon from React Icons
import '../AddProduct/AddProduct.scss'
const EditProduct = ({ setUser, setLogin }) => {
    const {id} = useParams();
    console.log(id);
    const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  const [pimages, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [newCategory, setNewCategory] = useState(""); 
  const [isAddCategory, setAddCategory] = useState(false);
  const [products,getProducts]=useState({})
  useEffect(() => {
    getDetails();
    fetchCategories(); 
    getProduct();
  }, []);

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
  const getProduct = async()=>{
    const res = await axios.get(`http://localhost:3000/api/getproducte/${id}`)
    console.log(res.data);
    if(res.status==201){
        getProducts(res.data)
    }
    else{
        alert("error")
    } 
  }
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/getcat", { headers: { "Authorization": `Bearer ${value}` } });
      if (res.status === 201) { 
        setCategories(res.data.category); // Assuming res.data is an array
      } else {
        alert("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories", error);
      alert("Failed to fetch categories");
    }
  };

  // Add new category to the API
  const addCategory = async () => {
    if (newCategory.trim() === "") {
      alert("Category cannot be empty");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/addcat", {newCategory}, { headers: { "Content-Type": "application/json" } });

      if (res.status === 201) { 
        alert("Category added successfully");
        setCategories((prev) => [...(Array.isArray(prev) ? prev : []), newCategory]); 
        getProducts((prev) => ({ ...prev, category: newCategory })); 
        setNewCategory(""); 
        
      } else {
        alert(res.data.msg || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category", error);
      alert("Failed to add category");
    }
  };

  // Handle product submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`http://localhost:3000/api/editproduct/${id}`, { ...products, pimages }, { headers: { "Content-Type": "application/json" } });
      if (res.status === 201) { 
        alert("Product edited successfully");
        navigate("/seller")
      } else {
        alert(res.data.msg || "Failed to edit product");
      }
    } catch (error) {
      console.error("Error editing product", error);
      alert("Failed to edit product");
    }
  };

  // Handle file input for product images
  const handleFile = async (e) => {
    const arr = Object.values(e.target.files);
    arr.map(async (file) => {
      const pimage = await convertToBase64(file);
      setPhotos((prev) => [...(Array.isArray(prev) ? prev : []), pimage]); 
    });
  };

  // Convert image file to base64 format
  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  }

  // Handle input changes for product fields
  const handleChange = (e) => {
    getProducts((prev) => ({
      ...prev, [e.target.name]: e.target.value
      
      
    }));
    console.log(e.target.value);
  };

  // Handle input change for new category field
  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  return (
    <div className='addp'>
        <div className="mains">
            <div className="main">
                 <h2>Edit Product</h2>
                          <input type="text" placeholder='Name' name='pname' id='pname' value={products.pname} onChange={handleChange} />
                          <select name='category' id='category' onChange={handleChange} value={products.category}>
                            <option value="">Select Category</option>
                            {Array.isArray(categories) && categories.length > 0 ? (
                              categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                              ))
                            ) : (
                              <option value="">No categories available</option>
                            )}
                          </select>
                
                          <button type="button" onClick={() => setAddCategory(!isAddCategory)}>
                            <FiPlus /> {/* Render the plus icon */}
                          </button>
                
                          {isAddCategory && (
                            <>
                              <input
                                type="text"
                                placeholder='Add new category'
                                value={newCategory}
                                onChange={handleNewCategoryChange}
                              />
                              <button type="button" onClick={addCategory} className='button-24'>Add Category</button>
                            </>
                          )}
                
                          {/* Size Select Box */}
                          <select name="size" id="size" onChange={handleChange} value={products.size}>
                            <option value="">Select Size</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                          </select>
                
                          <input type="text" placeholder='Price' name='price' id='price'value={products.price} onChange={handleChange} />
                          <input type="file" onChange={handleFile} name="pimages" id='pimages' multiple />
                
                          <div className="display">
                            {pimages.map((img, index) => (
                              <img key={index} src={img} alt={`Product Preview ${index}`} />
                            ))}
                          </div>
                          <button className='button-24' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
      
    </div>
  )
}

export default EditProduct