import React, { useEffect, useState } from 'react';
import './AddProduct.scss'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi'; // Import the plus icon from React Icons

const AddProduct = ({ setUser, setLogin }) => {
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  const [pimages, setPhotos] = useState([]); // Store images in base64 format
  const [product, setProduct] = useState({
    pname: "",
    category: "",
    price: "",
    size: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
      XXXL:0,
    },   
     brand: "",
    sellerId: ""
  });
  const [categories, setCategories] = useState([]); 
  const [newCategory, setNewCategory] = useState(""); 
  const [isAddCategory, setAddCategory] = useState(false);

  useEffect(() => {
    getDetails();
    fetchCategories(); 
  }, []);

  const getDetails = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/seller", { headers: { "Authorization": `Bearer ${value}` } });
      if (res.status === 201) {  
        console.log(res.data);
        
        setProduct((prev)=>({ ...prev,sellerId: res.data.seller.sellerId, brand: res.data.seller.name }));
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

  // Fetch categories from API
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
      const res = await axios.post("http://localhost:3000/api/addcat", {newCategory},  { headers: { "Authorization": `Bearer ${value}` } });

      if (res.status === 201) { 
        alert("Category added successfully");
        setCategories((prev) => [...(Array.isArray(prev) ? prev : []), newCategory]); 
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

    if (!product.category) {
      alert("Please select or add a category for the product");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/addproduct", { ...product, pimages }, { headers: { "Content-Type": "application/json" } });

      if (res.status === 201) { 
        alert("Product added successfully");
        navigate("/seller");
      } else {
        alert(res.data.msg || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product", error);
      alert("Failed to add product");
    }
  };
 // Handle file input for product images
 const handleFile = async (e) => {
  const arr = Object.values(e.target.files);
  arr.map(async (file) => {
    const pimages = await convertToBase64(file);
    setPhotos((prev) => [...(Array.isArray(prev) ? prev : []), pimages]); 
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
    setProduct((prev) => ({
      ...prev, [e.target.name]: e.target.value
    }));
  };

  // Handle input change for new category field
  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleSizeQuantityChange = (size, e) => {
    const value = parseInt(e.target.value, 10) || 0; // Ensure default value of 0 if invalid input
    setProduct({
      ...product,
      size: {
        ...product.size,
        [size]: value, // Correctly update the size quantity
      },
    });
  };
  console.log(product.size);
  
  return (
    <div className='addp'>
      <div className="mains">
        <div className="main">
          <h2>Add Product</h2>
          <input type="text" placeholder='Name' name='pname' id='pname' onChange={handleChange} />

          <select name='category' id='category' onChange={handleChange} value={product.category}>
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

<div className="size">
            <label>Sizes (Enter Quantity)</label>
            <div className="size-quantity">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL','XXXL'].map((size) => (
                <div key={size} className="size-input">
                  <input
                    type="number"
                    onChange={(e) => handleSizeQuantityChange(size, e)}
                    placeholder={size}
                  />
                </div>
              ))}
            </div>
          </div>

          <input type="text" placeholder='Price' name='price' id='price' onChange={handleChange} />
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
  );
};

export default AddProduct;