import userSchema from "./models/user.model.js";
import companySchema from './models/company.model.js'
import productSchema from './models/product.model.js'
import userdetailsSchema from "./models/userdetails.model.js";
import categorySchema from "./models/category.model.js";
import addressSchema from "./models/address.model.js";
import cartSchema from "./models/cart.model.js";
import wishlistSchema from "./models/wishlist.model.js";
import orderSchema from "./models/order.model.js";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import nodemailer from "nodemailer";
const { sign } = pkg;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ananduramachandran411@gmail.com",
    pass: "yttm rmjj dhok bchu",
  },
});

export async function signUp(req, res) {
  try {
    const { email, username, password, cpassword, accounttype } = req.body;
    console.log(req.body);
    if (!(email && username && password && cpassword))
      return res.status(404).send({ msg: "Fields are empty" });
    if (password != cpassword)
      return res.status(404).send({ msg: "Password mismatching" });
    bcrypt.hash(password, 10).then((hashedPassword) => {
      console.log(hashedPassword);

      userSchema
        .create({ email, username, password: hashedPassword,accounttype})
        .then(async () => {
          console.log("Success");
          return res.status(201).send({ msg: "Suceess" });
        })
        .catch((error) => {
          console.log(error);
          return res.status(404).send({ msg: "Not registered" });
        });
    });
  } catch (error) {
    console.log(error);
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });
    console.log(user);
    if (!(email && password))
      return res.status(404).send({ msg: "Fields are empty" });
    if (user === null) return res.status(404).send({ msg: "User not found" });
    const success = await bcrypt.compare(password, user.password);
    console.log(success);
    if (success != true)
      return res.status(404).send({ msg: "Email or Password mismatch" });
    const token = await sign({ userId: user._id }, process.env.JWT_KEY,{expiresIn: "24h"});
    console.log(token);
    return res.status(201).send({ msg: "successfully logged in",token});
  } catch (error) {
    return res.status(404).send({ msg: "Error" });
  }
}
export async function verifyMail(req, res) {
  try {
    const { email } = req.body;
    console.log(req.body);
  //   // send mail with defined transport object
  //   const info = await transporter.sendMail({
  //     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
  //     to: `${email}`, // list of receivers
  //     subject: "OTP", // Subject line
  //     text: "your otp", // plain text body
  //     html: `<!DOCTYPE html>
  //           <html lang="en">
  //           <head>
  //           <meta charset="UTF-8">
  //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //           <title>Email Verification</title>
  //           <style>
  //             body {
  //               font-family: Arial, sans-serif;
  //               background-color: #f4f4f4;
  //               margin: 0;
  //               padding: 0;
  //             }
  //             .container {
  //               max-width: 600px;
  //               margin: 0 auto;
  //               background-color: #ffffff;
  //               padding: 20px;
  //               text-align: center;
  //               border-radius: 8px;
  //               box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  //             }
  //             h1 {
  //               font-size: 24px;
  //               color: #333333;
  //             }
  //             p {
  //               font-size: 16px;
  //               color: #555555;
  //             }
  //             .button {
  //               display: inline-block;
  //               background-color: #4CAF50;
  //               color: white;
  //               padding: 15px 30px;
  //               text-decoration: none;
  //               font-size: 18px;
  //               border-radius: 4px;
  //               margin-top: 20px;
  //               text-transform: uppercase;
  //             }
  //           </style>verifyMail
  //           </head>
  //           <body>
  //           <div class="container">
  //             <h1>Email Verification</h1>
  //             <p>Click the button below to verify your email address:</p>
              
  //             <a href="http://localhost:5173/signup" class="button">Verify Email</a>
  //           </div>
  //           </body>
  //           </html>
  // `, // html body
  //   });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    return res
      .status(201)
      .send({ msg: "confirmation mail set success", email });
  } catch (error) {
    return res.status(404).send({ msg: "error" });
  }
}

