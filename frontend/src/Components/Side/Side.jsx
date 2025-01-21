import React, { useState,useEffect} from 'react';
import axios from 'axios';
import '../Side/Side.scss'
import { FaSearch } from 'react-icons/fa';

const Sidebar = ({setProducts}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice,setPrice]=useState(10000);

  const[sideProducts,setSideProducts]=useState([])
  const [categories,setCategories] = useState([]);
  const value=localStorage.getItem("Auth");
  useEffect(()=>{
    getDetails();
  },[])
  
  const getDetails=async()=>{
    const res = await axios.get("http://localhost:3000/api/getsdata",{ headers: { "Authorization": `Bearer ${value}` } })
      if (res.status==201) {
        setSideProducts(res.data.data)
        console.log(res.data);
        
        setCategories(res.data.data1)
        
        
      }
      else{
        console.log("error");
        
      }
  }
  // Handle search input change
  const handleSearchChange = async(e) => {
    setSearchTerm(e.target.value);
    try {
      setProducts([])
        sideProducts.filter((i)=>i.pname.toLowerCase().includes(e.target.value.toLowerCase())&&i.category.toLowerCase().includes(selectedCategory.toLowerCase())).map((product)=>{
          setProducts((pre)=>[...pre,product])
        })

    } catch (error) {
        console.log(error);
    }
  };

  // Handle category selection change
  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    
    setSelectedCategory(e.target.value);
    try {
      setProducts([])
        sideProducts.filter((i)=>i.category.toLowerCase().includes(e.target.value.toLowerCase())&&i.pname.toLowerCase().includes(searchTerm.toLowerCase())).map((product)=>{
          setProducts((pre)=>[...pre,product])
        })

    } catch (error) {
        console.log(error);
    }
  };
  const handlePriceChange = async(e) => {
    setPrice(parseInt(e.target.value,10));
    try {
      setProducts([])
        sideProducts.filter((i)=>i.price>=maxPrice&&i.category.toLowerCase().includes(selectedCategory.toLowerCase())&&i.pname.toLowerCase().includes(searchTerm.toLowerCase())).map((product)=>{
          setProducts((pre)=>[...pre,product])
        })

    } catch (error) {
        console.log(error);
    }
  };
  return (
    <div className="Sidebar">
      <div className="group">
        <FaSearch className="icon" />
        <input className="input" type="search" 
          id="search"
          value={searchTerm}
          onChange={handleSearchChange} placeholder="Search" />
      </div>

      <div className="category-filter">
        <label htmlFor="categories">Category:</label>
        <select
          id="categories"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option  value="">
            All
          </option>
          {categories.map((cat,ind)=>(
            <option key={ind} value={cat.category}>
            {cat.category.toUpperCase()}
          </option>
          ))}
        </select>
      </div>
      <div className="price-filter">
      <label for="rangeInput">Price Filter:</label>
      <p id="rangeValue">Under:- ${maxPrice}</p>
      <input type="range" id="rangeInput" name="range" min="0" max="10000" step="1"  onChange={handlePriceChange} />
      </div>
    </div>


  );
};

export default Sidebar;