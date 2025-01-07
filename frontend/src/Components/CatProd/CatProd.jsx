import React, { useEffect, useState } from 'react'
import '../CatProd/CatProd.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const CatProd = ({ setUser, setLogin }) => {
    const { category } = useParams();
    const value = localStorage.getItem('Auth');
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});  // State to track product quantities
    const [totalCost, setTotalCost] = useState(0);  // State to track total cost
    
    useEffect(() => {
        getProduct();
        getDetails();
    }, [category]);

    const getProduct = async () => {
        const res = await axios.get(`http://localhost:3000/api/getpcat/${category}`);
        if (res.status == 201) {
            setProducts([...res.data]);
        } else {
            alert("Error fetching products");
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
      // Function to handle increase/decrease in product quantity
      const changeQuantity = (productId, increment) => {
        setQuantities((prevQuantities) => {
            const currentQuantity = prevQuantities[productId] || 1;  // Default to 1 if no quantity set
            const newQuantity = currentQuantity + increment;

            if (newQuantity >= 1) {  // Prevent quantity from going below 1
                return { ...prevQuantities, [productId]: newQuantity };
            }

            return prevQuantities;  // Return previous state if quantity is less than 1
        });
    };

  const deleteProduct = async (id) => {
    const res = await axios.delete(`http://localhost:3000/api/deletep/${id}`);
    if (res.status === 201) {
      alert('Deleted');
      getProduct();
    } else {
      alert('Failed');
    }
  };

    // Calculate the total cost of all products in the cart
    const calculateTotalCost = () => {
        let total = 0;
        products.forEach((product) => {
            const productQuantity = quantities[product._id] || 1; // Default to 1 if no quantity set
            total += product.price * productQuantity;
        });
        setTotalCost(total);
    };


    return (
        <div className='catprod'>
            <div className="main">
                <div className="cardz">
                    {products.map((product, index) => (
                        <div className="cardy" key={index}>
                            <div className="imagesd">
                                <img src={product.pimages[0]} alt={product.pname} />
                            </div>
                            <h2>{product.pname}</h2>
                            <h3 className='cash'>₹{product.price}</h3>
                            <h3>{product.brand}</h3>
                            <div className="buttons">
                                <Link to={`/editproduct/${product._id}`}><button className='button-3'>Edit</button></Link>
                                <button className='button-4' onClick={() => deleteProduct(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CatProd;