export async function Home(req,res) {
  try{
    console.log(req.user.userId);
      const _id = req.user.userId;
      const user = await userSchema.findOne({_id})
      if(!(user))
        return res.status(404).send({msg:"Unauthorized user"})
      return res.status(200).send({username:user.username,accounttype:user.accounttype})
  }
  catch(error){
    return res.status(404).send({msg:"error"})
  }
}

export async function Seller(req,res) {
  try{
    const _id=req.user.userId;
    const seller = await companySchema.findOne({sellerId:_id});
    const user =await userSchema.findOne({_id});
    const address=await addressSchema.findOne({userId:_id})
    return res.status(201).send({seller,username:user.username,accounttype:user.accounttype,address})
  }
  catch{
    res.status(404).send({msg:error})

  }
  
}
export async function editSeller(req,res) {
  try{
    console.log(req.body);
    const {...seller}=req.body;
    const _id =req.user.userId;
    const sellerd = await companySchema.findOne({sellerId:_id});
    console.log(sellerd);
    
    if(sellerd){
      const data=await companySchema.updateOne({sellerId:_id},{$set:{...seller}});

    }
    else{
      const data = await companySchema.create({...seller,sellerId:_id})
    }
    return res.status(201).send({msg:"Edited Success"})        
}catch(error){
    res.status(404).send({msg:error})
}
}

export async function getSeller(req,res) {
  try{
      const _id =req.user.userId;
    const seller = await companySchema.findOne({sellerId:_id});
     res.status(201).send(seller)
  }
  catch(error){
    res.status(404).send({msg:error})

  }
  
}
export async function addProduct(req,res) {
  try {
    const {...product} = req.body;
    console.log(req.body);
    
    const category=product.category;
    const id=product.sellerId;
    const data = await productSchema.create({...product})
    const datas =await categorySchema.create({sellerId:id,category})
    res.status(201).send({msg:"Sucess"})
  } catch (error) {
    res.status(404).send({msg:error})

  }
 
}
export async function getProduct(req,res) {
  try {
        const _id = req.user.userId;
        const data = await productSchema.find({sellerId:_id})
        return res.status(201).send(data)
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function addUser(req,res){
  try {
    
    const {...user}=req.body;
    const _id= req.user.userId;
    const data =await userdetailsSchema.create({userId:_id,...user})
    console.log("asfsf");
    
    return res.status(201).send({msg:"success"})
  } catch (error) {
    res.status(404).send({msg:error})
  }
}

export async function addAddress(req,res){
  try {
    const user=req.body;
    
    
    const id=req.user.userId;
    const check=await addressSchema.findOne({userId:id});
    if(check){
      const data=await addressSchema.updateOne({userId:id},{$set:{address:user}})
    }
    else{
      const datas =await addressSchema.create({userId:id,address:user})
    }
    return res.status(201).send({msg:"Added"})
  } catch (error) {
   res.status(404).send({send:error}) 
  }
}
export async function getAddress(req,res) {
  try {
    const _id=req.user.userId;
    const address=await addressSchema.findOne({userId:_id})
    
    return res.status(201).send(address)

  } catch (error) {
    res.status(404).send({msg:error})

  }
}
export async function deleteAddress(req, res) {
  try {
    const  housename = req.body; 
    const  id = req.user.userId;  
      console.log(req.body);
      console.log(id);
      
      

    const result = await addressSchema.updateOne(
      { userId: id },
      { $pull: { address: housename } } 
    );
 
    return res.status(201).send({ msg: 'Address deleted successfully', result });
    
  } catch (error) {
    console.error('Error during address deletion:', error);
    return res.status(404).send({ msg: 'Error deleting address', error: error.message });
  }
}

export async function updateUser(req,res) {
  try {
    const _id =req.user.userId;
    const {...user} = req.body;
    const data = await userdetailsSchema.updateOne({userId:_id},{$set:{...user}})
    return res.status(201).send({msg:"Success"})

  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}



export async function  getUser(req,res) {
  try {
        const _id = req.user.userId;
        const user = await userdetailsSchema.findOne({userId:_id});
        const count = await orderSchema.countDocuments({});
        const count1 = await wishlistSchema.countDocuments({});
        const count2 = await cartSchema.countDocuments({});
        
        return res.status(201).send({msg:"Success",user,count,count1,count2})

  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function addCategory(req,res) {
  try{
    console.log(req.body);
    const {newCategory} = req.body;
    const category=await categorySchema.findOne({});
    
    if (category) {
      const data = await categorySchema.updateOne({_id:category._id},{$push:{category:newCategory}})
    }
    const datas = await categorySchema.create({category:[newCategory]})
    return res.status(201).send({msg:"Success"})

  }
  catch (error){
    res.status(404).send({msg:error})

  }
}

export async function getCategory(req,res) {
  try {
        const id = req.user.userId;
        const data = await categorySchema.findOne({});
        return res.status(201).send(data)
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}
export async function getCatProduct(req,res) {
  try {
    console.log("req.params");
      const {category}=req.params;
      console.log(category);
      const products=await productSchema.find({category})
      console.log(products);
      return res.status(201).send(products)  
      
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function getAllProducts(req,res) {
  try {
        const _id = req.user.userId;
        const products = await productSchema.find({sellerId:_id})
        return res.status(201).send(products)
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}
export async function getProductE(req,res) {
  try{
    const {id} = req.params;
    const product = await productSchema.findOne({_id:id});
    return res.status(201).send(product)
  }
  catch(error){
    res.status(404).send({msg:error})
  }
}



export async function editProduct(req,res) {
  try {
        const {id} =req.params;
        const {...product} = req.body;
        console.log(req.body);
        const data = await productSchema.updateOne({_id:id},{$set:{...product}})
        return res.status(201).send({msg:"Success"})

  } catch (error) {
    res.status(404).send({msg:error})


  }
  
}

export async function deleteProduct(req,res) {
  try {
    const {id} = req.params;
    const data = await productSchema.deleteOne({_id:id})
    console.log("deleted");
    return res.status(201).send({msg:"Sucess"})
  } catch (error) {
    res.status(404).send({msg:error})
  }
  
}
export async function addToCart(req,res) {
  try {
    const _id = req.user.userId;
    const {pname,price,pimages,quantity,productId,size,brand} = req.body;
    console.log(req.body);
    console.log(pname,price,pimages,quantity,productId,brand);
    const data = await cartSchema.create({pname,price,pimages,userId:_id,quantity,productId,size,brand  })
    console.log(data);
    return res.status(201).send({msg:"Success"})
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function getCart(req,res) {
    try {
          const _id = req.user.userId;
          const data = await cartSchema.find({userId:_id})
          return res.status(201).send(data);

    } catch (error) {
      res.status(404).send({msg:error})

    }
  
}
export async function getOrder(req,res) {
  try {
    const {id} = req.params;
    const data = await cartSchema.findOne({productId:id})
    console.log(data);
        
        return res.status(201).send(data);

  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function deleteCart(req,res) {
  try {
        const {id} =req.params;
        const data = await cartSchema.deleteOne({_id:id})
        return res.status(201).send({msg:"Success"})
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function updateCart(req,res) {
  try {
    const {quantity} = req.body;
    const {id} =req.params;
    const res = await cartSchema.updateOne({_id:id},{$set:{quantity}})
    console.log(res);
    return res.status(201).send({msg:"Success",res})
  } catch (error) {
    res.status(404).send({msg:error})
  }
}

export async function addToWishlist(req,res) {
  try {
        const {productId,pname,price,pimages,brand} = req.body;
        const {id} = req.user.userId;
        const product = await productSchema.findOne({_id:productId})
        if(!product) return res.status(404).send({msg:"Error"})
        const existingitem = await wishlistSchema.findOne({userId:id,productId,pname,price,pimages,brand})
      if(existingitem){
        if(!product) return res.status(404).send({msg:"Error"})
      }
      const data = await wishlistSchema.create({userId:id,productId,pname,price,pimages});
      return res.status(201).send({msg:"Success"})
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function  removeFromWishlist(req,res) {
  try { 
          const {id} =req.user.userId;
          const {productId} = req.params;
          console.log(productId);
          
          
          const data = await wishlistSchema.deleteOne({userId:id,productId:productId})
          return res.status(201).send({msg:"Success"})

  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function getWishlist(req,res) {
  try {
    const {id} = req.user.userId;
    const data = await wishlistSchema.find({userId:id})
    return res.status(201).send(data)
  } catch (error) {
    res.status(404).send({msg:error})

  }
  
}

export async function editQuantity(req,res) {
  try {
      const {id,quantity,type}=req.body;
      let newQuantity=0;
      const bid=req.user.userId;
     (type==='increase')? newQuantity=quantity+1: newQuantity=quantity-1;
      const data=await cartSchema.updateOne({_id:id},{ $set: { quantity: newQuantity }} );
      return res.status(201).send({msg:"Updated"});
  } catch (error) {
      return res.status(404).send({msg:"error"})
  }
}

export async function addOrder(req,res) {
  try {
    console.log(req.body);
    
    const {productId,quantity,sizee,housename,totalPrice} = req.body
    const id = req.user.userId;
    const product =await productSchema.findOne({_id:productId})
    console.log(product.size[sizee]);
    const newQuantity=product.size[sizee]-quantity;
    if(newQuantity<0)
      return res.status(201).send({msg:"Error"})
    await productSchema.updateOne({_id:productId},{$set:{[`size.${sizee}`]:newQuantity}})
    const data = await orderSchema.create({userId:id,productId,quantity,housename,totalPrice});
    return res.status(201).send({msg:"Success",data})
    
  } catch (error) {
    return res.status(404).send({msg:"error"})

  }
}

export async function getOrders(req,res) {
  try {
   
        const uid = req.user.userId;
        const count = await orderSchema.countDocuments({})
        const order = await orderSchema.find({userId:uid});
        console.log(order);
        
        
        
        const productData=order.map(async(p)=>{
          
          return await productSchema.findOne({_id:p.productId})
        })
        const products=await Promise.all(productData)
        
        return res.status(201).send({msg:"Success",products,order,count})

        
  } catch (error) {
        return res.status(404).send({msg:"error"})

  }
  
}
export async function addAllOrders(req, res) {
  try {
    const userId = req.user.userId; 
    const orderItems = req.body;
    console.log(orderItems);
    
    const orderData = [];  
    let totalOrderPrice = 0; 
    
    for (const item of orderItems) {
      const { productId, quantity, sizee, housename, totalPrice } = item;
      console.log(productId);
      
      const product = await productSchema.findOne({ _id: productId });
      console.log(product);
      
      if (!product) {
        return res.status(404).send({ msg: `Product with ID ${productId} not found` });
      }

      console.log(sizee);
      const newQuantity = product.size[sizee] - quantity;
      
      if (newQuantity < 0) {
        return res.status(400).send({ msg: `Not enough stock for size ${sizee} of ${product.pname}` });
      }

      await productSchema.updateOne(
        { _id: productId },
        { $set: { [`size.${sizee}`]: newQuantity } }
      );

      orderData.push({
        userId,
        product
      });
      console.log(orderData);
      

      totalOrderPrice += parseFloat(totalPrice);  
    }

    const orders = await orderSchema.insertMany(orderData);
    const deleteCart=await cartSchema.deleteMany({userId})
    console.log(deleteCart);
    

    return res.status(201).send({ msg: "Orders placed successfully!", orders, totalOrderPrice });
  } catch (error) {
    console.error("Error during order creation", error);
    return res.status(404).send({ msg: "Error processing orders" });
  }
}