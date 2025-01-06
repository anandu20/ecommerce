import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AddUser/UserDetails.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa"; // Importing icons from react-icons

const UserD = ({ setUser, setLogin }) => {
  const value = localStorage.getItem("Auth");
  const [addressCards, setAddressCards] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  // State for user data
  const [data, setData] = useState({
    fname: "",
    lname: "",
    mobile: "",
    gender: "",
  });

  const [count, setCount] = useState({
    counts: "",
    counts1: "",
    counts2: "",
  }); 
  const [position,setPosition]=useState(0)

  // Fetch user details from API
  useEffect(() => {
    getDetails();
    getData();
    getAddress();
  }, []);

  const getDetails = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/seller", {
        headers: { Authorization: `Bearer ${value}` },
      });
      if (res.status === 201) {
        setUser(res.data.username);
        setLogin(res.data.accounttype);
        setAddressCards(res.data.address.address);
      } else {
        alert("Error fetching seller details");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/getuser", {
        headers: { Authorization: `Bearer ${value}` },
      });

      setData({
        gender: res.data.user.gender || "",
        fname: res.data.user.fname,
        lname: res.data.user.lname,
        mobile: res.data.user.mobile,
      });
      setCount({
        counts: res.data.count,
        counts1: res.data.count1,
        counts2: res.data.count2,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getAddress = async () => {
    const res = await axios.get("http://localhost:3000/api/getaddress", {
      headers: { Authorization: `Bearer ${value}` },
    });

    if (res.status === 201) {
      setAddressCards(res.data.address);
    } else {
      alert("Failed");
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setAddressCards((prevCards) => {
      const updatedAddressCards = [...prevCards];
      updatedAddressCards[index] = {
        ...updatedAddressCards[index],
        [name]: value,
      };
      return updatedAddressCards;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { data };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/updateuser",
        data,
        { headers: { Authorization: `Bearer ${value}` } }
      );

      if (res.status === 201) {
        alert("User saved successfully!");
      } else {
        alert(res.data.msg);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const toggleInput = () => {
    setIsDisabled(!isDisabled);
  };

  const addAddressCard = () => {
    setAddressCards([
      ...addressCards,
      {
        housename: "",
        landmark: "",
        pincode: "",
        place: "",
        city: "", // Make sure to add a city in the new address
      },
    ]);
    setPosition(addressCards.length);
    setEditMode(true)
  };

  const handleAddressSubmit = async (index) => {
    const addressToSubmit = addressCards[index];

    try {
      const res = await axios.post(
        "http://localhost:3000/api/addaddress",
        addressCards,
        {
          headers: { Authorization: `Bearer ${value}` },
        }
      );

      if (res.status === 201) {
        alert("Address added successfully!");
        setPosition(0)
        setEditMode(false);
        getDetails();
        getData();
        getAddress();

      } else {
        alert("Failed to add address: " + res.data.msg);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Error adding address");
    }
  };

  const deleteAddress = async (fieldValue) => {
    const addressToDelete = addressCards.find(
      (address) => address.housename === fieldValue
    );

    if (!addressToDelete) {
      alert("Address not found");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/deleteaddress",
        { housename: fieldValue },
        {
          headers: { Authorization: `Bearer ${value}` },
        }
      );

      if (res.status === 201) {
        setAddressCards((prevCards) =>
          prevCards.filter((address) => address.housename !== fieldValue)
        );
        alert("Address deleted successfully!");
      } else {
        alert("Failed to delete address: " + res.data.msg);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Error deleting address");
    }
  };

  const logout = () => {
    localStorage.removeItem("Auth");
    alert("Logged Out");
    navigate("/login");
  };

  const [editMode, setEditMode] = useState(false);

  const handleEditClick = (index) => {
    setPosition(index);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setPosition(0)
  };

  return (
    <div className="userd">
      <div className="left">
        <div className="card">
          <h1>User Details</h1>
          <div className="images">
            <img src="profile.png" alt="Profile" />
          </div>
          <input
            type="text"
            placeholder="Fname"
            disabled={isDisabled}
            name="fname"
            value={data.fname}
            onChange={(e) => setData({ ...data, fname: e.target.value })}
          />
          <input
            type="text"
            placeholder="Lname"
            disabled={isDisabled}
            name="lname"
            value={data.lname}
            onChange={(e) => setData({ ...data, lname: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile number"
            disabled={isDisabled}
            name="mobile"
            value={data.mobile}
            onChange={(e) => setData({ ...data, mobile: e.target.value })}
          />
          {/* Gender Radio Buttons */}
          <label htmlFor="male">Male</label>
          <input
            type="radio"
            id="male"
            disabled={isDisabled}
            name="gender"
            value="male"
            checked={data.gender === "male"}
            onChange={(e) => setData({ ...data, gender: e.target.value })}
          />
          <label htmlFor="female">Female</label>
          <input
            type="radio"
            id="female"
            disabled={isDisabled}
            name="gender"
            value="female"
            checked={data.gender === "female"}
            onChange={(e) => setData({ ...data, gender: e.target.value })}
          />

          <div className="buttons">
            <button className="button-24" onClick={handleSubmit}>
              Save
            </button>
            <button className="button-24" onClick={toggleInput}>
              {isDisabled ? "Enable" : "Disable"}
            </button>
            {/* <button className="button-24" onClick={logout}>
              Logout
            </button> */}
          </div>
        </div>
      </div>

      <div className="right">
        <div className="buttonss">
          <button className="button-24">
            <Link to="/myorders">Your Orders ({count.counts})</Link>
          </button>
          <button className="button-24">
            <Link to="/wishlist">Your Wishlist ({count.counts1})</Link>
          </button>
          <button className="button-24">
            <Link to="/cart">Your Cart ({count.counts2})</Link>
          </button>
          <button className="button-24" onClick={logout}>Logout</button>
        </div>
        <div className="cards">
          <div className="cardx">
            <h1>Address Details</h1>
            <div className="buttonsss">
              <button className="button-24" onClick={addAddressCard}>
                <FaPlusCircle /> {/* Add Address Icon */}
              </button>
            </div>
            {editMode  &&(
                  <div  className="address-card">
                    <div className="ad">
                      <label htmlFor="housename">Housename</label>
                      <input
                        type="text"
                        placeholder="Housename"
                        name="housename"
                        id="housename"
                        value={addressCards[position].housename}
                        onChange={(e) => handleChange(e, position)}
                      />
                      <label htmlFor="landmark">Landmark</label>
                      <input
                        type="text"
                        placeholder="Landmark"
                        name="landmark"
                        id="landmark"
                        value={addressCards[position].landmark}
                        onChange={(e) => handleChange(e, position)}
                      />
                    </div>
                    <div className="ad">
                      <label htmlFor="pincode">Pincode</label>
                      <input
                        type="text"
                        placeholder="Pincode"
                        name="pincode"
                        id="pincode"
                        value={addressCards[position].pincode}
                        onChange={(e) => handleChange(e, position)}
                      />
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        name="city"
                        id="city"
                        value={addressCards[position].city}
                        onChange={(e) => handleChange(e, position)}
                      />
                    </div>
                    <div className="ad">
                      <label htmlFor="place">Place</label>
                      <input
                        type="text"
                        placeholder="Place"
                        name="place"
                        id="place"
                        value={addressCards[position].place}
                        onChange={(e) => handleChange(e, position)}
                      />
                      <label htmlFor="town">Town</label>
                      <input
                        type="text"
                        placeholder="Town"
                        name="town"
                        id="town"
                        value={addressCards[position].town}
                        onChange={(e) => handleChange(e, position)}
                      />
                    </div>
                    <div className="buttons">
                      <button
                        className="button-24"
                        onClick={() => handleAddressSubmit(position)}
                      >
                        Submit  <FaPlusCircle /> {/* Add Address Icon */}
                      </button>
                      <button
                        className="button-24"
                        onClick={handleCancelEdit}
                      >
                       Cancel  <FaEdit /> {/* Cancel Edit Icon */}
                      </button>
                    </div>
                  </div>
                ) }
            {addressCards.map((address, index) => (
              address.housename&&(
                <div key={index} className="address-card">

                      <div className="ps">
                      <p>{address.housename}</p>
                      <p>{address.landmark}</p>
                      <p>{address.pincode}</p>
                      <p>{address.city}</p>
                      <p>{address.place}</p>
                      <p>{address.town}</p>
                      </div><br />
                     
                    <div className="buttons">
                      <button
                        className="button-24"
                        onClick={() => handleEditClick(index)}
                      >
                          <FaEdit /> {/* Edit Icon */}
                      </button>
                      <button
                        className="button-24"
                        onClick={() => deleteAddress(address.housename)}
                      >
                       Delete   <FaTrash /> {/* Delete Icon */}
                      </button>
                    </div>
              </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserD;